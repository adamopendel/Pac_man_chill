import TileMap from "./TileMap.js"; // velocity quand le gameloop se recharge quadn il bouge vers un truc 

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext('2d');
const btn = document.getElementById("btn");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies();

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("sounds/gameOver.mp3");
const gameWinSound = new Audio("sounds/gameWin.wav");

function gameLoop() {
 tileMap.draw(ctx);
 drawGameEnd();
 pacman.draw(ctx, pause(), enemies);
 enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
 checkGameOver();
 checkGameWin();
}
// not game over thus check and if true play the motherfucking SOUND
function checkGameOver(){
    if(!gameOver){
    gameOver = isGameOver();
    if(gameOver){
        gameOverSound.play();
     }
   }
}

function checkGameWin(){
    if(!gameWin){
     gameWin = tileMap.didWin();
        if(gameWin){
        gameWinSound.play();
        }
}
}

// si enemy est touche pac man alors que il est pas powerdot alros game ova
function isGameOver(){
      return enemies.some(
(enemy) => !pacman.powerDotActive && enemy.collideWith(pacman) 
);
}


function pause(){
    return !pacman.madeFirstMove || gameOver || gameWin;
}


function drawGameEnd() {
    if(gameOver || gameWin){
let text = "You ate every little yellow dick but wait some seconds plz !";
    if (gameOver) {
text = "Jeez, you've been slaughtered by these jerks ! ";
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 10, canvas.width, 500);

    ctx.font = "75px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "yellow");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText(text, 10, canvas.height / 2, 600);
     }
}

btn.addEventListener("click", resetBtn);

function resetBtn(){
location.reload();
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);