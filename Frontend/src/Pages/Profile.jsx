import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/Profile.css';
<<<<<<< HEAD
import ChatsIcon from '../assets/Chats.svg?react';
import MenuIcon from '../assets/Menu.svg?react';
import CallIcon from '../assets/Call.svg?react';
=======
>>>>>>> main

function ProfilePage() {

  return (
    <>
<<<<<<< HEAD
      <div id="profilePage">
=======
      <div className="profilePage">
>>>>>>> main
        <div id="profileCard">
            <div id="bannerInfo">
                <img id="profileBanner" src="" alt="" />
                <div id="links">
                    <img src="" alt="" />
                    <img src="" alt="" />
                    <img src="" alt="" />
                </div>
            </div>
            <div id="profileInfo">
                <div id="profilePictureAndButtons">
                    <img id="profilePic" src="" alt="" />
                    <div id="buttons">
                        <button>
<<<<<<< HEAD
                            <CallIcon />
                        </button>
                        <button>
                            <ChatsIcon />
                        </button>
                        <button>
                            <MenuIcon />
=======
                            Call
                        </button>
                        <button>
                            Msg
                        </button>
                        <button>
                            Othr
>>>>>>> main
                        </button>
                    </div>
                </div>
                <div id="profileTextInfo">
                    <div id="nameAndOnline">
                        <h2>Name</h2>
                        <div id="onlineStatus"></div>
                    </div>
                    <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. In, necessitatibus tempora? Placeat pariatur perspiciatis natus repellat ipsa cumque nesciunt neque dicta voluptatibus facilis, doloribus qui molestiae rem voluptatem sed nam!</h3>
                    <div id="mutualFriendsAndServers">
                        <div id="mutualFriends">
                            <div id="icons">
                                <img src="" alt="" />
                                <img src="" alt="" />
                                <img src="" alt="" />
<<<<<<< HEAD
                                <img src="" alt="" />
=======
>>>>>>> main
                            </div>
                            <h3>Общ. друзья</h3>
                        </div>
                        <div id="mutualServers">
                            <div id="icons">
                                <img src="" alt="" />
                                <img src="" alt="" />
                                <img src="" alt="" />
<<<<<<< HEAD
                                <img src="" alt="" />
=======
>>>>>>> main
                            </div>
                            <h3>Общ. серверы</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage
