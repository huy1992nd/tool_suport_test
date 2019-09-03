$(function(){
	/**
	 * list
	 */
	var t = $('table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/ims/ajax/read'
		},
		'order': [[0, 'desc']],
		'columns': [
		    {'name':'id'},
			{'name':'ims'},
			{'name':'open_api_server_url'},
			{'name':'status', 'orderable':false, 'searchable':false},
			{'name':'action', 'orderable':false, 'searchable':false}
		],
		'language': {
	         url: site_url + 'admin/language/ajax/get_datatables_language',
	     }
	});
	
	/**
	 * add IMS
	 */
	$('#add-ims-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#add-ims-modal .btn-create'),
			url = site_url + 'admin/ims/ajax/create';
		btn.button('loading');						
		$.post(url, $('#add-ims-form').serializeArray(), function(response){
			btn.button('reset');
			if(response.success)
			{	
				showAlert(response, $('#li-alert'));				
				$('#li-alert').data('message', true);
				t.draw();						
				$('#add-ims-form')[0].reset();
				$('#add-ims-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#ai-alert'));
				$('#add-ims-modal').scrollTop(0);
			}
		});
	});
	
	$('#add-ims-modal .btn-create').click(function(){
		$('#add_ims_bt').click();
	});

	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
	}).on('shown.bs.modal', function(){
		if($(this).is('#add-ims-modal'))
			$('#add-ims-form').bootstrapValidator('resetForm', true);
	}).on('hide.bs.modal', function(){
		if($(this).is('#edit-ims-modal'))
			$('#edit-ims-form').bootstrapValidator('resetForm', true);
	});
	
	$('table').on('draw.dt', function(){
		var alert = $('#li-alert');
		if(alert.data('show_alert'))
			alert.data('show_alert', false);
		else
			$('.alert').hide();	
	});		
	
	
	/**
	 * edit IMS
	 */
	$('#edit-ims-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#edit-ims-modal .btn-update'),
			url = site_url + 'admin/ims/ajax/update',
			form_data = $(this).serializeArray();
		btn.button('loading');					
		form_data.push({name:'id', value:btn.data('ims_id')});
		$.post(url, form_data, function(response){
			btn.button('reset');
			if(response.success)
			{
				showAlert(response, $('#li-alert'));				
				$('#li-alert').data('show_alert', true);
				t.draw(false);
				$('#edit-ims-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#ei-alert'));
				$('#edit-ims-modal').scrollTop(0);
			}
		});
	});
	
	$('#edit-ims-modal .btn-update').click(function(){
		$('#edit_ims_bt').click();
	});
	
	$('table').on('click', '.edit-ims', function(){
		$('#li-alert').hide();
		var url = site_url + 'admin/ims/ajax/get/' + $(this).attr('data-id');
		$('#loading-indicator').show();		
		$.get(url, function(response){
			$('#loading-indicator').hide();			
			var modal_obj = $('#edit-ims-modal');			
			$('input[name="ims_name"]', modal_obj).val(response.name);
			$('input[name="open_api_server_url"]', modal_obj).val(response.open_api_server_url);
			$('#edit-ims-modal .btn-update').data('ims_id', response.id);
			modal_obj.modal('show');
		});
	});
	
	/**
	 * remove ims
	 */
	$('#remove-ims-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/ims/ajax/delete';
		btn.button('loading');
		$.post(url, {ims_id:btn.data('ims_id')}, function(response){
			btn.button('reset');
			showAlert(response, $('#li-alert'));
			$('#li-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#remove-ims-modal').modal('hide');
		});
	});
	
	$('table').on('click', '.remove-ims', function(){
		var ims_id = $(this).attr('data-id'),
			ims = $(this).closest('tr').find('td:eq(1)').html();
		$('#remove-ims-modal .modal-body p span.ims-name').text(ims);
		$('#remove-ims-modal .btn-remove').data('ims_id', ims_id);
	});
	
});