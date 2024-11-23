import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/Server.css';
import FileIcon from '../assets/File.svg?react';
import SendIcon from '../assets/Send.svg?react';
import EmojiIcon from '../assets/Emoji.svg?react';
import TagIcon from '../assets/Tag.svg?react';
import VolumeIcon from '../assets/Volume.svg?react';
import Message from './Message.jsx';

function Server() {
  const inputDivRef  = useRef(null);
  const messagesRef = useRef(null);

  const handleInput = () => {
    const inputDiv = inputDivRef .current;
    if (textarea) {
      inputDiv.style.height = 'auto';
      inputDiv.style.height = `${Math.max(textarea.scrollHeight, 20)}px`; 
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const text = event.clipboardData.getData('text/plain');

    document.execCommand('insertText', false, text);
  };

  useEffect(() => {
    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, []);

  return (
    <>
      <div id="serverPage">
        {/* <h2>Это страница сервера</h2> */}
        <div id="channelsList">
          <div id="category1" className='Category'>
            <h2 className='CategoryTitle'>CategodyTitle</h2>
            <div className="CategoryChannels">
              <div id="channel1" className='Channel'><VolumeIcon fillOpacity="0.4"/><h3>ChannelTitleChannelTitleChannelTitleChannelTitleChannelTitleChannelTitle</h3></div>
              <div id="channel2" className='Channel'><TagIcon fillOpacity="0.4"/><h3>ChannelTitle</h3></div>
              <div id="channel3" className='Channel'><TagIcon fillOpacity="0.4"/><h3>ChannelTitle</h3></div>
            </div>
          </div>
          <div id="category2" className='Category'>
            <h2 className='CategoryTitle'>CategodyTitle</h2>
            <div className="CategoryChannels">
              <div id="channel1" className='Channel'><VolumeIcon fillOpacity="0.4"/><h3>ChannelTitle</h3></div>
              <div id="channel2" className='Channel'><TagIcon fillOpacity="0.4"/><h3>ChannelTitle</h3></div>
            </div>
          </div>
        </div>
        <div id="messagesList">
          <div id="messages" ref={messagesRef}>
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
          </div>
          <div id="messagesInput">
            <div id="inputButtonsLeft" className='inputButtons'>
              <button><FileIcon /></button>
            </div>
            <div 
              id="messageInputArea"
              ref={inputDivRef}
              contentEditable="true"
              placeholder="Введите сообщение"
              onInput={handleInput}
              onPaste={handlePaste}
            />
            <div id="inputButtonsRight" className='inputButtons'>
              <button><EmojiIcon /></button>
              <button><SendIcon /></button>
            </div>
          </div>
        </div>
        <div id="usersList">
          <div id="onlineUsers">
            <h2>В сети:</h2>
            <div className="OnlineServerUsers">
              <div id="user1">User1</div>
              <div id="user2">User2</div>
              <div id="user3">User3</div>  
            </div>            
          </div>
          <div id="offlineUsers">
            <h2>Не сети:</h2>
            <div className="OfflineServerUsers">
              <div id="user1">User1</div>
              <div id="user2">User2</div>
              <div id="user3">User3</div>  
            </div>               
          </div>
        </div>
      </div>
    </>
  )
}

export default Server
