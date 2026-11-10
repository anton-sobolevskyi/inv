import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CORS_ORIGIN } });

io.on('connection', (socket) => {
  io.emit('sessions', io.engine.clientsCount);
  socket.on('disconnect', () => io.emit('sessions', io.engine.clientsCount));
});

server.listen(PORT, () => console.log(`Socket.io server: http://localhost:${PORT}`));
