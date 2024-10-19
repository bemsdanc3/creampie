const { Client } = require('pg');
const express = require('express');

const app = express();
const PORT = 1488;

const db = new Client({
host: 'localhost',
user: 'shared_user',
password: 'your_password',
database: 'creampie',
port: 5432,
});

db.connect()
.then(() => console.log('Connected to PostgreSQL'))
.catch(err => console.error('Connection error', err.stack));

app.get('/hello', (req, res) => {
    res.status(200).send('Hello world!');
})

app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log('Time:', result.rows);
        res.status(200).json(result.rows);
        db.end();
    });
})

app.listen(PORT, ()=>{
    console.log(`Сервер запущен по ссылке: http://localhost:${PORT}`);
})