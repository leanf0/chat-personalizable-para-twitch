require('dotenv').config();
const express = require('express');
const tmi = require('tmi.js');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

const client = new tmi.Client({
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_OAUTH
  },
  channels: [process.env.TWITCH_CHANNEL]
});

client.connect();

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const chatData = {
    user: tags['display-name'],
    text: message,
    color: tags.color || '#ffffff'
  };

  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(chatData));
    }
  });
});
