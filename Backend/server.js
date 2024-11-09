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

// Перенаправление запросов на микросервис на JS
app.use('/js-service', createProxyMiddleware({
    target: JS_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/js-service': '',  // Удаляет "/js-service" из пути
    },
}));

// Перенаправление запросов на микросервис на Go
app.use('/go-service', createProxyMiddleware({
    target: GO_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/rest-api-service': '',  // Удаляет "/rest-api-service" из пути
    },
}));

// Запуск API Gateway
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API Gateway запущен на порту ${PORT}`);
});

clientApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html')); // Возвращает index.html для всех маршрутов
});

// const CLIENT_PORT = 5500;
// clientApp.listen(CLIENT_PORT, () => {
//     console.log(`API Gateway запущен на порту ${CLIENT_PORT}`);
// });
