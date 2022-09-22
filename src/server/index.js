import { WebSocketServer } from 'ws';
import http from 'http';
import { ServerManager } from './server/server_manager.js';

const server = http.createServer();
const wss = new WebSocketServer({ server });

let port = process.env.MANCHESTER_PONG_PORT || 3000;

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

(new ServerManager(wss))
