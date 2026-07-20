$(document).ready(function(){
  $.clickyConfigureAllGoals(100857897);

  // open Form
  $('body').on('click', '.show_contact_form', function(){
    $('.hidden_contact_form').slideToggle(600);

    var dest = $('#contact').offset().top;
    $('html, body').animate({'scrollTop' : dest - 70}, 600);
    return false;
  })

})

// begin jquery.sticky script
$(window).load(function(){
  $("#header_wrapper").sticky({ topSpacing: 0 });
});


(function($){
  $(document).ready(function() {  
  /* This code is executed after the DOM has been completely loaded */
    
    $("#nav li a, a.scrool").click(function(e){

      var full_url = this.href;
      var parts = full_url.split("#");
      var trgt = parts[1];
      if (trgt == null) {
        return
      }
      var target_offset = $("#"+trgt).offset();
      var target_top = target_offset.top;
      
      $('html,body').animate({scrollTop:target_top -70}, 1000);
        return false;
      
    });
        
  });
})(jQuery);

$(function(){
 var shrinkHeader = 5;
  $(window).scroll(function() {
  var scroll = getCurrentScroll();
    if ( scroll >= shrinkHeader ) {
       $('#header_wrapper').addClass('shrink');
    }
    else {
      $('#header_wrapper').removeClass('shrink');
    }
  });
function getCurrentScroll() {
  return window.pageYOffset;
  }
});



function connectSun(){

  $('.connect_sun').height( $('.connect_sun').width() );
  var container = $('.connect_sun').width() / 2;

  function isEven(n) {
    return n % 2 == 0;
  }

  $('.connect_sun--ul').css({ 'width': container, 'height': container, 'margin-top': container, 'margin-left': container });

  $('.connect_sun--ul li').each(function(){
    var length = $('.connect_sun--ul li').length,
        thisIndex = $(this).index() + 1,
        angle = ( ( 360 / length ) * 0.0174532925 ) * thisIndex,
        R = 0;

    if( isEven(thisIndex) ){
      R = container * 0.5
    } else {
      R = container * 0.7
    }

    var posY = (R * (Math.sin(angle))),
        posX = (R * (Math.cos(angle)));

    $(this).css({"top": posY, "left": posX});

  });

}
connectSun();

$(window).resize(function(){
  connectSun();
});



function isScrolledIntoView(elem){
  var $elem = $(elem);
  var $window = $(window);

  var docViewTop = $window.scrollTop();
  var docViewBottom = docViewTop + $window.height();

  var elemTop = $elem.offset().top;
  var elemBottom = elemTop + $elem.height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}
function focusAfterText(e){
  var el = e.get(0);
  var elemLen = el.value.length;

  el.selectionStart = elemLen;
  el.selectionEnd = elemLen;
  el.focus();
}
$(window).scroll(function(){
   if ( isScrolledIntoView( $('.pricing_form--input') ) ){
      focusAfterText( $('.pricing_form--input') )
   }
});





function pricingChange(value){
  $('.pricing_form--year').text( value * 9 );
  $('.pricing_form--month').text( value * 10 );
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// price Calculator
$('body').on('keyup keydown', '.pricing_form--input', function(){
  var thisVal = parseInt( $(this).val() );

  if( isNumeric( thisVal ) ){
    pricingChange(thisVal)
  } else {
    $(this).val('');
  }
});

function plusMinus() {
  var input = $('.pricing_form--input');

  function goUp(value){
    if (isNaN(value)) {
      input.val( 1 );
    } else {
      input.val( value+1 );
      pricingChange( value+1 )
    }
    focusAfterText( $('.pricing_form--input') )
  }
  function goDn(value){
    if( value > 1 ){
      input.val( value-1 );
      pricingChange( value-1 )
    } else {
      input.val( 1 );
      pricingChange( 1 )
    }
    focusAfterText( $('.pricing_form--input') )
  }

  $('body').on('click', '.pricing_form--up', function(){
    var thisVal = parseInt( input.val() )
    goUp( thisVal );
  });
  $('body').on('click', '.pricing_form--dn', function(){
    var thisVal = parseInt( input.val() )
    goDn( thisVal );
  });

  $(document).keydown(function(e) {
    if ( e.keyCode === 38 || e.keyCode === 39 ){
      goUp( parseInt( input.val() ) );
    }
    if ( e.keyCode === 40 || e.keyCode === 37 ){
      goDn( parseInt( input.val() ) );
    }
});

}
plusMinus();
