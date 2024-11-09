import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/RegAndLogin.css';

function Register({ logged }) {

  return (
    <>
      <div id="registerPage">
        <div id="registerPane">
            <h2>Создание аккаунта</h2>
            <form action="">
                <input type="text" placeholder='Введите имя пользователя'/>
                <input type="text" placeholder='Введите email'/>
                <input type="password" placeholder='Введите пароль'/>
                <input type="password" placeholder='Повторите пароль'/>
                <button type='button' onClick={logged}>Зарегистрироваться</button>
            </form>
            <NavLink to="/login">
                Есть аккаунт
            </NavLink>
        </div>
      </div>
    </>
  )
}

export default Register
