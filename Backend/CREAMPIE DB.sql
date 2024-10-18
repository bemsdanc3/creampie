CREATE TABLE users (
	ID SERIAL PRIMARY KEY,
	login VARCHAR(100),
	pass VARCHAR(100),
	pfp TEXT,
	email VARCHAR(100) UNIQUE,
	isOnline BOOLEAN DEFAULT FALSE,
	description TEXT,
	reg_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	isBlocked BOOLEAN DEFAULT FALSE,
	isBot BOOLEAN DEFAULT FALSE,
	bot_token TEXT
);

CREATE TABLE servers (
	ID SERIAL PRIMARY KEY,
	title VARCHAR(100),
	isPublic BOOLEAN DEFAULT FALSE,
	owner_id INTEGER REFERENCES users(ID), 
	pfs TEXT,
	description TEXT
);

CREATE TABLE friend_list (
	ID SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(ID),
	friend_id INTEGER REFERENCES users(ID)
);

CREATE TABLE black_list (
	ID SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(ID),
	blockUser_id INTEGER REFERENCES users(ID)
);

CREATE TABLE friendship_requests (
	ID SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(ID),
	potential_friend_id INT REFERENCES users(ID)
);

CREATE TABLE server_members (
	ID SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(ID),
	server_id INTEGER REFERENCES servers(ID),
	server_nickname VARCHAR(100),
	isBanned BOOLEAN DEFAULT FALSE,
	isMuted BOOLEAN DEFAULT FALSE,
	notifications BOOLEAN DEFAULT TRUE
);

CREATE TABLE roles (
	ID SERIAL PRIMARY KEY,
	title TEXT,
	color VARCHAR(10),
	isAdmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE chats (
	ID SERIAL PRIMARY KEY,
	title TEXT,
	isGroup BOOLEAN DEFAULT FALSE,
	notifications BOOLEAN DEFAULT FALSE
);

CREATE TABLE categories (
	ID SERIAL PRIMARY KEY,
	server_id INT REFERENCES servers(ID),
	title TEXT,
	description TEXT
);

CREATE TABLE channels (
	ID SERIAL PRIMARY KEY,
	title TEXT,
	chan_type VARCHAR(50),
	description TEXT,
	category_id INT REFERENCES categories(ID), 
	server_id INT REFERENCES servers(ID)
);

CREATE TABLE chat_users (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	chat_id INT REFERENCES chats(ID)
);

CREATE TABLE messages (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	chat_id INT REFERENCES chats(ID),
	send_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	msg TEXT,
	channel_id INT REFERENCES channels(ID),
	pinned BOOLEAN DEFAULT FALSE,
	reference INT REFERENCES messages(ID)
);

CREATE TABLE msg_media (
	ID SERIAL PRIMARY KEY,
	msg_id INT REFERENCES messages(ID),
	file_link TEXT
);

CREATE TABLE voice_members (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	channel_id INT REFERENCES channels(ID), 
	connection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	chat_id INT REFERENCES chats(ID),
	date_out TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	isStreaming BOOLEAN DEFAULT FALSE,
	isVebka BOOLEAN DEFAULT FALSE
);

CREATE TABLE folders (
	ID SERIAL PRIMARY KEY,
	title TEXT,
	user_id INT REFERENCES users(ID),
	color VARCHAR(10)
);

CREATE TABLE server_folders (
	ID SERIAL PRIMARY KEY,
	folder_id INT REFERENCES folders(ID),
	server_id INT REFERENCES servers(ID)
);

CREATE TABLE pinned_chats (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	chat_id INT REFERENCES chats(ID)
);

CREATE TABLE msg_reactions (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	message_id INT REFERENCES messages(ID),
	reaction VARCHAR(50)
);

CREATE TABLE notifications (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	chat_id INT REFERENCES chats(ID),
	channel_id INT REFERENCES channels(ID)
);

CREATE TABLE user_roles (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	role_id INT REFERENCES roles(ID)
);

CREATE TABLE emojies (
	ID SERIAL PRIMARY KEY,
	title TEXT,
	file_link TEXT,
	server_id INT REFERENCES servers(ID),
	creator_id INT REFERENCES users(ID),
	chat_id INT REFERENCES chats(ID)
);

CREATE TABLE bot_command (
	ID SERIAL PRIMARY KEY,
	bot_id INT REFERENCES users(ID),
	title TEXT,
	description TEXT
);

CREATE TABLE polls (
	ID SERIAL PRIMARY KEY,
	msg_id INT REFERENCES messages(ID),
	msg TEXT,
	creating_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	end_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE poll_options (
	ID SERIAL PRIMARY KEY,
	poll_id INT REFERENCES polls(ID),
	answer_text TEXT
);

CREATE TABLE poll_option_user (
	ID SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(ID),
	poll_opt_id INT REFERENCES poll_options(ID)
);

CREATE TABLE permissions (
	ID SERIAL PRIMARY KEY,
	chat_id INT REFERENCES chats(ID),
	server_id INT REFERENCES servers(ID),
	channel_id INT REFERENCES channels(ID),
	category_id INT REFERENCES categories(ID),
	user_id INT REFERENCES users(ID),
	role_id INT REFERENCES roles(ID)
);
