let count = 20;
let nodes =[];
let cashIn = 0;
let cashOut = 0;
let income = 10
let fund, cntr, pen;
let fundsize = 1;
let maxIncome = 100;
let cycles = 0;
let newfundsize = 0
let timer = 1000;
let cue = timer;
let contribTimer

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
    //pen.rotate((angle/2))
    //nodes.push(new Node(i, cntr.x+(pen.x*1.2), cntr.y+(pen.y*1.2), income)); //put the nodes into an array
  }
  cue = millis()+timer
}

function draw() {
  background(255);
  for (let i = 0; i < nodes.length; i++) { //loop thru and show the nodes at the right size
  nodes[i].display()
    if (cycles/nodes.length < 7){                //check if we've looped 7 times
      nodes[i].contribute();                     //if not then contribute
      fund.growIt();                             //grow the fund dot
    } else {                                 //if we've looped thru 7 times
  nodes[i].payout();                        // run the payout
} 
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
    cue=(millis()+timer)/nodes.length
    circle (this.contribLoc.x, this.contribLoc.y, this.income*.3) // draw contribution dot
  }

  display() {
    strokeWeight(0.5);
    stroke(this.clr)
    line(this.x, this.y, cntr.x, cntr.y)
    strokeWeight(0);
    fill(this.clr);
    circle(this.x, this.y, this.rad) //draw member dot
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
      circle (this.payLoc.x, this.payLoc.y, (10)) // would be better if this was a real caclculation
      pop()
      if (fundsize > 0){
      fundsize -= this.incr; //shrink the fund dot
      } else {
        fundsize = 0
        newfundsize = 0
        cue=millis()+(timer)
      }
      cycles ++
    } else {
      this.incr = 1/frameRate();
      fundsize = 0;
      cycles = 1;
      this.income = this.newIncome;  //change the size of the dot?
      this.newIncome = this.newIncome + 10; //make the new income the same as the old except with payout
      this.contrib = 1; // no contribution this time
      // this all gets overwritten by the random call for newIncome. Can that updating go here again?
    }
  } 

};

class Fund {
  constructor(balance, icolor) {
    this.rad = 100; // size
    this.clr = '#007AFF' // color
    this.incr = 1/frameRate(); //1 frame
  }

  growIt(contrib){
    if (millis() > cue) {
    if (fundsize >= newfundsize){                 
      cue = millis()+(timer*2)
    } else {
      this.incr += 1/frameRate()
      fundsize += .1
   }
  }
}
  
  display() {
    strokeWeight(0)
    fill(this.clr)
    circle(cntr.x, cntr.y, fundsize)

  }
};



/*

-- always --
draw all member nodes
draw member lines
draw fund circle

--day 1 - 7--
change income
--transition from old income to new income
move contribution to center

--when contribution dots reach fund circle
increase size of fund circle

--when increase is done
start over

--payday--
move paydots to nodes
shrink fund circle

--when paydots reach the end
add pay to income
transition from old size to new size

*/