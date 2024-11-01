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

app.post('/servers', (req, res) => {
    const{title, is_public, pfs, description} = req.body;
    const owner_id = req.body.owner_id;
    console.log(title + " " + is_public + " " + owner_id + " " + pfs + " " + description);
    const createServer = `
    INSERT INTO servers (title, is_public, owner_id, pfs, description) VALUES ($1, $2, $3, $4, $5) RETURNING id;
    `;
    db.query(createServer, [title, is_public, owner_id, pfs, description], (err, rsServ) => {
        console.log(rsServ);
        if (err) {
            console.log(err);
        } else {
            console.log("New server created!");
            const server_id = rsServ.rows[0].id;
            const createDefaultTextChannel = `
            INSERT INTO channels (title, chan_type, server_id) VALUES ('Текстовый канал', 'text', $1);
            `;
            db.query(createDefaultTextChannel, [server_id], (err, rsText) => {
                console.log(rsText);
                if (err) {
                    console.log(err);
                } else {
                    console.log("Default text channel created!");
                };
            });
            const createDefaultVoiceChannel = `
            INSERT INTO channels (title, chan_type, server_id) VALUES ('Голосовой канал', 'voice', $1);
            `;
            db.query(createDefaultVoiceChannel, [server_id], (err, rsVoice) => {
                console.log(rsVoice);
                if (err) {
                    console.log(err);
                } else {
                    console.log("Default voice channel created!");
                };
            });
            res.status(200).json(rsServ);
        };
    });
});

app.get('/recommendedservers', (req, res) => {
    const getRecommendedServers = `
    SELECT * FROM servers WHERE isPublic = true;
    `;
    db.query(getRecommendedServers, [], (err, rs) => {
        console.log(rs.rows);
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(rs.rows);
        };
    });
});

app.get('/servers', (req, res) => {
    const user_id = req.body.ID;
    const getServers = `
    SELECT * FROM servers s JOIN server_members sm ON s.ID = sm.server_id WHERE sm.user_id = $1;
    `;
    db.query(getServers, [user_id], (err, rs) => {
        console.log(rs.rows);
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(rs.rows);
        };
    });
});



app.listen(PORT, ()=>{
    console.log(`Сервер запущен по ссылке: http://localhost:${PORT}`);
});