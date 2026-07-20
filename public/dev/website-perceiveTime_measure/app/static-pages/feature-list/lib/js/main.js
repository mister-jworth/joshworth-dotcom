$(document).ready(function(){
  // smoothScroll();
  affixPlans($('.ft__header--outer'));
  hideTooltipMobile();
  hideTooltipTablet();
  showMobileMenu();
});

$(window).scroll(function () {
  affixPlans($('.ft__header--outer'));
});



function smoothScroll(){
  $('body').on('click', '.smooth__scroll', function(){
    var elementClick = $(this).attr('href'),
        destination = $(elementClick).offset().top;

    return false;
  })
}

function affixPlans(wrapper) {
  if (wrapper.length > 0) {
      var body = $('body'),
          scrollH = wrapper.offset().top,
          docHeight = $(document).height(),
          footHeight = $('.site__footer').innerHeight();

    if ($(window).scrollTop() > scrollH) {
        if (body.hasClass('plans__header__fixed') === false) {
            body.addClass('plans__header__fixed');
        }
    } else {
        if (body.hasClass('plans__header__fixed') === true) {
            body.removeClass('plans__header__fixed');
        }
    }

    var stopHeader = $(window).scrollTop() - (docHeight - footHeight - 294 );

    if( stopHeader > 0 ){
      $('.ft__header--inner').css({'top': -stopHeader});
    }else{
      $('.ft__header--inner').removeAttr('style');
    }
  }
}

function hideTooltipMobile(){
  $('body').on('click', '.ft__body--hint', function(){
    $('.ft__body--hint').removeClass('active');
    $(this).addClass('active');
  });
  $('body').on('click', '.ft__body--hint_text strong', function(e){
    $('.ft__body--hint').removeClass('active');
    e.stopPropagation;
    return false;
  });

  $('body').on('click', '*', function(e){
    var target = $(e.target);
    if(!target.is('.ft__body--hint, .ft__body--hint_text') ) {
      $('.ft__body--hint').removeClass('active');
    }
  });

}

function hideTooltipTablet(){
  $('body').on('click', '.ft__body--hint', function(){
    $('.ft__body--hint').not($(this)).removeClass('tapped');
    $(this).toggleClass('tapped');
  });
  $('body').on('click', '*', function(e){
    var target = $(e.target);
    if(!target.is('.ft__body--hint, .ft__body--hint_text') ) {
      $('.ft__body--hint').removeClass('tapped');
    }
  });
}

function showMobileMenu(){
  $('body').on('click', '.nav-opener', function(){
    $('body').toggleClass('nav-visible');
  });
  $('body').on('click', '.wrapper', function(){
    if( $('body').hasClass('nav-visible') ){
      $('body').removeClass('nav-visible');
    }
  })
}
