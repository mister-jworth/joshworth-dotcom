// JavaScript Document

function updateDepth(){
    var px = (window.pageYOffset - $('#water').position().top + $(window).height());
    var distance = px;
    $('#distance-counter').text(distance);
	
}

$(window).scroll(updateDepth);