//Create variables here
var dog,HappyDog,sadDog,database;
var foodS,foodStock;
var feed,addFood;
var fedTime,lastFed;
var foodObj;
var gameState,changingGameState,readingGameState,currentTime;
var bedroom,garden,washroom;

function preload()
{
  //load images here
  sadDog = loadImage("images/dogImg.png");
  HappyDog = loadImage("images/dogImg1.png");
  //bedroom = loadImage("images/BedRoom.png");
  //garden = loadImage("images/Garden.png");
  //washroom = loadImage("images/WashRoom.png");
}

function setup() {
  database = firebase.database();
	createCanvas(1000,400);

  foodObj = new Foods();
  
  foodStock = database.ref('Food');
  foodStock.on("value",readStock)

  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15

  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  
}


function draw() {  
background(46,139,87);
foodObj.display();

fedTime=database.ref('FeedTime');
fedTime.on("value",function(data){
  lastFed=data.val();
});

fill(255,255,254);
textSize(15);

if(gameState!="Hungry"){
  feed.hide();
  addFood.hide();
  //dog.remove();
}else{
  feed.show();
  addFood.show();
  dog.addImage(sadDog)
}
if(currentTime = lastFed + 1){
  foodObj.garden()
}else if(currentTime-fedTime > 1 && currentTime-fedTime < 4){
  foodObj.washroom()
  gameState = "Bathing"
}else{
  gameState = "Hungry"
  feed.show();
  addFood.show();
  dog.addImage(sadDog)
}

foodObj.display(); 
drawSprites();
  //add styles here
textSize(10);
fill("white");
stroke("black");
textSize(13);
dog.display();
}

function readStock(data){
  foodS=data.val();
}

function writeStock(x){
  if(x<= 0){
    x=0;
  }else{
    x=x-1;
  }
 
  database.ref('/').update({
    Food:x
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function feedDog(){
  dog.addImage(HappyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  });
}