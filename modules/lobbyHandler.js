const Player = require('Player');
const PlayerLobby = require("PlayerLobby");
const lobbyHashTable = require('HashTable');
var table = new lobbyHashTable();
var lobbyCount = 0;
 let player1 = new Player();
 const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require("socket.io");
const path = require('path');
const io = new Server(server);
 function lobby(){
 /// all lobby code here
 io.on('connection', (socket) => {
    io.to(socket.id).emit('updateLobbyList',table);
     socket.on('createLobby', (lobby) => {
      let lobbName = lobby['name'];
      let lobbPass = lobby['password'];
      let newLobby = new PlayerLobby(lobbyCount,lobbName,[player1],lobbPass)
      table.add(newLobby)
      lobbyCount++;
      // perhaps remove this in the future so that only refresh shows new lobby (could be unstable if many people are creating lobbies to have multiple new ones appear in the list simulatenously)
     // io.emit("addLobby",{})
     });
     socket.on('requestJoin',(joinReq) =>{
      /// player related variables
      let playerId = joinReq["pId"];
      let playerPositionX = Math.floor((Math.random() * 225) + 1);
      let playerPositionY = Math.floor((Math.random() * 225) + 1);
      let playerName = joinReq["playerName"];
      let playerSkin = joinReq["skin"];
      let playerHeadItem = joinReq["headItem"]
      let playerOutfit = joinReq["outfit"];
      // Create player 
      let playerReq = new Player(playerId,playerPositionX,playerPositionY,playerName,playerSkin,playerHeadItem,playerOutfit);
      
      
      let id = joinReq['lId'];
      let passAttempt = joinReq['password'];
      let lobbyRequested = table.search(id);
  
  
  
      if (lobbyRequested.checkPass(passAttempt) || lobbyRequested['password'] == '' ){
        lobbyRequested.addPlayer(playerReq);
        socket.join(lobbyRequested['lobbyId']);
        io.to(socket.id).emit('successfulJoin');
        // successful entry to the lobby
      }
      else{
        // unsuccessful entry, handle error back to user here 
        console.log(socket.id + " has failed to enter the lobby: " + lobbyRequested['lobbyName'])
      }
     });
   //console.log("hi " + socket.id)
  });
}
exports.lobbyHandler = lobby;