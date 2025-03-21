
import Enemy from "./Enemy.js";
import MovingDirection from "./MovingDirection.js";


export default class Pacman {
    constructor(x, y, tileSize, velocity, tileMap) {
       this.x = x;
       this.y = y;
       this.tileSize = tileSize;
       this.velocity = velocity;
       this.tileMap = tileMap;
       this.timers = [];


       this.currentMovingDirection = null;
       this.requestedMovingDirection = null;

       this.pacmanAnimationTimerDefault = 10;
       this.pacmanAnimationTimer = null;

       this.pacmanRotation = this.Rotation.right;
       
       this.powerDotActive = false;
       this.powerDotAboutToExpire = false;
       this.powerDotSound = new Audio("sounds/power_dot.wav");
       this.madeFirstMove = false;
       this.wakaSound = new Audio("sounds/waka.wav");
       this.eatJellyFishesSound = new Audio("sounds/eat_ghost.wav");

       document.addEventListener("keydown",this.#keydown)

       this.#loadPacmanImages();
    }

Rotation = {
    right: 0,
    down: 1,
    left: 2,
    up: 3,

}


draw(ctx, pause, enemies) {  
 if (!pause){
this.#move();
this.#animate();
 }
this.#eatPenis();
this.#eatPowerDot();
this.#eatAwfulJellyfishes(enemies);
const size = this.tileSize/2;

ctx.save();
ctx.translate(this.x + size, this.y + size);
ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
ctx.drawImage(this.pacmanImages[this.pacmanImageIndex],
-size,
-size,
this.tileSize,
this.tileSize
);

ctx.restore();

 /* ctx.drawImage(this.pacmanImages[this.pacmanImageIndex],
    this.x, 
    this.y, 
    this.tileSize,
    this.tileSize
    ); */

}

 #loadPacmanImages() {
        const pacmanImage1 = new Image();
        pacmanImage1.src = "images/pac0.png";
    
        const pacmanImage2 = new Image();
        pacmanImage2.src = "images/pac1.png";
    
        const pacmanImage3 = new Image();
        pacmanImage3.src = "images/pac2.png";
    
        const pacmanImage4 = new Image();
        pacmanImage4.src = "images/pac1.png";
    
        this.pacmanImages = [
          pacmanImage1,
          pacmanImage2,
          pacmanImage3,
          pacmanImage4,
        ];
    
        this.pacmanImageIndex = 0;
  }

  #keydown = (event)=>{
   // UP tu bouge en bas et tu peux switch en haut mais on va regarde si y'a pas de mur etc pour le faire
   if(event.keyCode == 38){ // 87
      if(this.currentMovingDirection == MovingDirection.down)
      this.currentMovingDirection = MovingDirection.down;
     this.requestedMovingDirection = MovingDirection.up;
     this.madeFirstMove = true;
 }
 // DOWN
if(event.keyCode == 40){
 if(this.currentMovingDirection == MovingDirection.up)
 this.currentMovingDirection = MovingDirection.down;
  this.requestedMovingDirection = MovingDirection.down;
  this.madeFirstMove = true;
}
   // LEFT
   if(event.keyCode == 37){
     if(this.currentMovingDirection == MovingDirection.right)
     this.currentMovingDirection = MovingDirection.left
   this.requestedMovingDirection = MovingDirection.left
   this.madeFirstMove = true;
   }
   // RIGHT
   if(event.keyCode == 39){
     if(this.currentMovingDirection == MovingDirection.left)
     this.currentMovingDirection = MovingDirection.right
     this.requestedMovingDirection = MovingDirection.right
     this.madeFirstMove = true;
   }
}; 

   // voir si la position actuelle egal à la position demandé
   #move() {
      if (this.currentMovingDirection !== this.requestedMovingDirection) {
        if (
          Number.isInteger(this.x / this.tileSize) &&
          Number.isInteger(this.y / this.tileSize)
        ) {
          if (
            !this.tileMap.didCollideWithEnvironment(
              this.x,
              this.y,
              this.requestedMovingDirection
            )
          )
            this.currentMovingDirection = this.requestedMovingDirection;
        }
      }

      if (
        this.tileMap.didCollideWithEnvironment(
          this.x,
          this.y,
          this.currentMovingDirection
        )
      ) {
        this.pacmanAnimationTimer = null;
        this.pacmanImageIndex = 1;
        return;
      } else if (
        this.currentMovingDirection != null &&
        this.pacmanAnimationTimer == null
      ) {
        this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      }
  
      switch (this.currentMovingDirection) {
        case MovingDirection.up:
          this.y -= this.velocity;
          this.pacmanRotation = this.Rotation.up;
          break;
        case MovingDirection.down:
          this.y += this.velocity;
          this.pacmanRotation = this.Rotation.down;
          break;
        case MovingDirection.left:
          this.x -= this.velocity;
          this.pacmanRotation = this.Rotation.left;
          break;
        case MovingDirection.right:
          this.x += this.velocity;
          this.pacmanRotation = this.Rotation.right;
          break;
      }
   }

  

#animate() {
   if(this.pacmanAnimationTimer == null){
      return; 
   }
   this.pacmanAnimationTimer--;
   if(this.pacmanAnimationTimer == 0){
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanImageIndex++;
      if(this.pacmanImageIndex == this.pacmanImages.length){
         this.pacmanImageIndex = 0;
      }
   }
}

#eatPenis() {
   if (this.tileMap.eatPenis(this.x, this.y) && this.madeFirstMove) {
     this.wakaSound.play();
   }
 }

 #eatPowerDot(){
   if(this.tileMap.eatPowerDot(this.x,this.y)){
     this.powerDotSound.play();
     this.powerDotActive = true;
     this.powerDotAboutToExpire = false;
     this.timers.forEach((timer) => clearTimeout(timer));
     this.timers = [];

    let powerDotTimer = setTimeout(() => {
      this.powerDotActive = false;
      this.powerDotAboutToExpire = false;
    }, 1000*6);

    this.timers.push(powerDotTimer);

    let powerDotAboutToExpire = setTimeout(() => {
      this.powerDotAboutToExpire = true;
    }, 1000*3);

    this.timers.push(powerDotAboutToExpire);
    
   }
 }

 #eatAwfulJellyfishes(enemies){
   if(this.powerDotActive){
     const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
     collideEnemies.forEach((enemy)=> {
    enemies.splice(enemies.indexOf(enemy),1);
    this.eatJellyFishesSound.play(); 
  });
    }
  }
}
