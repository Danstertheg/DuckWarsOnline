const CryptoJS = require('crypto-js');

class User{
    constructor(username,password){
        this.username = username;
        this.password = password;
        this.itemsOwned = []; // give each item in store a unique Id and store in the users personal array possibly.
    }
    resetName(newName){
        this.username = newName;
    }
    resetPass(newPass){
        this.password = this.encrypt(newPass);
    }
    grantOwnership(item){
        this.itemsOwned.push(item)
    }
}
module.exports = User