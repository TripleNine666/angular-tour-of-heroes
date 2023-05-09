// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

// Создаем приложение Express
const app = express();


// Создаем HTTP-сервер
const server = http.createServer(app);

// Создаем Socket.io сервер
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

// Порт для прослушивания
const PORT = 3000;

// Обрабатываем подключение клиентов
io.on('connection', (socket) => {
  console.log('Новый клиент подключен');

  // Обрабатываем получение сообщения от клиента
  socket.on('message', (msg) => {
    console.log('Получено сообщение: ' + msg);

    // Отправляем сообщение всем подключенным клиентам
    io.emit('message', msg);
  });

  // Обрабатываем отключение клиента
  socket.on('disconnect', () => {
    console.log('Клиент отключен');
  });
});

// Запускаем сервер
server.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT);
});
