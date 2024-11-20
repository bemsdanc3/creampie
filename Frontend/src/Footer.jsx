import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Footer.css';
import ArrowForwardIcon from './assets/ArrowForward.svg?react';
import ArrowBackIcon from './assets/ArrowBack.svg?react';
import CamIcon from './assets/Cam.svg?react';
import MicIcon from './assets/Mic.svg?react';
import MonitorIcon from './assets/Monitor.svg?react';
import HeadphonesIcon from './assets/Headphones.svg?react';
import ArrowUpIcon from './assets/ArrowUp.svg?react';
import CallIcon from './assets/Call.svg?react';
import CallEndIcon from './assets/CallEnd.svg?react';
import CircleIcon from './assets/Circle.svg?react';

function Footer() { 
    const [showButtons, setShowButtons] = useState(false);
    const [showUserSettingsPane, setShowUserSettingsPane] = useState(false);
    const activeChannelsRef = useRef(null);

    const scrollLeft = () => {
        if (activeChannelsRef.current) {
            activeChannelsRef.current.scrollLeft -= 330; 
        }
    };

    const scrollRight = () => {
        if (activeChannelsRef.current) {
            activeChannelsRef.current.scrollLeft += 330; 
        }
    };

    const checkOverflow = () => {
        if (activeChannelsRef.current) {
            const { scrollWidth, clientWidth } = activeChannelsRef.current;
            setShowButtons(scrollWidth > clientWidth); // Показывать кнопки, если содержимое переполняет контейнер
        }
    };

    useEffect(() => {
        checkOverflow(); // Проверяем при первом рендере

        window.addEventListener('resize', checkOverflow); // Проверяем при изменении размера окна

        return () => {
            window.removeEventListener('resize', checkOverflow); // Убираем слушатель при размонтировании
        };
    }, []);

    useEffect(()=>{
        const profilePane = document.getElementById('profileSettingsPane');
        if (showButtons) {
            profilePane.classList.add('resize');
        } else {
            profilePane.classList.remove('resize');            
        }
    }, [showButtons]);

    const userSettingsPane = (
        <>
            <ul id="userSettingsPane">
                <li><CircleIcon fill="var(--online-color)"/> В сети</li>
                <li><CircleIcon fill="var(--afk-color)"/> Отошёл</li>
                <li><CircleIcon fill="var(--busy-color)"/> Занят</li>
                <li><CircleIcon fill="var(--offline-color)"/> Не в сети</li>
            </ul>
        </>
    )

    return (
        <>
            {showUserSettingsPane &&
                userSettingsPane
            }
            <footer id='footer'>
                <div id="profileSettingsPane" onClick={()=>setShowUserSettingsPane(!showUserSettingsPane)}>
                    <img src="" alt="" />
                    <h2>Name</h2>
                </div>
                <div id="activeChannelsAndBtns">
                    {showButtons && 
                    <button id='leftChannelBtn' className='arrow' onClick={scrollLeft}>
                        <ArrowBackIcon />    
                    </button>}
                    <div id="ActiveChannels" ref={activeChannelsRef}>
                        <div id="channel1" className="activeChannel">
                            <div className="voiceBtns">
                                <button>
                                    <MicIcon />
                                </button>
                                <button>
                                    <HeadphonesIcon />
                                </button>
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
                        <div id="channel1" className="activeChannel">
                            <div className="voiceBtns">
                                <button>
                                    <MicIcon />
                                </button>
                                <button>
                                    <HeadphonesIcon />
                                </button>
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
                            <h3>ChannelTtlfdhdfhd</h3>
                            <button><ArrowUpIcon /></button>
                        </div>
                        <div id="channel1" className="activeChannel">
                            <div className="voiceBtns">
                                <button>
                                    <MicIcon />
                                </button>
                                <button>
                                    <HeadphonesIcon />
                                </button>
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
                    </div>
                    {showButtons && 
                    <button id='rightChannelBtn' className='arrow' onClick={scrollRight}>
                        <ArrowForwardIcon />    
                    </button>} 
                </div> 
            </footer>
        </>
    )
}

export default Footer