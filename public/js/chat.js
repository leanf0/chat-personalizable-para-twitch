const socket = new WebSocket(`ws://${window.location.host}`);
const container = document.getElementById('chat-container');

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  messageDiv.innerHTML = `
    <span class="username" style="color:${data.color}">
      ${data.user}
    </span>: ${data.text}
  `;

  container.appendChild(messageDiv);

  if (container.children.length > 30) {
    container.removeChild(container.firstChild);
  }
};
