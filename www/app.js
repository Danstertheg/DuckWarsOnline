const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server);
// list of players
var playerList = [];
var projectiles = [];
var playerCount = 0;
const roomSize = 4;
var colors = ["blue","red","green","orange","black","navy"]
var skins = ["oats","danky","mr.goose","mr.goose"];
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  console.log("__dirname is : "+__dirname)
  res.sendFile(__dirname + '/index.html');
});
function findPlayerInList(id){
  for (x in playerList){
    if (playerList[x].id == String(id) ){
      return Number(x);
    }
  }
  return null
 }
io.on('connection', (socket) => {
    socket.on('message', (msg) => {
      io.emit('message', msg);
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
            skin:playerSkin,
            direction:'l'
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
        let id = playerMov['id'];
        let x = playerMov['x'];
        let y = playerMov['y'];
        let direction = playerMov['direction'];
        playerList[findPlayerInList(id)].x = x;
        playerList[findPlayerInList(id)].y = y;
        playerList[findPlayerInList(id)].direction = direction;
        
      })
      socket.on('playerShot',(projectile) => {
        console.log(projectile['id'] + " has shot.")
        projectiles.push(projectile)
        console.log(projectiles)
        io.emit('updateProjectiles', projectile);
      })
      socket.on('requestProjectileLocation',(projectile)=>{
        io.emit('updatedProjectiles', projectiles)
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
function calculateProjectilesPath(){
  let speed = 20;
  let radius = 10;
  let playerRadius = 30;
  let canvasWidth = 1000;
  for (i in projectiles){
    if (projectiles[i].direction == 'l')
    {
      projectiles[i].x -= speed;
    }
    else {
      projectiles[i].x += speed;
    }
  }
    //console.log(projectiles)
     for (j in playerList){
      for (i in projectiles){
      const dx = projectiles[i].x - playerList[j].x;
      const dy = projectiles[i].y - playerList[j].y;
      let distance = Math.sqrt(dx*dx + dy*dy); //pythegorean theorem!
   // checking for collision between current projectile and its target:
                if (distance < radius + playerRadius) {
                if (projectiles[i].damageCounted == false && playerList[j].id != projectiles[i].id) {
                    // play hit sounds
                    // deal damage
                    console.log(playerList[j].name + " was hit.")
                    io.emit("playerHit", playerList[j].id)
                    //projectiles[i].target.health -= projectiles[i].damage;
                    projectiles[i].damageCounted = true;
                    projectiles.splice(i, 1);
                    
                }
                
            }
            else if (projectiles[i].x < 0 - radius * 2 || projectiles[i].x > canvasWidth + radius * 2) {
              projectiles.splice(i, 1);
            }
    }
  }
}

function runGame(){
calculateProjectilesPath()
}

setInterval(runGame,20)
server.listen(8000,() => {
  console.log('listening on *:8000');
});