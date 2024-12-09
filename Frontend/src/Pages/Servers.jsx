import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import PlusIcon from '../assets/Plus.svg?react';
import LoadingIcon from '../assets/Loading.svg?react';
import SearchIcon from '../assets/Search.svg?react';
import ServerCard from './ServerCard.jsx';
import './css/Servers.css';

function Servers({ createServerFunc, reloadServersList, serversLoaded, setServerId }) {
  const [recServers, setRecServers] = useState([]);
  const [recServersLoaded, setRecServersLoaded] = useState(false);
  const [userServers, setUserServers] = useState([]);
  const [userServersLoaded, setUserServersLoaded] = useState(false);
  const [favServers, setFavServers] = useState([]);
  const [favServersLoaded, setFavServersLoaded] = useState(false);

  const ShowServers = async () => {
      try {  
          const userServersRes = await fetch("http://localhost:3000/js-service/servers", {
              method: 'GET',
              credentials: 'include',
              withCredentials: true,
          });
          const userServersResData = await userServersRes.json();
          setUserServers(userServersResData);
          setUserServersLoaded(true);
          const recServersRes = await fetch("http://localhost:3000/js-service/servers/recommended", {
              method: 'GET',
              credentials: 'include',
              withCredentials: true,
          });
          const recServersResData = await recServersRes.json();
          setRecServers(recServersResData);
          setRecServersLoaded(true);
          console.log(userServersResData);
          console.log(recServersResData);
          serversLoaded();
      } catch (error) {
          console.error("Ошибка:", error);
      }
  }

  useEffect(()=>{
    ShowServers();
  }, [reloadServersList]);

  return (
    <>
      <div id="serversPage">
        <div id="serverSearch">
            <button id="createBtn" onClick={()=>{createServerFunc()}}><PlusIcon /></button>
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
                    {!favServersLoaded &&
                      <LoadingIcon className="loadingIcon"/>
                    }
                    <div id="myFavServersList">
                      {/* <ServerCard member={true} pinned={true}/> */}
                      {/* <ServerCard member={true} pinned={true}/> */}

                    </div>  
                    <div id="myServersListText">
                        Мои серверы:
                    </div>
                    {!userServersLoaded &&
                      <LoadingIcon className="loadingIcon"/>
                    }
                    <div id="myServersList">
                      {userServersLoaded &&
                        userServers.map((server) => (
                          <ServerCard key={server.id} member={true} serverData={server} setServerId={(server_id)=>setServerId(server_id)}/>
                        ))
                      }  
                    </div>                    
                </div>
                <div id="recommendedServers">
                    <div id="recommendedServersText">
                        Рекомендуемые серверы:
                    </div>
                    {!recServersLoaded &&
                      <LoadingIcon className="loadingIcon"/>
                    }
                    <div id="recommendedServersList">
                      {recServersLoaded &&
                        recServers.map((server) => (
                          <ServerCard key={server.id} serverData={server} />
                        ))
                      }                      
                    </div>
                </div>
            </div>
      </div>
    </>
  )
}

export default Servers;
