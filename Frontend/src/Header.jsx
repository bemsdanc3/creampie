import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css'
import CityIcon from './assets/City.svg?react';
import HistoryIcon from './assets/History.svg?react';
import ChatsIcon from './assets/Chats.svg?react';
import GroupIcon from './assets/Group.svg?react';
import PersonIcon from './assets/Person.svg?react';
import SettingsIcon from './assets/Settings.svg?react';
import CloseIcon from './assets/Close.svg?react';
import CollapseIcon from './assets/Collapse.svg?react';
import MaximizeIcon from './assets/Maximize.svg?react';

function Header() {
    const [pageTitle, setPageTitle] = useState('CreamPie');

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
            const controls = Array.from(document.getElementsByClassName('windowControls'));
            controls.forEach((btn)=>{
                btn.style.display = 'block';
            })
        }
    }, []);
    
    return (
        <>
            <header id="header">
            <div className="left-head-box">
                <h2 title={pageTitle}>{pageTitle}</h2>
            </div>
            <div className="center-head-box">
                <ul id='nav'>
                    <li title={'Недавняя активность'}>
                        <NavLink to="/">
                            <HistoryIcon />
                        </NavLink>
                    </li>
                    <li title={'Серверы'}>
                        <NavLink to="/servers">
                            <CityIcon />
                        </NavLink>
                    </li>
                    <li title={'Чаты'}>
                        <NavLink to="/chats">
                            <ChatsIcon />
                        </NavLink>
                    </li>
                    <li title={'Друзья'}>
                        <NavLink to="/friends">
                            <GroupIcon />
                        </NavLink>
                    </li>
                    <li title={'Мой профиль'}>
                        <NavLink to="/profile">
                            <PersonIcon />
                        </NavLink>
                    </li>
                    <li title={'Настройки'}>
                        <NavLink to="/settings">
                            <SettingsIcon />
                        </NavLink>
                    </li>
                </ul>
            </div>
            <div className="right-head-box">
                <button id='minimize-button' className='windowControls' title={'Свенуть'} onClick={handleMinimize}>
                    <CollapseIcon />
                </button>
                <button id='maximize-button' className='windowControls' title={'Развернуть'} onClick={handleMaximize}>
                    <MaximizeIcon />
                </button>
                <button id='close-button' className='windowControls' title={'Закрыть'} onClick={handleClose}>
                    <CloseIcon />
                </button>
            </div>
            </header>
        </>
    )
}

export default Header
