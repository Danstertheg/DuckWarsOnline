var waterBlast = new Image();
class WaterBlast{
    constructor(user){
        this.id = user;
        this.player = user;
        this.currentFrame = 0;
        this.frames = 51;    //this.target = opponent; // ? THIS WAY? or maybe only target is needed since it will never collide with player. 
        this.user = playerList[findPlayerInList(user)];
        this.x = (this.user.direction == 'r') ? this.user.x + 25 : this.user.x - 25;
        this.y = this.user.y;
        this.radius = 100;
        this.speed = 25;
        this.direction = this.user.direction; // set in constructor and then never changed 
               // this.distance; // distance between it and opponent
               // this.damage = 10;
        this.damageCounted = false;
    }
    update() {

    }
    draw() {
        ctx = myGameArea.context;
       // console.log('attempting to draw waterblast...')
        if (this.currentFrame < 25){
            waterBlast.src = 'img/WaterBlast/right/frame_' + String(this.currentFrame) + "_delay-0.04s.gif";
            // console.log(waterBlast.src)
            this.currentFrame = this.currentFrame + 1;
        ctx.drawImage(waterBlast, this.x + 30, this.y - 80, this.radius * 2.5, this.radius * 2.5);
        }
    }
}