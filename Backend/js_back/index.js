const { Client } = require('pg');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 3001;

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
});

app.post('/server', (req, res) => {
    const{title, isPublic, pfs, description} = req.body;
    const owner_id = req.body.owner_id;
    console.log(title + " " + isPublic + " " + owner_id + " " + pfs + " " + description);
    const createServer = `
    INSERT INTO servers (title, isPublic, owner_id, pfs, description) VALUES ($1, $2, $3, $4, $5);
    `;
    db.query(createServer, [title, isPublic, owner_id, pfs, description], (err, rs) => {
        console.log(rs);
        if (err) {
            console.log(err);
        } else {
            console.log("New server created!");
            res.status(200).json(rs);
        };
    });
});

app.listen(PORT, ()=>{
    console.log(`Сервер запущен по ссылке: http://localhost:${PORT}`);
});