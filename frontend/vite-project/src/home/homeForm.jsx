import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCookie } from '../utils/useCookie';
import axios from 'axios';

function HomeForm() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);

    axios.get('http://localhost:8000/chat/rooms/', {
        withCredentials: true
    })
      .then(response => {
        setRooms(response.data);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }, []);

  const handleJoinRoom = (roomName) => {
    navigate(`/chat/${roomName}`);
  };

  const handleCreateRoom = () => {
    const csrfToken = getCookie('csrftoken');
    if (newRoomName.trim()) {
      axios.post('http://localhost:8000/chat/rooms/create/', { name: newRoomName }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken
        },
        withCredentials: true
      })
      .then(response => {
        alert(response.data.message);
        setRooms([...rooms, { name: newRoomName }]);
        setNewRoomName('');
      })
      .catch(error => {
        console.error('Error creating room:', error);
        if (error.response && error.response.status === 403) {
          alert('You must be logged in to create a room');
        } else {
          alert('Room creation failed');
        }
      });
    } else {
      alert('Please enter a room name');
    }
  };

  return (
    <div>
      <header>
        {username ? (
          <div>
            <p>Welcome, {username}!</p>
            <Link to="/logout">Logout</Link>
          </div>
        ) : (
          <div>
            <p>You are not logged in.</p>
            <Link to="/login">Login </Link>
            <Link to="/signup">| Signup</Link>
          </div>
        )}
      </header>

      <h1>Available Chat Rooms</h1>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room, index) => (
            <li key={index}>
              <button onClick={() => handleJoinRoom(room.name)}>
                {room.name}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available</p>
      )}

      <h2>Create a New Room</h2>
      <input
        type="text"
        placeholder="Enter new room name"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
      />
      <button onClick={handleCreateRoom}>Create Room</button>
    </div>
  );
}

export default HomeForm;
