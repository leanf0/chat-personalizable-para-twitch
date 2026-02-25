const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const tmi = require('tmi.js');
const config = require('./config');

if (!config.username || !config.oauth || !config.channel) {
  console.error('❌ Missing .env variables');
  process.exit(1);
}

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
  options: { debug: false },
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
    badges: tags.badges || {},
    mod: tags.mod,
    subscriber: tags.subscriber
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
  console.log('\n🛑 Shutting down...');
  twitchClient.disconnect();
  server.close(() => process.exit(0));
});
