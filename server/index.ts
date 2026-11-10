import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  io.emit('sessions', io.engine.clientsCount);
  socket.on('disconnect', () => io.emit('sessions', io.engine.clientsCount));
});

server.listen(3001, () => console.log('Socket.io server: http://localhost:3001'));
