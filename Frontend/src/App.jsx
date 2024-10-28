import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './Header.jsx';
import Chats from './Pages/Chats.jsx';
import Recent from './Pages/Recent.jsx';
import Servers from './Pages/Servers.jsx';
import Settings from './Pages/Settings.jsx';
import Profile from './Pages/Profile.jsx';
import Friends from './Pages/Friends.jsx';

function App() {

  return (
    <>
      <Header />

      <Routes>
            <Route path="/" element={<Recent />}/>
            <Route path="/servers" element={<Servers />}/>
            <Route path="/friends" element={<Friends />}/>
            <Route path="/chats" element={<Chats />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/settings" element={<Settings />}/>
            {/* <Route path="/articles" element={<Articles />}>
              <Route path=":articleId" element={<SelectedArticle />} />
            </Route> */}
        </Routes>
    </>
  )
}

export default App
