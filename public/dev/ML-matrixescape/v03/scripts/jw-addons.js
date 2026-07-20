// JavaScript Document

var textParts = $(".textpart")

textParts.each(function() {
    console.log($(this).offset().top);
});

$(window).scroll(function(){
   // Get container scroll position
   var fromTop = $(this).scrollTop();

   // Check the loc of the text parts to know the current one
   var cur = textParts.map(function(){
     if ($(this).offset().top < fromTop+200)
       return this;
   });
	textParts.removeClass("current")
	$(cur[cur.length-1]).addClass("current")
});



