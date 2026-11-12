import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

const app = express();
app.disable('x-powered-by');
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: CORS_ORIGIN } });

const broadcastSessions = () => io.emit('sessions', io.sockets.listenerCount);

io.on('connection', (socket) => {
  broadcastSessions();
  socket.on('disconnect', broadcastSessions);
});

server.listen(PORT, () => console.log(`Socket.io server: http://localhost:${PORT}`));
