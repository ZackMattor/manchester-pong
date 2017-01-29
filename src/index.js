const express = require('express')
const WebSocket = require('ws');
const http = require('http');
const ServerManager = require('./server/server_manager.js');

const app = express()

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('src/public'));

server.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

let pong_server = new ServerManager(wss);
