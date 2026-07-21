let x=0;
let y=0;
let vmarker, markerpos;
let abspos
let movex=0;
let movey=0;
let crsr;
let steerDir = 'ccw';


let dir = {
  "up": {
    xmove : 0,
    ymove : -2,
    cwAngle : 180,
    ccAngle : 360,
    crsrCW: "/dev/stripeytime/cursor-cw-r.png",
    crsrCCW: "/dev/stripeytime/cursor-ccw-l.png",
    steer: "v"
  },
  "down": {
    xmove : 0,
    ymove : +2,
    cwAngle : 0,
    ccAngle : 180,
    crsrCW: "/dev/stripeytime/cursor-cw-l.png",
    crsrCCW: "/dev/stripeytime/cursor-ccw-r.png",
    steer: "v"
  },
  "left": {
    xmove : -3,
    ymove : 0,
    cwAngle : 90,
    ccAngle : 270,
    crsrCW: "/dev/stripeytime/cursor-cw-u.png",
    crsrCCW: "/dev/stripeytime/cursor-ccw-d.png",
    steer: "h"
  },
  "right": {
    xmove : 3,
    ymove : 0,
    cwAngle : 270,
    ccAngle : 90,
    crsrCW: "/dev/stripeytime/cursor-cw-d.png",
    crsrCCW: "/dev/stripeytime/cursor-ccw-u.png",
    steer: "h"
  }
} 

let schemes = [
  'randobright',
  'monobright',
  'monodull', 
  'monofade',
  'orderly',
  'reorderly',
  'neon',
  'trainbow',
  'arizona',
  'basement',
  'raz',
  'sorbet',
  'den'
]

let bgcolors = [
  '#000000','#1C1B1B', '#282E31', '#3C3836', '#F2F1E5', '#F5F3D8','#FCFAF5','#FFFFFE', '#F1EADE','#DFD8D1','#E7E2D6'
]

let palneon = [
  '#FF0099','#FF8A00','#DBFF00','#00E0FF',"#AD00FF"
]

let trainbow = [
  '#F8510A','#FFC804','#A8D42C','#0DBBC6',"#3F794F"
]

let arizona = [
  '#5E391F','#7B4618','#ED4B12','#EE681B',"#ED8E2E"
]

let basement = [
  '#DFB621','#BC9538','#887825','#D68118',"#E6D8A7"
]

let raz = [
  '#201C3F','#43879A','#B73052','#BD5A73',"#E4D8C7"
]

let sorbet = [
  '#DD577D','#E9733F','#DCAF49','#CECAB8',"#57484C"
]

let den = [
  '#486267','#8D4428','#B65F36','#B49B42',"#C7C2A9"
]

let stripes =[]; // the stripe array 
let stripecount, thickness, baseRadius
let direction = dir.right

//start the show!

function setup() {
  createCanvas(windowWidth, windowHeight);
  addScreenPositionFunction();
  angleMode(DEGREES)
  doNew();
  abspos = createVector(0,0);
}

function draw(){

  translate(0, height/2);
  translate(movex,movey);
  if (movex < width+300 && movex > 0-350 && movey < height && movey > 0-height){
    movex = movex + direction.xmove
    movey = movey + direction.ymove
   steerIt(abspos.x,abspos.y)
  } else {
    x=0
    y=0
    movex = 0
    movey = 0
    steer = "h"
    translate(movex,movey);
    doNew()
    direction = dir.right
    return
  }
  for (let i = 0; i < stripes.length; i++) {
    stripes[i].display();
  }
}

function mousePressed() {
  if (steerDir =='ccw'){
    for (let i = 0; i < stripes.length; i++) {
      stripes[i].curlcounter(baseRadius, direction.ccAngle-90, direction.ccAngle)
    }
  } else {
    for (let i = 0; i < stripes.length; i++) {
      stripes[i].curlclockwise(baseRadius, direction.cwAngle, direction.cwAngle+90)
    }
  } 
}


function mouseReleased() {
  if (mouseY < height/2){
    //cursor(direction.crsrCCW)
    } else {
    //cursor(direction.crsrCW)
     }; 
}

class Stripe {
  constructor(count, ixp, iyp, ithk, icolor) {
    this.num = count // stripe count order
    this.xpos = ixp; // x position
    this.ypos = iyp; // y position
    this.thk = ithk; // thickness
    this.clr = icolor // color
  }

  curlclockwise(Radius, angleStart, angleEnd){ //activate this during mouseaction
    push();
    strokeCap(SQUARE);
    strokeWeight(this.thk); 
    stroke(this.clr); //
    noFill();
    let offset = this.thk/2
    let rad = Radius - (this.thk * (this.num));
    //turn down
    if (angleEnd==0 || angleEnd==360){
        arc(this.xpos + offset, this.ypos+rad, rad*2, rad*2, angleStart, angleEnd)
      this.xpos = this.xpos + rad + offset - 3;  
      this.ypos = this.ypos + rad + offset;
      if (this.num == stripes.length-1){
        direction = dir.down;
      } else {
        direction = direction
      };
      } else {
    //turn left
    if (angleEnd==90){
      arc(this.xpos-rad, this.ypos + offset, rad*2, rad*2, angleStart, angleEnd);
      this.xpos = this.xpos - rad - offset; 
      this.ypos = this.ypos + rad + offset - 2;
      if (this.num == stripes.length-1){
        direction = dir.left;
      } else {
        direction = direction
      };
      } else {
    //turn up
    if (angleEnd==180){
      arc(this.xpos - offset, this.ypos-rad, rad*2, rad*2, angleStart, angleEnd);
      this.xpos = this.xpos - rad - offset + 2.5; 
      this.ypos = this.ypos - rad - offset;
      if (this.num == stripes.length-1){
        direction = dir.up;
      } else {
        direction = direction
      };
      } else {
      //turn right  
      if (angleEnd==270){
        arc(this.xpos+rad, this.ypos - offset, rad*2, rad*2, angleStart, angleEnd);
        this.xpos = this.xpos + rad + offset; 
        this.ypos = this.ypos - rad - offset + 2;
        if (this.num == stripes.length-1){
          direction = dir.right;
          } else {
          direction = direction
        };   
        }
      }
      }}
      pop();
    }

      // start and end angles are switched since arcs only draw clockwise
      curlcounter(Radius, angleStart, angleEnd){ 
        push();
        strokeCap(SQUARE) 
        strokeWeight(this.thk); 
        stroke(this.clr);
        noFill();
        let offset = this.thk/2
        let rad = (Radius-(stripes.length*this.thk)) + (this.thk * (this.num+1));
        //turn up ccw
        if (angleStart==0 || angleStart==-90){
          arc(this.xpos+offset, this.ypos-rad, rad*2, rad*2, angleStart, angleEnd);
          this.xpos = this.xpos+rad + offset - 2.5;  
          this.ypos = this.ypos-rad-offset; 
          if (this.num == stripes.length-1){
            direction = dir.up;
              } else {
            direction = direction
          };
          } else {
        //turn right ccw
        if (angleStart==90){
          arc(this.xpos+rad, this.ypos + offset, rad*2, rad*2, angleStart, angleEnd);
          this.xpos = this.xpos + rad + offset; 
          this.ypos = this.ypos + rad + offset - 2;
          if (this.num == stripes.length-1){
            direction = dir.right;
              } else {
            direction = direction
          };
          } else {
        //turn down ccw
        if (angleStart==180){
          arc(this.xpos-offset, this.ypos+rad, rad*2, rad*2, angleStart, angleEnd);
          this.xpos = this.xpos - rad - offset + 3; 
          this.ypos = this.ypos + rad + offset - .5;
          if (this.num == stripes.length-1){
            direction = dir.down;
              } else {
            direction = direction
          };
          } else {
          //turn left ccw 
          if (angleStart==270){
            arc(this.xpos-rad, this.ypos-offset, rad*2, rad*2, angleStart, angleEnd);
            this.xpos = this.xpos - rad - offset +.5; 
            this.ypos = this.ypos - rad - offset + 2;
            if (this.num == stripes.length-1){
              direction = dir.left;
              } else {
              direction = direction
            };    
            }
          }
          }}
        pop()
      }

  display() {
    strokeWeight(.25); //eliminates edge
    stroke(this.clr); //
    fill(this.clr);
    rectMode(CENTER)
    rect(this.xpos,this.ypos,this.thk-.25,this.thk-.25)
    abspos = screenPosition(this.xpos, this.ypos) 
    push();
    stroke(120); //
    fill(120);
    pop(); 
  }
};

function doNew() {
  for (let i = 0; i < 6; i++) {
    stripes.pop();
  }
  background(random(bgcolors));
  stripecount = random(2,5)
  thickness = random(15,40)
  baseRadius = (stripecount*thickness)+thickness;
  colorMode(HSB, 100);
  let h = random(100);
  let c;
  let scheme = random(schemes);
  for (let i = 0; i <= stripecount; i++) {
    if (scheme == "randobright"){
    c = color(random(100), random(90,100), random(20,100));
    } else if (scheme =="monobright"){
        c = color(h, (100/stripecount)*(i), (100/stripecount)*(i))
      } else if (scheme =="monodull"){
          c = color(h, random(30,70), random(20,70))
        } else if (scheme =="monofade"){
            c = color(h, 100, 100/(i+1))
          } else if (scheme =="orderly"){
            c = color(h/(i+1), 100, random(90,100))
            } else if (scheme =="reorderly"){
              c = color(h-(i*(4)), random(80,100), random(70,100))
            } else if (scheme =="neon"){
              c = color(palneon[i])
            } else if (scheme =="trainbow"){
              c = color(trainbow[i])
              } else if (scheme =="arizona"){
              c = color(arizona[i])
            } else if (scheme =="arizona"){
              c = color(arizona[i])
            } else if (scheme =="basement"){
              c = color(basement[i])
            } else if (scheme =="raz"){
              c = color(raz[i])
            } else if (scheme =="sorbet"){
              c = color(sorbet[i])
            } else if (scheme =="den"){
              c = color(raz[i])
            }            
            stripes.push(new Stripe(i, x, y+thickness*i, thickness, c));
  }
}

function steerIt(xpos,ypos){
  if (
     (direction.steer=='v' && direction==dir.up && mouseX > xpos)
  || (direction.steer=='h' && direction==dir.right && mouseY > ypos)
  || (direction.steer=='v' && direction==dir.down && mouseX < xpos)
  || (direction.steer=='h' && direction==dir.left && mouseY < ypos)
  )
  {
  steerDir="cw";
  cursor(direction.crsrCW)

} else {
  steerDir="ccw"
  cursor(direction.crsrCCW)
}
}
 
