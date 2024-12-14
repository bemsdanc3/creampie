const { Pool } = require('pg');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 3001;

const db = new Pool({
host: '194.87.29.156',
user: 'shared_user',
password: 'your_password',
database: 'creampie',
port: 5432,
max: 10,
idleTimeoutMillis: 30000, 
connectionTimeoutMillis: 2000,
});

// db.connect()
// .catch(err => console.error('Connection error', err.stack));
db.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => {
      console.error('Initial connection error', err);
      setTimeout(() => {
          db.connect(); // Повторить попытку подключения
      }, 5000); // Через 5 секунд
  });


app.get('/hello', (req, res) => {
    res.status(200).send('Hello world!');
});

app.post('/servers', (req, res) => {
    const{title, is_public, pfs, description} = req.body;
    const owner_id = req.cookies.user_id;
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
            const addOwnerToServ = `
            INSERT INTO server_members (user_id, server_id) VALUES ($1, $2);
            `;
            db.query(addOwnerToServ, [owner_id, server_id], (err, rsAdd) => {
                console.log(rsAdd);
                if (err) {
                    console.log(err);
                } else {
                    console.log("Owner added to server!");
                };
            });
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

app.get('/servers/recommended', (req, res) => {
    const getRecommendedServers = `
    SELECT * FROM servers WHERE is_public = true;
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
    const user_id = req.cookies.user_id;
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

app.post('/server/channels', (req, res) => {
    const{title, chan_type, description, category_id, server_id} = req.body;
    console.log(title + " " + chan_type + " " + description + " " + category_id + " " + server_id);
    const createChannel = `
    INSERT INTO channels (title, chan_type, description, category_id, server_id) VALUES ($1, $2, $3, $4, $5);
    `;
    db.query(createChannel, [title, chan_type, description, category_id, server_id], (err, rs) => {
        console.log(rs);
        if (err) {
            console.log(err);
        } else {
            console.log("Channel created!");
            res.status(200).json(rs);
        };
    });
});

app.post('/server/categories', (req, res) => {
    const{server_id, title, description} = req.body;
    console.log(server_id + " " + title + " " + description);
    const createCategory = `
    INSERT INTO categories (server_id, title, description) VALUES ($1, $2, $3);
    `;
    db.query(createCategory, [server_id, title, description], (err, rs) => {
        console.log(rs);
        if (err) {
            console.log(err);
        } else {
            console.log("Category created!");
            res.status(200).json(rs);
        };
    });
});

app.get('/servers/:server_id/channels', (req, res) => {
    const user_id = req.cookies.user_id;
    const server_id = req.params.server_id;
    console.log(user_id + " " + server_id);
    const userOnServ = `
    SELECT * FROM server_members WHERE user_id = $1 AND server_id = $2;
    `;
    db.query(userOnServ, [user_id, server_id], (err, rsUserOnServ) => {
        console.log(rsUserOnServ.rows);
        if (err) {
            console.log(err);
        } else if (rsUserOnServ.rows.length >= 1) {
            const getChannels = `
            SELECT ch.*, ca.title AS category_title FROM channels AS ch LEFT JOIN categories AS ca ON ch.category_id = ca.ID WHERE ch.server_id = $1;
            `;
            db.query(getChannels, [server_id], (err, rsChan) => {
                console.log(rsChan.rows);
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json(rsChan.rows);
                };
            });
        } else {
            res.status(401).json({message: "User is not on this server!"});
        };
    });
});

app.get('/servers/:server_id/members', (req, res) => {
    const user_id = req.cookies.user_id;
    const server_id = req.params.server_id;
    console.log(user_id + " " + server_id);
    const userOnServ = `
    SELECT * FROM server_members WHERE user_id = $1 AND server_id = $2;
    `;
    db.query(userOnServ, [user_id, server_id], (err, rsUserOnServ) => {
        console.log(rsUserOnServ.rows);
        if (err) {
            console.log(err);
        } else if (rsUserOnServ.rows.length >= 1) {
            const getMembers = `
            SELECT 
                sm.server_id,
                sm.server_nickname,
                sm.is_banned,
                sm.is_muted,
                sm.notifications,
                u.ID AS user_id,
                u.login,
                u.pfp,
                u.is_online,
                u.description,
                u.reg_date
            FROM 
                server_members AS sm
            JOIN 
                users AS u ON sm.user_id = u.ID
            WHERE 
                sm.server_id = $1;
            `;
            db.query(getMembers, [server_id], (err, rsChan) => {
                console.log(rsChan.rows);
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json(rsChan.rows);
                };
            });
        } else {
            res.status(401).json({message: "User is not on this server!"});
        };
    });
});

app.get('/friends', (req, res) => {
    const user_id = req.cookies.user_id;
    console.log(user_id);
    const getFriends = `
    SELECT 
        u.ID AS friend_id,
        u.login,
        u.pfp,
        u.is_online,
        u.description,
        u.reg_date
    FROM 
        friend_list AS fl
    JOIN 
        users AS u ON fl.friend_id = u.ID
    WHERE fl.user_id = $1;
    `;
    db.query(getFriends, [user_id], (err, rs) => {
        console.log(rs.rows);
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(rs.rows);
        };
    });
});

app.get('/messages/channel/:channel_id', (req, res) => {
    const user_id = req.cookies.user_id;
    const channel_id = req.params.channel_id;
    console.log(user_id + " " + channel_id);
    const userInChannel = `
    SELECT * FROM server_members AS sm 
    JOIN channels AS ch 
    ON sm.server_id = ch.server_id
    WHERE sm.user_id = $1 AND ch.ID = $2;
    `;
    db.query(userInChannel, [user_id, channel_id], (err, rsIn) => {
        console.log(rsIn.rows);
        if (err) {
            console.log(err);
        } else if (rsIn.rows.length >= 1) {
            const viewMsgs = `
            SELECT 
                m.ID AS message_id,
                m.content,
                m.send_date,
                m.pinned,
                m.reference,
                u.ID AS user_id,
                u.login,
                u.pfp,
                u.is_online,
                sm.server_nickname AS nickname,
                r.color,
                COALESCE(array_agg(mm.file_link) FILTER (WHERE mm.file_link IS NOT NULL), '{}') AS files
            FROM 
                messages AS m
            JOIN 
                users AS u ON m.user_id = u.ID
            LEFT JOIN 
                server_members AS sm ON sm.user_id = u.ID AND sm.server_id = (
                    SELECT server_id FROM channels WHERE ID = $1
                )
            LEFT JOIN 
                user_roles AS ur ON ur.user_id = u.ID
            LEFT JOIN 
                roles AS r ON ur.role_id = r.ID
            LEFT JOIN 
                msg_media AS mm ON m.ID = mm.msg_id
            WHERE 
                m.channel_id = $1
            GROUP BY 
                m.ID, u.ID, sm.server_nickname, r.color
            ORDER BY 
                m.send_date ASC;
            `;
            db.query(viewMsgs, [channel_id], (err, rsView) => {
                console.log(rsView.rows);
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json(rsView.rows);
                };
            });
        } else {
            res.status(401).json({message: "User is not in this channel!"})
        };
    });
});

app.get('/messages/chat/:chat_id', (req, res) => {
    const user_id = req.cookies.user_id;
    const chat_id = req.params.chat_id;
    console.log(user_id + " " + chat_id);
    const userInChat = `
    SELECT * FROM chat_users
    WHERE user_id = $1 AND chat_id = $2;
    `;
    db.query(userInChat, [user_id, chat_id], (err, rsIn) => {
        console.log(rsIn.rows);
        if (err) {
            console.log(err);
        } else if (rsIn.rows.length >= 1) {
            const viewMsgs = `
            SELECT 
                m.ID AS message_id,
                m.content,
                m.send_date,
                m.pinned,
                m.reference,
                u.ID AS user_id,
                u.login,
                u.pfp,
                u.is_online,
                COALESCE(array_agg(mm.file_link) FILTER (WHERE mm.file_link IS NOT NULL), '{}') AS files
            FROM 
                messages AS m
            JOIN 
                users AS u ON m.user_id = u.ID
            LEFT JOIN 
                msg_media AS mm ON m.ID = mm.msg_id
            WHERE 
                m.chat_id = $1
            GROUP BY 
                m.ID, u.ID
            ORDER BY 
                m.send_date ASC;
            `;
            db.query(viewMsgs, [chat_id], (err, rsView) => {
                console.log(rsView.rows);
                if (err) {
                    console.log(err);
                } else {
                    res.status(200).json(rsView.rows);
                };
            });
        } else {
            res.status(401).json({message: "User is not in this chat!"});
        };
    });
});

app.post('/messages/channel', (req, res) => {
    const user_id = req.cookies.user_id;
    const{channel_id, content, reference, file_link} = req.body;
    console.log(user_id + " " + channel_id + " " + content);
    const userInChannel = `
    SELECT * FROM server_members AS sm 
    JOIN channels AS ch 
    ON sm.server_id = ch.server_id
    WHERE sm.user_id = $1 AND ch.ID = $2;
    `;
    db.query(userInChannel, [user_id, channel_id], (err, rsIn) => {
        console.log(rsIn);
        if (err) {
            console.log(err);
        } else if (rsIn.rows.length >= 1) {
            const sendMsgs = `
            INSERT INTO messages (user_id, channel_id, content, reference) VALUES ($1, $2, $3, $4) RETURNING ID;
            `;
            db.query(sendMsgs, [user_id, channel_id, content, reference], (err, rsSend) => {
                console.log(rsSend.rows);
                if (err) {
                    console.log(err);
                } else {
                    const msg_id = rsSend.rows[0].id;
                    console.log(msg_id);
                    if (file_link && Array.isArray(file_link) && file_link.length > 0) {
                        let completed = 0;
                        for (let i = 0; i < file_link.length; i++) {
                            const insertFile = `
                            INSERT INTO msg_media (msg_id, file_link)
                            VALUES ($1, $2);
                            `;
                            db.query(insertFile, [msg_id, file_link[i]], (err, rsFiles) => {
                                if (err) {
                                    console.log(err);
                                };
                                completed++;
                                if (completed === file_link.length) {
                                    res.status(200).json({rsSend, rsFiles});
                                };
                            });
                        };
                    } else {
                        res.status(200).json(rsSend);
                    };
                };
            });
        } else {
            res.status(401).json({message: "User is not in this channel!"})
        };
    });
});

app.post('/messages/chat', (req, res) => {
    const user_id = req.cookies.user_id;
    const{chat_id, content, reference, file_link} = req.body;
    console.log(user_id + " " + chat_id + " " + content);
    const userInChat = `
    SELECT * FROM chat_users
    WHERE user_id = $1 AND chat_id = $2;
    `;
    db.query(userInChat, [user_id, chat_id], (err, rsIn) => {
        console.log(rsIn);
        if (err) {
            console.log(err);
        } else if (rsIn.rows.length >= 1) {
            const sendMsgs = `
            INSERT INTO messages (user_id, chat_id, content, reference) VALUES ($1, $2, $3, $4) RETURNING ID;
            `;
            db.query(sendMsgs, [user_id, chat_id, content, reference], (err, rsSend) => {
                console.log(rsSend.rows);
                if (err) {
                    console.log(err);
                } else {
                    const msg_id = rsSend.rows[0].id;
                    console.log(msg_id);
                    if (file_link && Array.isArray(file_link) && file_link.length > 0) {
                        let completed = 0;
                        for (let i = 0; i < file_link.length; i++) {
                            const insertFile = `
                            INSERT INTO msg_media (msg_id, file_link)
                            VALUES ($1, $2);
                            `;
                            db.query(insertFile, [msg_id, file_link[i]], (err, rsFiles) => {
                                if (err) {
                                    console.log(err);
                                };
                                completed++;
                                if (completed === file_link.length) {
                                    res.status(200).json({rsSend, rsFiles});
                                };
                            });
                        };
                    } else {
                        res.status(200).json(rsSend);
                    };
                };
            });
        } else {
            res.status(401).json({message: "User is not in this chat!"})
        };
    });
});

app.get('/chats', (req, res) => {
    const user_id = req.cookies.user_id;
    const getChats = `
    SELECT * FROM chats c
    JOIN chat_users cu
    ON cu.chat_id = c.ID
    WHERE cu.user_id = $1;
    `;
    db.query(getChats, [user_id], (err, rs) => {
        console.log(rs.rows);
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(rs.rows);
        };
    });
});

app.post('/folders', (req, res) => {
    const user_id = req.cookies.user_id;
    const{title, color} = req.body;
    console.log(title + " " + user_id + " " + color);
    const createFolder = `
    INSERT INTO folders (title, user_id, color) VALUES ($1, $2, $3);
    `;
    db.query(createFolder, [title, user_id, color], (err, rs) => {
        console.log(rs);
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(rs);
        };
    });
});

app.post('/folders/addserver', (req, res) => {
    const{folder_id, server_id} = req.body;
    console.log(folder_id + " " + server_id);
    const addServer = `
    INSERT INTO server_folders (folder_id, server_id) VALUES ($1, $2);
    `;
    db.query(addServer, [folder_id, server_id], (err, rs) => {
        console.log(rs);
        if (err) {
            console.log(err);
        } else {
            res.status(200).json(rs);
        };
    });
});

app.post('/servers/recommended/enter', (req, res) => {
    const user_id = req.cookies.user_id;
    const{server_id} = req.body;
    console.log(user_id + " " + server_id);
    const isPublic = `
    SELECT * FROM servers WHERE ID = $1;
    `;
    db.query(isPublic, [server_id], (err, rsPublic) => {
        console.log(rsPublic.rows);
        if (err) {
            console.log(err);
        } else if (rsPublic.rows[0].is_public) {
            const inServer = `
            SELECT * FROM server_members WHERE user_id = $1 AND server_id = $2;
            `;
            db.query(inServer, [user_id, server_id], (err, rsIn) => {
                console.log(rsIn.rows);
                if (err) {
                    console.log(err);
                } else if (rsIn.rows.length < 1) {
                    const addUser = `
                    INSERT INTO server_members (user_id, server_id) VALUES ($1, $2);
                    `;
                    db.query(addUser, [user_id, server_id], (err, rs) => {
                        console.log(rs);
                        if (err) {
                            console.log(err);
                        } else {
                            res.status(200).json(rs);
                        };
                    });
                } else {
                    res.status(409).json({message: "User already in this server!"});
                };
            });
        } else {
            res.status(403).json({message: "Server is not public!"})
        };
    });
});

app.listen(PORT, ()=>{
    console.log(`Сервер запущен по ссылке: http://localhost:${PORT}`);
});