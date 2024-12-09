import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
  useNavigate
} from "react-router-dom";

// import HeadphonesIcon from './assets/Headphones.svg?react';

// import "./css/ChannelCreate.css";
import "./css/Windows.css";

function ChannelCreate({ close, reloadChannelsList, serverId }) {
    const [channelData, setChannelData] = useState({
      title: "Новый канал",
      description: "Описание нового канала",
      type: "text",
      category_id: null,
    });

    useEffect(()=>{
        console.log(serverId);
    }, [])
  
    const createChannel = async () => {
      console.log(channelData);
      console.log(serverId);
      try {
        const createChannelRes = await fetch(
          "http://localhost:3000/js-service/server/channels",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: channelData.title,
                chan_type: channelData.type,
                description: channelData.description,
                category_id: channelData.category_id,
                server_id: serverId,
            }),
          }
        );
        if (createChannelRes.ok) {
          console.log("Канал создан");
          reloadChannelsList();
        } else {
          console.warn("Ошибка при создании канала");
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <>
        <div id="channelCreateWindow" className="window">
          <div className="ttlAndBtns">
            <h3>Создание канала</h3>
            <div className="windowControlBtns">
              <button
                onClick={() => {
                  close();
                  console.log("window closed");
                }}
              >
                x
              </button>
            </div>
          </div>
          <form action="">
            <input
              type="text"
              placeholder="Название канала"
              value={channelData.title}
              onChange={(e) =>
                setChannelData({ ...channelData, title: e.target.value })
              }
            />
            <textarea
              placeholder="Описание канала"
              value={channelData.description}
              onChange={(e) =>
                setChannelData({ ...channelData, description: e.target.value })
              }
            />
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="channelType"
                  value="text"
                  checked={channelData.type === "text"}
                  onChange={(e) =>
                    setChannelData({ ...channelData, type: e.target.value })
                  }
                />
                Текстовый
              </label>
              <label>
                <input
                  type="radio"
                  name="channelType"
                  value="voice"
                  checked={channelData.type === "voice"}
                  onChange={(e) =>
                    setChannelData({ ...channelData, type: e.target.value })
                  }
                />
                Голосовой
              </label>
            </div>
            <button
              type="button"
              onClick={() => {
                console.log("Попытка создать канал...");
                createChannel();
              }}
            >
              Создать
            </button>
          </form>
        </div>
      </>
    );
}
  
export default ChannelCreate;  
