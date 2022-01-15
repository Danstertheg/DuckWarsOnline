const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
// list of players
var playerList = [];
var playerCount = 0;
const roomSize = 3;
var colors = ["blue","red","green","orange","black","navy"]
var skins = ["oats","danky","mr.goose"];
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  console.log("__dirname is : "+__dirname)
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    socket.on('chatmessage', (msg) => {
      io.emit('chatmessage', msg);
    });

    socket.on('playerJoined', (playerInitObj) => {
        // if the player limit is not exceeded, let the player join
        if (playerCount < roomSize){
          let playerSkin = skins[playerCount]
          let playerId = socket.id;
          let playerPositionY = Math.floor((Math.random() * 225) + 1);
          let playerPositionX = Math.floor((Math.random() * 225) + 1);
          let playerColor = colors[Math.floor(Math.random()* colors.length)];
          //JSON Object
          let newplayer = {
            id:playerId,
            x:playerPositionX,
            y:playerPositionY,
            color:playerColor,
            name:playerInitObj["playerName"],
            skin:playerSkin
          };
          // [{},{},{}]
          playerList.push(newplayer);
          // count 
          playerCount++;
          console.log(playerList);
          console.log("Current Player Count: " + String(playerCount))
          io.emit('updatePlayers', playerList);
        }
        else{ // playercount is exceeded... dont allow to join 
        console.log("room size full. Sorry mate")
        }
      });
      socket.on('playerMovement',(playerMov) => {
        socket.broadcast.emit('playerMovement', playerMov);
      })

      socket.on('startGame',(lobby) => {
        io.emit('startGame');
      })

      socket.on('disconnect', function() {
        console.log("disconnect")
        for(var i = 0; i < playerList.length; i++ ){
          if(playerList[i].id === socket.id){
            console.log(playerList[i].id + " just disconnected")
            playerList.splice(i, 1)
            playerCount--;
            console.log("Current Player Count: " + String(playerCount))
          }
        }
        io.emit('updatePlayers', playerList)
      })
  });

server.listen(8000,() => {
  console.log('listening on *:8000');
});