/* =========================
   DEBUG MODE
========================= */

const DEBUG_MODE = true;


/* =========================
   IMPORTS
========================= */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const tmi = require('tmi.js');
const config = require('./config');


/* =========================
   SERVER SETUP
========================= */

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

server.listen(config.port, () => {
  console.log(`🚀 Server running at http://localhost:${config.port}`);
});


/* =========================
   TWITCH CLIENT
========================= */

const twitchClient = new tmi.Client({
  options: { debug: DEBUG_MODE },
  identity: {
    username: config.username,
    password: config.oauth
  },
  channels: [config.channel],
  connection: {
    reconnect: true,
    secure: true
  }
});

twitchClient.connect().catch(console.error);


/* =========================
   MESSAGE HANDLER
========================= */

twitchClient.on('message', (channel, tags, message, self) => {
  if (self) return;

  const chatData = {
    user: tags['display-name'],
    text: message,
    color: tags.color || '#ffffff',

    // Roles & badges
    badges: tags.badges || {},
    mod: tags.mod || false,
    subscriber: tags.subscriber || false,

    // Emotes
    emotes: tags.emotes || null
  };

  broadcast(chatData);
});


/* =========================
   BROADCAST FUNCTION
========================= */

function broadcast(data) {
  const payload = JSON.stringify(data);

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}


/* =========================
   SAFE SHUTDOWN
========================= */

process.on('SIGINT', () => {
  twitchClient.disconnect();
  server.close(() => process.exit(0));
});
