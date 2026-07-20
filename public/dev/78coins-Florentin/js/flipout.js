var container = $("#cointainer"); //canvas area
var $coinBox = $("#coinBox");
var coinTl = new TimelineMax(); // master timeline
var jumpTime = (Math.random() * .75) + .8;
var keyCode = 0;

// Checks which key was pressed. If it's ENTER, you get all heads -otherwise it just flips the coins
function getKey(event) {
	keyCode = ('charCode' in event) ? event.charCode : event.keyCode;
	callIt();
}

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
		var side = Math.random() > 0.5 && keyCode !==13 ? tailFlip(this) : headFlip(this);
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

// gets called when you click the button
function callIt() {
	if (!coinTl.isActive()){
  //container.html('');
  coinTl.clear();
  buildTimeline();
  //coinTl.seek(0).invalidate().restart(); //don't seem to need this.
	}};

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

  // forEach is an array method
  coins.forEach(function(coin) {
    coinTl.add(coin.flip(), 0);
  });
};

buildTimeline();