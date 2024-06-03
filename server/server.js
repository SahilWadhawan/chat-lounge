const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('New user connected');

    // Handle incoming chat messages
    socket.on('chat', (data) => {
        io.sockets.emit('chat', data); // Broadcast the message to all connected clients
    });

    // Handle typing notifications
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data); // Broadcast the typing notification to all other clients except the sender
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Start the server
server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});

