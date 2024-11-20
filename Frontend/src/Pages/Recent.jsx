import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import ServerCard from './ServerCard.jsx';
import './css/Recent.css';
import FriendCard from './FriendCard.jsx';

function Recent() {

  return (
    <>
      <div id="recentPage">
        <div id="recentActivities">
          <div id="recentServers">
            <div id="recentServersText">
                Недавние серверы:
            </div>
            <div id="recentServersList">
              {/* <ServerCard />
              <ServerCard />
              <ServerCard />
              <ServerCard />
              <ServerCard /> */}
            </div>
          </div>
          <div id="recentChats">
            <div id="recentChatsText">
                Недавние чаты:
            </div>
            <div id="recentChatsList">
              <FriendCard online={'online'}/>
              <FriendCard />
              <FriendCard online={'online'}/>
              <FriendCard online={'online'}/>
              <FriendCard />
              <FriendCard />
              <FriendCard online={'online'}/>
              <FriendCard />
              <FriendCard online={'online'}/>
              <FriendCard online={'online'}/>
              <FriendCard />
              <FriendCard />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Recent
