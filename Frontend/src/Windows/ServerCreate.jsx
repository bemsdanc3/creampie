import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
  Navigate,
  useNavigate,
} from "react-router-dom";

// import HeadphonesIcon from './assets/Headphones.svg?react';

// import "./css/ServerCreate.css";
import "./css/Windows.css";

function ServerCreate({ close, reloadServersList }) {
  const [isPublic, setIsPublic] = useState(false);
  const [serverData, setServerData] = useState({
    title: "Новый сервер",
    description: "Описание нового сервера",
    pfs: "",
    isPublic: isPublic,
  });

  const createServer = async () => {
    console.log(serverData);
    try {
      const createServerRes = await fetch(
        "http://localhost:3000/js-service/servers",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json", 
          },
          withCredentials: true,
          body: JSON.stringify({
            title: serverData.title,
            is_public: serverData.isPublic,
            pfs: serverData.pfs,
            description: serverData.description,
          }),
        }
      );
      if (createServerRes.ok) {
        console.log("Сервер создан");
        reloadServersList();
      } else {
        console.warn("Ошибка при создании сервера");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    setServerData({...serverData, isPublic: isPublic});
  }, [isPublic])

  return (
    <>
      <div id="serverCreateWindow" className="window">
        <div className="ttlAndBtns">
          <h3>Создание сервера</h3>
          <div className="windowControlBtns">
            {/* <button>sdg</button> */}
            {/* <button>sdg</button> */}
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
          <img
            src="https://my.aeza.net/assets/images/ny-logo-dark.png"
            alt=""
          />
          <input
            type="text"
            name=""
            id=""
            placeholder="Название сервера"
            onChange={(e) => {
              setServerData({ ...serverData, title: e.target.value });
            }}
          />
          <textarea
            name=""
            id=""
            placeholder="Описание сервера"
            onChange={(e) => {
              setServerData({ ...serverData, description: e.target.value });
            }}
          />
          <label htmlFor="" onClick={() => {
            setIsPublic(!isPublic);
          }}>
            <span>Публичный</span>
            <input id="isPublic" type="checkbox" name="" checked={isPublic}/>
          </label>
          <button type="button" onClick={()=>{console.log('Попытка создать сервер...'); createServer()}}>Создать</button>
        </form>
      </div>
    </>
  );
}

export default ServerCreate;
