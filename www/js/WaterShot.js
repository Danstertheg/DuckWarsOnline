var waterShotImage = new Image()

class WaterShot{
    constructor(userId){
        this.id = userId // SAME AS PLAYER
        this.player = userId;
        this.frames = 52;    //this.target = opponent; // ? THIS WAY? or maybe only target is needed since it will never collide with player. 
        this.currentFrame = 0;
        this.user = playerList[findPlayerInList(userId)];
        this.x = (this.user.direction == 'r') ? this.user.x + 25 : this.user.x - 25;
        this.y = this.user.y;
        this.radius = 30;
        this.speed = 15;
        this.direction = this.user.direction;
        this.damageCounted = false;
        // how many game ticks per animation frame (eg. setInterval() ... 1 tick = 20ms)
        this.animationTick = 5;
    }
    update() {
        if (this.direction == 'l')
            this.x -= this.speed;
        else
            this.x += this.speed;


    }
    draw() {
        ctx = myGameArea.context;
        if (this.currentFrame < 50){
            console.log("this direction " + this.direction)
            waterShotImage.src = './img/WaterShot/' + String(this.direction) + '/frame_' + String(this.currentFrame) + '_delay-0.04s.gif';
        ctx.drawImage(waterShotImage, this.x + 11, this.y + 11, this.radius * 2.5, this.radius * 2.5);
        }
        else{
            this.currentFrame = 3;
            ctx.drawImage(waterShotImage, this.x + 11, this.y + 11, this.radius * 2.5, this.radius * 2.5);
        }
        // tickCount is a global variable in game.html
        if (tickCount % this.animationTick == 0 ){
            this.currentFrame++;
            console.log("changing Frame");
        }






    }
}