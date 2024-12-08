import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/Friends.css'
import FriendCard from './FriendCard.jsx';
import PlusIcon from '../assets/Plus.svg?react';
import SearchIcon from '../assets/Search.svg?react';

function Friends() {
    // const friends = Array.from({ length: 25 }, (_, index) => index + 1);
    const [friends, setFriends] = useState([]);
    const [friendsLoaded, setFriendsLoaded] = useState(false); 

    const loadFriends = async () => {
        try {  
            const friends = await fetch(`http://localhost:3000/js-service/friends`, {
                method: 'GET',
                credentials: 'include',
                withCredentials: true,
            });
            const friendsData = await friends.json();
            setFriends(friendsData);
            setFriendsLoaded(true);
            console.log(friendsData);
          } catch (error) {
              console.error("Ошибка:", error);
          }
    }

    useEffect(()=>{
        loadFriends();
    }, [])

    return (
        <>
            <div id="friendsPage">
            <div id="friendSearch">
                <input type="text" placeholder={'Введите имя...'}/>
                {/* <a id="friendFilters">Параметры</a> */}
                <button><SearchIcon/></button>
            </div>
            <div id="friendList">
                {/* {friends.map((friend) => (
                    <FriendCard key={friend} />
                ))} */}
                <div id="requestFriends">
                    <div id="requestFriendsText">
                        Заявки в друзья:
                    </div>
                    <div id="requestFriendsList">
                        <FriendCard request={true} />
                        <FriendCard request={true} />
                        <FriendCard request={true} online="online"/>
                        <FriendCard request={true} />
                    </div>
                </div>
                <div id="yourFriends">
                    <div id="onlineFriendsText">
                        В сети:
                    </div>
                    <div id="onlineFriends">
                        {friendsLoaded && friends.length >= 1 &&
                            friends.map((friend)=>{
                                if (friend.is_online) {
                                    return (
                                        <>
                                            <FriendCard online="online"/>
                                        </>
                                    )
                                }
                            })
                        }
                    </div>
                    <div id="offlineFriendsText">
                        Не в сети:
                    </div>
                    <div id="offlineFriends">
                        {friendsLoaded && friends.length >= 1 &&
                            friends.map((friend)=>{
                                if (!friend.is_online) {
                                    return (
                                        <>
                                            <FriendCard online="offline"/>
                                        </>
                                    )
                                }
                            })
                        }
                    </div>
                </div>
                {/* <div id="potentialFriends">
                    <div id="potentialFriendsText">
                        Возможные друзья:
                    </div>
                    <div id="potentialFriendsList">
                        <FriendCard potential={true} />
                        <FriendCard potential={true} online="online"/>
                        <FriendCard potential={true} />
                        <FriendCard potential={true} online="online"/>
                    </div>
                </div> */}
                {/* <button className='friendAddButton'><PlusIcon/></button> */}
            </div>
            </div>
        </>
    )
}

export default Friends
