$(function(){
	
	var upload_url = site_url + 'admin/structures/ajax/upload';
	
	/**
	 * list
	 */
	var t = $('table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/structures/ajax/read'
		},
		'order': [[0, 'desc']],
		'columns': [
		    {'name':'id'},
			{'name':'structure'},
			{'name':'kiosk_admin_name'},
			{'name':'brand'},
			{'name':'currency'},
			{'name':'ims'},
			{'name':'instance'},
			{'name':'action', 'orderable':false, 'searchable':false}
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language',
	    }
	});
	
	/**
	 * add structure
	 */
	$('#add-structure-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#add-structure-modal .btn-create'),
			url = site_url + 'admin/structures/ajax/create';
		btn.button('loading');						
		$.post(url, $('#add-structure-form').serializeArray(), function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#ls-alert'));				
				$('#ls-alert').data('show_alert', true);
				t.draw();						
				$('#add-structure-form')[0].reset();
				$('#add-structure-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#as-alert'));				
				$('#add-structure-modal').scrollTop(0);							
			}
		});
	});
	
	$('#add-structure-modal .btn-create').click(function(){
		$('#add_structure_bt').click();
	});
	
	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
	}).on('shown.bs.modal', function(){
		toggle_btn_upload($(this));
		if($(this).is('#add-structure-modal'))
			$('#add-structure-form').bootstrapValidator('resetForm', true);
	}).on('hide.bs.modal', function(){
		if($(this).is('#edit-structure-modal'))
			$('#edit-structure-form').bootstrapValidator('resetForm', true);
	});
	
	$('table').on('draw.dt', function(){
		var alert = $('#ls-alert');
		if(alert.data('show_alert'))
			alert.data('show_alert', false);
		else
			$('.alert').hide();	
	});		
	
	$('.modal').on('click', '.btn-upload', function(){
		var kind = $(this).attr('data-kind');
		$('#' + kind + '_file').data({'modal':$(this).closest('.modal'), 'btn':$(this)});
		$('#' + kind + '_file').click();
	});
	
	$('.modal input[name="api_certificate_key"], .modal input[name="api_certificate_file"]').on('focus blur', function(e){
		$(this).attr('readonly', function(id, old_value){
			return e.type == 'focus';
		});
	});
		
	/**
	 * edit structure
	 */
	$('#edit-structure-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#edit-structure-modal .btn-update'),
			url = site_url + 'admin/structures/ajax/update',
			form_data = $(this).serializeArray();
		btn.button('loading');					
		form_data.push({name:'id', value:btn.data('structure_id')});
		$.post(url, form_data, function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#ls-alert'));				
				$('#ls-alert').data('show_alert', true);
				t.draw(false);
				$('#edit-structure-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#es-alert'));				
				$('#edit-structure-modal').scrollTop(0);
			}
		});
	});
	$('#edit-structure-modal .btn-update').click(function(){
		$('#edit_structure_bt').click();
	});
	$('table').on('click', '.edit-structure', function(){
		$('#ls-alert').hide();
		var url = site_url + 'admin/structures/ajax/get/' + $(this).attr('data-id');
		$('#loading-indicator').show();				
		$.get(url, function(response){
			$('#loading-indicator').hide();					
			var modal_obj = $('#edit-structure-modal'),
				instance_obj = $('select[name="instance_id"]', modal_obj);
			$('select[name="ims_id"]', modal_obj).val(response.ims_id);
			instance_obj.find('option:gt(0)').remove();
			instance_obj.find('option:eq(0)').text('- Please select -');
			if(response.instances)
			{
				$.each(response.instances, function(i, v){
					var option = $('<option />', {value:v.id}).text(v.name);
					if(v.id == response.instance_id)
						option.attr('selected', true);
					instance_obj.append(option);
				});				
			}
			$('input[name="structure_name"]', modal_obj).val(response.name);
			$('input[name="kiosk_admin_name"]', modal_obj).val(response.kiosk_admin_name);
			$('select[name="currency"]', modal_obj).val(response.currency);
			$('select[name="brand_id"]', modal_obj).val(response.brand_id);
			$('input[name="api_certificate_key"], input[name="api_certificate_key_old"]', modal_obj).val(response.api_certificate_key);
			$('input[name="api_certificate_file"], input[name="api_certificate_file_old"]', modal_obj).val(response.api_certificate_file);						
			$('textarea[name="entity_key"]', modal_obj).val(response.entity_key);
			$('#edit-structure-modal .btn-update').data('structure_id', response.id);
			modal_obj.modal('show');
		});
	});
	
	/**
	 * remove structure
	 */
	$('#remove-structure-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/structures/ajax/delete';
		btn.button('loading');
		$.post(url, {structure_id:btn.data('structure_id')}, function(response){
			btn.button('reset');					
			showAlert(response, $('#ls-alert'));
			$('#ls-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#remove-structure-modal').modal('hide');
		});
	});
	$('table').on('click', '.remove-structure', function(){
		var structure_id = $(this).attr('data-id'),
			structure = $(this).closest('tr').find('td:eq(1)').html();
		$('#remove-structure-modal .modal-body p span.structure-name').html(structure);
		$('#remove-structure-modal .btn-remove').data('structure_id', structure_id);
	});
	
	/**
	 * ssl key file upload
	 */
	$('#ssl_key_file').fileupload({
		url: upload_url,
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#ssl_key_file').data('btn'),
				modal = $('#ssl_key_file').data('modal');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					file.error = $('label[for$="api_certificate_key"]', modal).text() + ': ' + file.error;
					showAlert(file, $('.alert', modal));
					$.scrollTo('.breadcrumb');
				}
				else
				{
					var ims_name = $('select[name="ims_id"] option:selected', modal).text(),
						instance_name = $('select[name="instance_id"] option:selected', modal).text(),
						entity_name = $('input[name="structure_name"]', modal).val(),
						d = new Date(),
						ymd = d.getFullYear() + '' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '' + (d.getDate() < 10 ? '0' : '') + d.getDate(),
						ssl_key_name = ims_name + '_' + instance_name + '_' + entity_name + '_' + ymd + '.key';
					
					$('input[name="api_certificate_key"]', modal).val(ssl_key_name.toLowerCase());
					$('input[name="api_certificate_key_old"]', modal).val(file.name);
					
					modal.find('form').bootstrapValidator('revalidateField', 'api_certificate_key');
					
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#ssl_key_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#ssl_key_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	
	/**
	 * ssl certificate file upload
	 */
	$('#ssl_cert_file').fileupload({
		url: upload_url,
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#ssl_cert_file').data('btn'),
				modal = $('#ssl_cert_file').data('modal');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					file.error = $('label[for$="api_certificate_file"]', modal).text() + ': ' + file.error;
					showAlert(file, $('.alert', modal));
					$.scrollTo('.breadcrumb');
				}
				else
				{
					var ims_name = $('select[name="ims_id"] option:selected', modal).text(),
						instance_name = $('select[name="instance_id"] option:selected', modal).text(),
						entity_name = $('input[name="structure_name"]', modal).val(),
						d = new Date(),
						ymd = d.getFullYear() + '' + ((d.getMonth() + 1) < 10 ? '0' : '') + (d.getMonth() + 1) + '' + (d.getDate() < 10 ? '0' : '') + d.getDate(),
						ssl_certificate_name = ims_name + '_' + instance_name + '_' + entity_name + '_' + ymd + '.pem';
					
					$('input[name="api_certificate_file"]', modal).val(ssl_certificate_name.toLowerCase());
					$('input[name="api_certificate_file_old"]', modal).val(file.name);
					
					modal.find('form').bootstrapValidator('revalidateField', 'api_certificate_file');
					
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#ssl_cert_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#ssl_cert_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');	
	
	/**
	 * IMS
	 */
	$('select[name="ims_id"]').change(function(){
		var selected = $(this).val(),
			modal = $(this).closest('.modal'),
			select = $('select[name="instance_id"]', modal),
			first_option = $('option:eq(0)', select);
		first_option.text(first_option.data('please-wait'));
		$('option:gt(0)', select).remove();						
		toggle_btn_upload(modal);
		if(selected != '')
		{
			var url = site_url + 'admin/structures/ajax/get_ims_instances/' + selected;
			$.get(url, function(response){
				if(! response.error)
				{
					first_option.text(first_option.data('please-select'));
					$.each(response, function(i, instance){
						var option = $('<option></option>', {value: instance.id}).text(instance.name);
						select.append(option);
					});
					modal.find('form').bootstrapValidator('updateStatus', select, 'NOT_VALIDATED');
				}
				else
					first_option.text(first_option.data('please-select-other-ims'));				
			});
		}
		else
			first_option.text(first_option.data('please-select-ims-first'));
	});
	
	$('select[name="instance_id"], input[name="structure_name"]').change(function(){
		toggle_btn_upload($(this).closest('.modal'));
	});
	
	var toggle_btn_upload = function(modal){
		var check = $('select[name="ims_id"]', modal).val() != '' && 
					$('select[name="instance_id"]', modal).val() != '' &&
					$('input[name="structure_name"]', modal).val() != '';
		$('.btn-upload', modal).attr('disabled', ! check);
	};	
});