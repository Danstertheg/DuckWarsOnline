var waterDash = new Image();
class WaterDash{
    constructor(user){
        this.id = user;
        this.currentFrame = 25;
        this.frames = 51;    //this.target = opponent; // ? THIS WAY? or maybe only target is needed since it will never collide with player. 
        this.user = playerList[findPlayerInList(this.id)];
        this.x = (this.user.direction == 'r') ? this.user.x + 25 : this.user.x - 25;
        this.y = this.user.y;
        this.radius = 100;
        this.speed = 25;
        this.direction = this.user.direction; 
        this.animationTick = 5;
        this.duration = 25; // (50 * 20  is 3 seconds, will last for 50 game ticks, 20 ms each) 
        // to reduce how many times this is drawn on the browser,
        this.updateDelay = 3;
        // set in constructor and then never changed 
               // this.distance; // distance between it and opponent
               // this.damage = 10;
        this.damageCounted = false;
    }
    update() {
        let inbounds = true;
        console.log(this.user.radius)
        if (this.user.x >= canvasWidth - 50){
            inbounds = false
        }
        else if (this.user.x < 0){
            inbounds = false
        }
        if (inbounds == true){
        if (this.direction == 'r'){
        this.user.x = this.user.x  + 10;
        }
        else{
            this.user.x = this.user.x - 10; 
        }
        socket.emit('playerMovement',{id:this.user,x:this.user.x,y:this.user.y,direction:this.user.direction});
        }
        this.duration--;
    }
    draw() {
        ctx = myGameArea.context;
       // console.log('attempting to draw waterblast...')
        if (this.currentFrame < 51 && this.currentFrame >= 0){
            waterDash.src = 'img/WaterDash/' + this.direction + '/frame_' + '5' + "_delay-0.04s.gif";
            // console.log(waterBlast.src)
            //console.log("direction " + this.direction + ' FROM ' + this.id)
            if (this.direction == 'l'){
                ctx.drawImage(waterDash, this.x + 80, this.y - 50, this.radius * 2, this.radius * 2);
            }
            else{
                ctx.drawImage(waterDash, this.x - 200, this.y - 50, this.radius * 2, this.radius * 2);
            }
        
        }
        else{
            this.currentFrame = 1;
        }
        if (tickCount % this.animationTick == 0){
            this.currentFrame = this.currentFrame - 1;
        }
    }
}