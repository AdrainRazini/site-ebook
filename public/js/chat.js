// public/js/chat.js
const socket = io();

let username = prompt("Digite seu nome de usuário:");

if (username) {
  socket.emit('login', username);
}

// Função para enviar uma mensagem
function sendMessage() {
  const messageInput = document.getElementById('message');
  const message = messageInput.value;

  if (message) {
    socket.emit('chatMessage', message);
    messageInput.value = '';
  }
}

// Recebe mensagens do servidor
socket.on('message', (data) => {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'user');
  messageElement.textContent = `${data.user}: ${data.text}`;
  chatBox.appendChild(messageElement);
  chatBox.scrollTop = chatBox.scrollHeight; // Rola para baixo automaticamente
});

// Recebe mensagens de outros usuários
socket.on('userConnected', (username) => {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'other');
  messageElement.textContent = `${username} entrou no chat.`;
  chatBox.appendChild(messageElement);
});

// Recebe notificações quando um usuário se desconecta
socket.on('userDisconnected', (username) => {
  const chatBox = document.getElementById('chat-box');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', 'other');
  messageElement.textContent = `${username} saiu do chat.`;
  chatBox.appendChild(messageElement);
});
