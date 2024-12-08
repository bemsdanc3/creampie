import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';

function Message({ messageData }) {

  return (
    <>
      <div className="message">
        <img className='msgUserProfile' src={messageData.pfp} alt="" />
        <div className="messageTextInfo">
          <h2>{messageData.login} <span>{messageData.send_date}</span></h2>
          <h3>{messageData.content}</h3>
        </div>
      </div>
    </>
  )
}

export default Message
