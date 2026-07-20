// 78 Coins by Josh Worth @misterjworth
//Lots of great help from Blake Bowen (OSUBlake - moderator at GSAP forums)

var container = $("#cointainer"); //canvas area
var $coinBox = $("#coinBox");
var coinTl = new TimelineMax(); // master timeline
var jumpTime = (Math.random() * .75) + .8;
var lineNum = 0; //index of essay text array

// The HTML for the coins to use
var template = $(".template").remove();

var count = 78;
var coins = createCoins(count);

// Returns an array of coin objects
function createCoins(count) {

  var coins = [];

  for (var i = 0; i < count; i++) {

    // Copy the template
    var clone = template.clone().attr("class", "coinBox");
    container.append(clone);

    // Finds the images inside the clone
    var img = clone.find("img");

    var coin = {
      index: i,
      box: clone,
      heads: img[0],
      edge: img[1],
      line: img[2],
      tails: img[3],
      flip: function() {
        var side = Math.random() > 0.5 && lineNum < (essayText.length-2) ? tailFlip(this) : headFlip(this);
        return getFlippage(this.box, side);
      }
    };

    coins.push(coin);
    

    TweenLite.set(clone, {
      autoAlpha: 1
    });
  }

  return coins;

}

// Animation setup
function getFlippage(coin, whatSide) {

  //define jumping
  jumpTime = (Math.random() * .75) + .8;
  var jumpTl = new TimelineMax();
  var jumpUp = new TweenMax(coin, jumpTime / 2, {
    y: "-=100",
    rotation: 10,
    ease: Power1.easeOut
  });
  var jumpDown = new TweenMax(coin, jumpTime / 2, {
    y: "+=100",
    rotation: -10,
    ease: Bounce.easeOut
  });

  jumpTl
    .add(jumpUp.play())
    .add(jumpDown.play())
    .to(coin, .1, {
      rotation: 0
    }, "-=.2");

  // timeline for each
  var coinFlipTl = new TimelineMax();
  coinFlipTl
    .add(whatSide, 0) //picks whether to land on heads or tails
    .add(jumpTl, 0);
  return coinFlipTl;
};

// gets called when you click the button (but only if it's not already playing)
function callIt() {
  coinTl.clear();
  buildTimeline();
};

//makes a new animation for a coin that's heads
function headFlip(coin) {

  var flipTime = jumpTime/6;
  var headsTl = new TimelineMax({
    repeat: 0
  });

  headsTl
    .to(coin.heads, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge1")
    .to(coin.tails, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge1")
    .to(coin.line, flipTime, {
      height: 4,
      y: 0
    }, "showedge1")
    .to(coin.edge, flipTime, {
      scaleY: 0,
      y: 4
    }, "showedge1")
  
     .to(coin.heads, flipTime, {
      scaleY: 1,
      y: 0
    }, "showheads1")
    .to(coin.line, flipTime, {
      height: 0,
      y: 0
    }, "showheads1")
    .to(coin.edge, flipTime, {
      scaleY: 1,
      y: 0
    }, "showheads1")
  
  .to(coin.heads, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge2")
    .to(coin.line, flipTime, {
      height: 4,
      y: 0
    }, "showedge2")
    .to(coin.edge, flipTime, {
      scaleY: 0,
      y: 4
    }, "showedge2")
  
    .to(coin.tails, flipTime, {
      scaleY: 1,
      y: 0
    }, "showtails1")
    .to(coin.line, flipTime, {
      height: 0,
      y: 0
    }, "showtails1")
    .to(coin.edge, flipTime, {
      scaleY: 1,
      y: 0
    }, "showtails1")
  
   .to(coin.tails, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge3")
    .to(coin.line, flipTime, {
      height: 4,
      y: 0
    }, "showedge3")
    .to(coin.edge, flipTime, {
      scaleY: 0,
      y: 4
    }, "showedge3")
  
    .to(coin.heads, flipTime, {
      scaleY: 1,
      y: 0
    }, "showheads2")
    .to(coin.line, flipTime, {
      height: 0,
      y: 0
    }, "showheads2")
    .to(coin.edge, flipTime, {
      scaleY: 1,
      y: 0
    }, "showheads2") 
    ;
  return headsTl;
};

//makes a new animation for a coin that's tails
function tailFlip(coin) {

  var flipTime = jumpTime/6;
  var tailsTl = new TimelineMax({
    repeat: 0
  });

  tailsTl
     .to(coin.heads, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge1t")
    .to(coin.tails, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge1t")
    .to(coin.line, flipTime, {
      height: 4,
      y: 0
    }, "showedge1t")
    .to(coin.edge, flipTime, {
      scaleY: 0,
      y: 4
    }, "showedge1t")
  
     .to(coin.tails, flipTime, {
      scaleY: 1,
      y: 0
    }, "showtails1t")
    .to(coin.line, flipTime, {
      height: 0,
      y: 0
    }, "showtails1t")
    .to(coin.edge, flipTime, {
      scaleY: 1,
      y: 0
    }, "showtails1t")
  
  .to(coin.tails, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge2t")
    .to(coin.line, flipTime, {
      height: 4,
      y: 0
    }, "showedge2t")
    .to(coin.edge, flipTime, {
      scaleY: 0,
      y: 4
    }, "showedge2t")
  
    .to(coin.heads, flipTime, {
      scaleY: 1,
      y: 0
    }, "showheads1t")
    .to(coin.line, flipTime, {
      height: 0,
      y: 0
    }, "showheads1t")
    .to(coin.edge, flipTime, {
      scaleY: 1,
      y: 0
    }, "showheads1t")
  
   .to(coin.heads, flipTime, {
      scaleY: 0,
      y: 0
    }, "showedge3t")
    .to(coin.line, flipTime, {
      height: 4,
      y: 0
    }, "showedge3t")
    .to(coin.edge, flipTime, {
      scaleY: 0,
      y: 4
    }, "showedge3t")
  
    .to(coin.tails, flipTime, {
      scaleY: 1,
      y: 0
    }, "showtails2t")
    .to(coin.line, flipTime, {
      height: 0,
      y: 0
    }, "showtails2t")
    .to(coin.edge, flipTime, {
      scaleY: 1,
      y: 0
    }, "showtails2t") 
    ;
  return tailsTl;
};

function buildTimeline() {

  // cycle through the coins array and add a flipping coin to the master TL
  coins.forEach(function(coin) {
    coinTl.add(coin.flip(), 0);
  });
};

buildTimeline();

/* thub flipping svg animation
(http://codepen.io/osublake/)'s Pen [Animating SVG Paths](http://codepen.io/osublake/pen/RPKdQz/). */

TweenLite.defaultEase = Power4.easeOut;

var thumb = document.getElementById("thumb");

var path1 = thumb.getAttribute("d");
var path2 = 
    "M30.3,52.9L30.3,52.9c-1.7,0-3.1,1.4-3.1,3.1c0,1.7,1.4,3.1,3.1,3.1h2.1c-1.7,0-3.1,1.4-3.1,3.1c0,1.7,1.4,3.1,3.1,3.1c0,0,8.4,0,13.6,0c8.4,0,6.3-4.2,23-4.2c0-1,0-18.9,0-18.9h-6.3c-7.3,0-15.7-6.7-15.7-16.8c0-3.3-6.3-3.7-6.3,2.6c0,4.2,2.1,12.1,2.1,12.1H26.1c-1.7,0-3.1,1.4-3.1,3.1c0,1.7,1.4,3.1,3.1,3.1h2.1c-1.7,0-3.1,1.4-3.1,3.1c0,1.7,1.4,3.1,3.1,3.1H30.3";
path1 = parsePath(path1);
path2 = parsePath(path2);

function thumbFlip() {
  new TimelineMax({ repeat: 1, yoyo: true })
  .to(path1, .3, { endArray: path2, onUpdate: update.bind(thumb, "d", path1) });
};

function update(attr, path) {
  this.setAttribute(attr, path.string());
}

function parsePath(string) {  
  
  // Split the string into path commands and points
  var pathExp = /[achlmrqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/ig;  
  var path = string.match(pathExp).map(function(n) { return isNaN(+n) ? n : +n; });
  
  // The first element needs to be a number, so remove if it's not
  // Calling the string method will return the path with the removed element
  path.prefix = isNaN(path[0]) ? path.shift() : "";
  path.string = function() { return path.prefix + path.join(" "); };
  
  return path;
  
}
  thumbFlip();

//document.getElementById("flipbtn").onclick=function(){thumbFlip();callIt();};

$('#flipbtn').on('click', function(e) {
	if (!coinTl.isActive()) {
	thumbFlip();
	callIt();
	lineNum++;
	writeEssay(lineNum);
	$( "#pgslider" ).slider("value", lineNum)
	}
});


//change the essay text
var $essay = $('#essay');

$("#titlecard").html(essayText[0])

function writeEssay(essayIndex) {
	TweenLite.to($essay, 1, {autoAlpha: 0, onComplete:switchText, onCompleteParams:[essayIndex]});
	TweenLite.to($essay, .74, {autoAlpha: 1, delay:1});
};

function switchText(essayIndex) {
	$essay.html(essayText[essayIndex]);
	centerEssay();
};

// center text
function centerEssay () { 
	var essaySpace = $("#wrapper").height() - $("#header").outerHeight() - $("#coinRow").outerHeight() + $("#btnRow").outerHeight();
	var essayHeight = $essay.outerHeight() / 2;
   $essay.css ({
        'bottom' : ( essaySpace / 2 ) - essayHeight + 'px',
		'padding-bottom' : 0
   });
}

$( window ).resize(centerEssay);


$('#sharebtn').on('click', function(e) {
	$('.overbox').css("visibility", "visible");
});

$('.closex').on('click', function(e) {
	$('.overbox').css("visibility", "hidden");
});


// page slider

$( "#pgslider" ).slider({
  animate: "fast",
  min: 1,
  max: essayText.length,
  step:1,
  change: function ( event, ui ) {
	lineNum = ui.value; 
	writeEssay(ui.value);
  },
    slide: function ( event, ui ) {
	lineNum = ui.value; 
	switchText(ui.value);
  }
});
var pgslideWidth = (100 / essayText.length) +'%';

$(".ui-slider-handle").css({
	"width" : pgslideWidth,
	"margin-left" : ((100 / essayText.length) / 2)-1
});


var $tickmark = "<span class=\'tickmark\'></span>"

for (var i = 0; i < essayText.length; i++) {
	$("#sliderticks").append($tickmark);
};

$(".tickmark").css("width", pgslideWidth);

//titlecard animation
$( document ).ready(function() {
	lineNum++;
	writeEssay(lineNum);
	$( "#pgslider" ).slider("value", lineNum)
    TweenLite.to("#titlepage", 2.5, {autoAlpha:0, ease:Power2.easeInOut, delay:2});;
});
