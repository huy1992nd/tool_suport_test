$(function(){
	/**
	 * list
	 */
	var t = $('table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/brands/ajax/read'
		},
		'order': [[0, 'desc']],
		'columns': [
		    {'name':'id'},
			{'name':'brand'},
			{'name':'currency', 'orderable':false},
			{'name':'access'},
			{'name':'credits', 'orderable':false, 'searchable':false},
			{'name':'action', 'orderable':false, 'searchable':false}
		],
		'language': {
	         url: site_url + 'admin/language/ajax/get_datatables_language',
	     }
	});
	
	t.on('preXhr.dt', function(e, settings, data){
		data.my_brands = $('input[name="show_brand"]:checked').val();
	});
	
	$('input[name="show_brand"]').change(function(){
		t.draw();
	});
	
	/**
	 * add brand
	 */
	$('#add-brand-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	tier_1: {
        		enabled: false
        	}
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#add-brand-modal .btn-create'),
			url = site_url + 'admin/brands/ajax/create';
		btn.button('loading');						
		$.post(url, $('#add-brand-form').serializeArray(), function(response){
			btn.button('reset');					
			if(response.success)
			{	
				showAlert(response, $('#lb-alert'));				
				$('#lb-alert').data('show_alert', true);
				t.draw();						
				$('#add-brand-form')[0].reset();
				$('#add-brand-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#ab-alert'));
				$('#add-brand-modal').scrollTop(0);							
			}
		});
	});
	
	$('#add-brand-modal .btn-create').click(function(){
		$('#add_brand_bt').click();
	});
	
	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
	}).on('shown.bs.modal', function(){
		if($(this).is('#add-brand-modal'))
			$('#add-brand-form').bootstrapValidator('resetForm');
	}).on('hide.bs.modal', function(){
		if($(this).is('#edit-brand-modal'))
			$('#edit-brand-form').bootstrapValidator('resetForm', true);
	});
	
	$('table').on('draw.dt', function(){
		var alert = $('#lb-alert');
		if(alert.data('show_alert'))
			alert.data('show_alert', false);
		else
			$('.alert').hide();	
	});	
	
	/**
	 * edit brand
	 */
	$('#edit-brand-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
	    fields: {
	    	tier_1: {
	    		enabled: false
	    	}
	    }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#edit-brand-modal .btn-update'),
			url = site_url + 'admin/brands/ajax/update',
			form_data = $(this).serializeArray();
		btn.button('loading');					
		form_data.push({name:'id', value:btn.data('brand_id')});
		$.post(url, form_data, function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#lb-alert'));				
				$('#lb-alert').data('show_alert', true);
				t.draw();						
				$('#edit-brand-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#eb-alert'));
				$('#edit-brand-modal').scrollTop(0);
			}
		});
	});
	
	$('#edit-brand-modal .btn-update').click(function(){
		$('#edit_brand_bt').click();
	});
	
	var kiosk_admin_names = [],
		entity_names = [];
	
	$('table').on('click', '.edit-brand', function(){
		$('#lb-alert').hide();
		var url = site_url + 'admin/brands/ajax/get/' + $(this).attr('data-id');
		$('#loading-indicator').show();
		$.get(url, function(response){
			$('#loading-indicator').hide();
			var modal = $('#edit-brand-modal'),
				form = modal.find('form'),
				structures = $.map(response.brand_structures, function(v, i){
					return v.parent_brand_structure_id;
				}),
				tier_1 = $('select[name="tier_1"]', modal);
			
			modal.find('.tier-2').remove();	
			
			$('select[name="access_id"] option', modal).each(function(){
				if(this.value == response.access_id)
					$(this).attr('selected', true);
				else
					$(this).removeAttr('selected');
			});
			
			tier_1.find('option').each(function(){
				$(this).toggleClass('hidden', this.value == response.id).removeAttr('selected');
			});
						
			if(response.access_id == '4')
				tier_1.closest('.form-group').addClass('hidden');
			else
			{			
				tier_1.find('option:gt(0)').remove();
				
				$.each(response.parent_brands, function(i, v){
					var option = $('<option />', {value:v.id}).text(v.name);
					tier_1.append(option);
				});
				
				var tier_1_opt = tier_1.find('option[value="' + response.parent_id + '"]');
				
				tier_1.closest('.form-group').removeClass('hidden');
				
				form.bootstrapValidator('addField', tier_1);
				form.bootstrapValidator('enableFieldValidators', 'tier_1', true);
				
				if(response.parent_id == null)
					tier_1.find('option').removeAttr('selected');
				else
				{
					tier_1_opt.attr('selected', true);
					
					var form_group = $('<div />', {class:'form-group tier-2'});
					
					form_group.append('<label class="col-md-3 control-label">' + (response.parent_brand_structures[0].access_id == '4' ? tle_label : entities_label) + '</label>');
					form_group.append('<div class="col-md-8"></div>');
					
					$.each(response.parent_brand_structures, function(i, v){
						var cb_label = v.access_id == '4' ? v.name + ' (' + v.ims_name + ' / ' + v.instance_name + ')' : v.entity_name + ' (' + v.name + ')',
							checked = structures.indexOf(v.brand_structure_id);
						
						form_group.find('> div').append('<div class="checkbox"><label><input type="checkbox" name="cb_structures[]" value="' + v.brand_structure_id + '"' + (checked != -1 ? ' checked="checked"' : '') + ' data-currency="' + v.currency + '" />' + cb_label + '</label></div>');
						
					});
					
					$('input[type="submit"]', modal).before(form_group);				
					
					form.bootstrapValidator('addField', 'cb_structures[]', {
						validators: {
							notEmpty: {
								message: $('select[name="tier_1"]', modal).data('cb-notempty-message')
							}
						}
					});
					form.bootstrapValidator('revalidateField', 'cb_structures[]');
					
					$.each(response.parent_brand_structures, function(i, v){
						var checked = structures.indexOf(v.brand_structure_id),
							label = v.access_id == '4' ? v.name + ' (' + v.ims_name + ' / ' + v.instance_name + ')' : v.entity_name + ' (' + v.name + ')';
							//label = v.access_id == '4' ? v.name + ' (' + v.ims_name + ' / ' + v.instance_name + ')' : v.entity_name + ' (' + v.ims_name + ' / ' + v.instance_name + ' / ' + v.name + ')';
						if(checked != -1)
						{
							var form_group_en = $('<div />', {class:'form-group tier-2'}),
								form_group_ek = $('<div />', {class:'form-group tier-2'}),
								form_group_currency = $('<div />', {class:'form-group tier-2'}),
								form_group_kan = $('<div />', {class:'form-group tier-2'}),
								en_obj = $('<input />', {
									name: 'entity_name[' + v.brand_structure_id + ']', 
									type: 'text', 
									class: 'form-control', 
									id: 'entity_name_' + v.brand_structure_id,
									value: response.brand_structures[checked].entity_name,
									'data-brand-structure-id': v.brand_structure_id,
									'data-bv-notempty': true,
									'data-bv-notempty-message': $('input[name="brand_name"]', modal).data('bv-notempty-message')									
								}).css({
									'text-transform':'uppercase'
								}).on({
									'change': entity_name_change, 
									'typeahead:selected typeahead:autocompleted': function(){
										en_obj.change();
									}
								}),
								kan_obj = $('<input />', {
									name: 'kiosk_admin_name[' + v.brand_structure_id + ']', 
									type: 'text', 
									class: 'form-control', 
									id: 'kiosk_admin_name_' + v.brand_structure_id,
									value: response.brand_structures[checked].kiosk_admin_name,
									'data-brand-structure-id': v.brand_structure_id
								}).css({
									'text-transform': 'uppercase',
									'padding-right': '42.5px'
								}),
								ek_obj = $('<textarea />', {
									name: 'entity_key[' + v.brand_structure_id + ']', 
									class: 'form-control', 
									id: 'entity_key_' + v.brand_structure_id,
									'data-bv-notempty': true,
									'data-bv-notempty-message': $('input[name="brand_name"]', modal).data('bv-notempty-message')									
								}).html(response.brand_structures[checked].entity_key);
							
							entity_names[v.brand_structure_id] = new Bloodhound({
								datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
								queryTokenizer: Bloodhound.tokenizers.whitespace,
								local: [{'name':$('input[name="brand_name"]', form).val() + v.currency}],
								limit: 10,
								dupDetector: function(remoteMatch, localMatch){
									return remoteMatch.name == localMatch.name;
								},				
								remote: {
									url: site_url + 'admin/brands/ajax/get_entities/' + v.brand_structure_id + '/%QUERY',
									filter: function(list){
										entity_names[v.brand_structure_id].clearPrefetchCache();										
										return $.map(list, function(entity){ return {name:entity}})
									}
								}
							}),
							
							kiosk_admin_names[v.brand_structure_id] = new Bloodhound({
								datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
								queryTokenizer: Bloodhound.tokenizers.whitespace,
								local: [{'name':$('input[name="brand_name"]', form).val() + v.currency}],
								prefetch: {
									url: site_url + 'admin/brands/ajax/get_entity_info/' + v.brand_structure_id + '?entity_name=' + response.brand_structures[checked].entity_name ,
									filter: function(list){
										return list.kiosk_admins ? list.kiosk_admins : [];
									}
								}
							}),
							
							entity_names[v.brand_structure_id].initialize(true);
							kiosk_admin_names[v.brand_structure_id].initialize(true);
							
							form_group_currency.append('<label class="col-md-3 control-label">' + currency_label + '</label>');
							form_group_currency.append('<div class="col-md-5"><p class="form-control-static">' + v.currency + '</p></div>');
							
							form_group_en.append('<label class="col-md-3 control-label">' + entity_name_label + '</label>');
							form_group_en.append('<div class="col-md-5"><div class="scrollable-dropdown-menu"></div></div>');
							form_group_en.find('div.scrollable-dropdown-menu').append(en_obj);	
							
							form_group_kan.append('<label class="col-md-3 control-label">' + kiosk_admin_name_label + '</label>');
							form_group_kan.append('<div class="col-md-5"><div class="scrollable-dropdown-menu"></div></div>');
							form_group_kan.find('div.scrollable-dropdown-menu').append(kan_obj);																	
							
							form_group_ek.append('<label class="col-md-3 control-label">' + entity_key_label + '</label>');
							form_group_ek.append('<div class="col-md-5"></div>');
							form_group_ek.find('> div').append(ek_obj);
							
							form_group.after('<fieldset class="fieldset-' +  v.brand_structure_id + ' tier-2"><legend>' + label + '</legend></fieldset>');
							form_group.next('fieldset').append(form_group_currency, form_group_en, form_group_kan, form_group_ek);
							
							en_obj.typeahead(null, {
								name: 'entities',
								displayKey: 'name',
								source: entity_names[v.brand_structure_id].ttAdapter()
							});	
							
							kan_obj.typeahead(null, {
								name: 'kiosk_admins',
								displayKey: 'name',
								source: kiosk_admin_names[v.brand_structure_id].ttAdapter()
							});
							
							form.bootstrapValidator('addField', en_obj);
							form.bootstrapValidator('addField', ek_obj);
							form.bootstrapValidator('revalidateField', en_obj);
							form.bootstrapValidator('revalidateField', ek_obj);
							
						}
							
						/*var cb_label = v.access_id == '4' ? v.name + ' (' + v.ims_name + ' / ' + v.instance_name + ')' : v.entity_name + ' (' + v.ims_name + ' / ' + v.instance_name + ' / ' + v.name + ')';
						
						form_group.append('<label class="col-md-3 control-label">' + (v.access_id == '4' ? 'TLE ' : 'Entity ') + (i + 1) + '</label>');
						form_group.append('<div class="col-md-8"></div>');
						form_group.find('> div').append('<div class="checkbox"><label><input type="checkbox" name="cb_structures[]" value="' + v.brand_structure_id + '"' + (checked != -1 ? ' checked="checked"' : '') + ' />' + cb_label + '</label></div>');
						
						$('input[type="submit"]', modal).before(form_group, form_group_en, form_group_ek);*/
												
					});					
				}
			}
			
			$('input[name="brand_name"]', modal).attr('value', response.name);
			$('#edit-brand-modal .btn-update').data('brand_id', response.id);
			
			form.bootstrapValidator('revalidateField', 'brand_name');
			
			modal.one('shown.bs.modal', function(){
				$('input[name="brand_name"]', form).change();				
			});
			
			modal.modal('show');
		});
	});
	
	/**
	 * view brand
	 */
	$('table').on('click', '.view-brand', function(){
		$('#lb-alert').hide();
		var url = site_url + 'admin/brands/ajax/get/' + $(this).attr('data-id'),
			access_name = $(this).attr('data-access-name');
		$('#loading-indicator').show();
		$.get(url, function(response){
			$('#loading-indicator').hide();
			var modal = $('#view-brand-modal'),
				form = modal.find('form'),
				structures = $.map(response.brand_structures, function(v, i){
					return v.parent_brand_structure_id;
				}),
				tier_1 = $('select[name="tier_1"]', modal);
			
			modal.find('.tier-2').remove();	
			
			$('#view_access_type', modal).html(access_name);
									
			var form_group = $('<div />', {class:'form-group tier-2'});
			
			form.append(form_group);				
					
			$.each(response.brand_structures, function(i, v){
				var label = v.access_id == '4' ? v.name + ' (' + v.ims_name + ' / ' + v.instance_name + ')' : v.entity_name + ' (' + v.name + ')',
					form_group_en = $('<div />', {class:'form-group tier-2'}),
					form_group_ek = $('<div />', {class:'form-group tier-2'}),
					form_group_currency = $('<div />', {class:'form-group tier-2'}),
					form_group_kan = $('<div />', {class:'form-group tier-2'}),
					en_obj = $('<p />', {
						class: 'form-control-static'
					}).css({
						'text-transform':'uppercase'
					}).html(response.brand_structures[i].entity_name),
					kan_obj = $('<p />', {
						class: 'form-control-static'
					}).css({
						'text-transform': 'uppercase'
					}).html(response.brand_structures[i].kiosk_admin_name),
					ek_obj = $('<p />', {
						class: 'form-control-static'
					}).css({
						'word-break':'break-all'
					}).html(response.brand_structures[i].entity_key);
												
				form_group_currency.append('<label class="col-md-4 control-label">' + currency_label + '</label>');
				form_group_currency.append('<div class="col-md-5"><p class="form-control-static">' + v.currency + '</p></div>');
				
				form_group_en.append('<label class="col-md-4 control-label">' + entity_name_label + '</label>');
				form_group_en.append('<div class="col-md-5"></div>');
				form_group_en.find('> div').append(en_obj);	
				
				form_group_kan.append('<label class="col-md-4 control-label">' + kiosk_admin_name_label + '</label>');
				form_group_kan.append('<div class="col-md-5"></div>');
				form_group_kan.find('> div').append(kan_obj);																	
				
				form_group_ek.append('<label class="col-md-4 control-label">' + entity_key_label + '</label>');
				form_group_ek.append('<div class="col-md-8"></div>');
				form_group_ek.find('> div').append(ek_obj);
				
				form_group.after('<fieldset class="fieldset-' +  v.brand_structure_id + ' tier-2"><legend>' + label + '</legend></fieldset>');
				form_group.next('fieldset').append(form_group_currency, form_group_en, form_group_kan, form_group_ek);
			});
			
			$('#viewBrandModalLabel', modal).html(response.name);
			
			modal.modal('show');
		});
	});
	
	
	/**
	 * remove brand
	 */
	$('#remove-brand-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/brands/ajax/delete';
		btn.button('loading');
		$.post(url, {brand_id:btn.data('brand_id')}, function(response){
			btn.button('reset');					
			showAlert(response, $('#lb-alert'));
			$('#lb-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#remove-brand-modal').modal('hide');
		});
	});
	
	$('table').on('click', '.remove-brand', function(){
		var brand_id = $(this).attr('data-id'),
			brand = $(this).closest('tr').find('td:eq(1)').html();
		$('#remove-brand-modal .modal-body p span.brand-name').text(brand);
		$('#remove-brand-modal .btn-remove').data('brand_id', brand_id);
	});
	
	/**
	 * access change
	 */
	$('select[name="access_id"]').change(function(){
		var current = $(this),
			value = current.val(),
			modal = current.closest('.modal'),
			form = current.closest('form'),
			tier_1 = $('select[name="tier_1"]', modal),
			access_id = $('input[name="admin_access_id"]', modal).val(),
			admin_id = $('input[name="admin_id"]', modal).val();
			
		tier_1.closest('.form-group').toggleClass('hidden', value == '4');
		//tier_1.attr('required', value != '4');
		if(tier_1.find('option:selected').is('.hidden'))
			tier_1.find('option:selected').removeAttr('selected');
		if(value == '4')
		{
			form.bootstrapValidator('removeField', 'tier_1');
			
			if($(':checkbox', form).length > 0)
				form.bootstrapValidator('removeField', 'cb_structures[]');
			
			if($('fieldset', form).length > 0)
			{
				$('fieldset', form).each(function(){
					form.bootstrapValidator('removeField', $('input[type="text"]', this));
					form.bootstrapValidator('removeField', $('textarea', this));
				});
			}
				
			$('.tier-2', modal).remove();
			tier_1.find('option').removeAttr('selected');			
		}
		else
		{
			var url = site_url + (access_id == '2' ? 'admin/brands/ajax/get_brands_by_access/' : 'admin/brands/ajax/get_brands_by_user/' + admin_id + '/') + (current.val() - 2);
			current.after('<p class="help-block">' + $('.btn-primary', modal).data('loading-text') + '</p>');
			$.get(url, function(response){
				var skip_brand_id = modal.is('#edit-brand-modal') ? $('.btn-update', modal).data('brand_id') : null;
				tier_1.find('option:gt(0)').remove();
				$.each(response, function(i, v){
					if(v.id == skip_brand_id)
						return true;
					var option = $('<option />', {value:v.id}).text(v.name);
					tier_1.append(option);
				});
				form.bootstrapValidator('addField', tier_1);
				form.bootstrapValidator('enableFieldValidators', 'tier_1', true);
				current.next('p').remove();
				modal.find('.tier-2').remove();				
			});	
		}		
	});	
	
	/**
	 * tier 1 change
	 */
	$('select[name="tier_1"]').change(function(){
		var current_fg = $(this).closest('.form-group'),
			value = $(this).val(),
			modal = $(this).closest('.modal'),
			url = site_url + 'admin/brands/ajax/get_brand_structures/' + value;
		modal.find('.tier-2').remove();		
		if(value == '')
			return false;
		$('> div', current_fg).append('<p class="help-block">' + $('.btn-primary', modal).data('loading-text') + '</p>');
		$.get(url, function(response){
			$('> div > p', current_fg).remove();
			if(! response.error)
			{
				var form_group = $('<div />', {class:'form-group tier-2'});
				//form_group.append('<label class="col-md-3 control-label">' + (v.access_id == '4' ? 'TLE ' : 'Entity ') + (i + 1) + '</label>');
				form_group.append('<label class="col-md-3 control-label">' + (response[0].access_id == '4' ? tle_label : entities_label) + '</label>');
				form_group.append('<div class="col-md-8"></div>');
				
				$.each(response, function(i, v){
					var cb_label = v.access_id == '4' ? v.name + ' (' + v.ims_name + ' / ' + v.instance_name + ')' : v.entity_name + ' (' + v.name + ')';
					
					form_group.find('> div').append('<div class="checkbox"><label><input type="checkbox" name="cb_structures[]" value="' + v.brand_structure_id + '" data-currency="' + v.currency + '" />' + cb_label + ' </label></div>');
					
				});
				
				$('input[type="submit"]', modal).before(form_group);				
				
				modal.find('form').bootstrapValidator('addField', 'cb_structures[]', {
					validators: {
						notEmpty: {
							message: $('select[name="tier_1"]', modal).data('cb-notempty-message')
						}
					}
				}).bootstrapValidator('enableFieldValidators', 'cb_structures[]', true);				
			}
		});
	});	
	
	/**
	 * brand name change
	 */
	$('input[name="brand_name"]').change(function(){
		var current = $(this),
			modal = current.closest('.modal'),
			brand_name = current.val(),
			checkboxes = $(':checkbox', modal),
			old_brand_name = current.data('old_brand_name');
		if(checkboxes.length > 0)
		{
			checkboxes.filter(':checked').each(function(){
				var bs_id = this.value,
					currency = $(this).data('currency');
				entity_names[bs_id].clear();
				entity_names[bs_id].local = [{'name':brand_name + currency}];
				entity_names[bs_id].initialize(true);
				
				var kan_local = kiosk_admin_names[bs_id].local;
				
				if(old_brand_name)
				{
					kan_local = $.grep(kan_local, function(obj, i){
						return obj.name != old_brand_name + currency;
					});
				}
				
				kiosk_admin_names[bs_id].clear();
				kiosk_admin_names[bs_id].add([{'name':brand_name + currency}]);
				kiosk_admin_names[bs_id].add(kan_local);				
			});
			
			current.data('old_brand_name', brand_name);
		}
	});
	
	/**
	 * structure change
	 */
	$('.modal').on('change', '.tier-2 :checkbox', function(){
		var current = $(this),
			is_checked = current.is(':checked'),
			value = current.val(),
			label = current.parent().text(),
			modal = current.closest('.modal'),
			current_fg = current.closest('.form-group');
		if(is_checked)
		{
			var form_group_en = $('<div />', {class:'form-group tier-2'}),
				form_group_ek = form_group_en.clone(),
				form_group_currency = form_group_en.clone(),
				form_group_kan = form_group_en.clone(),
				en_obj = $('<input />', {
					name: 'entity_name[' + value + ']', 
					type: 'text', 
					class: 'form-control', 
					id: 'entity_name_' + value,
					'data-brand-structure-id': value,
					'data-bv-notempty': true,
					'data-bv-notempty-message': $('input[name="brand_name"]', modal).data('bv-notempty-message')
				}).css({
					'text-transform': 'uppercase'
				}).on({
					'change': entity_name_change, 
					'typeahead:selected typeahead:autocompleted': function(){
						en_obj.change();
					}
				}),
				kan_obj = $('<input />', {
					name: 'kiosk_admin_name[' + value + ']', 
					type: 'text', 
					class: 'form-control', 
					id: 'kiosk_admin_name_' + value,
					'data-brand-structure-id': value
				}).css({
					'text-transform': 'uppercase',
					'padding-right': '42.5px'
				}),
				ek_obj = $('<textarea />', {
					name: 'entity_key[' + value + ']',
					class: 'form-control',
					rows: '3',
					id: 'entity_key_' + value,
					'data-bv-notempty': true,
					'data-bv-notempty-message': $('input[name="brand_name"]', modal).data('bv-notempty-message')					
				});
			
			entity_names[value] = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				local: [{'name':$('input[name="brand_name"]', modal).val() + current.data('currency')}],
				limit: 10,
				dupDetector: function(remoteMatch, localMatch){
					return remoteMatch.name == localMatch.name;
				},
				prefetch: {
					url: site_url + 'admin/brands/ajax/get_entities/' + value,
					filter: function(list){
						return $.map(list, function(entity){ return {name:entity}})
					}
				},					
				remote: {
					url: site_url + 'admin/brands/ajax/get_entities/' + value + '/%QUERY',
					filter: function(list){
						entity_names[value].clearPrefetchCache();
						return $.map(list, function(entity){ return {name:entity}})
					}
				}
			}),
			
			kiosk_admin_names[value] = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				identify: function(obj) { return obj.name },
				local: []
			});
			
			entity_names[value].initialize();
			kiosk_admin_names[value].initialize();
			
			form_group_currency.append('<label class="col-md-3 control-label">' + currency_label + '</label>');
			form_group_currency.append('<div class="col-md-5"><p class="form-control-static">' + current.data('currency') + '</p></div>');		
			
			form_group_en.append('<label class="col-md-3 control-label">' + entity_name_label + '</label>');
			form_group_en.append('<div class="col-md-5"><div class="scrollable-dropdown-menu"></div></div>');
			form_group_en.find('div.scrollable-dropdown-menu').append(en_obj);			
			
			form_group_kan.append('<label class="col-md-3 control-label">' + kiosk_admin_name_label + '</label>');
			form_group_kan.append('<div class="col-md-5"><div class="scrollable-dropdown-menu"></div></div>');
			form_group_kan.find('div.scrollable-dropdown-menu').append(kan_obj);			
			
			form_group_ek.append('<label class="col-md-3 control-label">' + entity_key_label + '</label>');
			form_group_ek.append('<div class="col-md-5"></div>');
			form_group_ek.find('> div').append(ek_obj);	
			
			//current_fg.after(form_group, form_group_2);
			current_fg.after('<fieldset class="fieldset-' + value + ' tier-2"><legend>' + label + '</legend></fieldset>');
			current_fg.next('fieldset').append(form_group_currency, form_group_en, form_group_kan, form_group_ek);
			
			en_obj.typeahead(null, {
				name: 'entities',
				displayKey: 'name',
				source: entity_names[value].ttAdapter()
			});		
			
			kan_obj.typeahead(null, {
				name: 'kiosk_admins',
				displayKey: 'name',
				source: kiosk_admin_names[value].ttAdapter()
			});			
			
			modal.find('form').bootstrapValidator('addField', en_obj);
			modal.find('form').bootstrapValidator('addField', ek_obj);
		}
		else
		{
			//modal.find('form').bootstrapValidator('addField', $('#entity_name_' + value));
			//modal.find('form').bootstrapValidator('addField', $('#entity_key_' + value));
			
			$('.fieldset-' + value, modal).remove();
			//current_fg.nextAll('.tier-2:lt(2)').remove();
		}
	});
	
	/**
	 * entity name change
	 */
	var entity_name_change = function(){
		var en_obj = $(this),
			brand_structure_id = en_obj.data('brand-structure-id'),
			url = site_url + 'admin/brands/ajax/get_entity_info/' + brand_structure_id,
			modal = en_obj.closest('.modal'),
			form = en_obj.closest('form'),
			brand_name = $('input[name="brand_name"]', form).val(),
			//form_group_2 = en_obj.closest('.form-group').next(),
			kan_obj = $('#kiosk_admin_name_' + brand_structure_id),
			ek_obj = $('#entity_key_' + brand_structure_id); //form_group_2.find('> div > textarea'),
			//btn = en_obj.next('span.input-group-btn').find('button');;

		ek_obj.val('');						
		if(en_obj.val() == '')
			return false;

		/*if(btn.length > 0)
			btn.button('loading');
		else*/
		en_obj.after('<p class="help-block">' + $('.btn-primary', modal).data('loading-text') + '</p>');
				
		$.get(url, {entity_name:$(this).val().toUpperCase()}, function(response){
			en_obj.next('.help-block').remove();
			if(response.entitykey)
			{
				/*if(en_obj.parent().is('.input-group'))
				{
					en_obj.next('span.input-group-btn').remove();
					en_obj.unwrap();
					en_obj.closest('.col-md-7').removeClass('col-md-7').addClass('col-md-5');
				}*/
				
				var currency = $(':checkbox[value="' + brand_structure_id + '"]', form).data('currency');
								
				kiosk_admin_names[brand_structure_id].clear();
				kiosk_admin_names[brand_structure_id].add([{'name':brand_name + currency}]);
				kiosk_admin_names[brand_structure_id].add(response.kiosk_admins);
				
				en_obj.closest('form').find('.country').remove();
				//en_obj.closest('.form-group').next('.country').remove();
				
				ek_obj.val(response.entitykey);
				
				if(ek_obj.val() != undefined)
					form.bootstrapValidator('revalidateField', ek_obj);				
			}
			else
			{
				//if(btn.length > 0)
					//btn.button('reset');
				//else
				//{
					//en_obj.closest('.col-md-5').removeClass('col-md-5').addClass('col-md-7');
					//en_obj.wrap('<div class="input-group"></div>');
					//en_obj.after('<span class="input-group-btn"><button data-brand-structure-id="' + brand_structure_id + '" class="btn btn-default btn-create-entity" data-loading-text="Please wait..." type="button">Create</button></span>');
					//en_obj.off('change');
					
					if(response.countries && en_obj.closest('.form-group').next('.country').length == 0)
					{
						var select = $('<select />', {
										class:'form-control', 
										name:'country_code[' + brand_structure_id + ']',
										id: 'country_code_' + brand_structure_id}),
							bce = $('<button />', {
									'data-brand-structure-id': brand_structure_id, 
									'class': 'btn btn-default btn-create-entity',
									'data-loading-text': $('button[data-loading-text]').attr('data-loading-text')}),
							fg = $('<div />', {class:'form-group tier-2 country'});
						$.each(response.countries, function(i, c){
							select.append('<option value="' + c.iso_alpha2 + '">' + c.name + '</option>');
						});
						
						fg.append('<label class="col-md-3 control-label">Country</label>' +
								'<div class="col-md-5"><div class="input-group"></div></div>');
						
						bce.text('Create');
						
						fg.find('.input-group').append(select, '<span class="input-group-btn"></span>');
						fg.find('.input-group-btn').append(bce);
						
						en_obj.closest('.form-group').after(fg);
						
						form.bootstrapValidator('revalidateField', ek_obj);						
					}
					
				//}
			}
		});
	}
	
	/**
	 * create entity
	 */
	$('.modal').on('click', '.btn-create-entity', function(e){
		var	btn = $(this),
			brand_structure_id = btn.data('brand-structure-id'),		
			en_obj = $('#entity_name_' + brand_structure_id), //btn.parent().prev(),
			form = btn.closest('form'),
			brand_name = $('input[name="brand_name"]', form).val(),
			kan_obj = $('#kiosk_admin_name_' + brand_structure_id),
			ek_obj = $('#entity_key_' + brand_structure_id), //en_obj.closest('.form-group').next().find('> div > textarea'),
			cc_obj = $('#country_code_' + brand_structure_id),
			url = site_url + 'admin/brands/ajax/create_entity';
		
		btn.button('loading');
		en_obj.parent().next('.help-block').remove();		
		
		$.post(url, {'entity_name':en_obj.val().toUpperCase(), 'brand_name':brand_name, 'brand_structure_id':brand_structure_id, 'country_code':cc_obj.val()}, function(response){
			btn.button('reset');
			if(response.error)
				en_obj.parent().after('<p class="help-block">' + response.error + '</p>');
			else
			{
				/*en_obj.closest('.col-md-7').removeClass('col-md-7').addClass('col-md-5');
				en_obj.next('span.input-group-btn').remove();
				en_obj.unwrap();
				en_obj.on('change', entity_name_change);*/
				
				en_obj.closest('.form-group').next('.country').remove();
				kan_obj.val(en_obj.val());
				ek_obj.val(response.entitykey);	
			}
			
			if(ek_obj.val() != undefined)
				form.bootstrapValidator('revalidateField', ek_obj);			
		});
	});
	
	/**
	 * move credits
	 */
	$('#move-credits-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#move-credits-modal .btn-move'),
			url = site_url + 'admin/brands/ajax/move_credits';
		btn.button('loading');						
		$.post(url, $('#move-credits-form').serializeArray(), function(response){
			btn.button('reset');					
			if(response.error)
			{
				showAlert(response, $('#mc-alert'));
				$('#move-credits-modal').scrollTop(0);							
			}
			else
			{	
				showAlert(response, $('#lb-alert'));				
				$('#lb-alert').data('show_alert', true);
				t.draw();						
				$('#move-credits-form')[0].reset();
				$('#move-credits-modal').modal('hide');
			}
		});
	});
	
	$('#move-credits-modal .btn-move').click(function(){
		$('#move_credits_bt').click();
	});	
	
	$('table').on('click', '.move-credits', function(e){
		e.preventDefault();
		var current = $(this),
			c_bs_id = current.attr('data-brand-structure-id'),
			c_access_id = current.attr('data-access-id'),
			form = $('#move-credits-form'),
			modal = $('#move-credits-modal'),
			url = site_url + 'admin/brands/ajax/get_related_brands_with_kiosk_admin/' + current.attr('data-brand-id') + '/' + current.attr('data-structure-id');
		$.get(url, function(response){
			if(response.error)
				showAlert(response, $('#lb-alert'));
			else
			{
				$('#mc_from').html(current.attr('data-brand-name') + ' (' + current.attr('data-kiosk-admin-name') + ')');
				$('input[name="brand_structure_id"], input[name="method"]', form).val('');
				$('input[name="from"]', form).val(current.attr('data-kiosk-admin-name'));
				$('#mc_currency').html(response[0].structure.currency);
				$('#mc_to option').remove();
				$('#mc_to').on('change', function(){
					var option = $(this).find('option[value="' + $(this).val() + '"]');
					$('input[name="brand_structure_id"]', form).val(option.attr('data-brand-structure-id'));
					$('input[name="method"]', form).val(option.attr('data-method'));
				});
				$.each(response, function(i, v){
					var option = $('<option />', {
										'value':v.structure.kiosk_admin_name,
										'data-brand-structure-id':(c_access_id < v.access_id ? c_bs_id : v.structure.brand_structure_id),
										'data-method':(c_access_id < v.access_id ? 'increasebalance' : 'decreasebalance')
									}).text(v.name + ' (' + v.structure.kiosk_admin_name + ')');
					$('#mc_to').append(option);
				});
				form.bootstrapValidator('updateOption', $('#mc_amount', form), 'lessThan', 'value', current.attr('data-max-amount'));
				form.bootstrapValidator('revalidateField', $('#mc_amount', form));			
				modal.one('shown.bs.modal', function(){
					form.bootstrapValidator('updateStatus', $('#mc_amount', form), 'NOT_VALIDATED');	
					$('#mc_to').change();
				});
				modal.modal('show');	
			}
		});
	});
	
	/**
	 * modal show
	 */
	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
		if($('form', this).length > 0)
		{
			$('form', this)[0].reset();
			if($(this).is('#add-brand-modal'))
			{				
				var admin_access_id = $('input[name="admin_access_id"]', this).val();
				if(admin_access_id == 2)
					$('select[name="tier_1"]', this).closest('.form-group').addClass('hidden');
				
				$('.tier-2', this).remove();				
			}
		}
	});	
});