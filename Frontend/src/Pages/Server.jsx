import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import './css/Server.css';
import FileIcon from '../assets/File.svg?react';
import SendIcon from '../assets/Send.svg?react';
import EmojiIcon from '../assets/Emoji.svg?react';
import TagIcon from '../assets/Tag.svg?react';
import VolumeIcon from '../assets/Volume.svg?react';
import Message from './Message.jsx';

function Server({ showCreateChannelFunc, reloadChannelsList, channelsLoaded }) {
  const inputDivRef  = useRef(null);
  const messagesRef = useRef(null);
  const [channels, setChannels]  = useState([]);
  const [channelsLoaded, setChannelsLoaded]  = useState(false);
  const { serverId } = useParams();
  const [members, setMembers]  = useState([]);
  const [membersLoaded, setMembersLoaded]  = useState(false);
  const [messages, setMessages]  = useState([]);
  const [messagesLoaded, setMessagesLoaded]  = useState(false);
  const [selectedChannel, setSelectedChannel]  = useState(0);
  const [refId, setRefId]  = useState(null);
  const [messageContent, setMessageContent] = useState("");
  const [files, setFiles]  = useState([]);
  
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
      channelsLoaded();
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

  const handlePaste = (event) => {
    event.preventDefault();

    const text = event.clipboardData.getData('text/plain');

    document.execCommand('insertText', false, text);
  };

  useEffect(() => {
    loadChannelsAndCats();
    loadMembers();
    console.log('serverId:', serverId);
  }, []);

  useEffect(()=>{
    loadChannelsAndCats();
  }, [reloadChannelsList]);

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

  const msgSend = async () => {
    if (messageContent.length >= 1) {
      console.log("messageContent: " + 
        messageContent + 
        "; " + 
        "selectedChannel: " + 
        selectedChannel +
        " " +
        "refId: " + 
        refId + 
        " " +
        "files: " + 
        files
      );
      try {
        const messageSendReq = await fetch(
          "http://localhost:3000/js-service/messages/channel",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json", 
            },
            withCredentials: true,
            body: JSON.stringify({
              channel_id: selectedChannel,
              content: messageContent,
              reference: refId,
              file_link: files,
            }),
          }
        );
        if (messageSendReq.ok) {
          console.log("Сообщение отправлено!");
          loadMessages(selectedChannel);
          inputDivRef.current.innerHTML = "";
          setMessageContent(""); 
        } else {
          console.warn("Ошибка при отправке сообщения");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleFocus = () => {
    inputDivRef.current.classList.remove('empty');
  };
  
  const handleBlur = () => {
    if (!messageContent.trim()) {
      inputDivRef.current.classList.add('empty');
    }
  };  

  useEffect(() => {
    const isFocused = document.activeElement === inputDivRef.current;
  
    if (!messageContent.trim() && !isFocused) {
      inputDivRef.current.classList.add('empty');
    } else {
      inputDivRef.current.classList.remove('empty');
    }
  }, [messageContent]);  

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
              <button onClick={()=>{console.log("Received showCreateChannelFunc:", showCreateChannelFunc); showCreateChannelFunc(); }}>+</button>
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
              onInput={() => setMessageContent(inputDivRef.current.textContent.trim())}
              onPaste={handlePaste}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { // Отправка при Enter, Shift+Enter — для новой строки
                  e.preventDefault(); // Останавливаем стандартное поведение (перенос строки)
                  msgSend(); // Отправка сообщения
                }
              }}
            />
            <div id="inputButtonsRight" className='inputButtons'>
              <button><EmojiIcon /></button>
              <button onClick={msgSend}><SendIcon /></button>
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

export default Server;
