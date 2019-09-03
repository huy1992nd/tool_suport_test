$(function(){
	
	$('#select-brand-structure-id').select2({
		  placeholder: translate.select_entity,
		  allowClear: true
	});
	
});

$(document).on({
	 ajaxStart: function() { $('#loading-indicator').show();},
	 ajaxStop: function() { $('#loading-indicator').hide(); }    
});