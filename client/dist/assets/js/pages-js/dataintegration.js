$(function() {
  /*
  $().timelinr( {
    autoPlay: 'true',
    autoPlayDirection: 'forward',
    datesSpeed: 'slow'
  })
  */
  $( '#mi-slider' ).catslider();

});

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

$("#loginprocess").click(function() {

    $('.timeline-label').each(function() {
      
      var imagePos = $(this).offset().top;
      var topOfWindow = $(window).scrollTop();
      var classname = randomFrom([
            'slideUp', 'slideLeft', 'slideRight', 'slideExpandUp', 
            'expandUp', 'fadeIn', 'expandOpen', 'bigEntrance', 
            'hatch', 'bounce', 'pulse', 'floating', 'tossing', 
            'pullUp', 'pullDown', 'stretchLeft', 'stretchRight'
            ])
      if (imagePos < topOfWindow+400) {
        $(this).addClass(classname).show(10000);
      }
    });
});


$("#show").hover( function() {

  $(this).animate({ 
    'font-size': '70%',
   }, 500);
   },
   function() {
   $(this).animate({ 
     'font-size': '60%',
   }, 500);

})

$("#show").click(function() {

  $(".section").hide(); 
  $(".col-lg-12").show(); 

});

$("#depositprocess").click(function(e) {

  var dl = $('.dl');
  current = 0;
  dl.hide();
  Rotator();

  function Rotator() {
    $(dl[current]).fadeIn('slow').delay(5000);
    $(dl[current]).queue(function() {
        current = current < dl.length - 1 ? current + 1 : 0;
        Rotator();
        $(this).dequeue();
    });
  }

});

    