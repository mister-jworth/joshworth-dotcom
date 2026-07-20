let society
let wealthBase=1; //starting wealthBase 
let transfer = .05;
let tithe = transfer*0; //sets the contribution percentage
let growthRate = 0;
let taxRate = 0;
let count = 100;
// set up gradient
let gradientStart = [1,117,255];
let gradientEnd = [36,255,1];
let gradientStep = [Math.abs((gradientEnd[0]-gradientStart[0])/count),Math.abs((gradientEnd[1]-gradientStart[1])/count), Math.abs((gradientEnd[2]-gradientStart[2])/count)];
let showBaseline = false;
let baseScaleFactor = 60;
let scaleFactor = baseScaleFactor;
let baseRadiusScale = 1;
let radiusScale = baseRadiusScale;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60)
  let spacingX = width/11;
  let spacingY = (height-100)/11;
  society = new Society(50,50, spacingX, spacingY)
  let posx=spacingX;
  let posy=spacingY;
  size = min(spacingX, spacingY)*wealthBase
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
  checkBaseline = createCheckbox('Show baseline', false);
  checkBaseline.position(width-200,10);
  checkInterest = createCheckbox('Interest', false);
  checkInterest.position(width-300,10);
  checkInterest.changed(addInterest);
  checkBars = createCheckbox('Bars', true);
  checkBars.position(width-400,10);
  checkBubbles = createCheckbox('Bubbles', true);
  checkBubbles.position(width-500,10);
  checkOrdering = createCheckbox('Reorder', true);
  checkOrdering.position(width-600,10);  
  checkTithe = createCheckbox('Tithe', false);
  checkTithe.position(width-700,10);
  checkTithe.changed(addTithe);
  checkTax = createCheckbox('Tax', false);
  checkTax.position(width-800,10);
  checkTax.changed(addTax);
}

 function addInterest() {
  if (checkInterest.checked()) {
    growthRate = .002;
  } else {
    growthRate = 0;
  }
} 

function addTithe() {
    if (checkTithe.checked()) {
      tithe = transfer*.5
    } else {
       tithe = 0;
    }
  } 

function addTax() {
    if (checkTax.checked()) {
      taxRate = .002;
    } else {
      taxRate = 0;
    }
  }   

function draw() {
  background(0,20,60);
  society.update();
  //text(society.totalWealth, 20, 20);
  text(frameCount, 20, 20)
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
    this.wealthBase = round(wealthBase, 2);
    this.wealth = round(wealthBase, 2);
    this.r = size/2;
    this.index = index;
    //this.color = color(random(0,30),random(90,210),random(90,210),210); // old colors
    this.color = color(gradientStart[0]+gradientStep[0]*(index+1), gradientStart[1]+gradientStep[1]*(index+1), gradientStart[2]-gradientStep[2]*(index+1), 210); //gradient colors -- (check + - when changing colors)
    this.receiver = random(society.citizens);

  }
  update() {
     //investment -> growth by % of current wealthBase
    this.wealth += this.wealth*growthRate; 

    //baseline calc
    this.receiver = random(society.citizens)
    if (this.receiver.index == this.index){
      this.receiver = random(society.citizens);
      //return;
    }
     if (this.wealthBase >= transfer){
      this.wealthBase -= transfer;
      this.receiver.wealthBase += transfer;
    } else {
      this.wealthBase = this.wealthBase
    }  
     // adjustments
    if (this.wealth >= transfer){
      this.wealth -= transfer;
      this.receiver.wealth +=transfer;
      this.wealth -= this.wealth*taxRate; //subtract tax
      this.receiver.wealth -= tithe; // subtract tithe from transfer
      for (let i = 0; i < society.citizens.length; i++){
          society.citizens[i].wealth += tithe/(count); //give everyone a piece of the tithe
          society.citizens[i].wealth += this.wealth*taxRate/(count); // give everyone a piece of the tax
      } 
    } else {
      this.wealth = this.wealth;
    } 

    society.totalWealth += this.wealth
    //society.totalWealth += this.wealthBase;
  }
  
  displayCitizen() { 
    fill(this.color);
    strokeWeight(0);
    stroke(this.color);
    strokeCap(SQUARE);
    // reorder
    let orderSpot = 1;
    let orderSpotAlt = 1;
    for (let i = 0; i < society.citizens.length; i++){
      if (this.wealthBase > society.citizens[i].wealthBase){
      orderSpot+=1
      }
      if (this.wealth > society.citizens[i].wealth){
        orderSpotAlt+=1
        }
    }
    let barHeight = this.wealth*scaleFactor;
    let dotSize = this.wealth*radiusScale;

    if (orderSpotAlt == society.citizens.length){
      stroke(255,255,255); //color the tallest bar white
      fill(255,255,255,220)
      // check whether scaling is needed on bars
      if (this.wealth*baseScaleFactor >= height) {
        barHeight = height-2; //stop growing
        //add a reduction factor to all bar heights that's proportional to how much the real height is over the screen height
        let newScaleFactor = baseScaleFactor-(baseScaleFactor*(((this.wealth*baseScaleFactor - height)/height)));
        scaleFactor = newScaleFactor;
        }
       // check whether scaling is needed on bubbles
      if (this.wealth*baseRadiusScale >= 10) {
        dotSize = 10; //stop growing
        //add a reduction factor to all bubbles that's proportional to how much the real size is over 11
        let newRadiusScale = baseRadiusScale-(baseRadiusScale*(((this.wealth*baseRadiusScale - 10)/10)));
        if (newRadiusScale < 0) {
            newRadiusScale = 0; //set scaling factor to 0 when size reaches minimum value
        }
        radiusScale = newRadiusScale;
        }
      }
    
     if (!checkOrdering.checked()){ // don't reorder
         orderSpot = 1+this.index;
         orderSpotAlt = 1+this.index;
     }
  
    //draw bar for chart
    push()
    strokeWeight((width/count)-2);
    if (checkBars.checked()){
        line(orderSpotAlt*(width/count)-10, height, orderSpotAlt*(width/count)-10, height-barHeight);
        //draw baselines
        if (checkBaseline.checked()){
         stroke(255,255,0)
         line(orderSpot*(width/count)-10,height-(this.wealthBase*scaleFactor)+2,orderSpot*(width/count)-10,height-(this.wealthBase*scaleFactor))
        }
    } 
    pop()
    if (checkBubbles.checked()){
        // draw circles
        strokeWeight(0);
        circle(this.vPosition.x,this.vPosition.y,this.r*dotSize);
        //draw baseline circles
        if (checkBaseline.checked()){
         push()
         strokeWeight(1);
         fill(255,0)
         stroke(255,255,0)
         circle(this.vPosition.x,this.vPosition.y,this.r*(this.wealthBase*radiusScale));
        }
    }
    pop();
    //draw a line to receiver?
    //line(this.vPosition.x,this.vPosition.y,this.receiver.vPosition.x, this.receiver.vPosition.y) 
    //text(round(this.wealthBase, 3), this.vPosition.x, this.vPosition.y) //display wealthBase value at circle
};
}


