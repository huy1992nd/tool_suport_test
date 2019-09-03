$(function(){
	
	/**
	 * list
	 */
	var t = $('table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/domains/ajax/read'
		},
		'order': [[0, 'desc']],
		'columns': [
		    {'name':'id'},
			{'name':'domain'},
			{'name':'admin'},
			{'name':'status', 'orderable':false, 'searchable':false},
			{'name':'block'},
			{'name':'action', 'orderable':false, 'searchable':false}
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language',
	    }
	});
	
	/**
	 * add domain
	 */
	$('#add-domain-form').bootstrapValidator({
		excluded: ':disabled',
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#add-domain-modal .btn-create'),
			url = site_url + 'admin/domains/ajax/create';
		btn.button('loading');						
		$.post(url, $('#add-domain-form').serializeArray(), function(response){
			btn.button('reset');					
			if(response.success)
			{		
				showAlert(response, $('#ld-alert'));				
				$('#ld-alert').data('show_alert', true);
				t.draw();						
				$('#add-domain-form')[0].reset();
				$('#add-domain-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#ad-alert'));				
				$('#add-domain-modal').scrollTop(0);							
			}
		});
	});
	$('#add-domain-modal .btn-create').click(function(){
		$('#add_domain_bt').click();
	});
	
	/*$('#add-domain-modal').on('show.bs.modal', function(){
		$('.alert').hide();
		var form = $('form', this);
		if(form.length > 0)
			form[0].reset();
	}).on('shown.bs.modal', function(){
		if($('select[name="access_id"]', this).length > 0)
			$('select[name="access_id"]', this).change();
		else
			$('select[name="brand_id"]', this).change();
	});	
	
	$('table').on('draw.dt', function(){
		var alert = $('#ld-alert');
		if(alert.data('message'))
		{
			alert.addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + alert.data('message')).end().show();
			alert.data('message', null);
		}
		else
			$('.alert').hide();	
	});*/
	
	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
	}).on('shown.bs.modal', function(){
		if($(this).is('#add-domain-modal'))
		{
			var brands = $('select[name="brand_id"]', this),
				checkbox_area = brands.closest('.form-group').next().find('> div');
		
			//$('#add-domain-form', this).data('bootstrapValidator').resetForm();
			$('#add-domain-form', this).data('bootstrapValidator').resetField(brands, true);
			$('#add-domain-form', this).data('bootstrapValidator').resetField('domain', true);
			
			checkbox_area.html('<p class="form-control-static">' + brands.data('please-select-brand-first') + '</p>');
		}
	});
	
	$('table').on('draw.dt', function(){
		var alert = $('#ld-alert');
		if(alert.data('show_alert'))
			alert.data('show_alert', false);
		else
			$('.alert').hide();	
	});			
	
	
	/**
	 * remove domain
	 */
	$('#remove-domain-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/domains/ajax/delete';
		btn.button('loading');
		$.post(url, {domain_id:btn.data('domain_id')}, function(response){
			btn.button('reset');					
			showAlert(response, $('#ld-alert'));
			$('#ld-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#remove-domain-modal').modal('hide');
		});
	});
	$('table').on('click', '.remove-domain', function(){
		var domain_id = $(this).data('id'),
			domain = $(this).closest('tr').find('td:eq(1)').html();
		$('#remove-domain-modal .modal-body p span.domain-name').html(domain);
		$('#remove-domain-modal .btn-remove').data('domain_id', domain_id);
	});
	
	/**
	 * access change
	 */
	$('select[name="access_id"]').change(function(){
		var current = $(this),
			modal = current.closest('.modal'),
			admin = $('select[name="admin_id"]', modal),
			brands = $('select[name="brand_id"]', modal),
			checkbox_area = brands.closest('.form-group').next().find('> div'),
			url = site_url + 'admin/domains/ajax/get_users_by_access/' + current.val();
		
		admin.html('<option>' + current.data('please-wait') + '</option>').attr('disabled', true);
		brands.find('option:eq(0)').text(current.data('please-wait'));
		brands.find('option:gt(0)').remove();
		brands.attr('disabled', true);
		checkbox_area.html('<p class="form-control-static">' + brands.data('please-select-brand-first') + '</p>');
		$.get(url, function(response){
			admin.find('option').remove();
			$.each(response, function(i, v){
				var option = $('<option />', {value:v.id}).text(v.full_name);
				admin.append(option);
			});
			admin.removeAttr('disabled');
			admin.change();
		});	
	});	
	
	/**
	 * admin change
	 */
	$('select[name="admin_id"]').change(function(){
		var current = $(this),
			modal = current.closest('.modal'),
			form = modal.find('form'),
			brands = $('select[name="brand_id"]', modal),
			checkbox_area = brands.closest('.form-group').next().find('> div'),
			url = site_url + 'admin/domains/ajax/get_brands_by_user/' + current.val();
		
		brands.find('option:eq(0)').text(current.data('please-wait'));
		brands.find('option:gt(0)').remove();
		brands.attr('disabled', true);
		checkbox_area.html('<p class="form-control-static">' + brands.data('please-select-brand-first') + '</p>');		
		$.get(url, function(response){
			brands.removeAttr('disabled');
			brands.find('option:eq(0)').text(brands.data('please-select'));
			brands.find('option:gt(0)').remove();
			$.each(response, function(i, v){
				var option = $('<option />', {value:v.id}).text(v.name);
				brands.append(option);
				form.bootstrapValidator('updateStatus', brands, 'NOT_VALIDATED');
			});
		});	
	});
	
	/**
	 * brands change
	 */
	$('select[name="brand_id"]').change(function(){
		var current = $(this),
			modal = current.closest('.modal'),
			form = modal.find('form'),
			admin = $('select[name="admin_id"]', form),
			url = site_url + 'admin/domains/ajax/get_admin_brand_structures/' + current.val() + (admin.length > 0 ? '/' + admin.val() : ''),
			checkbox_area = current.closest('.form-group').next().find('> div');
		if(current.val() == '')
		{
			checkbox_area.html('<p class="form-control-static">' + current.data('please-select-brand-first') + '</p>');
			return false;
		}
		checkbox_area.html('<p class="form-control-static">' + current.data('please-wait') + '</p>');
		$.get(url, function(response){
			$.get(url, function(response){
				checkbox_area.html('');
				$.each(response.brand_structures, function(i, v){
					var form_group = $('<div />', {class: 'checkbox'}),
						cb_label = v.currency + ' (' + v.name + ')',
						disabled = v.disabled ? ' disabled="disabled"' : '';
						//cb_label = v.access_id == '4' ? v.name + ' (' + v.ims_name + ' / ' + v.instance_name + ')' : v.entity_name + ' (' + v.name + ')';
						//cb_label = v.access_id > 6 ? v.currency + ' (' + v.ims_name + ' / ' + v.instance_name + ' / ' + v.name + ' / ' + v.parent_entity_name + ' / ' + v.entity_name + ')' : (v.access_id > 4 ? v.currency + ' (' + v.ims_name + ' / ' + v.instance_name + ' / ' + v.name + ' / ' + v.entity_name + ')' : v.currency + ' (' + v.ims_name + ' / ' + v.instance_name + ' / ' + v.name + ')');
					form_group.append('<label><input type="checkbox" name="structures[]" value="' + v.brand_structure_id + '" data-currency="' + v.currency + '"' + disabled + ' />' + cb_label + '</label>');
					checkbox_area.append(form_group, '<div class="clearfix"></div>');
				});
				
				form.bootstrapValidator('addField', 'structures[]', {
					validators: {
						notEmpty: {
							message: $('select[name="brand_id"]', modal).data('cb-notempty-message')
						}
					}
				});	
			});
		});	
	});
	
	/**
	 * checkbox
	 */
	$('.modal').on('click', ':checkbox[name="structures[]"]', function(){
		var is_checked = $(this).is(':checked'),
			currency = $(this).data('currency');
		if(is_checked)
		{
			$(':checkbox[name="structures[]"]').not(this).filter(function(){
				return $(this).data('currency') == currency;
			}).prop('checked', false);
		}
	});
	
	var _getCountries = function(domain_id){
		url = site_url + 'admin/domains/ajax/get_countries/' + domain_id;
		$.get(url, function(countries){
			var countries_str = '<select class="form-control multiselect" id="select_block_country" name="select_block_country" multiple="multiple">';	
	    	$.each(countries, function(k, v){
	    		var selected = '';
	    		if(typeof v.blocked != 'undefined' && v.blocked == true)
	    			selected = 'selected="selected"';
	    		
				countries_str += '<option value="' + v.id_countries + '" '+selected+' data-id="'+domain_id+'">' + v.name + '</option>';
		    });
			countries_str += '</select>';
			
			$('#div_block_country').html(countries_str);


			$('#select_block_country').multiselect({
		        //includeSelectAllOption: true,
		        enableFiltering: true,
		        maxHeight: 300,
				//buttonWidth: '260px',
				disableIfEmpty: true,
				enableCaseInsensitiveFiltering: true,
				onChange: function(element, checked){
					console.log($(element).val() + ' ' + $(element).data('id'));
				}
			});	
		});	
	}
	
	$('table').on('click', '.block-country', function(){
		var domain_id = $(this).data('id'),
			domain = $(this).closest('tr').find('td:eq(1)').html();
		
		_getCountries($(this).data('id'));
		
		$('#block-country-modal .modal-body p span.domain-name').html(domain);
		$('#block-country-modal .btn-remove').data('domain_id', domain_id);
	});
	
	$('#block-country-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/domains/ajax/block_country';
		btn.button('loading');
		
		$.post(url, {domain_id:btn.data('domain_id'), blocked: $('#select_block_country').val()}, function(response){
			btn.button('reset');					
			showAlert(response, $('#ld-alert'));
			$('#ld-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#block-country-modal').modal('hide');
		});
	});
	
	
});