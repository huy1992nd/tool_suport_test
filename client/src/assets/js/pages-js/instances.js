$(function(){
	/**
	 * list
	 */
	var t = $('table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/instances/ajax/read'
		},
		'order': [[0, 'desc']],
		'columns': [
		    {'name':'id'},
			{'name':'instance'},
			{'name':'ims'},
			{'name':'pas_integration_url'},
			{'name':'flash_game_base_url'},
			{'name':'mobile_game_base_url'},
			{'name':'status', 'orderable':false, 'searchable':false},
			{'name':'action', 'orderable':false, 'searchable':false}
		],
		'language': {
	         url: site_url + 'admin/language/ajax/get_datatables_language',
	     }
	});
	
	/**
	 * add instance
	 */
	$('#add-instance-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#add-instance-modal .btn-create'),
			url = site_url + 'admin/instances/ajax/create';
		btn.button('loading');						
		$.post(url, $('#add-instance-form').serializeArray(), function(response){
			btn.button('reset');					
			if(response.success)
			{	
				showAlert(response, $('#li-alert'));				
				$('#li-alert').data('show_alert', true);
				t.draw();						
				$('#add-instance-form')[0].reset();
				$('#add-instance-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#ai-alert'));
				$('#add-instance-modal').scrollTop(0);
			}
		});
	});
	
	$('#add-instance-modal .btn-create').click(function(){
		$('#add_instance_bt').click();
	});
	
	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
	}).on('shown.bs.modal', function(){
		if($(this).is('#add-instance-modal'))
			$('#add-instance-form').bootstrapValidator('resetForm', true);
	}).on('hide.bs.modal', function(){
		if($(this).is('#edit-instance-modal'))
			$('#edit-instance-form').bootstrapValidator('resetForm', true);
	});
	
	$('table').on('draw.dt', function(){
		var alert = $('#li-alert');
		if(alert.data('show_alert'))
			alert.data('show_alert', false);
		else
			$('.alert').hide();	
	});		
	
	/**
	 * edit instance
	 */
	$('#edit-instance-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#edit-instance-modal .btn-update'),
			url = site_url + 'admin/instances/ajax/update',
			form_data = $(this).serializeArray();
		btn.button('loading');					
		form_data.push({name:'id', value:btn.data('instance_id')});
		$.post(url, form_data, function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#li-alert'));				
				$('#li-alert').data('show_alert', true);
				t.draw(false);
				$('#edit-instance-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#ei-alert'));
				$('#edit-instance-modal').scrollTop(0);
			}
		});
	});
	
	$('#edit-instance-modal .btn-update').click(function(){
		$('#edit_instance_bt').click();
	});
	
	$('table').on('click', '.edit-instance', function(){
		$('#li-alert').hide();
		var url = site_url + 'admin/instances/ajax/get/' + $(this).attr('data-id');
		$('#loading-indicator').show();		
		$.get(url, function(response){
			$('#loading-indicator').hide();			
			var modal_obj = $('#edit-instance-modal');
			$('select[name="ims_id"]', modal_obj).val(response.ims_id);
			$('input[name="instance_name"]', modal_obj).val(response.name);
			$('input[name="pas_integration_url"]', modal_obj).val(response.pas_integration_url);
			$('input[name="flash_game_base_url"]', modal_obj).val(response.flash_game_base_url);
            $('input[name="mobile_game_base_url"]', modal_obj).val(response.mobile_game_base_url);
			$('#edit-instance-modal .btn-update').data('instance_id', response.id);
			modal_obj.modal('show');
		});
	});
	
	/**
	 * remove instance
	 */
	$('#remove-instance-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/instances/ajax/delete';
		btn.button('loading');
		$.post(url, {instance_id:btn.data('instance_id')}, function(response){
			btn.button('reset');					
			showAlert(response, $('#li-alert'));
			$('#li-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#remove-instance-modal').modal('hide');
		});
	});
	
	$('table').on('click', '.remove-instance', function(){
		var instance_id = $(this).attr('data-id'),
			instance = $(this).closest('tr').find('td:eq(1)').html();
		$('#remove-instance-modal .modal-body p span.instance-name').html(instance);
		$('#remove-instance-modal .btn-remove').data('instance_id', instance_id);
	});	
});