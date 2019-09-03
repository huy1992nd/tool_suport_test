$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});
var table;
$(document).ready(function() {
	
if (typeof(console) !== "undefined") {
	  window.alert = function(content) {
	    try {
	      window.console.log(content); /* send alerts to console.log if available. */
	    } catch(e) {} /* otherwise do nussink else */
	  }
	}	
	
	
$('#console-form').submit(function(e){
	e.preventDefault();
	var params = $("#apiparams").val();

	$("#console_response_url").html("");
	$("#httpheader").html("");
	$("#httpcode").html("");
	$("#httpcodedesc").html("");
	
	$('#download_response').attr('href', function(){
		return $(this).data('url');
	}).addClass('hidden');
	
	$.ajax({
	 type: "POST",
	 url: site_url + "admin/console/ajax/send_request",
	 data: {
	  "params": params
	 },
	 success: function(result, textStatus, jqXHR){
		var obj = jQuery.parseJSON(result.data);
		var $tabular = jQuery.parseJSON(result.tabular);
		 
		 
		 var  dataSet = $tabular.data;
		 var colnames = $tabular.colnames;
		 
		$("#console_response_url").html(obj.url);
		$("#httpheader").html(obj.header);
		$("#console_response").html("<span style='color: white'>" + JSON.stringify(obj.result, null, 4)+ "</span>");
		$("#console_response_readable").html(renderjson.set_show_to_level("all")(obj.result));
		$("#http_status_code").html(jqXHR.status + " (" + jqXHR.statusText  + ") ");
		$('#tbl_api_result').html('');
		
		$('#download_response').attr('href', function(){
			return $(this).data('url') + '?file=' + obj.file.name;
		}).removeClass('hidden');
		
		 if(dataSet.length>0){

			if ( $.fn.dataTable.isDataTable( '#tbl_api_result' ) ) {
				$('#tbl_api_result').dataTable().fnClearTable(); 
				$('#tbl_api_result').dataTable().fnDestroy();
				$("thead", table).remove();
				
				table = $('#tbl_api_result').dataTable({
					"autoWidth": false,
					"retrieve": true,
					"bdestroy": true,
					"pagingType": "full_numbers", 	
			        "data": dataSet,
			        "columns": colnames,
			        "scrollX": false,
			        "language": {
				        url: site_url + 'admin/language/ajax/get_datatables_language',
				    }
					,"dom": 'T<"clear">lfrtip'
					,"drawCallback": function( settings ) {
				    }
			    });
				
			}
			else{
				table = $('#tbl_api_result').dataTable({
					"autoWidth": false,
					"retrieve": true,
					"bdestroy": true,
					"pagingType": "full_numbers", 	
			        "data": dataSet,
			        "columns": colnames,
			        "scrollX": false,
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
			 if ($.fn.dataTable.isDataTable( '#tbl_api_result' ) ) {
				 $('#tbl_api_result').dataTable().fnClearTable(); 
				 $('#tbl_api_result').dataTable().fnDestroy();
				 $('#tbl_api_result').html('-No Data Found-');

			 }
			 else{
				 $('#tbl_api_result').html('-No Data Found-');
			 }
			 $("#div_toggle_columns").html('');
		 }
		 $("#div_toggle_columns").show();
		
	 },
	 error: function(jqXHR, textStatus, errorThrown){
		 $("#http_status_code").html(jqXHR.status + " (" + jqXHR.statusText  + ") ");
	 }
	});
});

})
 