const CryptoJS = require('crypto-js');

class PlayerLobby{
    constructor(id,name,players,password){
        this.lobbyId = id;
        this.lobbyName = name;
        this.playerList = players;
        console.log(password)
        if (password == ''){
            this.password = '';
        }
        else{
            console.log('encrypting pass')
        this.password = String(password);
        }
        this.nextLobby = null; // linked list feature 
        this.playerCount = this.playerList.length;


        /// Gameplay related vars
        this.projectiles = [];
        this.abilities = [];
        this.gameStarted = false;
        this.roomSize = 4;
        this.leaderId = null;
    }
    // encrypt(text){
    //     //change passphrase to function variable and store in app.js server only
        
    //     var hash = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
    //     return hash;
    // }
    // decrypt(encryptedText){
    //     let passphrase = '1'
    //     let decrypted = CryptoJS.AES.decrypt(encryptedText, passphrase);
    //     return decrypted.toString(CryptoJS.enc.Utf8);
    // }
    checkPass(passAttempt){
        console.log("pass attempt " + passAttempt)
        console.log("comparing with" + this.password)
        //console.log(this.getPassword())
        if (passAttempt == this.getPassword()){
            return true;
        }
        else {
            return false;
        }
    }
    getPlayerCount(){
        return this.playerCount;
    }
    getPlayerList (){
        return this.playerList;
    }
    getPassword(){
        return this.password;
    }
    getNextLobby(){
        return this.nextLobby;
    }
    startGame(){
        console.log("starting lobby game. send to all players in the lobby list")
    }
    addPlayer(player){
        let alreadyAdded = this.checkPlayerInList(player);
        if (alreadyAdded == false){
            console.log("player is not yet in lobby, adding them to lobby.")
            if (this.playerCount <= this.roomSize){
            this.playerList.push(player)
            this.playerCount++;
            }
            else{
            // spectate mode possibly?
            }
        }
        else{
            console.log("player is already in this lobby, multilog attempt")
        }

    }
    checkPlayerInList(player){
        // returns true if player is in list, false otherwise
        if (!this.playerList.some(item => item.id == player['id'])){
            return false
        }
        else return true
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