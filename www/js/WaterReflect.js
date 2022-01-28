
class WaterReflect{
    constructor(user){
        this.id = user;
        this.currentFrame = 0;
        this.frames = 51;    //this.target = opponent; // ? THIS WAY? or maybe only target is needed since it will never collide with player. 
        this.user = playerList[findPlayerInList(this.id)];
        this.x = (this.user.direction == 'r') ? this.user.x + 25 : this.user.x - 25;
        this.y = this.user.y;
        this.radius = 50;
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
        this.animation = animation
        

    }
    update() {
    
        this.duration--;
        
    }
    draw() {
        ctx = myGameArea.context;
       // console.log('attempting to draw waterblast...')
        if (this.currentFrame < 51 && this.currentFrame >= 0){
            
           //console.log(this.animation[this.currentFrame])
            if (this.direction == 'l'){
                ctx.drawImage(this.animation[Number(this.currentFrame)], this.x - 80, this.y , this.radius * 2, this.radius * 2);
            }
            else{
                ctx.drawImage(this.animation[Number(this.currentFrame)], this.x + 80, this.y , this.radius * 2, this.radius * 2);
            }


        }
        else{
            this.currentFrame = 1;
        }
        if (tickCount % this.animationTick == 0){
            this.currentFrame = this.currentFrame + 1;
        }
    }
}