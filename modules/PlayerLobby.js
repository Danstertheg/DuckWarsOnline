class PlayerLobby{
    constructor(id,name,players,password){
        this.lobbyId = id;
        this.lobbyName = name;
        this.playerList = players;
        this.password = password;
        this.nextLobby = null; // linked list feature 
        this.playerCount = this.playerList.length;


        /// Gameplay related vars
        this.projectiles = [];
        this.abilities = [];
        this.gameStarted = false;
        this.roomSize = 4;
        this.leaderId = null;
    }
    getPlayerCount(){
        return this.playerCount;
    }
    getPlayerList (){
        return this.playerList;
    }
    getpassword(){
        return this.password;
    }
    getNextLobby(){
        return this.nextLobby;
    }
    startGame(){
        console.log("starting lobby game. send to all players in the lobby list")
    }
    update(){
        /// loop through all players
        for (i = 0; i < this.playerCount; i++ ){
            this.playerList[i];
        }
        /// loop through all projectiles
        for (j = 0; j < this.projectiles.length; j++){

        }
        /// loop through all abilities casted 
        for (k = 0; k < this.abilities.length; k ++){

        }
        // loop through all powerups in game floor 
        for (l = 0; l < this.powerups.length; l++){

        }
    }
}
module.exports = PlayerLobby