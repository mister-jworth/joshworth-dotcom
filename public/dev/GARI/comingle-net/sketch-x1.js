let count = 20;
let nodes =[];
let cashIn = 0;
let cashOut = 0;
let income = 10
let fund, cntr, pen;
let fundsize = 1;
let maxIncome = 100;
let cycles = 0;
let dayTimer = 0;
let newfundsize = 0
let timer = 3000;
let cue = timer;

function setup() {
  frameRate(60)
  angleMode(DEGREES)
  createCanvas(windowWidth, windowHeight);
  cntr = createVector(width/2, height/2); //center reference
  pen = createVector(220,0); // distance from center
  fund = new Fund(); // comingle fund dot
  let angle=360/count
  for (let i = 0; i < count; i++) {
    pen.rotate(angle)
    nodes.push(new Node(i, cntr.x+pen.x, cntr.y+pen.y, income)); //put the nodes into an array
  }
}

function draw() {
  background(255);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].display()
    if(millis() > cue){
      if (cycles/nodes.length < 7){
       nodes[i].contribute();
         if (fundsize < newfundsize){
           fundsize += .1
         } else {
           newfundsize = fundsize
        }
     } else {
    nodes[i].payout();
    cue = millis()+timer
  } }
  }
  fund.display(); // draw the fund dot
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
    this.clr = '#0AC83B' // color
    this.incr = 1/frameRate(); //1 frame
    this.start = createVector(this.x,this.y);
    this.end = createVector(cntr.x,cntr.y);
    this.contribLoc = createVector(this.x,this.y);
    this.payLoc = createVector(cntr.x,cntr.y);
  }

  contribute(){
    if (this.incr <= 1){
      this.clr = "#0AC83B"
      this.incr += 1/frameRate() //matches frame rate
      this.rad = lerp(this.income, this.newIncome, this.incr) // transition dotsize from old to new income
      this.contribLoc = p5.Vector.lerp(this.start, this.end, this.incr) // transition contribudot
    } else {
      this.incr = 1/frameRate();
      this.income = this.newIncome;
      this.newIncome = random(1,40); //get new income
      this.contrib = this.newIncome*.07; // calculate contribution
      newfundsize = newfundsize+this.contrib; //grow the fund dot
      cycles ++
    };
    circle (this.contribLoc.x, this.contribLoc.y, this.income*.3) // draw contribution dot
  }

  display() {
    strokeWeight(0.5);
    stroke(this.clr)
    line(this.x, this.y, cntr.x, cntr.y)
    strokeWeight(0);
    fill(this.clr);
    circle(this.x, this.y, this.rad) //draw dot
    push()
    fill(10,200,59,120-(frameRate()*this.incr)*2) 
    strokeWeight(1)
    stroke(0,150,39,255-(frameRate()*this.incr)*4) 
    circle(this.x, this.y, this.income) //draw / fade old outline
    pop()
  }

  payout(){
    if (this.incr <= 1){
      this.incr += 1/frameRate() //matches frame rate
      this.payLoc = p5.Vector.lerp(this.end, this.start, this.incr) // transition payout dot
      push()
      fill('#007AFF')
      circle (this.payLoc.x, this.payLoc.y, (10))
      pop()
      if (fundsize > 1){
      fundsize -= this.incr; //shrink the fund dot
      } else {
        fundsize = 1
        newfundsize = 1
      }
      cycles ++
    } else {
      this.incr = 1/frameRate();
      fundsize=1
      cycles = 1
    }
  } 

};

class Fund {
  constructor(balance, icolor) {
    this.rad = 100; // size
    this.clr = '#007AFF' // color
  }

  display() {
    strokeWeight(0)
    fill(this.clr)
    circle(cntr.x, cntr.y, fundsize)

  }
};



