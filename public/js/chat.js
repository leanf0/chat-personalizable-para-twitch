/* ==============================
   CONFIGURACIÓN EDITABLE
   Cambiá estos valores si querés personalizar el chat
============================== */

const MAX_MESSAGES = 40;        // Cantidad máxima de mensajes visibles
const MESSAGE_DURATION = 30000; // Tiempo antes de desaparecer (30000 = 30s)
const EMOTE_SIZE = "2.0";       // Cambiar a "3.0" para emotes más grandes

/* ==============================
   CONEXIÓN
============================== */

const socket = new WebSocket(`ws://${window.location.host}`);
const container = document.getElementById('chat-container');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  addMessage(data);
};

/* ==============================
   SISTEMA DE EMOTES
============================== */

function getEmoteUrl(id, size = EMOTE_SIZE) {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/${size}`;
}

function renderMessageWithEmotes(container, text, emotes) {

  container.appendChild(document.createTextNode(": "));

  if (!emotes) {
    container.appendChild(document.createTextNode(text));
    return;
  }

  const emoteList = [];

  for (const emoteId in emotes) {
    emotes[emoteId].forEach(range => {
      const [start, end] = range.split("-").map(Number);
      emoteList.push({ start, end, id: emoteId });
    });
  }

  emoteList.sort((a, b) => a.start - b.start);

  let currentIndex = 0;

  emoteList.forEach(emote => {

    if (currentIndex < emote.start) {
      container.appendChild(
        document.createTextNode(text.slice(currentIndex, emote.start))
      );
    }

    const img = document.createElement("img");
    img.src = getEmoteUrl(emote.id);
    img.classList.add("emote");
    img.alt = "emote";

    container.appendChild(img);

    currentIndex = emote.end + 1;
  });

  if (currentIndex < text.length) {
    container.appendChild(
      document.createTextNode(text.slice(currentIndex))
    );
  }
}



/* ==============================
   RENDER MENSAJES
============================== */

function addMessage(data) {

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');


  /* ===== USERNAME ===== */

  const usernameSpan = document.createElement('span');
  usernameSpan.classList.add('username');

  usernameSpan.style.color = data.color || "#ffffff";
  usernameSpan.textContent = data.user;

  /* ===== MESSAGE TEXT ===== */

  const textSpan = document.createElement('span');
  textSpan.classList.add('text');

  renderMessageWithEmotes(textSpan, data.text, data.emotes);

  messageDiv.appendChild(usernameSpan);
  messageDiv.appendChild(textSpan);
  container.appendChild(messageDiv);


  /* LÍMITE DE MENSAJES */
  if (container.children.length > MAX_MESSAGES) {
    container.removeChild(container.firstChild);
  }

  /* AUTO ELIMINAR */
  setTimeout(() => {
    messageDiv.classList.add('fade-out');
    setTimeout(() => {
      messageDiv.remove();
    }, 800);
  }, MESSAGE_DURATION);
}
