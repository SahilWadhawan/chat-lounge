document.addEventListener('DOMContentLoaded', () => {
    const socket = io.connect('http://localhost:3000');
    
    const message = document.getElementById('message');
    const username = document.getElementById('username');
    const sendButton = document.getElementById('send');
    const output = document.getElementById('output');
    const feedback = document.getElementById('feedback');

    sendButton.addEventListener('click', () => {
        socket.emit('chat', {
            message: message.value,
            username: username.value
        });
        message.value = '';
    });

    message.addEventListener('keypress', () => {
        socket.emit('typing', username.value);
    });

    socket.on('chat', data => {
        feedback.innerHTML = '';
        output.innerHTML += `<p><strong>${data.username}:</strong> ${data.message}</p>`;
    });

    socket.on('typing', data => {
        feedback.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
    });
});
