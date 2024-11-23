import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './css/Settings.css';
import PaletteIcon from '../assets/Palette.svg?react';

function Settings() {
  // Доступные темы
  const themes = [
    'dark', 
    'vibrant-dark', 
    "vibrant-dark-green", 
    "pastel-dark-purple",
    "sunset",
    "berry",
    "ocean",
    'light', 
  ];
  
  // Состояние для хранения текущей темы
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  // Функция для смены темы
  const toggleTheme = () => {
    const currentIndex = themes.indexOf(theme);
    const newTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(newTheme);
    document.getElementById('root').classList.remove(theme);
    document.getElementById('root').classList.add(newTheme);
    localStorage.setItem('theme', newTheme); // Сохранение выбранной темы в localStorage
  };

  // Применяем тему при первой загрузке
  useEffect(() => {
    document.getElementById('root').classList.add(theme);
  }, [theme]);

  return (
    <>
      <div id="settingsPage">
        {/* <h2>Это страница настроек</h2> */}
        <button onClick={toggleTheme}><PaletteIcon />Сменить тему</button>
      </div>
    </>
  )
}

export default Settings;
