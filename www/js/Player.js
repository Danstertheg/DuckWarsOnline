//const e = require("express");

function Player(id, x, y, name,skin, headItem, outfit) {
      if (outfit == "noneOutfit")
        this.bodyIMG = 'img/animations/' + skin + '/' + skin + '_';
      else
        this.bodyIMG = 'img/clothingItems/' + skin + '/outfits/' + outfit + '/';

      if (headItem != "noneHead") {
        this.headItemIMG = 'img/clothingItems/' + skin + '/headItems/' + headItem + '/'; 
        this.headItemXOffset = 0;
      }


      // starts at frame 1 for simplicity
      this.frame = 1;
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
      this.width = 30;
      this.height = 30;
      this.speed = 0;
      this.x = x;
      this.y = y;
      this.health = 5;
      this.animation = new Image();
      this.headItemAnimation = new Image(); // new
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
      this.regenMana = function(){
        if (this.mana <= this.maxMana){
          this.mana = this.mana + this.manaRegenRate;
        }
      }
      this.update = function() {
          ctx = myGameArea.context;
          ctx.save();
          ctx.translate(this.x, this.y);
          this.healthBar.src = 'img/healthbar/health_' + String(this.health) + '.png'
          ////////////drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
          ctx.drawImage(this.healthBar,0,0,200,100,0,-20,100,50)


          // NEW STYLE CODE START:

          // 1. drawing base (either skin or outfit):=======================================
          this.animation.src = this.bodyIMG + this.direction + '_idle' + String(this.frame) + ".png";
          ctx.drawImage(this.animation,0,0,200,200,0,0,75,75);
          //this.animation.src = this.skin + '_' + this.direction + '_idle' + String(this.frame) + ".png"; OLDSTYLECODE

          // 2. drawing head item (if any):=======================================
          if (headItem != "noneHead") {
            this.headItemAnimation.src = this.headItemIMG + this.direction + '.png';

            var xDirectionFactor = (this.direction == 'l') ? 1 : -1;

            if (skin == "mrgoose") 
              ctx.drawImage(this.headItemAnimation, 0,0,200,200,0,0 + this.headItemXOffset,75,75);
            else if (skin == "oats")
              ctx.drawImage(this.headItemAnimation, 0,0,200,200,0 + this.headItemXOffset * xDirectionFactor * -1,0 -6,75,75);
            else
              ctx.drawImage(this.headItemAnimation, 0,0,200,200,0 + this.headItemXOffset * xDirectionFactor,0,75,75);
          }

          // NEW STYLE CODE END. thanks for coming, mate
          

          ctx.fillText(name,25,75);
          ctx.restore();
          
          // Switching frames:
          this.frameCount++;
          if (this.frameCount % this.frameCountMax == 0) {
            if (this.frame == 1) {
              this.frame = 2;
              this.headItemXOffset = -2;
            } else if (this.frame == 2) {
              this.frame = 1;
              this.headItemXOffset = 0;
            }
          }
           // this.frame = (this.frame == 1) ? 2 : 1;

          // Old code:
         /* if (this.frame == 1){
            this.frameCount++;
            if (this.frameCount == this.frameCountMax){
              this.frame = 2;
              this.frameCount = 0;

              if (this.direction == 'l')
                this.headItemXOffset = (this.headItemXOffset != -2) ? -2 : 0;
              else
                this.headItemXOffset = (this.headItemXOffset != 1) ? 1 : 0;
            }
          
          }
          else if (this.frame == 2){
            this.frameCount++;
            if (this.frameCount == this.frameCountMax){
              this.frame = 1;
              this.frameCount = 0;
              
              if (this.direction == 'l')
                this.headItemXOffset = (this.headItemXOffset != -2) ? -2 : 0;
              else
                this.headItemXOffset = (this.headItemXOffset != 2) ? 2 : 0;
            }
            
          }*/
      }
      this.showMessage = function(msg){
        ctx = myGameArea.context;
        ctx = save();
        ctx.fillText(msg,40,100);
      }
      this.newPos = function() {
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