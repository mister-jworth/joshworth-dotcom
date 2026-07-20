		// This is all work from Krilnon (Kyle Murray). Some comments from JW.
        var lightspeed = 299792 // km/s
		var _1km = 3474.8
        var unit = 'km'
		 var delimeter = ','
		 var decimalmark = '.'
		 var unitname = 'km'
        var language = languages.English
        var currentRAFID = 0 // from requestAnimationFrame
        var speedMultiplier = 1
        var unitTable = {
            km: 1,
            mi: 0.621371,
            AU: 6.68458712e-9,
			 Light: 0.0000000555941,
			 Earths: 0.0000785238,
            Buses: 79.36,
			 Blue:33.3333,
			 Great: 0.00011297137305,
            Pixels: 0.0002877863474156786
        }

$(function() {
    // console speedometer for debugging
    var pos = 0
    setInterval(function(){
        var curPos = $(document.body).scrollLeft()
        console.log((curPos - pos) * _1km, 'km/s, lightspeed is ', lightspeed)
        pos = curPos
    }, 1000)

    // handles easing to any planet based on their symbolic buttons up top
    $('ul.nav a.planetjump').bind('click',function(event){
		stopSpeeding();
		$('.warpfactor').text(' ');
		speedMultiplier = 1;
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollLeft: $($anchor.attr('href')).offset().left
        }, 5000,'easeInOutExpo');
        event.preventDefault();
		
    })
	

// handles easing to next place of interest via < > buttons
	//get the coordinates of all essay chunks and put them into an array
	var essayMarks = [];
	$('.essay').each(function(){
     	essayMarks.push($(this).offset().left - 200)
	});
	//don't forget planets
	var planetMarks = [
		$('#suntxt').offset().left - 200,
		$('#merctxt').offset().left - 200,
		$('#venustxt').offset().left - 200,
		$('#earthtxt').offset().left - 200,
		$('#marstxt').offset().left - 200,
		$('#jupitertxt').offset().left - 200,
		$('#saturntxt').offset().left - 200,
		$('#neptunetxt').offset().left - 200,
		$('#uranustxt').offset().left - 200,
		$('#plutotxt').offset().left - 200,
	];
	var destinations = $.makeArray(essayMarks).concat($.makeArray(planetMarks));
	destinations.sort(function(a, b){return a-b});
	var destinationNext = destinations[0];
	//Attach it to the next button
    $('ul.nav a.nextjump').bind('click',function(event){
		var currentDist = (window.scrollX );
		//find the next destination
    	$.each(destinations, function(index, value){
			if(currentDist >= value) { 
				destinationNext = destinations[index + 1];	
				 }
				else {
				return false
				}
		});
		//scroll there
        $('html, body').stop().animate({
            scrollLeft: destinationNext
        }, 5000,'easeInOutExpo');
        event.preventDefault();
    })
	//Attach it to the prev button
    $('ul.nav a.prevjump').bind('click',function(event){
		var currentDist = (window.scrollX );
		//find the prev destination
    	$.each(destinations, function(index, value){
			if(currentDist <= value) { 
				destinationNext = destinations[index-1];	
				return false
				}
		});
		//scroll there
        $('html, body').stop().animate({
            scrollLeft: destinationNext
        }, 5000,'easeInOutExpo');
        event.preventDefault();
    })

    // show/hide the units dropdown (dropup, really)
    $('#distance-counter').on('click', function(e){
        var $units = $('#unitselect')
        $units.css('display', $units.css('display') == 'none' ? 'block' : 'none')
    })

    // clicking on one of the units changes what the distance counter uses
    $('#unitselect a').on('click', function(e){
        unit = $(e.target).text().split(' ')[0]
		unitname = $(e.target).text()
        console.log(unit)
        updateDistance()
        $('#unitselect').css('display', 'none')
        return false
    })

    // toggles between 0x, 1x, 10x, 100x lightspeed scroll speed
    $('#lightspeeder a').on('click', function(e){
        $('.warpfactor').text('x ' + speedMultiplier)
        currentRAFID = startSpeedingAt(speedMultiplier)
        speedMultiplier = speedMultiplier * 10 || 1
        if(speedMultiplier > 100) speedMultiplier = 0
        return false
    })
	// show/hide the language selector
    $('#langselect').on('click', function(e){
        var $lang = $('#langs')
        $lang.css('display', $lang.css('display') == 'none' ? 'block' : 'none')
    })
    // makes the language buttons change text values, images and delimeters around
    $('#langselect a').on('click', function(e){
       language = languages[$(e.target).text()]
		delimeter = delimeters[$(e.target).text()]
		decimalmark = decimalmarks[$(e.target).text()]
		updateDistance()
		$('#titleimg').attr('src', 'img/maintitle-'+ language + '.svg')
		$('#scaleimg').attr('src', 'img/scale-'+ language + '.svg')
		$('#langs').css('display', 'none')
        for(var translation in translations){
            $('#' + translation).text(translations[translation][language])
        }

        return false
    })
});


// Elegant distance counter .js courtesy of Krilnon at kirupa.com
function updateDistance(){
    var px = (window.scrollX - $('#bigspace').position().left + $(window).width() / 2)
    var km = px * _1km
    var distance = km * unitTable[unit]
    $('#counter').text(Math.max(0, distance.toFixed(1)).toString().replace(".", decimalmark).replace(/\B(?=(\d{3})+(?!\d))/g, delimeter) + ' ' + unitname)
}



// scroll automatically at some multiple of the speed of light
function startSpeedingAt(multipleOfLightspeed){
    stopSpeeding()
    if(multipleOfLightspeed == 0) return
    var startX = window.scrollX
	var lastTime = window.performance.now() // error
    var onEnterFrame = function(now){
		var timeDelta = now - lastTime // milliseconds
       var distance = (lightspeed * multipleOfLightspeed * timeDelta) / (_1km * 1000)
		//var distance = (lightspeed * multipleOfLightspeed * now) / (_1km * 1000)
        $('html, body').scrollLeft(startX + distance)
        currentRAFID = requestAnimationFrame(onEnterFrame)
    }
    return requestAnimationFrame(onEnterFrame)
}



// stops the current rAF cycle for autoscrolling
// called by startSpeedingAt, but could be elsewhere too, if desired
function stopSpeeding(){
    cancelAnimationFrame(currentRAFID);
}

/* Early lightspeeder by Krilnon. Only has one speed and requires a click on a link so it wasn't quite right
 
$(function() {
 // Get the distance to the next destination (piece of text or planet)
    var $destinations = $('.essay, .labeltext').sort(function(e1, e2){ return e1.getBoundingClientRect().left - e2.getBoundingClientRect().left })
    
    // sticks a link at the end of each destination
    $destinations.each(function(){
        if(this == $destinations.last()[0]) return false // last one doesn't get a button

        $(this).append($(
            '<a />', { href: '#', text: '>>' }
        ).click(function(){
        // When you clikc the link - off you go
            lightspeedTo($destinations[$destinations.toArray().indexOf($(this).parent()[0]) + 1])
        }))
    })

    // console speedometer for debugging
    var pos = 0
    setInterval(function(){
        var curPos = $(document.body).scrollLeft()
        console.log((curPos - pos) * _1km, 'km/s, lightspeed is ', lightspeed)
        pos = curPos
    }, 1000)

    $('ul.nav a').bind('click',function(event){
        var $anchor = $(this);

        $('html, body').stop().animate({
            scrollLeft: $($anchor.attr('href')).offset().left
        }, 5000,'easeInOutExpo');
        event.preventDefault();
    });
});

// Scrolls at light speed to the next destination
function lightspeedTo(e){
    var target = $(e).offset().left
    var distance = target - $(document.body).scrollLeft()
    var time = ((distance * _1km) / lightspeed) * 1000
    console.log('time', (time / 1000).toFixed(2), 'seconds', 'distance', distance, 'pixels')
    $('html, body').stop().animate({
        scrollLeft: $(e).offset().left
    }, time,'linear');
}
*/
  
 

$(window).scroll(updateDistance);
$('#monitors').text(Math.floor($('#bigspace').width() / screen.availWidth / window.devicePixelRatio));


/* Makes scrollwheel scroll horizontally - except that it loses the accelleration/decelleration on a trackpad so I killed it 

var mouseWheelEvt = function (e)
{
    var event = e || window.event;
    if (document.body.doScroll)
        document.body.doScroll(event.wheelDelta>0?"left":"right");
    else if ((event.wheelDelta || event.detail) > 0)
        document.body.scrollLeft -= 20;
    else
        document.body.scrollLeft += 20;

    return false;
}
if ("onmousewheel" in document.body)
    document.body.onmousewheel = mouseWheelEvt;
else
    document.body.addEventListener("DOMMouseScroll", mouseWheelEvt);
*/
 