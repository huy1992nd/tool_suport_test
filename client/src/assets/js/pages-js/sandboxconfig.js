$.fn.bootstrapSwitch.defaults.size = 'mini';
$.fn.bootstrapSwitch.defaults.onColor = 'success';
$.fn.bootstrapSwitch.defaults.offColor = 'danger';

$(".switchbtn").bootstrapSwitch();

$('.switchbtn').on('switchChange.bootstrapSwitch', function(event, state) {
  //this.value = state;	
  //console.log(this); // DOM element
  //console.log(event); // jQuery event
  //console.log(state); // true | false
  
  
  var classname = $(this).attr('class');
	var parentclass = classname.substring(classname.lastIndexOf(" ") + 1, classname.length);
	
	this.value = state;
	//$(".parent_" + this.id).bootstrapSwitch('state', false);
	if(parentclass=='parent'){
		if(state==false){
			$(".childof_" + this.id).bootstrapSwitch('state', false);
		}
		else{
			$(".childof_" + this.id).bootstrapSwitch('state', true);
		}
		
		
	}
  
});

function saveconfig(){
	var config_values = "";
	$('#navigation .switchbtn').each(function(n, a, s){

		if(this.value != 'false' && this.value!=false && this.value!='off'){
			if(config_values.length > 0){
				config_values += ",";
			}
			
			config_values += this.id;
		}
		
	});
	
	
	$.ajax({
		 type: "POST",
		 url: "sandboxconfig/setconfig",
		 data: {
		  "params": config_values
		 },
		 success: function(result){
			 if(result){
				 alert('Configuration saved.')
				 window.location.reload();
			 }
			 
			
		 }
	});
	
}
$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});

$(function () {
	/* $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
   $('.tree li.parent_li > span').on('click', function (e) {
       var children = $(this).parent('li.parent_li').find(' > ul > li');
       if (children.is(":visible")) {
           children.hide('fast');
           $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
       } else {
           children.show('fast');
           $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
       }
       e.stopPropagation();
   });*/
});