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
let steps = count;
let gradientStep = [Math.abs((gradientEnd[0]-gradientStart[0])/steps), Math.abs((gradientEnd[1]-gradientStart[1])/steps), Math.abs((gradientEnd[2]-gradientStart[2])/steps)];
// set up contrasting scheme
let gradientAltStart = [255,1,1];
let gradientAltEnd = [255,230,1];
let gradientAltStep = [Math.abs((gradientAltEnd[0]-gradientAltStart[0])/steps),Math.abs((gradientAltEnd[1]-gradientAltStart[1])/steps), Math.abs((gradientAltEnd[2]-gradientAltStart[2])/steps)];
let applyEffects = true;
let showBaseline = false;
let baseScaleFactor = 60;
let scaleFactor = baseScaleFactor;
let baseRadiusScale = 1;
let radiusScale = baseRadiusScale;
let step = 0.01;

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
  checkBaseline = createCheckbox('Baseline', false);
  checkBaseline.position(width-575,8);
  checkInterest = createCheckbox('Interest', false);
  checkInterest.position(width-475,8);
  checkInterest.changed(addInterest);
  checkBars = createCheckbox('Bars', true);
  checkBars.position(width-750,8);
  checkBubbles = createCheckbox('Bubbles', true);
  checkBubbles.position(width-850,8);
  checkOrdering = createCheckbox('Reorder', true);
  checkOrdering.position(width-675,8);  
  checkTithe = createCheckbox('Comingle', false);
  checkTithe.position(width-300,8);
  checkTithe.changed(addTithe);
  checkTax = createCheckbox('Tax', false);
  checkTax.position(width-375,8);
  checkTax.changed(addTax);
  checkSplitEffects = createCheckbox('Split Effects', false);
  checkSplitEffects.position(width-200,8);
  checkIDs = createCheckbox('IDs', false);
  checkIDs.position(width-920,8);
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
      tithe = transfer*.1
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
  //text(society.totalWealth, 20, 40);
  //text(frameCount, 20, 20)
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
    // can I change the framerate just for the loop?
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
    this.colorAlt = color(gradientAltStart[0], gradientAltStart[1]+gradientAltStep[1]*(index+1), gradientAltStart[2], 210); //gradient colors -- (check + - when changing colors) 
    this.receiver = random(society.citizens);
    this.applyEffects = true;
    this.dist = 0;
  }
  update() {

    /* 
    When split effects is checked, and this is an odd-numbered index (control group)
    don't apply any effects
    
   // WHAT'S UP HERE!
    if (checkSplitEffects.checked() && this.index % 2 != 0) {
      applyEffects = false;
    } else {
      applyEffects = true;
    }
    */
    //baseline calc
    //choose receiver
    this.receiver = random(society.citizens)
    if (this.receiver.index == this.index){
      this.receiver = random(society.citizens);
    }
     if (this.wealthBase >= transfer){
      this.wealthBase -= transfer;
      this.receiver.wealthBase += transfer;
    } else {
      this.wealthBase = this.wealthBase
    }  

    // plotted calc    
    // apply normal effects using same receiver as baseline
    if(!checkSplitEffects.checked()){
       if (this.wealth >= transfer){
            this.wealth -= transfer;
            this.receiver.wealth +=transfer;
            this.wealth += this.wealth*growthRate; // grow by a percentage of wealth (0 is interest is unchecked)
            this.wealth -= this.wealth*taxRate; //subtract tax (which is 0 if tax is unchecked)
            this.receiver.wealth -= tithe; // subtract tithe from transfer (which is 0 if tithe is unchecked)
            for (let i = 0; i < society.citizens.length; i++){ 
                society.citizens[i].wealth += tithe/count; //give everyone a piece of the tithe
                society.citizens[i].wealth += this.wealth*(taxRate/count); // give everyone a piece of the tax 
                }
            } else {
                this.wealth = this.wealth;
            };
        } else {
            /* this chooses a random even number
                this.receiver = random(society.citizens.filter(number => {
                return number % 2 === 0;
              });) 
              */ 
             // double check to make sure odd members are only giving to odd members
            // this.receiver = random(society.citizens)  
            /* if (this.receiver.index == this.index || (this.index %2)-(this.receiver.index %2) != 0){ //problem is here
            //if (this.receiver.index == this.index || this.index %2 == 0){ //problem is here
                this.receiver = random(society.citizens);
                } */

            // REWORKING THIS so transfer can go anywhere but tithe only goes to other cominglers    
            if (this.wealth >= transfer){
                this.wealth -= transfer;
                this.receiver.wealth +=transfer;
                if (this.index % 2 === 0) { // evens get the effects
                    this.wealth += this.wealth*growthRate; 
                    this.wealth -= this.wealth*taxRate; //subtract tax (which is 0 if tax is unchecked)
                    this.receiver.wealth -= tithe; // subtract tithe from transfer (which is 0 if tithe is unchecked)
                    for (let i = 0; i < society.citizens.length; i++){ // adjust this loop to only apply to evens
                        if (i % 2 == 0){
                            // ???
                        society.citizens[i].wealth += tithe/(count/2); //give evens a piece of the tithe
                        society.citizens[i].wealth += this.wealth*taxRate/(count/2); // give evens a piece of the tax
                        } 
                        }
                    };
             } else {
                this.wealth = this.wealth;
             }
      }
     
    society.totalWealth += this.wealth
    //this.displayCitizen();
    //society.totalWealth += this.wealthBase;
  }
  
  displayCitizen() {
    if (this.index % 2 == 0 && checkSplitEffects.checked()){ //alternate color schemes
      fill(this.colorAlt);
      stroke(this.colorAlt);
    } else {
      fill(this.color);
      stroke(this.color);
    } 
    strokeWeight(0);
    strokeCap(SQUARE);

    // reorder
    let orderSpot = 1; // for baseline (doesn't match naming scheme - sorry)
    let orderSpotAlt = 1; // alt version is for effects
    for (let i = 0; i < society.citizens.length; i++){
      if (this.wealthBase > society.citizens[i].wealthBase){
      orderSpot+=1
      }
      if (this.wealth > society.citizens[i].wealth){
        orderSpotAlt+=1
        }
    }
    if (checkBars.checked() && checkBubbles.checked()){
        scaleFactor = 60;
    } else {
        scaleFactor = 100; //change this to 100 to make it look better without bubbles
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
      if (this.wealth*baseRadiusScale >= 8) {
        dotSize = 8; //stop growing
        //add a reduction factor to all bubbles that's proportional to how much the real size is over 8
        let newRadiusScale = baseRadiusScale-(baseRadiusScale*(((this.wealth*baseRadiusScale - 8)/8)));
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
    /*draw a line to receiver?
    strokeWeight(1);
    stroke(255,255,0)
    line(this.vPosition.x,this.vPosition.y,this.receiver.vPosition.x, this.receiver.vPosition.y)
    stroke(0,255,255) 
    line(this.receiver.vPosition.x, this.receiver.vPosition.y, this.vPosition.x,this.vPosition.y)
    */
   
    /* trying to animate it. Doesn't quite work
    //https://p5js.org/reference/#/p5.Vector/lerp

    if (this.dist > 1 || this.dist < 0) {
        step *= -1;
      }
      this.dist  += step;
      let endpoint = p5.Vector.lerp(this.vPosition, this.receiver.vPosition, this.dist);
      strokeWeight(1);
      stroke(255,255,0)
      line(this.vPosition.x, this.vPosition.y, endpoint.x,endpoint.y)
     */ 


    textAlign(CENTER, CENTER);
    if (checkIDs.checked() == true){
    textSize(16);
    text(round(this.index+1, 3), this.vPosition.x, this.vPosition.y);
    textSize(11);
    text(round(this.receiver.index+1, 3), this.vPosition.x, this.vPosition.y+14)
    }
};
}


