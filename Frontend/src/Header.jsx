import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation  } from 'react-router-dom';
import './Header.css';
import CityIcon from './assets/City.svg?react';
import HistoryIcon from './assets/History.svg?react';
import ChatsIcon from './assets/Chats.svg?react';
import GroupIcon from './assets/Group.svg?react';
import PersonIcon from './assets/Person.svg?react';
import SettingsIcon from './assets/Settings.svg?react';
import CloseIcon from './assets/Close.svg?react';
import CollapseIcon from './assets/Collapse.svg?react';
import MaximizeIcon from './assets/Maximize.svg?react';
import ViceIcon from '../public/vice.svg?react';

function Header({logged}) {
    const [pageTitle, setPageTitle] = useState('Недавняя активность');
    const location = useLocation();

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

    const selectFunc = (id) => {
        // console.log('выбрана страница ' + id);
        const listItems = Array.from(document.getElementsByClassName('listItem'));
        listItems.forEach((li)=>{
            li.classList.remove('selectedPage');
        })
        const selected = document.getElementById(id);
        selected.classList.add('selectedPage');
    };

    useEffect(()=>{
        if (isElectron()) {
            const controls = Array.from(document.getElementsByClassName('windowControls'));
            controls.forEach((btn)=>{
                btn.style.display = 'block';
            })
        }
    }, []);

    useEffect(() => {
        switch (location.pathname) {
            case '/':
                setPageTitle('Недавняя активность');
                if (logged) selectFunc('listItem1');
                break;
            case '/servers':
                setPageTitle('Серверы');
                if (logged) selectFunc('listItem2');
                break;
            case '/chats':
                setPageTitle('Чаты');
                if (logged) selectFunc('listItem3');
                break;
            case '/friends':
                setPageTitle('Друзья');
                if (logged) selectFunc('listItem4');
                break;
            case '/profile':
                setPageTitle('Мой профиль');
                if (logged) selectFunc('listItem5');
                break;
            case '/settings':
                setPageTitle('Настройки');
                if (logged) selectFunc('listItem6');
                break;
            case '/server':
                setPageTitle('Сервер');
                if (logged) selectFunc('listItem2');
                break;
            case '/login':
                setPageTitle('Авторизация');
                if (logged) selectFunc('listItem1');
                break;
            case '/register':
                setPageTitle('Регистрация');
                if (logged) selectFunc('listItem1');
                break;
            default:
                setPageTitle('Недавняя активность'); // Заголовок по умолчанию
        }
    }, [location.pathname]);
    
    return (
        <>
            <header id="header">
            <div className="left-head-box">
                <ViceIcon />
                <h2 title={pageTitle}>{pageTitle}</h2>
            </div>
            <div className="center-head-box">
                {logged &&
                <ul id='nav'>
                    <li id="listItem1" className='listItem selectedPage' title={'Недавняя активность'} onClick={(e)=>{setPageTitle('Недавняя активность'); selectFunc(e.currentTarget.id)}}>
                        <NavLink to="/">
                            <HistoryIcon />
                        </NavLink>
                    </li>
                    <li id="listItem2" className='listItem' title={'Серверы'} onClick={(e)=>{setPageTitle('Серверы'); selectFunc(e.currentTarget.id)}}>
                        <NavLink to="/servers">
                            <CityIcon />
                        </NavLink>
                    </li>
                    <li id="listItem3" className='listItem' title={'Чаты'} onClick={(e)=>{setPageTitle('Чаты'); selectFunc(e.currentTarget.id)}}>
                        <NavLink to="/chats">
                            <ChatsIcon />
                        </NavLink>
                    </li>
                    <li id="listItem4" className='listItem' title={'Друзья'} onClick={(e)=>{setPageTitle('Друзья'); selectFunc(e.currentTarget.id)}}>
                        <NavLink to="/friends" >
                            <GroupIcon />
                        </NavLink>
                    </li>
                    <li id="listItem5" className='listItem' title={'Мой профиль'} onClick={(e)=>{setPageTitle('Мой профиль'); selectFunc(e.currentTarget.id)}}>
                        <NavLink to="/profile">
                            <PersonIcon />
                        </NavLink>
                    </li>
                    <li id="listItem6" className='listItem' title={'Настройки'} onClick={(e)=>{setPageTitle('Настройки'); selectFunc(e.currentTarget.id)}}>
                        <NavLink to="/settings">
                            <SettingsIcon />
                        </NavLink>
                    </li>
                </ul>
                }
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
