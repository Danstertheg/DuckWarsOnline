function Player(width, height, color, x, y, name,id,skin) {
    if (skin == "danky"){
      this.skin = 'img/animations/danky/Danky';
    }
    else if(skin == "oats"){
      this.skin = 'img/animations/oats/Oats';
    }
    else{
      this.skin = 'img/animations/mrgoose/mrgoose';
    }
      // starts at frame 1 for simplicity
      this.frame = 1;
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
      this.animation = new Image();
      this.healthBar = new Image();
      this.lives = 3;
      this.takeDamage = function (){
        console.log(this.playerName + " taking damage.")
        this.health--;
      }
      this.loseLife = function (){
          console.log(this.playerName + " lost a life");
          this.lives--;
      }
      this.revive = function (){
          this.health = 5;
      }
      this.update = function() {
          ctx = myGameArea.context;
          ctx.save();
          ctx.translate(this.x, this.y);
          this.animation.src = this.skin + '_' + this.direction + '_idle' + String(this.frame) + ".png";
          this.healthBar.src = 'img/healthbar/health_' + String(this.health) + '.png'
          ////////////drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          ctx.drawImage(this.healthBar,0,0,200,100,0,-20,100,50)
          ctx.drawImage(this.animation,0,0,200,200,0,0,75,75)
          ctx.fillText(name,25,75);
          ctx.restore();
          if (this.frame == 1){
            this.frameCount++;
            if (this.frameCount == this.frameCountMax){
              this.frame = 2;
              this.frameCount = 0;
            }
          
          }
          else if (this.frame == 2){
            this.frameCount++;
            if (this.frameCount == this.frameCountMax){
              this.frame = 1;
              this.frameCount = 0;
            }
            
          }
      }
      this.showMessage = function(msg){
        ctx = myGameArea.context;
        ctx = save();
        ctx.fillText(msg,40,100);
      }
      this.newPos = function() {
          this.x += this.Xspeed;
          this.y -= this.Yspeed;
         // console.log(this.x, this.y);
      }
  }