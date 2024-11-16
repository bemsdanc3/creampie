import { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Footer.css';
import ActiveChannel from './ActiveChannel.jsx';
import CircleIcon from './assets/Circle.svg?react';
import ArrowForwardIcon from './assets/ArrowForward.svg?react';
import ArrowBackIcon from './assets/ArrowBack.svg?react';
import HeadphonesIcon from './assets/Headphones.svg?react';
import MicIcon from './assets/Mic.svg?react';

function Footer() { 
    const [showButtons, setShowButtons] = useState(false);
    const [showUserSettingsPane, setShowUserSettingsPane] = useState(false);
    const activeChannelsRef = useRef(null);

    const scrollLeft = () => {
        if (activeChannelsRef.current) {
            activeChannelsRef.current.scrollLeft -= 336; 
        }
    };

    const scrollRight = () => {
        if (activeChannelsRef.current) {
            activeChannelsRef.current.scrollLeft += 336; 
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
        const leftChannelBtn = document.getElementById('leftChannelBtn');
        const rightChannelBtn = document.getElementById('rightChannelBtn');
        if (showButtons) {
            leftChannelBtn.classList.remove('hiddenBtn');  // Убираем скрытие кнопки прокрутки влево
            rightChannelBtn.classList.remove('hiddenBtn'); // Убираем скрытие кнопки прокрутки вправо
        } else {
            leftChannelBtn.classList.add('hiddenBtn');     // Скрываем кнопку прокрутки влево
            rightChannelBtn.classList.add('hiddenBtn');    // Скрываем кнопку прокрутки вправо
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
                    <div id="profileSettingsButtons">
                        <button>
                            <MicIcon />
                        </button>
                        <button>
                            <HeadphonesIcon />
                        </button>
                    </div>
                </div>
                <div id="activeChannelsAndBtns">
                    <button id='leftChannelBtn' className={'arrow' + (!showButtons ? '' : ' hiddenBtn')} onClick={scrollLeft}>
                        <ArrowBackIcon />    
                    </button>
                    <div id="ActiveChannels" ref={activeChannelsRef}>
                        <ActiveChannel showMic={true} showHP={true}/>
                        {/* <ActiveChannel showMic={true}/> */}
                        <ActiveChannel />
                        <ActiveChannel />
                        {/* <ActiveChannel /> */}
                        {/* <ActiveChannel />
                        <ActiveChannel />
                        <ActiveChannel /> */}
                    </div>
                    <button id='rightChannelBtn' className={'arrow' + (!showButtons ? '' : ' hiddenBtn')} onClick={scrollRight}>
                        <ArrowForwardIcon />    
                    </button>
                </div> 
            </footer>
        </>
    )
}

export default Footer