$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});

$(".showinput" ).click(function(){
	$("#div_show_input").toggle();
});

$( "input[name=startdate]" ).datetimepicker({
	mask: true,
	format: 'Y-m-d H:i'
});
$( "input[name=enddate]" ).datetimepicker({
	mask: true,
	format: 'Y-m-d H:i'
});


$(function(){
	
	$('#gamereports-form').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		
		$.ajax({
			 type: "POST",
			 url: site_url + "admin/gamereports/ajax/show_stats",
			 data: {
				 "params": $params
		
			 },
			 success: function(result){
				 var dataSet = result.data;
				 var colnames = result.colnames;
				 if(dataSet.length>0){
					 $("#display_result").html('<table class="display" id="gamestats_table"></table>');
					 $('#gamestats_table').dataTable({
						"pagingType": "full_numbers", 	
				        "data": dataSet,
				        "columns": colnames,
				        "language": {
					        url: site_url + 'admin/language/ajax/get_datatables_language',
					    }
				    });
				 }
				 else{
					 $("#display_result").html('-No record found.-');
				 }
				  
				$("#urlinput").html(result.url);
				$("#httpheader").html(result.header);
				$("#apiresponse_raw").html("<span style='color: white'>" + JSON.stringify(result.apiresponse, null, 4)+ "</span>");
				$("#apiresponse_parsed").html(renderjson.set_show_to_level("all")(result.apiresponse)); 
				 
			 }
		});
	})
	
	
	$("input[name=startdate]").prop('disabled', true);
	$("input[name=enddate]").prop('disabled', true);

	$("select[name=timeperiod]").on('change', function() {

		if($(this).val()=='specify'){
			$("input[name=startdate]").prop('disabled', false);
			$("input[name=enddate]").prop('disabled', false);
		}
		else{
			$("input[name=startdate").val('');
			$("input[name=enddate]").val('');
			
			$("input[name=startdate").prop('disabled', true);
			$("input[name=enddate]").prop('disabled', true);
		}
	});
	
})

