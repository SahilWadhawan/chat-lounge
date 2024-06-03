const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

mongoose.connect('mongodb://localhost/chat', { useNewUrlParser: true, useUnifiedTopology: true });

const ChatSchema = new mongoose.Schema({
  username: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', ChatSchema);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

io.on('connection', (socket) => {
  console.log('New user connected');

  ChatMessage.find().then(messages => {
    socket.emit('init', messages);
  });

  socket.on('chat', (data) => {
    const chatMessage = new ChatMessage(data);
    chatMessage.save().then(() => {
      io.sockets.emit('chat', data);
    });
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
