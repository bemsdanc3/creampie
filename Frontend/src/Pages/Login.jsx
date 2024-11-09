import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/RegAndLogin.css';

function Login({ logged }) {
  const [loginData, setLoginData] = useState({
    email: '',
    pass: ''
  })

  const login = async () => {
    console.log(loginData);
    try {
      const loginRes = await fetch('http://localhost:3000/go-service/login',{
        method: 'POST',
        credentials: 'include',
        withCredentials: true,
        body: JSON.stringify({
          email: loginData.email,
          pass: loginData.pass
        }),
      });
      if (loginRes.ok) {
        logged();
      } else {
        const errorData = await loginRes.json();
        console.log(errorData.error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div id="loginPage">
        <div id="loginPane">
            <h2>Вход в аккаунт</h2>
            <form action="">
                <input type="text" placeholder='Введите email' onChange={(e)=>{setLoginData({...loginData, email: e.target.value }); console.log(loginData)}}/>
                <input type="password" placeholder='Введите пароль' onChange={(e)=>{setLoginData({...loginData, pass: e.target.value }); console.log(loginData)}}/>
                <button type='button' onClick={login}>Войти</button>
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
