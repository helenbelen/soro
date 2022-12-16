const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    },
});
io.on('connection', (socket) => {
    io.emit('connection',  socket.id)
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
});

server.listen(9000, () => {
    console.log('listening on *:9000');
});