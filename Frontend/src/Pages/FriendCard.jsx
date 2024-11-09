import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import ChatsIcon from '../assets/Chats.svg?react';
import CallIcon from '../assets/Call.svg?react';
import MenuIcon from '../assets/Menu.svg?react';
import CloseIcon from '../assets/Close.svg?react';
import FriendAddIcon from '../assets/FriendAdd.svg?react';

function FriendCard({online, request, potential}) {

    return (
        <>
            <NavLink to="/profile" className={"friendCard " + online}>
                <img src="" alt="" />
                <h3>Name</h3>
                
                <div className="friendCardButtons">
                {!request && !potential && 
                    <>
                        <button><ChatsIcon /></button>
                        <button><CallIcon /></button>
                        <button><MenuIcon /></button>
                    </>
                }
                {request && 
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
