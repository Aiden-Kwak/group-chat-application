import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { HomeForm } from './home'
import {SignupForm, LoginForm, LogoutForm} from './account'
import { ChatRoomForm } from './chat'

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path="/" element={<HomeForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/logout" element={<LogoutForm />} />
          <Route path="/chat/:roomName" element={<ChatRoomForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
