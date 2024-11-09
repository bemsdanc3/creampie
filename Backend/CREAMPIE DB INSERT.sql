-- Заполнение таблицы users
INSERT INTO users (login, pass, pfp, email, isOnline, description, isBlocked, isBot, bot_token) 
VALUES 
('user1', 'pass1', 'pfp1.png', 'user1@example.com', TRUE, 'First user description', FALSE, FALSE, NULL),
('user2', 'pass2', 'pfp2.png', 'user2@example.com', FALSE, 'Second user description', FALSE, FALSE, NULL),
('bot1', 'passbot', 'pfp_bot.png', 'bot1@example.com', FALSE, 'Test bot', FALSE, TRUE, 'bot_token_123');

-- Заполнение таблицы servers
INSERT INTO servers (title, isPublic, owner_id, pfs, description) 
VALUES 
('Test Server 1', TRUE, 1, 'pfs_server1.png', 'This is a public test server'),
('Private Server', FALSE, 2, 'pfs_server2.png', 'Private server for testing');

-- Заполнение таблицы friend_list
INSERT INTO friend_list (user_id, friend_id) 
VALUES 
(1, 2),
(2, 1);

-- Заполнение таблицы black_list
INSERT INTO black_list (user_id, blockUser_id) 
VALUES 
(1, 3),
(2, 3);

-- Заполнение таблицы friendship_requests
INSERT INTO friendship_requests (user_id, potential_friend_id) 
VALUES 
(2, 1),
(1, 3);

-- Заполнение таблицы server_members
INSERT INTO server_members (user_id, server_id, server_nickname, isBanned, isMuted, notifications) 
VALUES 
(1, 1, 'user1_nick', FALSE, FALSE, TRUE),
(2, 1, 'user2_nick', FALSE, FALSE, TRUE),
(3, 1, 'bot_nick', TRUE, FALSE, FALSE);

-- Заполнение таблицы roles
INSERT INTO roles (title, color, isAdmin) 
VALUES 
('Admin', '#FF0000', TRUE),
('Moderator', '#00FF00', FALSE);

-- Заполнение таблицы chats
INSERT INTO chats (title, isGroup, notifications) 
VALUES 
('General Chat', TRUE, TRUE),
('Private Chat', FALSE, FALSE);

-- Заполнение таблицы categories
INSERT INTO categories (server_id, title, description) 
VALUES 
(1, 'General', 'General category for discussions'),
(1, 'Gaming', 'Category for gaming discussions');

-- Заполнение таблицы channels
INSERT INTO channels (title, chan_type, description, category_id, server_id) 
VALUES 
('general-text', 'text', 'Text channel for general discussion', 1, 1),
('gaming-voice', 'voice', 'Voice channel for gaming', 2, 1);

-- Заполнение таблицы chat_users
INSERT INTO chat_users (user_id, chat_id) 
VALUES 
(1, 1),
(2, 1),
(3, 1);

-- Заполнение таблицы messages
INSERT INTO messages (user_id, chat_id, msg, channel_id, pinned) 
VALUES 
(1, 1, 'Hello everyone!', 1, FALSE),
(2, 1, 'Hey there!', 1, FALSE),
(3, 1, 'Bot message', 1, FALSE);

-- Заполнение таблицы msg_media
INSERT INTO msg_media (msg_id, file_link) 
VALUES 
(1, 'link_to_image.png'),
(2, 'link_to_video.mp4');

-- Заполнение таблицы voice_members
INSERT INTO voice_members (user_id, channel_id, chat_id, isStreaming, isVebka) 
VALUES 
(1, 2, 1, TRUE, FALSE),
(2, 2, 1, FALSE, TRUE);

-- Заполнение таблицы folders
INSERT INTO folders (title, user_id, color) 
VALUES 
('My Folder', 1, '#FF00FF'),
('Test Folder', 2, '#0000FF');

-- Заполнение таблицы server_folders
INSERT INTO server_folders (folder_id, server_id) 
VALUES 
(1, 1),
(2, 1);

-- Заполнение таблицы pinned_chats
INSERT INTO pinned_chats (user_id, chat_id) 
VALUES 
(1, 1),
(2, 1);

-- Заполнение таблицы msg_reactions
INSERT INTO msg_reactions (user_id, message_id, reaction) 
VALUES 
(1, 1, '👍'),
(2, 1, '😂');

-- Заполнение таблицы notifications
INSERT INTO notifications (user_id, chat_id, channel_id) 
VALUES 
(1, 1, 1),
(2, 1, 1);

-- Заполнение таблицы user_roles
INSERT INTO user_roles (user_id, role_id) 
VALUES 
(1, 1),
(2, 2);

-- Заполнение таблицы emojies
INSERT INTO emojies (title, file_link, server_id, creator_id, chat_id) 
VALUES 
('smile', 'link_to_smile.png', 1, 1, 1),
('heart', 'link_to_heart.png', 1, 2, 1);

-- Заполнение таблицы bot_command
INSERT INTO bot_command (bot_id, title, description) 
VALUES 
(3, 'greet', 'Greets the user'),
(3, 'info', 'Displays bot info');

-- Заполнение таблицы polls
INSERT INTO polls (msg_id, msg, creating_date, end_date) 
VALUES 
(1, 'Favorite game?', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 DAY');

-- Заполнение таблицы poll_options
INSERT INTO poll_options (poll_id, answer_text) 
VALUES 
(1, 'Option 1: Minecraft'),
(1, 'Option 2: Fortnite');

-- Заполнение таблицы poll_option_user
INSERT INTO poll_option_user (user_id, poll_opt_id) 
VALUES 
(1, 1),
(2, 2);

-- Заполнение таблицы permissions
INSERT INTO permissions (chat_id, server_id, channel_id, category_id, user_id, role_id) 
VALUES 
(1, 1, 1, 1, 1, 1),
(1, 1, 1, 1, 2, 2);
