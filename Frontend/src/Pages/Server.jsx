import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
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
  const [channels, setChannels]  = useState([]);
  const [channelsLoaded, setChannelsLoaded]  = useState(false);
  const { serverId } = useParams();
  const [members, setMembers]  = useState([]);
  const [membersLoaded, setMembersLoaded]  = useState(false);
  const [messages, setMessages]  = useState([]);
  const [messagesLoaded, setMessagesLoaded]  = useState(false);
  const [selectedChannel, setSelectedChannel]  = useState(-1);

  const loadChannelsAndCats = async () => {
    try {  
      const serverChannels = await fetch(`http://localhost:3000/js-service/servers/${serverId}/channels`, {
          method: 'GET',
          credentials: 'include',
          withCredentials: true,
      });
      const serverChannelsData = await serverChannels.json();
      setChannels(serverChannelsData);
      setChannelsLoaded(true);
      console.log(serverChannelsData);
    } catch (error) {
        console.error("Ошибка:", error);
    }
  }

  const loadMembers = async () => {
    try {  
      const serverMembers = await fetch(`http://localhost:3000/js-service/servers/${serverId}/members`, {
          method: 'GET',
          credentials: 'include',
          withCredentials: true,
      });
      const serverMembersData = await serverMembers.json();
      setMembers(serverMembersData);
      setMembersLoaded(true);
      console.log(serverMembersData);
    } catch (error) {
        console.error("Ошибка:", error);
    }
  }

  const loadMessages = async (chan_id) => {
    try {  
      const serverMessages = await fetch(`http://localhost:3000/js-service/messages/channel/${chan_id}`, {
          method: 'GET',
          credentials: 'include',
          withCredentials: true,
      });
      const serverMessagesData = await serverMessages.json();
      setMessages(serverMessagesData);
      setMessagesLoaded(true);
      console.log(serverMessagesData);
    } catch (error) {
        console.error("Ошибка:", error);
    }
  }

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
    loadChannelsAndCats();
    loadMembers();
  }, []);

  useEffect(() => {
    const messagesContainer = messagesRef.current;
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const updateSelectedChannel = (selectChanId) => {
    const chans = Array.from(document.getElementsByClassName('Channel'));
    chans.forEach((chan)=>{
      chan.classList.remove('selected');
    })
    const selectingChan = document.getElementById('channel_'+selectChanId);
    console.log('selecting ' + selectingChan)
    selectingChan.classList.add('selected');
  }

  return (
    <>
      <div id="serverPage">
        {/* <h2>Это страница сервера</h2> */}
        <div id="channelsList">
          
            {channelsLoaded && channels.length >= 1 &&
            <>
              {channels.map((chan, i)=>{
                return (
                  <>
                    <div key={i} id={"channel_" + chan.id} className='Channel' onClick={()=>{
                      setSelectedChannel(chan.id); 
                      updateSelectedChannel(chan.id);
                      loadMessages(chan.id);
                      }}>
                      {chan.chan_type == "voice" && <VolumeIcon fillOpacity="0.4"/>}
                      {chan.chan_type == "text" && <TagIcon fillOpacity="0.4"/>}
                      <h3>{chan.title}</h3>
                    </div>
                  </>
                )
              })}
            </>
            }
          {/* <div id="category1" className='Category'>
            <h2 className='CategoryTitle'>CategodyTitle</h2>
            <div className="CategoryChannels">
              <div id="channel1" className='Channel'><VolumeIcon fillOpacity="0.4"/><h3>ChannelTitleChannelTitleChannelTitleChannelTitleChannelTitleChannelTitle</h3></div>
              <div id="channel2" className='Channel'><TagIcon fillOpacity="0.4"/><h3>ChannelTitle</h3></div>
              <div id="channel3" className='Channel'><TagIcon fillOpacity="0.4"/><h3>ChannelTitle</h3></div>
            </div>
          </div> */}
        </div>
        <div id="messagesList">
          <div id="messages" ref={messagesRef}>
          {messagesLoaded && messages.length >= 1 &&
            messages.map((msg, i)=>{
              return (
                <Message messageData={msg}/>
              )
            })
          }
          </div>
          {selectedChannel != -1 &&
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
          </div>}
        </div>
        <div id="usersList">
          <div id="onlineUsers">
            <h3>В сети:</h3>
            <div className="OnlineServerUsers">
              {membersLoaded && members.length >= 1 &&
                members.map((member, i)=>{
                  if (member.is_online) {
                    return (
                      <>
                        <div id={"member " + i} className='user' >
                          <img src={member.pfp} alt="" />
                          <h4>{member.server_nickname || member.login}</h4>
                        </div>
                      </>
                    )
                  }
                })
              }
            </div>            
          </div>
          <div id="offlineUsers">
            <h3>Не сети:</h3>
            <div className="OfflineServerUsers">
              {membersLoaded && members.length >= 1 &&
                members.map((member, i)=>{
                  if (!member.is_online) {
                    return (
                      <>
                        <div id={"member " + i} className='user offline' >
                          <img src={member.pfp} alt="" />
                          <h4>{member.server_nickname || member.login}</h4>
                        </div>
                      </>
                    )
                  }
                })
              }
            </div>               
          </div>
        </div>
      </div>
    </>
  )
}

export default Server
