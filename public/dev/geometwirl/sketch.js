let W, H, geom;
let angle = 0;
let speed = 10;
let siz = 200 //shape size
let gap = 30 // space between shapes

function setup() {
  W = windowWidth, H=windowHeight
  angleMode(DEGREES);
  rectMode(CENTER);
  createCanvas(W, H);
  geom = new Geom()
}

function draw() {
  background(0);
  translate(W/2, H/2)
  fill(0,0);
  stroke(255,180);
  strokeWeight(2);
  //-----
  //TOP ROW
  //shape left
  push();
  translate(-siz-gap,-siz-gap)
  for (let i = 0; i < 4; i++) {
    rotate(90);
    geom.displayTriangle(0, 0, siz*.8, sin(millis() / speed)*(siz*.8));
  }
  pop();
  //shape center
  push();
  translate(0,-siz-gap)
  for (let i = 0; i < 6; i++) {
    rotate(60);
    geom.displayTriangle(0, 0, siz*.8, sin(millis() / speed)*(siz*.8));
  }
  pop();
    //shape right
    push();
    translate(siz+gap,-siz-gap)
    for (let i = 0; i < 20; i++) {
      rotate(18);
      geom.displayTriangle(0, 0, siz*.8, sin(millis() / speed)*(siz*.8));
    }
    pop();
  //-----  
  //MIDDLE ROW
  //shape 1ft
  push();
  translate(-siz-gap,0)
  for (let i = 0; i < 6; i++) {
    rotate(60);
    geom.displayEllipse(0, 0, siz, sin(millis() / speed)*siz);
  }
  pop();
    //shape ctr
    push();
    translate(0,0)
    for (let i = 0; i < 10; i++) {
      rotate(36);
      geom.displayEllipse(0, 0, siz, sin(millis() / speed)*siz);
    }
    pop();
    //shape rt
    push();
    translate(siz+gap,0)
    for (let i = 0; i < 20; i++) {
      rotate(18);
      geom.displayEllipse(0, 0, siz, sin(millis() / speed)*siz);
    }
    pop();
  //-----
  //BOTTOM ROW
  //shape 1ft
  push();
  translate(-siz-gap,siz+gap)
  for (let i = 0; i < 6; i++) {
    rotate(60);
    geom.displayRect(0, 0, siz, sin(millis() / speed)*siz);
  }
  pop();
    //shape ctr
    push();
    translate(0,siz+gap)
    for (let i = 0; i < 10; i++) {
      rotate(36);
      geom.displayRect(0, 0, siz, sin(millis() / speed)*siz);
    }
    pop();
    //shape rt
    push();
    translate(siz+gap,siz+gap)
    for (let i = 0; i < 20; i++) {
      rotate(18);
      geom.displayRect(0, 0, siz, sin(millis() / speed)*siz);
    }
    pop();
}

class Geom {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = W/4;
    this.h = H/5;
    this.angle = 0;
  }
  displayEllipse(gx, gy, gw, gh) {
    ellipse(gx,gy,gw,gh);    
  }
  displayTriangle(gx, gy, gw, gh) {
    triangle(gx-(gw/2),gy+(gh/2), gx,gy-(gh/2), gx+(gw/2),gy+(gh/2)); 
  }
  displayRect(gx, gy, gw, gh) {
    rect(gx,gy,gw*.8,gh*.8,4);    
  }

  //make a method for different types of motion? parameters for angles & width and one that gets replaced by sin(millis)
};

