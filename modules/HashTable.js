class HashTable {
    constructor() {
      this.values = {};
      this.length =  0;
      this.size =  10;
    }
  
    calculateHash(lobbyId) {
      return lobbyId % this.size;
    }
  
    add(playerLobby) {
      let key = playerLobby.lobbyId;
      const hash = this.calculateHash(key);
      if (!this.values.hasOwnProperty(hash)) {
        this.values[hash] = {};
      }
      if (!this.values[hash].hasOwnProperty(key)) {
         this.length++;
      }
      this.values[hash][key] = playerLobby;
    }
  
    search(key) {
       const hash = this.calculateHash(key);
       console.log("searching for lobby with id " + key)
       if (this.values.hasOwnProperty(hash) && this.values[hash].hasOwnProperty(key)) {
         return this.values[hash][key];
       } else {
         return null;
       }
    }

    show(){
        console.log(this.values);
    }
  }
  module.exports = HashTable