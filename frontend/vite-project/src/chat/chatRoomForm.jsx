import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function ChatRoomForm() {
  const { roomName } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, { user: data.user, message: data.message }]);
    };

    newSocket.onclose = () => {
      console.log('WebSocket closed');
    };

    return () => {
      newSocket.close();
    };
  }, [roomName]);

  const handleSendMessage = () => {
    if (socket && inputMessage) {
      socket.send(JSON.stringify({ message: inputMessage }));
      setInputMessage('');
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.send(JSON.stringify({ message: 'has left the chat', system: true })); // 시스템 메시지 전송
      setTimeout(() => {
        socket.close();
        navigate('/');
      }, 100);
    } else {
      navigate('/');
    }
  };

  return (
    <div>
      <h2>Chat Room: {roomName}</h2>
      <button onClick={handleLeaveRoom}>Leave Room</button>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
}

export default ChatRoomForm;
