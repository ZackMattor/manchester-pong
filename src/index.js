const express = require('express')
const WebSocket = require('ws');
const http = require('http');
const ServerManager = require('./server/server_manager.js');

const app = express()

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('src/public'));

let port = process.env.MANCHESTER_PONG_PORT || 3000;

server.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

let pong_server = new ServerManager(wss);
