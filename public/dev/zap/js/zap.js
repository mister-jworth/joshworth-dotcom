// JavaScript Document

var $bgImg = $("#bgimage");
var $octagon1 = $("#octagon1");
var $octagon2 = $("#octagon2");
var $octagon3 = $("#octagon3");
var bgViz = "1";
var octoPictures = [
	"img/00.jpg",
	"img/02.jpg",
	"img/03.jpg",
	"img/04.jpg",
	"img/05.jpg",
	"img/06.jpg",
	"img/07.jpg",
	"img/08.jpg",
	"img/09.jpg",
];
var octoPicture;
var $octoImg1 = $("#octoImg1");
var $octoImg2 = $("#octoImg2");
var $octoImg3 = $("#octoImg3");
var tl = new TimelineMax();

/* 
Write random points within a range, then animate to them
*/
function randShift(min, max) {
    return Math.floor (Math.random() * (max - min) + min);
}



// an object prototype for making an octagon
function octo (pt1x, pt1y, pt2x, pt2y, pt3x, pt3y, pt4x, pt4y, pt5x, pt5y, pt6x, pt6y, pt7x, pt7y, pt8x, pt8y, points) {
  this.pt1xA = pt1x+randShift(60,-60);
  this.pt1yA = pt1y+randShift(60,-60);
  this.pt2xA = pt2x+randShift(60,-60);
  this.pt2yA = pt2y+randShift(60,-60);
  this.pt3xA = pt3x+randShift(60,-60);
  this.pt3yA = pt3y+randShift(60,-60);
  this.pt4xA = pt4x+randShift(60,-60);
  this.pt4yA = pt4y+randShift(60,-60);
  this.pt5xA = pt5x+randShift(60,-60);
  this.pt5yA = pt5y+randShift(60,-60);
  this.pt6xA = pt6x+randShift(60,-60);
  this.pt6yA = pt6y+randShift(60,-60);
  this.pt7xA = pt7x+randShift(60,-60);
  this.pt7yA = pt7y+randShift(60,-60);
  this.pt8xA = pt8x+randShift(60,-60);
  this.pt8yA = pt8y+randShift(60,-60);
  
  this.pt1xB = this.pt1xA+randShift(30,-30);
  this.pt1yB = this.pt1yA+randShift(30,-30);
  this.pt2xB = this.pt2xA+randShift(30,-30);
  this.pt2yB = this.pt2yA+randShift(30,-30);
  this.pt3xB = this.pt3xA+randShift(30,-30);
  this.pt3yB = this.pt3yA+randShift(30,-30);
  this.pt4xB = this.pt4xA+randShift(30,-30);
  this.pt4yB = this.pt4yA+randShift(30,-30);
  this.pt5xB = this.pt5xA+randShift(30,-30);
  this.pt5yB = this.pt5yA+randShift(30,-30);
  this.pt6xB = this.pt6xA+randShift(30,-30);
  this.pt6yB = this.pt6yA+randShift(30,-30);
  this.pt7xB = this.pt7xA+randShift(30,-30);
  this.pt7yB = this.pt7yA+randShift(30,-30);
  this.pt8xB = this.pt8xA+randShift(30,-30);
  this.pt8yB = this.pt8yA+randShift(30,-30);
  this.centerX = ( this.pt1xA+this.pt2xA+this.pt3xA+this.pt4xA+this.pt5xA+this.pt6xA+this.pt7xA+this.pt8xA) / 8;
    this.centerY = ( this.pt1yA+this.pt2yA+this.pt3yA+this.pt4yA+this.pt5yA+this.pt6yA+this.pt7yA+this.pt8yA) / 8;
  this.points = function () {
    var points = 
        this.pt1xA + "," + this.pt1yA + " " +
        this.pt2xA + "," + this.pt2yA + " " +
        this.pt3xA + "," + this.pt3yA + " " +
        this.pt4xA + "," + this.pt4yA + " " +
        this.pt5xA + "," + this.pt5yA + " " +
        this.pt6xA + "," + this.pt6yA + " " +
        this.pt7xA + "," + this.pt7yA + " " +
        this.pt8xA + "," + this.pt8yA
   return points;
  };
       this.pointsB = function () {
    var pointsB =  
        this.pt1xB + "," + this.pt1yB + " " +
        this.pt2xB + "," + this.pt2yB + " " +
        this.pt3xB + "," + this.pt3yB + " " +
        this.pt4xB + "," + this.pt4yB + " " +
        this.pt5xB + "," + this.pt5yB + " " +
        this.pt6xB + "," + this.pt6yB + " " +
        this.pt7xB + "," + this.pt7yB + " " +
        this.pt8xB + "," + this.pt8yB
   return pointsB;
	   }; 
  //the method where all the action is
  this.animateOcto = function (targetOct, imgWidth, imgHeight, clickptX, clickptY, offsetX, offsetY, octoImg) {
	var warpX= (Math.random() * (1.5 - .7) + .8);
	var warpY= (Math.random() * (1.5 - .7) + .8);
	var rotSpeed= 15+randShift(10,-10);
  // correct centerpoint for SVG scaling - probably a simpler way
  var widthShift = 0;
  var heightShift = 0;
  var scaleFactor = $(window).width() / imgWidth;	
  var octoCenterX;
  var octoCenterY;
  var aspectFactor = $(window).height() / $(window).width();
  if (aspectFactor < 1) {
	 // this works because svg is set to xMaxYMax slice and we know the original size of the image
	 heightShift = (scaleFactor * imgHeight) - $(window).height();
	 octoCenterX = (clickptX / scaleFactor) - (this.centerX * scaleFactor);
	 octoCenterY = (clickptY / scaleFactor) - (this.centerY * scaleFactor) + (heightShift/2);
	 } else {
	 scaleFactor = $(window).height() / imgHeight;		
	 widthShift = ((imgWidth / scaleFactor) - $(window).width())/4;
	 octoCenterX = (clickptX / scaleFactor) - (this.centerX * scaleFactor) + widthShift ;
	 octoCenterY = (clickptY / scaleFactor) - (this.centerY * scaleFactor);
	 };

  tl.to(targetOct, 1, {attr: {points:this.points()}, x:octoCenterX+offsetX, y:octoCenterY+offsetY, scaleX:warpX, scaleY:warpY, transformOrigin: "50%, 50%", ease:Elastic.easeOut},0);
    tl.to(targetOct, 2, {attr: {points:this.pointsB()}, ease: Power2.easeInOut, yoyo: true, repeat:-1},1);
	tl.to($bgImg, 4, {autoAlpha:bgViz, ease: Power2.easeOut},0);
	pickPic();
	tl.to(octoImg, 10, {autoAlpha:bgViz, ease: Power2.easeOut},1);
   tl.to(targetOct, rotSpeed, {rotation:"+=360", transformOrigin: "50%, 50%", repeat:-1, ease: Power0.easeNone}, 0);
  };
};


function toggleViz() {
if (bgViz == "1") {
	bgViz = "0";
	} else {
	bgViz="1";
	};
	return bgViz;	
};

function pickPic() {
	$('.octoBgImg').each(function(){
	 	var pic = randShift(0,9);
		octoPicture = octoPictures[pic];
		$(this).attr("xlink:href", octoPictures[pic]);
	});
};

 	


/* $(window).click(function(e) {
  var clickX = e.pageX;
  var clickY = e.pageY;
  zapper(clickX, clickY);
    }
	);  */  

document.addEventListener('touchstart', function(e){
    var clickX = e.touches[0].clientX;
  var clickY = e.touches[0].clientY;
  toggleViz();
  zapper(clickX, clickY);
}, false);

function zapper(clickx, clicky) {
  tl.clear();
  var octo1= new octo (130,27,172,70,172,130,130,172,70,172,27,130,27,70,70,27);
  var octo2= new octo (130,27,172,70,172,130,130,172,70,172,27,130,27,70,70,27);
  var octo3= new octo (130,27,172,70,172,130,130,172,70,172,27,130,27,70,70,27);
  octo1.animateOcto($octagon1, 1060, 778, clickx, clicky, -200, 0, $octoImg1);
  octo2.animateOcto($octagon2, 1060, 778, clickx, clicky, 0, 0, $octoImg2);
  octo3.animateOcto($octagon3, 1060, 778, clickx, clicky, 200, 0, $octoImg3);
}


zapper(($(window).width() /2), ($(window).height() /2));

function zapIt(clickx, clicky) {
	tl.clear();
  var octoNew= new octo (130,27,172,70,172,130,130,172,70,172,27,130,27,70,70,27);
  octoNew.animateOcto(clickx, clicky)
};
      