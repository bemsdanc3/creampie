import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import PlusIcon from '../assets/Plus.svg?react';
import SearchIcon from '../assets/Search.svg?react';
import ServerCard from './ServerCard.jsx';
import './css/Servers.css';

function Servers() {

  const ShowServers = async () => {
    const response = await fetch('', {
      
    })
  }

  return (
    <>
      <div id="serversPage">
        <div id="serverSearch">
            <button id="createBtn"><PlusIcon /></button>
            <input type="text" placeholder={'Введите имя...'}/>
            {/* <a id="friendFilters">Параметры</a> */}
            <button id="searchBtn"><SearchIcon/></button>
        </div>
        <div id="serverList">
                {/* {friends.map((friend) => (
                    <FriendCard key={friend} />
                ))} */}
                {/* <div id="requestFriends">
                    <div id="requestFriendsText">
                        Заявки в друзья:
                    </div>
                    <div id="requestFriendsList">
                        <FriendCard />
                        <FriendCard />
                        <FriendCard online="online"/>
                        <FriendCard />
                    </div>
                </div> */}
                <div id="myServers">
                    <div id="myFavServersListText">
                        Избранные серверы:
                    </div>
                    <div id="myFavServersList">
                      <ServerCard member={true} pinned={true}/>
                      <ServerCard member={true} pinned={true}/>
                    </div>  
                    <div id="myServersListText">
                        Мои серверы:
                    </div>
                    <div id="myServersList">
                      <ServerCard member={true}/>
                      <ServerCard member={true}/>
                      <ServerCard member={true}/>
                      <ServerCard member={true}/>
                      <ServerCard member={true}/>
                      <ServerCard member={true}/>
                    </div>                    
                </div>
                <div id="recommendedServers">
                    <div id="recommendedServersText">
                        Рекомендуемые серверы:
                    </div>
                    <div id="recommendedServersList">
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                      <ServerCard />
                        
                    </div>
                </div>
            </div>
      </div>
    </>
  )
}

export default Servers
