import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
// import './App.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Chats from './Pages/Chats.jsx';
import Recent from './Pages/Recent.jsx';
import Servers from './Pages/Servers.jsx';
import Settings from './Pages/Settings.jsx';
import Profile from './Pages/Profile.jsx';
import Friends from './Pages/Friends.jsx';
import Server from './Pages/Server.jsx';
import Login from './Pages/Login.jsx';
import Register from './Pages/Register.jsx';

import ServerCreate from './Windows/ServerCreate.jsx';
import ChannelCreate from './Windows/ChannelCreate.jsx';

import CloseIcon from './assets/Close.svg?react';
import CollapseIcon from './assets/Collapse.svg?react';
import MaximizeIcon from './assets/Maximize.svg?react';

function App() {
  const [logged, setLogged] = useState(false);
  const [reloadServers, setReloadServers] = useState(false);
  const [reloadChannels, setReloadChannels] = useState(false);
  const [showWindow, setShowWindow] = useState(false);
  const [serverId, setServerId] = useState(0);
  const [showCreateServerWindow, setShowCreateServerWindow] = useState(false);
  const [showCreateChannelWindow, setShowCreateChannelWindow] = useState(false);
  const [windows, setWindows] = useState({
    createServer: false,
    createChannel: false,
  });
  const navigate = useNavigate();

  const logFunc = () => {
    setLogged(true); 
    console.log('вы вошли в аккаунт');
    navigate('/');
  }

  useEffect(()=>{
    document.getElementById('root').classList.add(localStorage.theme || 'dark');
    if (!logged) {
      navigate('/login');
    }
  }, [])

  useEffect(()=>{
    if (showWindow) {
      const windowBg = document.querySelector('.windowBg');
      const window = document.querySelector('.window');

      windowBg.addEventListener('click', (event) => {
          if (event.target === windowBg) {
              setShowWindow(false);
          }
      });
    }
  }, [showWindow]);

  const isElectron = () => {
    return typeof window !== 'undefined' && window.navigator.userAgent.includes('Electron');
  }    

  const handleMinimize = () => {
      if (window.electron) {
          window.electron.minimize();
      } else {
          console.error('window.electron is not defined');
      }
  };


  const handleMaximize = () => {
      if (window.electron) {
          window.electron.maximize();
      } else {
          console.error('window.electron is not defined');
      }
  };


  const handleClose = () => {
      if (window.electron) {
          window.electron.close();
      } else {
          console.error('window.electron is not defined');
      }
  };

  useEffect(()=>{
    if (isElectron()) {
        const controls = Array.from(document.getElementsByClassName('windowControlsBtn'));
        controls.forEach((btn)=>{
            btn.style.display = 'block';
        })
    }
  }, []);

  const hideAllWindows = () => {
    setShowWindow(false); 
    setShowCreateChannelWindow(false);
    setShowCreateServerWindow(false);
  }
  
  const openWindow = (windowName) => {
    setWindows((prev) => ({
      ...prev,
      [windowName]: true,
    }));
  };
  
  const closeWindow = (windowName) => {
    setWindows((prev) => ({
      ...prev,
      [windowName]: false,
    }));
  };
  
  const closeAllWindows = () => {
    setWindows({
      createServer: false,
      createChannel: false,
    });
  };  

  return (
    <>
      <Header logged={logged}/>

      <div className='window-controls'>
        <button id='minimize-button' className='windowControlsBtn' title={'Свенуть'} onClick={handleMinimize}>
            <CollapseIcon />
        </button>
        <button id='maximize-button' className='windowControlsBtn' title={'Развернуть'} onClick={handleMaximize}>
            <MaximizeIcon />
        </button>
        <button id='close-button' className='windowControlsBtn' title={'Закрыть'} onClick={handleClose}>
            <CloseIcon />
        </button>
      </div>

      {Object.values(windows).some((isOpen) => isOpen) && (
        <>
          <div className="windowBg" onClick={closeAllWindows}></div>
          {windows.createServer && (
            <ServerCreate
              close={() => closeWindow("createServer")}
              reloadServersList={() => {
                setReloadServers(true);
                closeWindow("createServer");
              }}
            />
          )}
          {windows.createChannel && (
            <ChannelCreate
              close={() => closeWindow("createChannel")}
              serverId={serverId}
              reloadChannelsList={() => {
                setReloadChannels(true);
                closeWindow("createChannel");
              }}
            />
          )}
        </>
      )}

      <Routes>
            <Route path="/" element={<Recent />}/>
            <Route path="/login" element={<Login logged={logFunc}/>}/>
            <Route path="/register" element={<Register logged={logFunc}/>}/>
            <Route path="/servers" element={<Servers setServerId={(server_id)=>{console.log("server_id from <Servers/>", server_id); setServerId(server_id)}} serversLoaded={()=>setReloadServers(false)} reloadServersList={reloadServers} createServerFunc={()=>{openWindow("createServer")}}/>}/>
            <Route path="/friends" element={<Friends />}/>
            <Route path="/chats" element={<Chats />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/settings" element={<Settings />}/>
            <Route path="/servers/:serverId" element={<Server channelsLoaded={()=>setReloadChannels(false)} reloadChannelsList={reloadChannels} showCreateChannelFunc={() => {openWindow("createChannel")}} />} />
            {/* <Route path="/articles" element={<Articles />}>
              <Route path=":articleId" element={<SelectedArticle />} />
            </Route> */}
        </Routes>

        {logged && 
          <Footer />
        }
    </>
  )
}

export default App;
