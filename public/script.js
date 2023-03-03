const app = document.querySelector('.app');
const socket = io();

let uname;

app.querySelector('.join-screen #join-user').addEventListener('click', (e) => {
  let username = app.querySelector('.join-screen #username').value;
  if (username.length == 0) {
    return;
  }
  uname = username;

  socket.emit('newuser', username);

  app.querySelector('.join-screen').classList.remove('active');
  app.querySelector('.chat-screen').classList.add('active');
});

app.querySelector('.chat-screen #exit-chat').addEventListener('click', (e) => {
  app.querySelector('.join-screen').classList.add('active');
  app.querySelector('.chat-screen').classList.remove('active');
});

function renderMessage(type, message) {
  const messageContainer = app.querySelector('.chat-screen .messages');
  let el = document.createElement('div');
  el.innerHTML = `
    <div>
      <div class="name">${message.username}</div>
      <div class="text">${message.text}</div>
    </div>
  `;
  if (type == 'me') {
    el.setAttribute('class', 'message my-message');
  } else {
    el.setAttribute('class', 'message other-message');
  }
  messageContainer.appendChild(el);
}

app.querySelector('.chat-screen #send-message').addEventListener('click', (e) => {
  const message = app.querySelector('.chat-screen #message-input').value;
  if (message.length == 0) {
    return;
  }

  renderMessage('me', {
    username: uname,
    text: message,
  });
  socket.emit('prompt', { username: uname, text: message });
});

socket.on('chatbot', (message) => {
  renderMessage('bot', message);
});
