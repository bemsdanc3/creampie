const { Client } = require('pg');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

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

app.get('/users', async (req, res) => {
    db.query('SELECT * FROM users', (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log('Time:', result.rows);
        res.status(200).json(result.rows);
        //db.end();
    });
})

app.post('/users', async (req, res) => {
    const { login, pass, email } = req.body;
    const addUserQuery = `
    INSERT INTO users (login, pass, email) 
    VALUES 
    ($1, $2, $3);
    `
    db.query(addUserQuery, [login, pass, email], (error, result) => {
        if (error) {
            console.error(error);
            return;
        }
        console.log("заебумба");
        res.status(200).json({message: "заебумба"});
        // db.end();
    });
})

app.listen(PORT, ()=>{
    console.log(`Сервер запущен по ссылке: http://localhost:${PORT}`);
})