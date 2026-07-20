let count = 20;  //number of members
let nodes =[];
let income = 10 //starting income
let maxIncome = 100;  
let fund, cntr, pen;
let fundsize = 1;
let newfundsize = 0
let cycles = 0;
let cue = 1;
let payamt;
let clrA = '#0AC83B'; // green
let clrB= '#007AFF'; // blue
let stat = '0';
let hovering = false;
//for stats
let newWeek = false;
let week = 1;
let days = 1;
let contributors = 0;
let receivers = 0;
let getter = true;
let currentPayout = 0;


function setup() {
  frameRate(60)
  angleMode(DEGREES)
  createCanvas(windowWidth, windowHeight);
  cntr = createVector(width/2, height/2); //center reference
  pen = createVector(220,0); // distance from center
  let angle=360/count
  for (let i = 0; i < count; i++) {
    pen.rotate(angle)
    nodes.push(new Node(i, cntr.x+pen.x, cntr.y+pen.y, income)); //put the nodes into an array
  }
}

function draw() {
  background(255);
  if (cue==1){ 
    for (let i = 0; i < count; i++) { 
      nodes[i].changeIncome();
    }}
  if (cue==2){ 
    for (let i = 0; i < count; i++) { 
      nodes[i].contribute();
    }} 
  if (cue==3){ 
    for (let i = 0; i < count; i++) { 
      nodes[i].growFund();
    }}     
  if (cue==4){ 
    for (let i = 0; i < count; i++) { 
      nodes[i].payout();
    }} 
  if (cue==5){ 
    for (let i = 0; i < count; i++) { 
      nodes[i].addPayout();
    }} 
for (let i = 0; i < count; i++) { 
  nodes[i].display();
    }
if (hovering == false) {
    cursor(ARROW);
 } else {
    cursor(HAND);
 }
 getStats();
  }

function mouseMoved(){
    for (let i = 0; i < count; i++) {
    if (mouseX < nodes[i].x + 20 && mouseX > nodes[i].x - 20 && mouseY < nodes[i].y + 20 && mouseY > nodes[i].y - 20 ){
      hovering = true;
      nodes[i].updateStats()
      return hovering
    } else {
      hovering = false
    }
  }
  }
  
class Node {
  constructor(i, iX, iY, iIncome) {
    this.id = i;  // node count order
    this.x = iX; // x position
    this.y = iY;  // y position
    this.income = iIncome;
    this.newIncome = this.income; 
    this.contrib = this.income*.07
    this.rad = iIncome; // size
    this.clr = clrA
    this.incr = 1/frameRate(); //1 frame
    this.start = createVector(this.x,this.y);
    this.end = createVector(cntr.x,cntr.y);
    this.contribLoc = createVector(this.x,this.y);
    this.payLoc = createVector(cntr.x,cntr.y);
    this.payAmt = 0;
    this.startCash = 0;
    this.totalContrib = 0;
    this.endCash = 0;
    this.paySize = 0;
  }

  changeIncome(){
    if (newWeek == true){
      week ++;
      newWeek = false;
    }
    if (this.incr >= 1){
      this.incr = 1/frameRate();
      this.income = this.newIncome;
      this.newIncome = random(1,40); //get new income
      cycles++
      days = cycles/count
      cue=2;
    } else {
      this.clr = clrA
      this.incr += 1/frameRate() //matches frame rate
      this.rad = lerp(this.income, this.newIncome, this.incr) // transition dotsize from old to new income
    }
  }

  contribute(){
    if (this.incr >= 1){
      this.incr = 1/frameRate();
      newfundsize += this.contrib; //grow the fund dot
      this.totalContrib += this.contrib;
      cue=3;
    } else {
    this.incr += 1/frameRate()
    this.contribLoc = p5.Vector.lerp(this.start, this.end, this.incr) // transition contribudot
    this.contrib = this.newIncome*.07; // calculate contribution
    this.startCash = this.newIncome - this.contrib // impact of the day
    this.clr = clrA
    fill(this.clr)
    circle (this.contribLoc.x, this.contribLoc.y, this.income*.3) // draw contribution dot
    }
  }

  growFund(){
    if (fundsize < newfundsize){
      fundsize += .2;
      this.payAmt = fundsize;    
    } else {
      if (cycles/count != 3){
        cue=1
      } else { 
        //newfundsize = 10;
        fundsize = newfundsize;
        cue = 4; 
      }
    }
  }
      
  payout(){
    if (this.incr >= 1){
      this.incr = 1/frameRate();
      fundsize = 0;
      newfundsize = 1;
      cycles = 0;
      cue = 5;
    } else {
      this.incr += 1/frameRate()
      this.payLoc = p5.Vector.lerp(this.end, this.start, this.incr) // transition payout dot
      push()
      fill(clrB)
      this.paySize = this.payAmt/count
      circle (this.payLoc.x, this.payLoc.y, this.paySize) 
      pop()
      if (fundsize <= 0) {
        fundsize = 0;
        contributors = 0;
        receivers = 0;
      } else {
        fundsize -= .2
      }
    }
}

addPayout(){
  if (this.incr >= 1){
    //updateStats();
    newWeek = true;
    this.incr = 1/frameRate();
    this.income = this.newIncome;
    this.newIncome = random(1,40); //get new income
    this.totalContrib = 0;
    if (this.getter == true){
      receivers++
      this.getter = false;
    } else{
      contributors++
    }
    currentPayout = this.payAmt.toFixed(2)
    getStats();
    cue=1;
  } else {
    this.clr = clrB
    this.endCash = this.income+(this.payAmt/count); //what they ended up with for the day
    this.newIncome = this.endCash;
    this.incr += 1/frameRate() 
   if (this.paySize >= this.totalContrib){
      this.clr = clrB;
      this.getter = true;
    } else {
      this.clr = clrA;
      this.getter = false;
    }

    this.rad = lerp(this.income, this.endCash, this.incr) // transition dotsize from old to new income
  }
}

updateStats() {
  //map pixels to money using map()
  /*//node
  this.totalContrib.toFixed(2)
  this.impact
  this.lifetimeContrib
  this.lifetimeImpact
  */
  stat = this.totalContrib;
  /* //global
  payoutThisWeek = this.payAmt/count
  contributionsThisWeek
  lifetimePayout
  lifetimeContrib
  netGivers
  netGetters
  */
  let totalContrib = this.totalContrib.toFixed(2)

}

  display() {
    strokeWeight(0.5);
    stroke(clrA)
    line(this.x, this.y, cntr.x, cntr.y)
    strokeWeight(0);
    fill(this.clr);
    circle(this.x, this.y, this.rad) //draw member dot
    push()
    fill(10,200,59,100-(100*this.incr)) 
    strokeWeight(1)
    stroke(0,150,39,255-(255*this.incr)) 
    circle(this.x, this.y, this.income) //draw / fade old outline
    pop()
    strokeWeight(0)
    fill(clrB)
    circle(cntr.x, cntr.y, fundsize) //fund dot
  }
}; // end of node object




function getStats() {
  text(`Week: ${week} Day: ${days}`, 30,30);
  text(`Last Payout: ${currentPayout}`, 30,60);
  text(`Contributors: ${contributors} Receivers: ${receivers}`, 30,76);
}  


