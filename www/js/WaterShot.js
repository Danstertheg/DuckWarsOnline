var waterShot = new Image()

class WaterShot{
    constructor(userId){
        this.player = userId;
        this.frames = 52;    //this.target = opponent; // ? THIS WAY? or maybe only target is needed since it will never collide with player. 
        this.currentFrame = 0;
        this.user = playerList[findPlayerInList(userId)];
        this.x = (this.user.direction == 'r') ? this.user.x + 25 : this.user.x - 25;
        this.y = this.user.y;
        this.radius = 10;
        this.speed = 25;
        this.direction = this.user.direction;
        this.damageCounted = false;
    }
    update() {
        if (this.direction == 'l')
            this.x -= this.speed;
        else
            this.x += this.speed;


    }
    draw() {
        ctx = myGameArea.context;
        if (this.currentFrame < 51){
            waterShot.src = 'img/WaterShot/' + String(this.direction) + '/frame_' + String(this.currentFrame) + "_delay-0.04s.gif";
            console.log(waterShot.src)
        this.currentFrame = this.currentFrame + 1;
        ctx.drawImage(waterShot, this.x + 11, this.y + 11, this.radius * 2.5, this.radius * 2.5);
        }
    }
}