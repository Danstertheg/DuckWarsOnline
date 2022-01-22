const PlayerLobby = require("./modules/PlayerLobby");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const io = new Server(server);
// all these vars will be needed in the future when creating a playerLobby class. 
// leader id is the socket connection id of the lobby leader. so that only this character can start the match and select game mode in the future.
var leaderId;
var playerList = [];
var projectiles = [];
var playerCount = 0;
const roomSize = 4;
var gameStarted = false;
var gameEnded = false;
var skins = ["oats","danky","mr.goose","mr.goose"];

app.use(express.static(__dirname +"/www"));
app.get('/', (req, res) => {
  console.log("__dirname is : "+__dirname +"/www")
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
  io.emit("gameStatus", {started:gameStarted,ended:gameEnded});
  io.emit('updatePlayers', playerList);
    socket.on('message', (msg) => {
      io.emit('message', msg);
    });


    // NEW CODE START

    socket.on('getPlayerCount', () => {
      io.to(socket.id).emit('playerCount', playerList.length);
    });

    socket.on('getGameStarted', () => {
      io.to(socket.id).emit('gameStarted', gameStarted);
    });

    socket.on('chatMessage', (msg) => {
      io.emit('chatMessage', msg);
    });

    socket.on('playerJoinedLobby', (playerInfo) => {
      io.emit('playerJoinedLobby', playerInfo);
    });

    socket.on('lastPlayerLeft', () => {
      console.log(" we do a lil tomfoolery");
      gameStarted = false;
      playerCount = 0;
    });

    // NEW CODE END


    socket.on('playerJoined', (playerInitObj) => {
        if (playerCount < roomSize){
        // if the player limit is not exceeded, let the player join
         // let playerSkin = skins[playerCount] //OLDSTYLECODE
          let playerId = socket.id;
          let playerPositionY = Math.floor((Math.random() * 225) + 1);
          let playerPositionX = Math.floor((Math.random() * 225) + 1);
          //JSON Object
          let newplayer = {
            id:playerId,
            x:playerPositionX,
            y:playerPositionY,
            name:playerInitObj["playerName"],
            skin:playerInitObj["skin"],//playerSkin, OLDSTYLECODE
            headItem: playerInitObj["headItem"],
            outfit: playerInitObj["outfit"],
            direction:'l',
            health:5,
            lives:3
          };
          if (!playerList.some(item => item.id == socket.id))
          {
            // player is not already in playerList 
            if (gameStarted == false){
              // game has not yet started
          console.log("serverVerified new player");
          playerList.push(newplayer);
          // count 
          playerCount++;
          console.log(playerList);
          console.log("Current Player Count: " + String(playerCount))
          io.emit('updatePlayers', playerList);
            }
            else {
              // game has already started, the player is late to the lobby and needs to wait for gameStarted boolean to reset once game is over. 
              console.log("Player is attempting to join game that has already begun");
            } 
        }
          else {
            // player is attempting to join twice, their socket id is already registered in the playerList
            console.log("player attempting to double join!!!! caught you bitch");
          }
        }
        else{ // playercount is exceeded... dont allow to join 
        console.log("room size full. Sorry mate");
        }
      });
      socket.on('playerMovement',(playerMov) => {
        socket.broadcast.emit('playerMovement', playerMov);
        let id = playerMov['id'];
        let x = playerMov['x'];
        let y = playerMov['y'];
        let direction = playerMov['direction'];
        if (playerList.some(item => item.id == id)){
        playerList[findPlayerInList(id)].x = x;
        playerList[findPlayerInList(id)].y = y;
        playerList[findPlayerInList(id)].direction = direction;
        }
        
      })
      socket.on('playerShot',(projectile) => {
        console.log(projectile['id'] + " has shot.")
        //check if the person is in the playerlist on the server before allowing them to shoot TODO HERE
        projectiles.push(projectile);
        console.log(projectiles);
        io.emit('updateProjectiles', projectile);
      })
      socket.on('waterBlast',(projectile)=> {
        console.log(projectile['id'] + " has waterBlasted.")
        projectiles.push(projectile);
        console.log(projectiles);
        io.emit('updateProjectiles', projectile);
      })
      socket.on('waterShot',(projectile) =>{
        console.log(projectile['id'] + " has waterBlasted.")
        projectiles.push(projectile);
        console.log(projectiles);
        io.emit('updateProjectiles', projectile);
      })
      socket.on('requestProjectileLocation',(projectile)=>{
        io.emit('updatedProjectiles', projectiles);
      })
      socket.on('startGame',(lobby) => {
        if (gameStarted == false){
        io.emit('startGame');
        gameStarted = true;
        }
      })
      

      socket.on('disconnect', function() {
        // NEW CODE START!
        io.emit('playerLeftLobby');
        // NEW CODE END!

        for(var i = 0; i < playerList.length; i++ ){
          if(playerList[i].id === socket.id){
            console.log(playerList[i].id + " just disconnected");
            playerList.splice(i, 1);
            playerCount--;
            if (playerCount == 0){
              gameStarted = false;
            }
            console.log("Current Player Count: " + String(playerCount))
          }
        }
        io.emit('updatePlayers', playerList)
      })
  });
function calculateProjectilesPath(){
  var speed = 20;
  let radius = 10;
  let playerRadius = 30;
  let canvasWidth = 1000;
  for (i in projectiles){
    let type = projectiles[i].type 
    if (type == "waterShot"){
      speed = 15;
    }

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
                    console.log(playerList[j].name + " was hit.");
                    let type = projectiles[i].type 
                    if (type == 'waterShot'){
                      playerList[j].health--;
                      playerList[j].health--;
                    }
                    else if (type = 'bread')
                    {
                      playerList[j].health--;
                    }
                    io.emit("playerHit", {id:playerList[j].id,type:projectiles[i].type});
                    if (playerList[j].health <= 0){
                        console.log("this player has died or lost a life");
                        if (playerList[j].lives <= 1){
                          console.log("this player has lost their last life. They are out of the game");
                          io.emit("playerLose", playerList[j].id);
                          playerList.splice(j,1);
                          playerCount--;
                        }
                        else{
                          playerList[j].lives--;
                          playerList[j].health = 5;
                          io.emit("loseLife", playerList[j].id);
                        }
                    }
                    
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
  if (playerList.length >= 1){
calculateProjectilesPath();
  }
}

setInterval(runGame,20)
server.listen(8000,() => {
  console.log('listening on *:8000');
});