// JavaScript Document

/* 
Write random points within a range, then animate to them
*/
function randShift(min, max) {
    return Math.floor (Math.random() * (max - min) + min);
}

// an object prototype for making an octagon
function octo (pt1x, pt1y, pt2x, pt2y, pt3x, pt3y, pt4x, pt4y, pt5x, pt5y, pt6x, pt6y, pt7x, pt7y, pt8x, pt8y, points) {
  this.pt1x = pt1x+randShift(30,-30);
  this.pt1y = pt1y+randShift(30,-30);
  this.pt2x = pt2x+randShift(30,-30);
  this.pt2y = pt2y+randShift(30,-30);
  this.pt3x = pt3x+randShift(30,-30);
  this.pt3y = pt3y+randShift(30,-30);
  this.pt4x = pt4x+randShift(30,-30);
  this.pt4y = pt4y+randShift(30,-30);
  this.pt5x = pt5x+randShift(30,-30);
  this.pt5y = pt5y+randShift(30,-30);
  this.pt6x = pt6x+randShift(30,-30);
  this.pt6y = pt6y+randShift(30,-30);
  this.pt7x = pt7x+randShift(30,-30);
  this.pt7y = pt7y+randShift(30,-30);
  this.pt8x = pt8x+randShift(30,-30);
  this.pt8y = pt8y+randShift(30,-30);
  this.centerX = ( this.pt1x+this.pt2x+this.pt3x+this.pt4x+this.pt5x+this.pt6x+this.pt7x+this.pt8x) / 8;
    this.centerY = ( this.pt1y+this.pt2y+this.pt3y+this.pt4y+this.pt5y+this.pt6y+this.pt7y+this.pt8y) / 8;
  this.points = function () {
    var points = 
        this.pt1x + "," + this.pt1y + " " +
        this.pt2x + "," + this.pt2y + " " +
        this.pt3x + "," + this.pt3y + " " +
        this.pt4x + "," + this.pt4y + " " +
        this.pt5x + "," + this.pt5y + " " +
        this.pt6x + "," + this.pt6y + " " +
        this.pt7x + "," + this.pt7y + " " +
        this.pt8x + "," + this.pt8y
   return points;
  }
};

var $clipper = $("#clipper");
var $octagon = $("#octagon");
var $flower = $("#flower");

// correct centerpoint for scaling - MATH NOT WORKINg

/*
function getAspectFactor() {
	 aspectFactor = $(window).height() / $(window).width();
	 if (aspectFactor < 1) {
	 widthShift = 0
	 // this works because image svg is set to xMaxYMax slice	 
	 heightShift = (($(window).width() / 737 )* 545) - $(window).height();
	 } else {
	 widthShift = (($(window).height() / 545 )* 737) - $(window).width();
	 heightShift = 0;
	 }
}; */

var tl = new TimelineMax();

$(window).click(function(e) {
        var clickX = e.pageX;
        var clickY = e.pageY;
        zapIt(clickX, clickY)
    });    

//where all the action is

function zapIt(clickx, clicky) {
  tl.clear();
  var octoNew= new octo (130,27,172,70,172,130,130,172,70,172,27,130,27,70,70,27);
  var warpX= (Math.random() * (1.5 - .7) + .7);
  var warpY= (Math.random() * (1.5 - .7) + .7);
  // correct centerpoint for SVG scaling - probably a simpler way
  var widthShift = 0;
  var heightShift = 0;
  var octoCenterX;
  var octoCenterY;
  var aspectFactor = $(window).height() / $(window).width();
  if (aspectFactor < 1) {
	 widthShift = 0
	 // this works because image svg is set to xMaxYMax slice and we know the original size of the image	 
	 heightShift = (($(window).width() / 737 )* 545) - $(window).height();
	 octoCenterX = (clickx - octoNew.centerX) * aspectFactor;
	 octoCenterY = (clicky - octoNew.centerY + heightShift) * aspectFactor;
	 } else {
	 widthShift = (($(window).height() / 545 )* 737) - $(window).width();
	 octoCenterX = (clickx - octoNew.centerX + widthShift) / aspectFactor;
	 octoCenterY = (clicky - octoNew.centerY) / aspectFactor;
	 }
   tl.to($octagon, 1, {attr: {points:octoNew.points()},scaleX:warpX,scaleY:warpY, x:octoCenterX, y:octoCenterY, transformOrigin: "50%, 50%", ease:Elastic.easeOut});
console.log("aspect: " + aspect + "width: " + $(window).width() + "height: " + $(window).height());
}
      