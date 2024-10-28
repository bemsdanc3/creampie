import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/Friends.css'
import FriendCard from './FriendCard.jsx';
import PlusIcon from '../assets/Plus.svg?react';
import SearchIcon from '../assets/Search.svg?react';

function Friends() {
    const friends = Array.from({ length: 25 }, (_, index) => index + 1);

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
                <FriendCard online="online"/>
                <FriendCard online="online"/>
                <FriendCard />
                <FriendCard online="online"/>
                <FriendCard online="online"/>
                <FriendCard online="online"/>
                <FriendCard />
                <FriendCard online="online"/>
                <FriendCard online="online"/>
                <FriendCard />
                <FriendCard />
                {/* <button className='friendAddButton'><PlusIcon/></button> */}
            </div>
            </div>
        </>
    )
}

export default Friends
