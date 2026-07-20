var ringSize=0;
var ringCenter=0;
var ringTop=0;
var ringCount=8;
var ringSet = [];
var ringID;


function createRingSet() {
	for ( var i = 0; i < ringCount; i = i + 1 ) {
		ringID = "ring"+i;
		var newRing = $("<div/>", {"id": ringID,});
		newRing.addClass("ringStyle");
		newRing.appendTo("#pagewrapper");
		ringSet.push(newRing);
    	console.log( newRing ); 
}
}

createRingSet();

function drawRing(ringSize) {
	ringCenter = $('#pagewrapper').height() / 2;
	ringTop = ringCenter - (ringSize / 2);
	if (ringSize < 0) {
		ringTooSmall();
		return;  
	} else if (ringSize > $('#pagewrapper').height()) {
		ringTooBig();
		return;
	} else {
		$.each(ringSet, ringSizer(ringID));
		}		
}

function ringTooSmall() {
	console.log ("too small")
}

function ringTooBig() {
	console.log ("too big")
}

function ringSizer(newRing) {
	$(newRing).css({'height': ringSize, 'width': ringSize, 'top': ringTop, 'border-radius': ringSize});
}

$('#pagewrapper').bind('mousewheel',function(e){
	var wheelSpin = e.originalEvent.wheelDelta
	if(wheelSpin < 0) {
         //scroll down
		 ringSize = ringSize+wheelSpin
		drawRing(ringSize)
         console.log('Down');
     }else {
         //scroll up
		 	ringSize = ringSize+wheelSpin
			drawRing(ringSize)
         console.log('Up');
     }	

     //prevent page fom scrolling
     //return false;
}

);


function repeatOften() {
  requestAnimationFrame(repeatOften);
}
