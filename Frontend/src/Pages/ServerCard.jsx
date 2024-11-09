import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import StarFilledIcon from '../assets/StarFilled.svg?react';
import StarOutlineIcon from '../assets/StarOutline.svg?react';

function ServerCard({member, pinned, serverData}) {

    return (
        <>
            <NavLink to="/server" className={"serverCard "}>
                <div className="bannerInfo">
                    <img src="" alt="" />
                    <ul className="voiceMembers">
                        
                    </ul>
                </div>
                <div className="serverInfo">
                    <img src={serverData.pfs} alt="" />
                    <div className="serverTextInfo">
                        <div className="titleAndPin">
                            <h2 title={serverData.title}>{serverData.title}</h2>
                            
                            <button className='pinServerBtn'>
                            {member && (
                                pinned ? <StarFilledIcon /> : <StarOutlineIcon />
                            )}
                            </button>
                        </div>
                        <h4 title={serverData.description}>{serverData.description}</h4>
                    </div>
                </div>
            </NavLink>
        </>
    )
}

export default ServerCard
