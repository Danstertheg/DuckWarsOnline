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
        this.speed = 20;
        this.direction = this.user.direction; // set in constructor and then never changed 
               // this.distance; // distance between it and opponent
               // this.damage = 10;
        this.damageCounted = false;
    }
    update() {
        //if (this.direction == 'l')
        //    this.x -= this.speed;
       // else
         //   this.x += this.speed;
        
        // calculate distance between it and opponent
       // const dx = this.x - this.target.x;
       // const dy = this.y - this.target.y;
        //this.distance = Math.sqrt(dx*dx + dy*dy); //pythegorean theorem!
    }
    draw() {
        ctx = myGameArea.context;
        console.log('attempting to draw waterblast...')
        if (this.currentFrame < 51){
            waterBlast.src = 'img/WaterBlast/frame_' + String(this.currentFrame) + "_delay-0.04s.gif";
            console.log(waterBlast.src)
            // this.draw(waterBlast)
            this.currentFrame = this.currentFrame + 1;
            
        ctx.drawImage(waterBlast, this.x + 30, this.y - 80, this.radius * 2.5, this.radius * 2.5);
        }
    }
}