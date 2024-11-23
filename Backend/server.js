const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const clientApp = express();
const cors = require('cors');
const path = require('path');

// Настройка CORS
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5500'], // Массив разрешенных источников
    credentials: true,
};

app.use(cors(corsOptions));
clientApp.use(cors(corsOptions));
clientApp.use(express.static('../frontend/dist'));

// URL для микросервисов
const JS_SERVICE_URL = 'http://localhost:3001';  // Микросервис на JS
const GO_SERVICE_URL = 'http://localhost:3002';  // Микросервис на Go

// Функция для добавления атрибута SameSite=None и Secure для кук
const addSameSiteNone = (proxyRes, req, res) => {
    const cookies = proxyRes.headers['set-cookie'];
    if (cookies) {
        const updatedCookies = cookies.map(cookie => {
            // Проверяем, если это куки token или user_id
            if (cookie.includes('token') || cookie.includes('user_id')) {
                // Добавляем атрибуты SameSite=None и Secure
                if (!cookie.includes('SameSite')) {
                    return cookie + '; SameSite=None; Secure';
                }
            }
            return cookie;
        });
        proxyRes.headers['set-cookie'] = updatedCookies;
    }
};

// Перенаправление запросов на микросервис на JS
app.use('/js-service', createProxyMiddleware({
    target: JS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/js-service': '',  // Удаляет "/js-service" из пути
    },
    onProxyRes: addSameSiteNone, // Добавление SameSite=None к куки
}));

// Перенаправление запросов на микросервис на Go
app.use('/go-service', createProxyMiddleware({
    target: GO_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/go-service': '',  // Удаляет "/go-service" из пути
    },
    onProxyRes: addSameSiteNone, // Добавление SameSite=None к куки
}));

// Устанавливаем куки с атрибутами SameSite=None и Secure на сервере
app.use((req, res, next) => {
    res.cookie('token', 'your-token-value', {
        httpOnly: true,
        secure: false,  // Нужно для HTTPS
        sameSite: 'None',  // Для кросс-доменных запросов
        maxAge: 3600000,  // Пример времени жизни куки
    });

    res.cookie('user_id', 'your-user-id', {
        httpOnly: true,
        secure: false,  // Нужно для HTTPS
        sameSite: 'None',  // Для кросс-доменных запросов
        maxAge: 3600000,  // Пример времени жизни куки
    });

    next();
});

// Запуск API Gateway
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway запущен на порту ${PORT}`);
});

clientApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Возвращает index.html для всех маршрутов
});

const CLIENT_PORT = 5500;
clientApp.listen(CLIENT_PORT, () => {
    console.log(`API Gateway запущен на порту ${CLIENT_PORT}`);
});
