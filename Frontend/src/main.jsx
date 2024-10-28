import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, HashRouter, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';

const Router = window.navigator.userAgent.includes('Electron') ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router >
    <App />
  </Router >,
)
