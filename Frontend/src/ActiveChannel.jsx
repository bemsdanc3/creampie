import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import HeadphonesIcon from './assets/Headphones.svg?react';
import MicIcon from './assets/Mic.svg?react';
import CamIcon from './assets/Cam.svg?react';
import MonitorIcon from './assets/Monitor.svg?react';
import ArrowUpIcon from './assets/ArrowUp.svg?react';
import CallIcon from './assets/Call.svg?react';
import CallEndIcon from './assets/CallEnd.svg?react';

function ActiveChannel({ showMic, showHP }) {

  return (
    <>
        <div id="channel1" className="activeChannel">
            <div className="voiceBtns">
                {showMic &&
                <button>
                    <MicIcon />
                </button>}
                {showHP &&
                <button>
                    <HeadphonesIcon />
                </button>}
                <button>
                    <CamIcon />
                </button>
                <button>
                    <MonitorIcon />
                </button>
                <button>
                    <CallEndIcon />
                </button>
            </div>
            <h3>ChannelTtl</h3>
            <button><ArrowUpIcon /></button>
        </div>
    </>
  )
}

export default ActiveChannel
