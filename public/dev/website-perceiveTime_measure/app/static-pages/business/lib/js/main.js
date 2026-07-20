$(document).ready(function(){
  $.clickyConfigureAllGoals(100857897);

  integrationCarousel();
  smoothScroll();

});


function integrationCarousel(){

  var carousel = $('.integrations__carousel--items'),
      carouselItem = $('.integrations__carousel--items').children(),
      carouselAnimation = 5000,
      carouselItemWidth = carouselItem.innerWidth();

  function carouselWidth(){
    carousel.width( carouselItemWidth * $('.integrations__carousel--items > div:visible').length );
  }
  carouselWidth();

  function loop(){
    $(carousel).stop().animate({'margin-left': -( carouselItemWidth )}, carouselAnimation, 'linear', function(){
      $(this).css({'margin-left': 0}).find('div:last').after($('div:first', this));
      loop();
    });
  }
  loop();

  function filterCarousel(match){
    if( match == '' ){
      $('.no__match').hide();
      carouselItem.show();
      $('.integrations__carousel--frame').removeClass('carousel__filtered');
      carouselWidth();
    } else {
      carouselItem.hide();
      carousel.find('[data-logo-name*=\"'+match+'\"]').show();
      $('.integrations__carousel--frame').addClass('carousel__filtered');
      carouselWidth();

      if( !$('[data-logo-name*=\"'+match+'\"]').length ){
        $('.no__match').show();
      }else{
        $('.no__match').hide();
      }
    }
  }

  var keyupTimeout;
  $('.slider__section--input').keyup(function(){
    var value = $(this).val(),
        value = value.toLowerCase();

    window.clearTimeout(keyupTimeout);

    keyupTimeout = setTimeout(function(){
      filterCarousel(value);
    }, 300);

  });

}

function smoothScroll(){
  $('body').on('click', '.smooth__scroll', function(){
    var elementClick = $(this).attr('href'),
        destination = $(elementClick).offset().top;

    if ( elementClick == '#section_more' ){
      $('.pricing__section').addClass('active_index');
    }

    $('html, body').animate({ scrollTop: destination-100}, 800, function(){
      if( elementClick == '#section_pricing' ){
        $('.pricing__section').addClass('active_pricing');
        setTimeout(function(){
          $('.pricing__section').removeClass('active_pricing');
        }, 150);
      } else if ( elementClick == '#section_more' ){
        $('.pricing__section').addClass('active_more');
        setTimeout(function(){
          $('.pricing__section').removeClass('active_more');
        }, 150);
        setTimeout(function(){
          $('.pricing__section').removeClass('active_index')
        }, 300);
      }
    });

    return false;
  })
}