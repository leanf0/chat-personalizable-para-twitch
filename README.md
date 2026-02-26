<div align="center">

# 🖤 custom-obs-chat

minimal • realtime • twitch overlay

</div>

---

## ✦ Overview

A lightweight real-time Twitch chat overlay built with:

- Node.js   
- WebSocket  
- tmi.js  

Designed for OBS Browser Source usage.

Clean architecture. No bloated dependencies. Fully customizable.

---

## ⚡ Features

✦ Real-time chat connection  
✦ WebSocket bridge (backend → frontend)  
✦ Modular structure  
✦ CSS-ready for full aesthetic control  
✦ Environment-based configuration  

---

## 🗂 Structure

```OBS-CHAT
├── public/
│   ├── assets/
│   ├── css/style.css
│   ├── js/chat.js
│   └── index.html
├── server/
│   ├── config.js
│   └── server.js
├── package.json
```

# 🚀 Setup

---

## 1️⃣ Installation

```bash
git clone https://github.com/leanf0/chat-personalizable-para-twitch
cd obs-chat
npm install
```

---

## 2️⃣ Environment Configuration

Create a `.env` file in the root:

```env
TWITCH_USERNAME=your_username
TWITCH_CHANNEL=your_channel
TWITCH_OAUTH=oauth:your_token_here
PORT=3000
```

---

## 3️⃣ Run the Server

```bash
npm start
```

Server runs at:

```
http://localhost:3000
```

---

# 🎥 OBS Configuration

## ➜ Add Browser Source

Open OBS → Add **Browser Source**

## ➜ Set URL

```
http://localhost:3000
```

Adjust resolution as desired.

---

# 🎨 Customization

## ✦ Visual Styling

```
public/css/style.css
```

## ✦ Frontend Logic

```
public/js/chat.js
```

## ✦ Backend Logic

```
server/server.js
```

---

# 🧠 Roadmap

- Smooth message animations  
- Emote rendering  
- EventSub WebSocket migration  
- Advanced filtering  
- Themed layouts  

---

<div align="center">
made with caffeine & insomnia ☕
</div>
