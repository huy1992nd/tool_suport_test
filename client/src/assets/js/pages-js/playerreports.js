$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});

$( "input[name=startdate]" ).datepicker(
	{
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true
	}
);
$( "input[name=enddate]" ).datepicker(
	{
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true
	}
);


$(".showinput" ).click(function(){
	$("#div_show_input").toggle();
});



$(function(){
	
	$('#playerstats_form').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		
		
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/playerreports/ajax/show_stats",
		    data: {
		    	'params': $params
		    },
		    success: function(result) {
	    		var dataSet = result.tabular.data;
				var colnames = result.tabular.colnames;
				
				if(dataSet.length>0){

					if ( $.fn.dataTable.isDataTable( '#tbl_playerstats' ) ) {
						$('#tbl_playerstats').dataTable().fnClearTable(); 
						$('#tbl_playerstats').dataTable().fnDestroy();
						$("thead", $oTable).remove();
						
						$oTable = $('#tbl_playerstats').dataTable({
							"autoWidth": false,
							"retrieve": true,
							"bdestroy": true,
							"pagingType": "full_numbers", 	
					        "data": dataSet,
					        "columns": colnames,
					        "scrollX": false,
					        "columnDefs": [
				                       { "visible": true, "targets": [0], "searchable": false, "sortable": false }
				                       ],
					        "language": {
						        url: site_url + 'admin/language/ajax/get_datatables_language',
						    }
							,"dom": 'T<"clear">lfrtip'
							,"drawCallback": function( settings ) {
						    }
					    });
						
					}
					else{
						$oTable = $('#tbl_playerstats').dataTable({
							"autoWidth": false,
							"retrieve": true,
							"bdestroy": true,
							"pagingType": "full_numbers", 	
					        "data": dataSet,
					        "columns": colnames,
					        "scrollX": false,
					        "columnDefs": [
					                       { "visible": true, "targets": [0], "searchable": false, "sortable": false }
					                   ],
					        "language": {
						        url: site_url + 'admin/language/ajax/get_datatables_language',
						    }
							,"dom": 'T<"clear">lfrtip'
							,"drawCallback": function( settings ) {
								
						    }
					    });
						
					}
					
					
					$options = '<select id="toggle_columns" class="combobox multiselect" multiple="multiple">';
					$.each(colnames, function(o, e){
						$options += "<option value='"+o+"' selected='selected'>"+e.title+"</option>";
					})
					$options += "</select>";

					$("#div_toggle_columns").html($options);
					
					$('#toggle_columns').multiselect({
				        includeSelectAllOption: false,
				        enableFiltering: true,
				        maxHeight: 150,
						buttonWidth: '300px',
						disableIfEmpty: true,
						enableCaseInsensitiveFiltering: true,
						onChange: function(element, checked){
							var column = $oTable.api().column($(element).val());
					        column.visible( ! column.visible() );
					        $oTable.width('auto')
						},
						buttonText: function(options, select) {
							return translate.show_hide_columns;
			            }
					});
				 }
				 else{
					 if ($.fn.dataTable.isDataTable( '#tbl_playerstats' ) ) {
						 $('#tbl_playerstats').dataTable().fnClearTable(); 
						 $('#tbl_playerstats').dataTable().fnDestroy();
						 $('#tbl_playerstats').html('');

					 }
					 else{
						 $('#tbl_playerstats').html('');
					 }
					 $("#div_toggle_columns").html('');
				 }
				 $("#div_toggle_columns").show();
				 
				 $("#console_response_url").html(result.url);
				 $("#httpheader").html(result.header);
				 $("#console_response").html("<span style='color: white'>" + JSON.stringify(result.apiresponse, null, 4)+ "</span>");
				 $("#console_response_readable").html(renderjson.set_show_to_level("all")(result.apiresponse));
				 
	    	}
		})
	})
	
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



