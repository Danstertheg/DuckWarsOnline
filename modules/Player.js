class Player {
    constructor(width, height, x, y, name,id){
    this.mana = 1000;
    this.maxMana = 1000;
    this.manaRegenRate = 1;
    this.attackDelay = 15;
    this.attackTick = 15;
    // Amount of times per frame set to 10 currently (game runs on 20 ms intervals, animation every 20 * 10 (200) ms changed...)
    this.frameCount = 0;
    this.frameCountMax = 10;
    // animation direction l for left, r for right.
    this.direction = 'l';
    this.playerName = name;
    this.id = id;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.x = x;
    this.y = y;
    this.health = 5;
    this.lives = 3;
    }
    takeDamage(){
      console.log(this.playerName + " taking damage.")
      this.health--;
    }
    loseLife(){
        console.log(this.playerName + " lost a life");
        this.lives--;
    }
    revive (){
        this.health = 5;
    }
    regenMana() {
      if (this.mana <= this.maxMana){
        this.mana = this.mana + this.manaRegenRate;
      }
    }

    newPos(){
      // keep in mind that player bounds should be checked by server also to avoid cheating TODO
      let inBounds = true;
        if (this.Xspeed > 0 && this.x >= canvasWidth - 50 ){
          inBounds = false
          // moving right
        }
        else if (this.Xspeed < 0 && this.x <= 0 ){
          inBounds = false
          // moving left
        }
        if (this.Yspeed > 0 && this.y < 0){
          inBounds = false
          // moving up
        }
        else if (this.Yspeed < 0 && this.y >= canvasHeight - 50){
          // moving down
          inBounds = false
        }
        if (inBounds){
        this.x += this.Xspeed;
        this.y -= this.Yspeed;
        }
       // console.log(this.x, this.y);
    }
}
module.exports = Player