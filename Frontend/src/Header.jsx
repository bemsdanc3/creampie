import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, useParams } from 'react-router-dom';
import './Header.css';
import CityIcon from './assets/City.svg?react';
import HistoryIcon from './assets/History.svg?react';
import ChatsIcon from './assets/Chats.svg?react';
import GroupIcon from './assets/Group.svg?react';
import PersonIcon from './assets/Person.svg?react';
import SettingsIcon from './assets/Settings.svg?react';
import ViceIcon from '../public/vice.svg?react';

function Header({logged}) {
    const { serverId } = useParams();
    const [pageTitle, setPageTitle] = useState('Недавняя активность');
    const location = useLocation();

    const selectFunc = (id) => {
        // console.log('выбрана страница ' + id);
        const listItems = Array.from(document.getElementsByClassName('listItem'));
        listItems.forEach((li)=>{
            li.classList.remove('selectedPage');
        })
        const selected = document.getElementById(id);
        selected.classList.add('selectedPage');
    };

    useEffect(() => {
        if (location.pathname.startsWith('/servers/')) {
            const id = location.pathname.split('/servers/')[1];
            setPageTitle(`Сервер`);
            if (logged) selectFunc('listItem2');
        } else {
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
                case '/login':
                    setPageTitle('Авторизация');
                    if (logged) selectFunc('listItem1');
                    break;
                case '/register':
                    setPageTitle('Регистрация');
                    if (logged) selectFunc('listItem1');
                    break;
                default:
                    setPageTitle('Недавняя активность');
            }
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
                
            </div>
            </header>
        </>
    )
}

export default Header
