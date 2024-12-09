import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import ChatsIcon from '../assets/Chats.svg?react';
import CallIcon from '../assets/Call.svg?react';
import MenuIcon from '../assets/Menu.svg?react';
import CloseIcon from '../assets/Close.svg?react';
import FriendAddIcon from '../assets/FriendAdd.svg?react';

function FriendCard({online, requestReceive, requestSend, potential, userData}) {

    return (
        <>
            <NavLink to="/profile" className={"friendCard " + online}>
                <img src={userData.pfp || userData.receiver_pfp} alt="" />
                <h3>{userData.login || userData.receiver_login}</h3>
                
                <div className="friendCardButtons">
                {!requestSend && !requestReceive && !potential && 
                    <>
                        <button><ChatsIcon /></button>
                        <button><CallIcon /></button>
                        <button><MenuIcon /></button>
                    </>
                }
                {requestSend && 
                    <>
                        {/* <button><FriendAddIcon /></button> */}
                        <button><CloseIcon /></button>
                        {/* <button><MenuIcon /></button> */}
                    </>
                }
                {requestReceive && 
                    <>
                        <button><FriendAddIcon /></button>
                        <button><CloseIcon /></button>
                        {/* <button><MenuIcon /></button> */}
                    </>
                }
                {potential && 
                    <>
                        <button><FriendAddIcon /></button>
                        <button><MenuIcon /></button>
                    </>
                }
                </div>
            </NavLink>
        </>
    )
}

export default FriendCard
