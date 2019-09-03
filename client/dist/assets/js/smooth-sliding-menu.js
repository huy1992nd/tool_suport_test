//jQuery.noConflict();
	
	/**********Vertical Slide*********/
	

$('#nav li').on('click', function(e) {
	  $this = $(this);
	  e.stopPropagation(); 

	  if($this.has('ul').length) {
		e.preventDefault();
		var visibleUL = $('#nav').find('ul:visible').length; 
		var ele_class = $('ul', this).attr("class");
		if(ele_class != 'sub-menu opened')
		{
			$('#nav').find('ul:visible').slideToggle("normal");
			$('#nav').find('ul:visible').removeClass("opened");
			$('.icon-angle-down').addClass("closing");
			$('.closing').removeClass("icon-angle-down");
			$('.closing').addClass("icon-angle-left");
			$('.icon-angle-left').removeClass("closing");
		}
		$('ul', this).slideToggle("normal");
		if(ele_class == 'sub-menu opened')
		{
			$('ul', this).removeClass("opened");
			$('.arrow', this).removeClass("icon-angle-down");
			$('.arrow', this).addClass("icon-angle-left");
		}
		else
		{
			$('ul', this).addClass("opened");
			$('.arrow', this).removeClass("icon-angle-left");
			$('.arrow', this).addClass("icon-angle-down");
		}
	  } 
});

	/*jQuery('#nav li').on('click', function(e) {
	  jQuerythis = jQuery(this);
	  e.stopPropagation(); 

	  if(jQuerythis.has('ul').length) {
		e.preventDefault();
		var visibleUL = jQuery('#nav').find('ul:visible').length; 
		var ele_class = jQuery('ul', this).attr("class");
		if(ele_class != 'sub-menu opened')
		{
			jQuery('#nav').find('ul:visible').slideToggle("normal");
			jQuery('#nav').find('ul:visible').removeClass("opened");
			jQuery('.icon-angle-down').addClass("closing");
			jQuery('.closing').removeClass("icon-angle-down");
			jQuery('.closing').addClass("icon-angle-left");
			jQuery('.icon-angle-left').removeClass("closing");
		}
		jQuery('ul', this).slideToggle("normal");
		if(ele_class == 'sub-menu opened')
		{
			jQuery('ul', this).removeClass("opened");
			jQuery('.arrow', this).removeClass("icon-angle-down");
			jQuery('.arrow', this).addClass("icon-angle-left");
		}
		else
		{
			jQuery('ul', this).addClass("opened");
			jQuery('.arrow', this).removeClass("icon-angle-left");
			jQuery('.arrow', this).addClass("icon-angle-down");
		}
	  } 

});*/

/**********Horizontal Slide for i-phone*********/

jQuery(document).ready(function(){
  jQuery(".icon-reorder").on("click", function(e){
    e.preventDefault();
      var distance = jQuery('.page-content').css('left');
      var elm_class = jQuery(".icon-reorder").attr("class");
      if(elm_class=='icon-reorder') {
		jQuery(this).addClass("open");
        jQuery('.left-nav').animate({width: 'toggle'});
      } else {
		 jQuery(".icon-reorder").removeClass("open");
        jQuery('.left-nav').animate({width: 'toggle'});
      }
  });
});