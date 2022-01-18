

socket.on('updatePlayers', function(newPlayerList) {
    let tmpList = []
    playersInLobby = "";
    for (x in newPlayerList){
      player = newPlayerList[x];
      tmpPlayer = new Player(30,30,player["color"],player["x"],player["y"],player["name"],player["id"],player["skin"]);
      tmpList.push(tmpPlayer);
      playersInLobby += player["name"] + ","
    }
    playerList = tmpList;
    document.getElementById("playerList").innerText = playersInLobby;
    document.getElementById("playerCount").innerText = "Number of players: " + String(playerList.length);
   if (findPlayerInList(socket.id) != null){
       myGamePiece = playerList[findPlayerInList(socket.id)]
       spectateMode = false;
       if (!loadedPlayerInfo){
           let playerInfo = document.getElementById("playerInfo");
           let template = document.getElementById("playerTemplate").content.cloneNode(true);
           playerInfo.appendChild(template);
       let lives = document.getElementById("lifeHolder");
       for (i = 0; i < 3; i++){
        let life = document.createElement('img');
        life.src = myGamePiece.skin + '_l_idle1.png';
        life.classList.add('life');
        lives.appendChild(life);
       }
       loadedPlayerInfo = true;
    }
    else{
        console.log("already loaded player info.");
    }
   }
   else{
       spectateMode = true;
   }
  });
  socket.on('updateProjectiles',function(projectile){
    let type = projectile['type'];
      if ( type == 'waterBlast'){
        tmpProjectile = new WaterBlast(String(projectile['id']));
      }
      else if (type == 'waterShot')
      {
        tmpProjectile = new WaterShot(String(projectile['id']));
      }
      else if (type == 'bread'){
      tmpProjectile = new BreadProjectile(String(projectile['id']));

    }
    projectiles.push(tmpProjectile)
    console.log(projectiles)
    //document.getElementById("playerList").innerText = playersInLobby;
    //document.getElementById("playerCount").innerText = "Number of players: " + String(playerList.length);
  })
  socket.on('playerHit',function(projectile){
    console.log("hit received.")
    let id = projectile['id'];
    console.log("id is :" + id + " and my id is " + myGamePiece.id)
    if (projectile['type'] == 'waterShot'){
        playerList[findPlayerInList(id)].takeDamage();
        playerList[findPlayerInList(id)].takeDamage();
    }
    else if (projectile['type']== 'bread'){
    playerList[findPlayerInList(id)].takeDamage();
    }
    if (playerList[findPlayerInList(id)].health < 0){
      playerList[findPlayerInList(id)].health = 0;
    }
    if (id = myGamePiece.id){
        let src = 'img/healthbar/health_' + playerList[findPlayerInList(id)].health + '.png'; 
        console.log(src)
        let myHealthbar = document.getElementById('healthBarImage');
        myHealthbar.src = src;
    }

    })
  socket.on('playerLose',function(id){
    //playerList.splice(findPlayerInList(id),1);  
    if (id == socket.id){
    spectateMode = true;
    //
    let myLifeImages = document.getElementById("lifeHolder");
    myLifeImages.innerHTML = '';
    console.log("i died.")
    //
      }
    })

  socket.on("loseLife",function(id){
    playerList[findPlayerInList(id)].loseLife();
    if (playerList[findPlayerInList(id)].lives >= 0)
    {
        
    playerList[findPlayerInList(id)].revive();
    console.log("my game piece id " + id)
        if (playerList[findPlayerInList(id)].id == myGamePiece.id){
            let myLifeImages = document.getElementById("lifeHolder");
            myLifeImages.innerHTML = '';
            let livesLeft = playerList[findPlayerInList(id)].lives;
            for (i = 0; i < livesLeft; i++){
                let life = document.createElement('img');
                life.src = myGamePiece.skin + '_l_idle1.png';
                life.classList.add('life');
                myLifeImages.appendChild(life);
            }
        }
    }
    })

  socket.on('message',function(msg){
    let id = msg['id'];
    playerList[findPlayerInList(id)].showMessage(msg['msg']);
    console.log(msg);
  })
  socket.on("playerMovement",function(playerMovement){
      let id = playerMovement["id"];
      let x = playerMovement["x"];
      let y = playerMovement["y"];
      let direction = playerMovement['direction'];
      // let angle = playerMovment["angle"];
      
      playerList[findPlayerInList(id)].x = x;
      playerList[findPlayerInList(id)].y = y;
      playerList[findPlayerInList(id)].direction = direction;
      // playerList[findPlayerInList(id)].angle = angle;
  });
  socket.on("startGame",function(lobby){
    //console.log("received start game call from server.")
    myGameArea.start();
  })
  socket.on("winner",function(winnerId){
    console.log("winner id is " + winnerId)
  })
  socket.on("gameStatus",function(gameStatus){
        let started = gameStatus['started'];
        //let ended = gameStatus['ended'];
        if (started == false){
            
            
            
        }
        else {
            // the player must have joined a lobby where the game has already started. or begun. 
            if (!playerList.some(item => item.id == socket.id)){
            spectateMode = true;
            myGameArea.start()
            console.log('please wait the game has already started.')
            }
            else {
              // you are already in the game, someone else must have joined in spectator view
            }
        }

  })
