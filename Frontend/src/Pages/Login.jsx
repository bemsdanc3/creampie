import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/RegAndLogin.css';

function Login({ logged }) {

  return (
    <>
      <div id="loginPage">
        <div id="loginPane">
            <h2>Вход в аккаунт</h2>
            <form action="">
                <input type="text" placeholder='Введите email'/>
                <input type="password" placeholder='Введите пароль'/>
                <button type='button' onClick={logged}>Войти</button>
            </form>
            <NavLink to="/register">
                Нет аккаунта
            </NavLink>
        </div>
      </div>
    </>
  )
}

export default Login
