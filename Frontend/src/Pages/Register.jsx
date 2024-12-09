import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/RegAndLogin.css';

function Register({ logged }) {
  const [regData, setRegData] = useState({
    login: '',
    email: '',
    pass: '',
    passRepeat: '',
  })

  const register = async () => {
    if (regData.pass == regData.passRepeat) {
        console.log(regData);
      try {
        const regRes = await fetch('http://localhost:3000/go-service/register',{
          method: 'POST',
          credentials: 'include',
          withCredentials: true,
          body: JSON.stringify({
            login: regData.login,
            email: regData.email,
            pass: regData.pass
          }),
        });
        if (regRes.ok) {
          logged();
        } else {
          const errorData = await regRes.json();
          console.log(errorData.error);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log('Пароли не совпадают');
    }
  }

  return (
    <>
      <div id="registerPage">
        <div id="registerPane">
            <h2>Создание аккаунта</h2>
            <form action="">
                <input type="text" placeholder='Введите имя пользователя' onChange={(e)=>{setRegData({...regData, login: e.target.value }); console.log(regData)}}/>
                <input type="text" placeholder='Введите email' onChange={(e)=>{setRegData({...regData, email: e.target.value }); console.log(regData)}}/>
                <input type="password" placeholder='Введите пароль' onChange={(e)=>{setRegData({...regData, pass: e.target.value }); console.log(regData)}}/>
                <input type="password" placeholder='Повторите пароль' onChange={(e)=>{setRegData({...regData, passRepeat: e.target.value }); console.log(regData)}}/>
                <button type='button' onClick={register}>Зарегистрироваться</button>
            </form>
            <NavLink to="/login">
                Есть аккаунт
            </NavLink>
        </div>
      </div>
    </>
  )
}

export default Register;
