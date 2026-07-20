// JavaScript Document



var toss = Math.floor((Math.random() * 2) + 1);
var isHeads = true;
var flipCount = 0;
var flipNum = 3;
var jumpRot = (Math.random()*10)-5;
var flipStrength = (Math.random() * 1.5 + 1);
var jumpHeight = (50 * flipStrength + 20);
var jumpTime = flipStrength/2;
var flipTime =jumpTime/5;



// jump animation
var $box = $(".coinBox");
var jumpUp = new TweenMax($box, jumpTime, {y:(-jumpHeight), rotation:jumpRot, ease:Power1.easeOut}, paused="true");
var jumpDown = new TweenMax($box, jumpTime, {y:0, rotation:-jumpRot, ease: Bounce.easeOut}, paused="true");

var jumpTl = new TimelineMax();
jumpTl
	.add(jumpUp.play())
	.add(jumpDown.play())
    .to($box, .1, {rotation:0},"-=.2") ;
 
// Flipping animation

var $coinheads = $(".coinHeads");
var $coinedge = $(".coinEdge");
var $coinline = $(".coinLine");
var $cointails = $(".coinTails");
var flipperTl = new TimelineMax();
flipperTl
	.fromTo($coinheads, flipTime, {scaleY:1, y:0}, {scaleY:0, y:0}, "headEnd")
	.fromTo($coinedge, flipTime, {scaleY:1, y:0}, {scaleY:0, y:8}, "headEnd")
	.fromTo($coinline, flipTime, {height:0, y:0}, {height:8, y:0}, "headEnd")
	
	.to($coinedge, 0, {y:0}, "tailStart")
	.fromTo($cointails, flipTime, {opacity:1, scaleY:0, y:8}, {opacity:1, scaleY:1, y:0}, "tailStart")
	.to($coinedge, flipTime, {scaleY:1, y:0}, "tailStart")
	.to($coinline, flipTime, {height:0, y:0}, "tailStart")
	.call(checkTails)
	
	.to($cointails, flipTime, {scaleY:0}, "tailEnd")
	.fromTo($coinedge, flipTime, {scaleY:1, y:0}, {scaleY:0, y:8}, "tailEnd")
	.to($coinline, flipTime, {height:8, y:0}, "tailEnd")
	
	.fromTo($coinheads, flipTime, {scaleY:0, y:8}, {scaleY:1, y:0}, "headStart")
	.fromTo($coinedge, flipTime, {scaleY:0, y:0}, {scaleY:1, y:0}, "headStart")
	.to($coinline, flipTime, {height:0, y:0}, "headStart")
	.call(checkHeads)
	.repeat(-1)
	;
	
	
function callIt() {
	var startMarker;
	if (isHeads==true) {startMarker=0} else {startMarker="tailEnd"};
	flipStrength = (Math.random() * 1.5 + 1);
	var jumpHeight = (50 * flipStrength + 20);
	jumpTime = flipStrength/2;
  jumpRot = (Math.random()*40)-20;
  flipNum = Math.round(1 + flipStrength);
  flipSpeed = jumpTime / flipperTl.duration();
  flipSpeedRound = Math.max((Math.round(flipSpeed*100) / 100), 1.5);
  
	if (Math.random() < 0.5) {isHeads=true;} else {isHeads=false;};
    document.getElementById("demo").innerHTML = ('isHeads: ' + isHeads + ' startMarker: ' + startMarker + ' flipStrength: '+flipStrength +' flipHeight: ' + jumpHeight  +' flipSpeed: ' + flipSpeedRound +' flipNum: ' + flipNum +' jumpRot: ' + jumpRot); 
    
  flipperTl.timeScale(flipSpeedRound).play(startMarker);
  jumpUp.vars.css.rotation = jumpRot;
  jumpDown.vars.css.rotation = -jumpRot;
  jumpUp.vars.css.y = -jumpHeight;
  jumpTl.duration(jumpTime).seek(0).invalidate().restart();
};
 
function checkTails() {
	if (isHeads==false && flipCount >= flipNum) {flipperTl.stop(); flipCount = 0} else {flipCount++};
	document.getElementById("counter").innerHTML = ('flipCount: ' + flipCount);
}; 

function checkHeads() {
	if (isHeads==true && flipCount >= flipNum) {flipperTl.stop(); flipCount = 0} else {flipCount++};
	document.getElementById("counter").innerHTML = ('flipCount: ' + flipCount);
};


