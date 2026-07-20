let society
let wealth=1; //starting wealth 
let transfer = .05;
let tithe = transfer*0; //sets the contribution percentage
let count = 100;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60)
  let spacingX = width/11;
  let spacingY = (height-100)/11;
  society = new Society(50,50, spacingX, spacingY)
  let posx=spacingX;
  let posy=spacingY;
  size = min(spacingX, spacingY)*wealth
  for (let i = 0; i < count; i++) {
    society.addCitizen(posx,posy,i, size); //put all the citizens into an array
    if ((i+1)%10 == 0){
      posx=spacingX;
      posy+=spacingY;
    }
    else {
      posx+=spacingX;
    }
  }
}


function draw() {
  background(0,20,60);
  society.update();
  text(society.totalWealth, 20, 20)
  society.totalWealth = 0;
  
} 

class Society {
  constructor(X,Y, spacingX, spacingY) {
    this.location = createVector(X,Y);
    this.citizens = [];
    this.totalWealth = 100;
    this.spacingX = spacingX;
    this.spacingY = spacingY;
  }

  addCitizen(cx, cy, index, size){
    this.citizens.push(new Citizen(cx,cy,index, size))
  }
  update(){
    for (let i = 0; i < this.citizens.length; i++) {
      this.citizens[i].update();
      this.citizens[i].displayCitizen();
    } 
  }
}

class Citizen {
  constructor(cX, cY, index, size) {
    this.vPosition = createVector(cX,cY) //location of citizen
    this.wealth = Number(wealth.toFixed(2));
    this.wealthAlt = Number(wealth.toFixed(2));
    this.r = size/2;
    this.index = index;
    this.color = color(random(0,30),random(90,210),random(90,210),210);
    this.receiver = random(society.citizens);

  }
  update() {
     /* // investment -> growth by % of current wealth
     this.wealth += this.wealth*.0001  */ 
    //no tithe
    this.receiver = random(society.citizens)
    if (this.receiver.index == this.index){
      this.receiver = random(society.citizens);
      //return;
    }
     if (this.wealth >= transfer){
      this.wealth -= transfer;
      this.receiver.wealth += transfer;
    } else {
      this.wealth = this.wealth
    }  

     // tithe
    if (this.wealthAlt >= transfer){
      this.wealthAlt -= transfer;
      this.receiver.wealthAlt +=transfer;
      for (let i = 0; i < society.citizens.length; i++){
        if (i !== this.index){
          this.receiver.wealthAlt -= tithe/(count-1)
          society.citizens[i].wealthAlt += tithe/(count-1);
        }
      } 
    } else {
      this.wealthAlt = this.wealthAlt
    } 
    society.totalWealth += this.wealthAlt
    
    //society.totalWealth += this.wealth;
  }
  
  displayCitizen() { 
    /// draw circles
    strokeWeight(0);
    circle(this.vPosition.x,this.vPosition.y,this.r*this.wealth);
    push()
    strokeWeight(1);
    fill(255,0)
    circle(this.vPosition.x,this.vPosition.y,this.r*this.wealthAlt);
    //line(this.vPosition.x,this.vPosition.y,this.receiver.vPosition.x, this.receiver.vPosition.y) //draw a line to receiver
    pop();
        
    //draw bar chart
    fill(this.color);
    strokeWeight(0);
    stroke(this.color);
    strokeCap(SQUARE);
    let orderSpot = 1;
    let orderSpotAlt = 1;
    for (let i = 0; i < society.citizens.length; i++){
      if (this.wealth > society.citizens[i].wealth){
      orderSpot+=1
      }
      if (this.wealthAlt > society.citizens[i].wealthAlt){
        orderSpotAlt+=1
        }
    }
    if (orderSpot == society.citizens.length){
      stroke(255,255,255);
      fill(255,255,255,220)
      }
    push()
    strokeWeight((width/count)-2);
    line(orderSpot*(width/count)-10,height,orderSpot*(width/count)-10,height-(this.wealth*60));
    //draw alt lines
    //stroke(255,0,0)
    //line(orderSpotAlt*(width/count)-10,height-(this.wealthAlt*60)+2,orderSpotAlt*(width/count)-10,height-(this.wealthAlt*60))
    pop()


    //end circles 
    //fill(255)
    //text(round(this.wealth, 3), this.vPosition.x, this.vPosition.y) // put wealth in circle
};
}


