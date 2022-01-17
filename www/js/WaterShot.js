var waterShot = new Image()

class WaterShot{
    constructor(user){
        this.player = user;
        this.frames = 52;    //this.target = opponent; // ? THIS WAY? or maybe only target is needed since it will never collide with player. 
        this.user = playerList[findPlayerInList(user)];
        this.x = (this.user.direction == 'r') ? this.user.x + 25 : this.user.x - 25;
        this.y = this.user.y;
        this.radius = 10;
        this.speed = 20;
        this.direction = this.shooter.direction; // set in constructor and then never changed 
               // this.distance; // distance between it and opponent
               // this.damage = 10;
        this.damageCounted = false;
    }
    update() {
        if (this.direction == 'l')
            this.x -= this.speed;
        else
            this.x += this.speed;

        // calculate distance between it and opponent
       // const dx = this.x - this.target.x;
       // const dy = this.y - this.target.y;
        //this.distance = Math.sqrt(dx*dx + dy*dy); //pythegorean theorem!
    }
    draw() {
        ctx = myGameArea.context;

        ctx.drawImage(breadShotImage, this.x + 11, this.y + 11, this.radius * 2.5, this.radius * 2.5);
    }
}