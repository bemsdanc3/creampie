import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import StarFilledIcon from '../assets/StarFilled.svg?react';
import StarOutlineIcon from '../assets/StarOutline.svg?react';

function ServerCard({member, pinned}) {

    return (
        <>
            <NavLink to="/server" className={"serverCard "}>
                <div className="bannerInfo">
                    <img src="" alt="" />
                    <ul className="voiceMembers">
                        
                    </ul>
                </div>
                <div className="serverInfo">
                    <img src="" alt="" />
                    <div className="serverTextInfo">
                        <div className="titleAndPin">
                            <h2>Title</h2>
                            
                            <button className='pinServerBtn'>
                            {member && (
                                pinned ? <StarFilledIcon /> : <StarOutlineIcon />
                            )}
                            </button>
                        </div>
                        <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid sed porro odio commodi ullam? Dolorum quidem unde eveniet! Officia doloribus suscipit, optio voluptates quos esse nesciunt debitis. Architecto, aut odio!  </h4>
                    </div>
                </div>
            </NavLink>
        </>
    )
}

export default ServerCard
