$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});

$(function(){
	var table = $('table').DataTable({
		processing: true,
		pagingType: 'simple',
		ajax: {
			url: site_url + 'admin/dashboard/ajax/get_entity_list'
		},
		displayLength: 3,
		lengthChange: true,
		info: true,
		ordering: true,
		searching: true,
		columns: [
		    {'data':'dateandtime'},
			{'data':'entityname'},
			{'data':'totaldepositbalance'},
			{'data':'totalbonusbalance'}
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language_dashboard',
	    },
		columnDefs: [
           {
               "targets": [ 0 ],
               "visible": false,
               "searchable": false
           }
       ],
		initComplete: function () {
            var api = this.api();
            var row = api.rows( {page:'current'} ).data();
            if(row[0]){
            	$("#lastupdate").html('<b>' + row[0].dateandtime + '</b>');
            }
           
        }
	});
	
})   

$("#update_entity_list_btn").click(function(){
	if(confirm(translate.dashboard_update)){
		$.ajax({
			 type: "POST",
			 url: site_url + "admin/dashboard/ajax/update_entity_list",
			 success: function(result){
				 if(result.success){
					 location.reload();
				 }
			 }
		});
	}
});

 