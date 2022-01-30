const CryptoJS = require('crypto-js');

class User{
    constructor(username,password){
        this.username = username;
        this.password = this.encrypt(password);
        this.itemsOwned = []; // give each item in store a unique Id and store in the users personal array possibly.
    }
    encrypt(text){
        //change passphrase to function variable and store in app.js server only
        var hash = CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex);
        return hash;
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