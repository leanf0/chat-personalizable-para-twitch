/* ==============================
   WEBSOCKET CONNECTION
   Conecta el frontend con el servidor
============================== */

const socket = new WebSocket(`ws://${window.location.host}`);

/* ==============================
   CHAT CONTAINER
   Contenedor donde se insertan los mensajes
============================== */

const container = document.getElementById('chat-container');

/* ==============================
   CONNECTION EVENTS
   Útil para debugging
============================== */

socket.onopen = () => {
  console.log('🟢 Connected to WebSocket');
};

socket.onerror = (err) => {
  console.error('WebSocket error:', err);
};

socket.onclose = () => {
  console.warn('🔴 WebSocket disconnected');
};

/* ==============================
   MESSAGE RECEIVED
   Se ejecuta cada vez que llega un mensaje desde Twitch
============================== */

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  addMessage(data);
};

/* ==============================
   ADD MESSAGE FUNCTION
   Controla cómo se renderiza cada mensaje
============================== */

function addMessage(data) {

  // Crear contenedor principal del mensaje
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  // Crear nombre de usuario
  const usernameSpan = document.createElement('span');
  usernameSpan.classList.add('username');
  usernameSpan.style.color = data.color; // Cambiar si querés ignorar color Twitch
  usernameSpan.textContent = data.user;

  // Crear texto del mensaje
  const textSpan = document.createElement('span');
  textSpan.classList.add('text');
  textSpan.textContent = `: ${data.text}`;

  // Insertar elementos
  messageDiv.appendChild(usernameSpan);
  messageDiv.appendChild(textSpan);
  container.appendChild(messageDiv);

  /* ==============================
     MESSAGE LIMIT
     Cambiar el número para más o menos mensajes visibles
  ============================== */

  const MAX_MESSAGES = 40;

  if (container.children.length > MAX_MESSAGES) {
    container.removeChild(container.firstChild);
  }

  /* ==============================
     AUTO REMOVE TIMER
     Tiempo antes de desaparecer (milisegundos)
     30000 = 30 segundos
  ============================== */

  const MESSAGE_DURATION = 30000;

  setTimeout(() => {
    messageDiv.classList.add('fade-out');

    // Tiempo que coincide con animación CSS
    setTimeout(() => {
      messageDiv.remove();
    }, 800);

  }, MESSAGE_DURATION);
}