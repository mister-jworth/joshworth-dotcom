let faceapi;
let video;
let detections;
let rightEyeX;
let rightEyeY;
let leftEyeX;
let leftEyeY;
let mover = 0;
let zapLerpA = 0;
let zapLerpB = 0.15;
let r = 3;
let pew;

// by default all options are set to true
const detection_options = {
    withLandmarks: true,
    withDescriptors: false,
}

function preload(){
  pew = loadSound('/dev/lazereyezer/lazer.mp3');
}

function setup() {
    
    pew.playMode('sustain');
    createCanvas(windowWidth, windowHeight);
    // load up your video
    video = createCapture(VIDEO);
    var vidWidth = windowWidth
    var vidHeight = vidWidth * 0.67
    windowResized();
    video.size(vidWidth, vidHeight);
    video.hide(); // Hide the video element, and just show the canvas
    faceapi = ml5.faceApi(video, detection_options, modelReady)
    cursor(CROSS);
}

function windowResized() {
  var vidWidth = windowWidth
  var vidHeight = vidWidth * 0.67
  video.size(vidWidth, vidHeight);
  resizeCanvas(vidWidth, vidHeight);
}

function modelReady() {
    console.log('ready!')
    console.log(faceapi)
    faceapi.detect(gotResults)
}

function gotResults(err, result) {
    if (err) {
        console.log(err)
        return
    }
    // console.log(result)
    detections = result;

    background(255);
    image(video, 0,0, width, height)
    if (detections) {
        if (detections.length > 0) {
            trackEyes(detections)
            draw()
        }
    }
    faceapi.detect(gotResults)
}

function trackEyes(detections){
  for(let i = 0; i < detections.length; i++){
    const leftEye = detections[i].parts.leftEye;
    const rightEye = detections[i].parts.rightEye;
     rightEyeX = rightEye[1]._x+10;
     rightEyeY = rightEye[1]._y+10;
     leftEyeX = leftEye[1]._x+10;
     leftEyeY = leftEye[1]._y+10;
  } 
}

function draw(){    
       if (mouseIsPressed) {
        zap();
        }
    }  
  
function zap(){
  pewZap();
  zapLerpA += .05;
  zapLerpB += .1;
  r += 1;
  if (zapLerpB >= 1) {
    zapLerpB = 1;
    circle(mouseX,mouseY,r);
    
  }
  if (zapLerpA >= 1) {
    zapLerpA = 0;
    zapLerpB = 0;
    r = 6;
  }

  colorMode(RGB)
  let from = color(255, 100, 30);
  let to = color(255, 0, 180);
  let interA = lerpColor(from, to, zapLerpA);
  rightStartX = lerp(rightEyeX,mouseX,zapLerpA)
  rightStartY = lerp(rightEyeY,mouseY,zapLerpA)
  leftStartX = lerp(leftEyeX,mouseX,zapLerpA)
  leftStartY = lerp(leftEyeY,mouseY,zapLerpA)
  rightEndX = lerp(rightEyeX,mouseX,zapLerpB)
  rightEndY = lerp(rightEyeY,mouseY,zapLerpB)
  leftEndX = lerp(leftEyeX,mouseX,zapLerpB)
  leftEndY = lerp(leftEyeY,mouseY,zapLerpB) 
  noFill();
  strokeWeight(6);
  stroke(interA); 
  line(rightStartX,rightStartY,rightEndX,rightEndY)
  line(leftStartX,leftStartY,leftEndX,leftEndY)
  strokeWeight(6)
  noFill();
  circle(mouseX,mouseY, r)
  circle(mouseX,mouseY, r*2)
  circle(mouseX,mouseY, r*3)
  strokeWeight(0)
  fill (interA)
  circle(rightEyeX,rightEyeY, r*.75)
  circle(leftEyeX,leftEyeY, r*.75)
  noFill();
}

function pewZap() {
if (pew.isPlaying()) {
  // .isPlaying() returns a boolean
  return
} else {
  pew.play();
}
}