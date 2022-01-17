// const { range } = require("express/lib/request");

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
      if (projectile['type'] == 'waterBlast'){
        tmpProjectile = new WaterBlast(String(projectile['id']));
        console.log("received waterblast")
      }
      else if (projectile['type'] == 'waterShot')
      {
        tmpProjectile = new WaterShot(String(projectile['id']));
      }
      else{
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
    if (projectile['type'] == 'waterShot'){
        playerList[findPlayerInList(id)].takeDamage();
        playerList[findPlayerInList(id)].takeDamage();
    }
    else if (projectile['type' == 'bread']){
    playerList[findPlayerInList(id)].takeDamage();
    }
    if (id = myGamePiece.id){
        let src = 'img/healthbar/health_' + playerList[findPlayerInList(id)].health + '.png'; 
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
  socket.on("gameStatus",function(gameStatus){
        let started = gameStatus['started'];
        //let ended = gameStatus['ended'];
        if (started == false){
            
            
            
        }
        else {
            // the player must have joined a lobby where the game has already started. or begun. 
            spectateMode = true;
            myGameArea.start()
            console.log('please wait the game has already started.')
        }

  })
