var bg,bgImg;
var player, shooterImg, shooter_shooting,zombieImg;
var explosionSound,loseSound,winSound;
var ZombieGroup;
var heart1Img,heart2Img,heart3Img;
var bullets = 60;
var gameState = "fight";
var bulletsGroup;
var  score = 0;
var lives = 3;


function preload(){
  
  shooterImg = loadImage("assets/shooter_2.png")
  shooter_shooting = loadImage("assets/shooter_3.png")
  zombieImg = loadImage("assets/zombie.png");
  bgImg = loadImage("assets/bg.jpeg");
  heart1Img  = loadImage("assets/heart_1.png");
  heart2Img = loadImage("assets/heart_2.png");
  heart3Img = loadImage("assets/heart_3.png");
  explosionSound = loadSound("assets/explosion.mp3");
  loseSound = loadSound("assets/lose.mp3");
  winSound = loadSound("assets/win.mp3");

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

  //adding the background image
  bg = createSprite(displayWidth/2-20,displayHeight/2-40,20,20)
bg.addImage(bgImg)
bg.scale = 1.1
  

//creating the player sprite
player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
 player.addImage(shooterImg)
   player.scale = 0.3
   player.debug = true
   player.setCollider("rectangle",0,0,300,300)

   ZombieGroup = new Group();
   bulletsGroup = new Group();

   heart1 = createSprite(displayWidth-150,40,20,20);
   heart1.addImage(heart1Img);
   heart1.scale=0.4;
   heart1.visible=false;

   heart2 = createSprite(displayWidth-100,40,20,20);
   heart2.addImage(heart2Img);
   heart2.scale=0.4;
   heart2.visible=false;

   heart3 = createSprite(displayWidth-150,40,20,20);
   heart3.addImage(heart3Img);
   heart3.scale=0.4;
   heart3.visible=false;





}

function draw() {
  background(0); 
  if(gameState === "fight"){
    //moving the player up and down and making the game mobile compatible using touches

    if(lives === 3){
      heart3.visible = true;
      heart2.visible = false;
      heart1.visible = false;

    }

    if(lives === 2){
      heart2.visible = true;
      heart3.visible = false;
      heart1.visible = false;
    }

    if(lives ===1){
      heart1.visible = true;
      heart2.visible = false;
      heart3.visible = false;
    }
    if(lives === 0 ){
      gameState = "lost";
    }
    if(score ===100){
      gameState = "won";
      winSound.play();
    }
    if(keyDown("UP_ARROW")||touches.length>0){
     player.y = player.y-30
  }
    if(keyDown("DOWN_ARROW")||touches.length>0){
      player.y = player.y+30
    }

    
    //release bullets and change the image of shooter to shooting position when space is pressed
    if(keyWentDown("space")){
      var bullet = createSprite(displayWidth-1150,player.y-30,20,10);
      bullet.velocityX = 20;

      bullet.depth = player.depth;
      player.depth +=2;
      bulletsGroup.add(bullet);
     
      
      player.addImage(shooter_shooting)
      bullets = bullets-1;
    }

    //player goes back to original standing image once we stop pressing the space bar
    else if(keyWentUp("space")){
      player.addImage(shooterImg)
    }

    if(bullets === 0 ){
      gameState = "bullet";
    }

    if(ZombieGroup.isTouching(bulletsGroup)){
      for(var i =0; i<ZombieGroup.length; i++){
        if(ZombieGroup[i].isTouching(bulletsGroup)){
          ZombieGroup[i].destroy();
          bulletsGroup.destroyEach();
          score = score+2;
          explosionSound.play();
        }
       
      }
    }

    if(ZombieGroup.isTouching(player)){

      loseSound.play();
      for(var i =0; i<ZombieGroup.length; i++){
        if(ZombieGroup[i].isTouching(player)){
          ZombieGroup[i].destroy();
          lives-=1;
        }
      }
    }
    enemy();
   
  }
  drawSprites();

  textSize(20);
  fill("white");
  text("Bullets: "+bullets,displayWidth-210,displayHeight/2-250);
  text("Score: " +score,displayWidth-200,displayHeight/2-220);
  text("Lives: " +lives,displayWidth-200,displayHeight/2-280);

if(gameState === "lost"){
  textSize(100);
  fill("red");
  text("YOU LOST!",400,400);
  ZombieGroup.destroyEach();
  player.destroy();
}
else if(gameState === "won"){
  textSize(100);
  fill("blue");
  text("YOU WON THE GAME !!",400,400);
  ZombieGroup.destroyEach();
  player.destroy();
}
else if(gameState === "bullet"){
  textSize(80);
  fill("red");
  text("YOU RAN OUT OF BULLETS!",100,410);
  ZombieGroup.destroyEach();
  player.destroy();
  bulletsGroup.destroyEach();
}

}
function enemy(){
  if(frameCount% 50 ===0){
    var Zombie = createSprite(random(500,1100),random(100,500),40,40);
    Zombie.addImage(zombieImg);
    Zombie.scale= 0.15;
    Zombie.velocityX = -3;
    Zombie.debug=true;
    Zombie.setCollider("rectangle",0,0,400,400);
    Zombie.lifetime = 400;
    ZombieGroup.add(Zombie);
  }
}