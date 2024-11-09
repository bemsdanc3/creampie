import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './Header.jsx';
<<<<<<< HEAD
import Footer from './Footer.jsx';
=======
>>>>>>> main
import Chats from './Pages/Chats.jsx';
import Recent from './Pages/Recent.jsx';
import Servers from './Pages/Servers.jsx';
import Settings from './Pages/Settings.jsx';
import Profile from './Pages/Profile.jsx';
import Friends from './Pages/Friends.jsx';
<<<<<<< HEAD
import Server from './Pages/Server.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';

function App() {
  const [logged, setLogged] = useState(false);
  const navigate = useNavigate();

  const logFunc = () => {
    setLogged(true); 
    console.log('вы вошли в аккаунт');
    navigate('/');
  }

  useEffect(()=>{
    if (!logged) {
      navigate('/login');
    }
  }, [])

  return (
    <>
      <Header logged={logged}/>

      <Routes>
            <Route path="/" element={<Recent />}/>
            <Route path="/login" element={<Login logged={logFunc}/>}/>
            <Route path="/register" element={<Register logged={logFunc}/>}/>
=======

function App() {

  return (
    <>
      <Header />

      <Routes>
            <Route path="/" element={<Recent />}/>
>>>>>>> main
            <Route path="/servers" element={<Servers />}/>
            <Route path="/friends" element={<Friends />}/>
            <Route path="/chats" element={<Chats />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/settings" element={<Settings />}/>
<<<<<<< HEAD
            <Route path="/server" element={<Server />}/>
=======
>>>>>>> main
            {/* <Route path="/articles" element={<Articles />}>
              <Route path=":articleId" element={<SelectedArticle />} />
            </Route> */}
        </Routes>
<<<<<<< HEAD

        {logged && 
          <Footer />
        }
=======
>>>>>>> main
    </>
  )
}

export default App
