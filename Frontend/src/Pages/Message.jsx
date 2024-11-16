import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';

function Message({ messageData }) {

  return (
    <>
      <div className="message">
        <img className='msgUserProfile' src="" alt="" />
        <h2>Name</h2>
        <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora commodi consectetur repellendus officia aliquam impedit dolorem id quos ut iste eum corrupti, doloremque soluta. Fugit temporibus eius porro unde vitae.</h3>
      </div>
    </>
  )
}

export default Message
