$(function(){
 	
	var instance_table = $('#instance-url-table').DataTable({
        "columnDefs": [
            { "visible": false, "targets": [0], "searchable": false }
        ],
        "order": [[ 0, 'asc' ]],
        "displayLength": 25,
        "pagingType": 'full_numbers',
		"language": {
	        "url": site_url + 'admin/language/ajax/get_datatables_language',
	    },
	    "ajax": {
			"url": site_url + 'admin/casinoupdateurl/ajax/get_instance_url'
		},
		"columns": [
				    {'data':'instance'},
					{'data':'url'},
					{'data':'action'}
		],
        "drawCallback": function ( settings ) {
            var api = this.api();
            var rows = api.rows( {page:'current'} ).nodes();
            var last=null;
 
            api.column(0, {page:'current'} ).data().each( function ( group, i ) {
                if ( last !== group ) {
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+group+'</td></tr>'
                    );
 
                    last = group;
                }
            } );
        }
    } );
 
    // Order by the grouping
    $('#instance-url-table tbody').on( 'click', 'tr.group', function () {
        var currentOrder = instance_table.order()[0];
        if ( currentOrder[0] === 0 && currentOrder[1] === 'asc' ) {
        	instance_table.order( [ 0, 'desc' ] ).draw();
        }
        else {
        	instance_table.order( [ 0, 'asc' ] ).draw();
        }
    } );
    
    $('#add-instance-url-form').submit(function(e){
    	var btn = $('#add-instance-url-modal .btn-update'),
			url = site_url + 'admin/casinoupdateurl/ajax/create',
			form_data = $(this).serializeArray();
	    	
	    	$.post(url, form_data, function(response){
				var modal_obj = $('#add-instance-url-modal');
				btn.button('reset');	
				if(response.success)
				{
					showAlert(response, $('#instance-url-alert'));				
					instance_table.ajax.reload();
					modal_obj.modal('hide');
					
				}
				else
				{
					//showAlert(response, $('#ei-alert'));
					//$('#edit-instance-modal').scrollTop(0);
				}
			});
    	e.preventDefault();
    })
	 
    $('#edit-instance-url-form').submit(function(e){
    	var btn = $('#edit-instance-url-modal .btn-update'),
			url = site_url + 'admin/casinoupdateurl/ajax/update',
			form_data = $(this).serializeArray();
	    	form_data.push({name:'id', value:btn.data('instance_url_id')});
	    	
	    	$.post(url, form_data, function(response){
				var modal_obj = $('#edit-instance-url-modal');
				btn.button('reset');	
				if(response.success)
				{
					showAlert(response, $('#instance-url-alert'));				
					instance_table.ajax.reload();
					modal_obj.modal('hide');
					
				}
				else
				{
					//showAlert(response, $('#ei-alert'));
					//$('#edit-instance-modal').scrollTop(0);
				}
			});
    	e.preventDefault();
    })
	
    
    /**
	 * remove structure
	 */
	$('#remove-instance-url-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/casinoupdateurl/ajax/delete';
		btn.button('loading');
		$.post(url, {url_id:btn.data('url_id')}, function(response){
			btn.button('reset');
			if(response.success)
			{
				showAlert(response, $('#instance-url-alert'));				
				instance_table.ajax.reload();
				$('#remove-instance-url-modal').modal('hide');
				
			}
			else
			{
				//showAlert(response, $('#ei-alert'));
				//$('#edit-instance-modal').scrollTop(0);
			}
			
		});
	});
    
    instance_table.on('click', '.remove-url', function(){
		var url_id = $(this).attr('data-id'),
			url = $(this).closest('tr').find('td:eq(0)').html();
		
		$('#remove-instance-url-modal .modal-body p span.instance-url-name').html(url);
		$('#remove-instance-url-modal .btn-remove').data('url_id', url_id);
	});
    
    
	instance_table.on('click', '.edit-instance-url', function(){
		$('#instance-url-alert').hide();
		var url = site_url + 'admin/casinoupdateurl/ajax/get_url_details';
		var id = $(this).attr('data-id');
		
		$('#loading-indicator').show();
		$.ajax({
			type: "POST",
			url: url,
			data: {
				"id": id
			},
			success: function(result){
				if(result){
					var obj = result[0];
					var modal_obj = $('#edit-instance-url-modal');
					
					$('#loading-indicator').hide();
					$("#edit-instance-name").html(obj.name);
					$("#edit-instance-url").val(obj.update_url)
					$('#edit-instance-url-modal .btn-update').data('instance_url_id', id);
					
					modal_obj.modal('show');
				}
			}
		});
		
	});
	
	$('#add-instance-url-modal').on('show.bs.modal', function(){
		 $('#add-instance-url-form').trigger("reset");
	}).on('shown.bs.modal', function(){
		
	}).on('hide.bs.modal', function(){
		
	});
    
});