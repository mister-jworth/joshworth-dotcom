var pathPrefix = "again/";
$( function() {
  $( "#slider-range-min" ).slider({
    range: "max",
    min: 0,
    max: 9,
    value: 2,
    slide: function( event, ui ) {
      $( "#amount" ).val( ui.value );
    }
  });
  $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );
} );
$( function() {
  $( "#slider-range-select" ).slider({
    range: "max",
    min: 30,
    max: 150,
    value: 90,
    slide: function( event, ui ) {
      
    }
  });
  $( "#amount" ).val( $( "#slider-range-max" ).slider( "value" ) );
} );
var origin;
function getbigger() {
  $('.b').each(function(index) {
    origin=Number($(this).attr("r")) + 5;
    if(origin>2000) $(this).attr('r',0);
    else    $(this).attr('r',origin);
  });
}

$('#menusvg').click(function(){alert('menu');});