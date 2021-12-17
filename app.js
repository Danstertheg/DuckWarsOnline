const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chatmessage', (msg) => {
      io.emit('chatmessage', msg);
    });

    socket.on('playerJoined', (playerInitObj) => {
        console.log("type of playerInitObj:  " + typeof(playerInitObj))
        console.log(playerInitObj)
        console.log(playerInitObj['id'])
        console.log(playerInitObj['color'])
        io.emit('playerJoined', playerInitObj);
      });
      socket.on('playerMovement',(playerMov) => {
        io.emit('playerMovement', playerMov);
      })
  });

server.listen(8000, () => {
  console.log('listening on *:8000');
});