$(function(){
	$.fn.bootstrapSwitch.defaults.size = 'normal';
	$.fn.bootstrapSwitch.defaults.onColor = 'success';
	$.fn.bootstrapSwitch.defaults.offColor = 'danger';

	$(".switchbtn").bootstrapSwitch({
		onText: "Yes",
		offText: "No"
	});
	
	$( ".date" ).datepicker(
			{
				dateFormat: 'yy-mm-dd',
				changeMonth: true,
				changeYear: true,
				showButtonPanel: true
			}
	);
	
	$("#playerstats_form select[name=timeperiod]").change(function(){
		$("#playerstats_form input[name=startdate]").val('');
		$("#playerstats_form input[name=enddate]").val('');
		if($(this).val()=='specify' || $(this).val()==""){
			$("#playerstats_form input[name=startdate]").attr('disabled', false);
			$("#playerstats_form input[name=enddate]").attr('disabled', false);
		}
		else{
			$("#playerstats_form input[name=startdate]").attr('disabled', true);
			$("#playerstats_form input[name=enddate]").attr('disabled', true);
		}
	})
	var table;
	$("#playerstats_form").submit(function(e){
		e.preventDefault();
		var $formdata = $(this).serializeArray();
		var $btn = $("#showstats");
		$btn.button('loading');					
		
		if($("#select-brand-structure-id").val()==null){
			alert('Please select ENTITY.');
			$btn.button('reset');
		}
		else{
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/get_player_reports",
				 data: {
					 "params": $formdata
				 },
				 success: function(result, textStatus, jqXHR){

					$("#console_response_url").html(JSON.stringify(result.url));
					$("#httpheader").html(JSON.stringify(result.header));
					$("#console_response").html("<span style='color: white'>" + JSON.stringify(result.apiresponse, null, 4)+ "</span>");
					$("#console_response_readable").html(renderjson.set_show_to_level("all")(result.apiresponse));
					 
					 $btn.button('reset');
					 
					 var dataSet = result.data;
					 var colnames = result.colnames;
					 if(dataSet.length>0){
						$('#tbl_playerstats').html('');
						if ( $.fn.dataTable.isDataTable( '#tbl_playerstats' ) ) {
							
							$('#tbl_playerstats').dataTable().fnDestroy();
							table = $('#tbl_playerstats').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    },
							    "dom": 'T<"clear">lfrtip'
						    });
						}
						else{
							table = $('#tbl_playerstats').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    },
							    "dom": 'T<"clear">lfrtip'
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
					        maxHeight: 200,
							buttonWidth: '300px',
							disableIfEmpty: true,
							enableCaseInsensitiveFiltering: true,
							onChange: function(element, checked){
								var column = table.api().column($(element).val());
						        column.visible( ! column.visible() );
							},
							buttonText: function(options, select) {
				                return 'Show/Hide Columns';
				            }
						
						});
					 }
					 else{
						 if ($.fn.dataTable.isDataTable( '#tbl_playerstats' ) ) {
							 $('#tbl_playerstats').dataTable().fnClearTable(); 
							 $('#tbl_playerstats').dataTable().fnDestroy();
							 $('#tbl_playerstats').html('-No Record Found');
						 }
						 else{
							 $('#tbl_playerstats').html('-No Record Found');
						 }
						 
						 $("#div_toggle_columns").html('');
					 }
					 
				 }
			});
		}
		
		
	})

});

