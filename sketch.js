let bird;
let gravity = 0.06;
let attractToSlingshot = true;
let leaveBird = false;

//for debugging
let debug = false;

//loading backgroud image
function preload() {
  bkImg = loadImage('sky.png');
}

function setup() { 
  createCanvas(700, 400);
  
  //Ground
  ground = createSprite(400, 365, 10, 10);
  ground.immovable = true;
  ground.setCollider ('rectangle', 0,  0,  10000, 250  )
  ground.scale=0.09;
  ground.addImage(loadImage('ground.png','ground.png'));
  ground.shapeColor = color(200,100,100);
  ground.debug= debug;
  
  //target boxes
  targets = new Group();  
  
  var images = ['catapilla.png','monkey.png','pig.png'];
  var k=0;
  targetH=height/5;
  for (var i = 0; i < 4; i++) {
    var t = createSprite( random(530,580), targetH, 80, 80);
    t.shapeColor = color(255, 100, 0);
    
    //gravity
    t.velocity.y=5;
    //setting collision area
    t.setCollider("rectangle", 0, 0, 80,80);
    
    //adding image
     if(k < 3){
      t.addImage(loadImage(images[k],images[k]));
      k++;
     }
    else{
      k=0;
      t.addImage(loadImage(images[k],images[k]));
    }
    t.rotateToDirection = true;
    t.debug=debug;
    //adding sprites to group
    targets.add(t);
    targetH = targetH - 90;
  }
  
  //making slingshot
  slingshot = createSprite(110, 235, 8, 120);
  slingshot.shapeColor = color(204, 102, 0);
  //gravity
  slingshot.setSpeed(5, 90);
  
  //A bird to hit targets
  bird = createSprite(110, 235, 30, 30);
  bird.shapeColor = color(128);
  bird.setCollider("circle", 0, 0, 30)
  bird.mouseActive= true;
  
  var img =loadImage('bird_icon.png','bird_icon.png');
  bird.addImage(img);
  bird.scale = 0.7;
  
  //uncomment for debugging
  bird.debug = debug;
  bird.maxSpeed = 50;
}

function draw() {
  background(bkImg);
 
  //allow bird to hit targets
  bird.displace(targets);
  //allow target to hit themself
  targets.displace(targets);
  //allow all sprites to rest on ground
  allSprites.collide(ground)
  
  //hovering bird on slingshot
  if(attractToSlingshot == true){
    bird.attractionPoint(0.1, 110, slingshot.position.y - 70);
  }
  
  //gravitational effect for bird
  bird.velocity.y = bird.velocity.y + gravity ;
  
  //holding bird via mouse
  if(bird.mouseIsPressed && leaveBird == false ){
    bird.position.x = mouseX;
    bird.position.y = mouseY;
  }
  
  //draw everthing
  drawSprites();
}

function mousePressed() {
  bird.rotateToDirection = true;
  bird.friction=0.01;
}

function mouseReleased() {
  leaveBird = true;
  attractToSlingshot = false;
 
  //calcualting throwing speed
  var throwSpeed = int(dist(bird.position.x, bird.position.y, 110, 190)/10);
  
  //console.log(throwSpeed);
  
  //throwing bird towards (110,190)
  bird.attractionPoint(throwSpeed, 110, 190);
  bird.setSpeed(bird.getSpeed(), bird.getDirection());
  //console.log(mouseX,mouseY);
}