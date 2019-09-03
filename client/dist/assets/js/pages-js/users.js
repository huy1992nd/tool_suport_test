
$(function(){
	
	$.fn.bootstrapSwitch.defaults.size = 'small';
	$.fn.bootstrapSwitch.defaults.onColor = 'success';
	$.fn.bootstrapSwitch.defaults.offColor = 'danger';
	
	/**
	 * list
	 */
	var t = $('#users_table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/users/ajax/read'
		},
		'order': [[0, 'desc']],
		'columns': [
		    {'name':'id'},
			{'name':'admin'},
			{'name':'access'},
			{'name':'brand', 'orderable':false,},
			{'name':'status', 'orderable':false, 'searchable':false},
			{'name':'action', 'orderable':false, 'searchable':false}
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language',
	    }
	});

	$('select[name="brands[]"]').chosen({
		width: '100%'
	}).change(function(){
		var form = $(this).closest('form');
		form.bootstrapValidator('revalidateField', $(this));
	});
	
	$('select[name="access_id"]').change(function(){
		var current = $(this),
			modal = current.closest('.modal'),
			form = modal.find('form'),
			tier_1 = $('select[name="tier_1"]', modal),
			brands = $('select[name="brands[]"]', modal),
			access_id = $('input[name="admin_access_id"]', modal).val(),
			admin_id = $('input[name="admin_id"]', modal).val();
		
		tier_1.find('option').removeAttr('selected');
		tier_1.closest('.form-group').toggleClass('hidden', current.val() == 4);
		
		brands.closest('.form-group').toggleClass('hidden', current.val() != 4 && access_id == 2);
		
		current.after('<p class="help-block">' + current.data('please-wait') + '</p>');	
		
		if(current.val() == 4)
		{
			var url = site_url + 'admin/users/ajax/get_brands_by_access/' + current.val();
			$.get(url, function(response){
				brands.find('option').remove();
				$.each(response, function(i, v){
					var option = $('<option />', {value:v.id}).text(v.name);
					brands.append(option);
				});
				brands.trigger('chosen:updated');
				current.next('p').remove();
				
				form.bootstrapValidator('removeField', tier_1);	
				form.bootstrapValidator('enableFieldValidators', 'brands[]', true);
				form.bootstrapValidator('updateStatus', brands, 'NOT_VALIDATED');					
			});			
		}
		else
		{
			if(access_id == '2')
			{
				brands.trigger('chosen:updated');
				var url = site_url + 'admin/users/ajax/get_parent_users_by_access/' + current.val();
				$.get(url, function(response){
					var skip_user_id = modal.is('#edit-user-modal') ? $('.btn-update', modal).data('admin_id') : null;
					tier_1.find('option:gt(0)').remove();
					$.each(response, function(i, v){
						if(v.id == skip_user_id)
							return true;
						var option = $('<option />', {value:v.id}).text(v.full_name);
						tier_1.append(option);
					});
					current.next('p').remove();
					
					form.bootstrapValidator('addField', tier_1);
					form.bootstrapValidator('updateStatus', tier_1, 'NOT_VALIDATED');
					form.bootstrapValidator('enableFieldValidators', 'brands[]', false);
				});	
			}
			else
			{
				var url = site_url + 'admin/users/ajax/get_brands_by_user/' + admin_id + '/' + current.val();
				$.get(url, function(response){
					brands.find('option').remove();
					$.each(response, function(i, v){
						var option = $('<option />', {value:v.id}).text(v.name);
						brands.append(option);
					});
					brands.trigger('chosen:updated');
					current.next('p').remove();
					
					form.bootstrapValidator('enableFieldValidators', 'brands[]', true);	
					form.bootstrapValidator('updateStatus', brands, 'NOT_VALIDATED');					
				});						
				
			}
		}
	});
	
	$('select[name="tier_1"]').change(function(){
		var current = $(this),
			modal = current.closest('.modal'),
			url = site_url + 'admin/users/ajax/get_brands_by_user/' + current.val() + '/' + $('select[name="access_id"]', modal).val(),
			brands = $('select[name="brands[]"]', modal);
		
		brands.closest('.form-group').toggleClass('hidden', current.val() == '');
		
		if(current.val() != '')
		{
			current.after('<p class="help-block">' + current.data('please-wait') + '</p>');
			$.get(url, function(response){
				var brand_obj = $('select[name="brands[]"]', modal),
					form = modal.find('form');
				brand_obj.find('option').remove();
				$.each(response, function(i, v){
					var option = $('<option />', {value:v.id}).text(v.name);
					brand_obj.append(option);
				});
				brand_obj.trigger('chosen:updated');
				current.next('p').remove();
				
				form.bootstrapValidator('enableFieldValidators', 'brands[]', true);					
				form.bootstrapValidator('updateStatus', brand_obj, 'NOT_VALIDATED');				
			});						
		}
	});
	
	/*$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
		if($('form', this).length > 0)
		{
			$('form', this)[0].reset();
			if($(this).is('#add-user-modal'))
				$('select[name="tier_1"]', this).closest('.form-group').addClass('hidden');
			$('select[name="brands[]"]', this).trigger('chosen:updated').closest('.form-group').removeClass('hidden');
		}
	}).on('shown.bs.modal', function(){
		if($(this).is('#add-user-modal'))
			$('select[name="access_id"]', this).change();
	});*/
	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
		if($(this).is('#add-user-modal'))
			$('select[name="tier_1"]', this).closest('.form-group').addClass('hidden');
		$('select[name="brands[]"]', this).trigger('chosen:updated').closest('.form-group').removeClass('hidden');		
	}).on('shown.bs.modal', function(){
		if($(this).is('#add-user-modal'))
		{
			$('#add-user-form').bootstrapValidator('resetForm');
			$('select[name="access_id"]', this).find('option:selected').removeAttr('selected').end().find('option:first').attr('selected', true).end().change();
		}
	}).on('hide.bs.modal', function(){
		if($(this).is('#edit-user-modal'))
			$('#edit-user-form').bootstrapValidator('resetForm', true);
	});
	
	$('table').on('draw.dt', function(){
		var alert = $('#lu-alert');
		if(alert.data('show_alert'))
			alert.data('show_alert', false);
		else
			$('.alert').hide();	
	});			
	
	/**
	 * add user
	 */
	$('#add-user-form').bootstrapValidator({
		excluded: ':disabled',
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	'brands[]': {
        		enabled: false
        	}
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#add-user-modal .btn-create'),
			url = site_url + 'admin/users/ajax/create',
			form = $(this);
		btn.button('loading');						
		$.post(url, $('#add-user-form').serializeArray(), function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#lu-alert'));				
				$('#lu-alert').data('show_alert', true);
				t.draw();
				form[0].reset();
				form.find('#entity_key').html('- no entity key -');
				$('#add-user-modal select[name="access_id"] option.hidden').removeClass('hidden');
				$('#add-user-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#au-alert'));				
				$('#add-user-modal').scrollTop(0);
			}
		});
	});
	
	$('#add-user-modal .btn-create').click(function(){
		$('#add_user_bt').click();
	});	
	
	/**
	 * edit user
	 */
	$('#edit-user-form').bootstrapValidator({
		excluded: ':disabled',
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
        	old_password: {
        		validators: {
        			remote: {
        				type: 'POST',
        				data: function(validator){
        					return {
        						id: $('#edit-user-modal .btn-update').data('admin_id')
        					};
        				}
        			}
        		}
        	}
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#edit-user-modal .btn-update'),
			url = site_url + 'admin/users/ajax/update',
			form_data = $(this).serializeArray();
		btn.button('loading');					
		form_data.push({name:'id', value:btn.data('admin_id')});
		$.post(url, form_data, function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#lu-alert'));				
				$('#lu-alert').data('show_alert', true);
				t.draw(false);
				$('#edit-user-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#eu-alert'));				
				$('#edit-user-modal').scrollTop(0);
			}
		});
	});
	$('#edit-user-modal .btn-update').click(function(){
		$('#edit_user_bt').click();
	});
	
	
	$('table').on('click', '.edit-user', function(){
		$('#lu-alert').hide();
		var value = $(this).data('id'),
			url = site_url + 'admin/users/ajax/get/' + value,
			modal = $('#edit-user-modal'),
			access_id = $('input[name="admin_access_id"]', modal).val();
		$('#loading-indicator').show();						
		$.get(url, function(response){			
			$('#loading-indicator').hide();							
			var brands = $('select[name="brands[]"]', modal),
				form = modal.find('form'),
				user_brands = $.map(response.user_brands, function(v, i){
					return v.id;
				}),
				tier_1 = $('select[name="tier_1"]', modal);
			
			$('select[name="access_id"]', modal).val(response.access_id);
			
			if(access_id == '2')
			{
				tier_1.find('option:gt(0)').remove();
				$.each(response.parent_users, function(i, v){
					var option = $('<option />', {value:v.id}).text(v.full_name);
					tier_1.append(option);
				});				
			}
			
			if(response.access_id > 4)
			{
				tier_1.val(response.parent_id);
				tier_1.closest('.form-group').removeClass('hidden');
			}
			else
			{
				tier_1.closest('.form-group').addClass('hidden');			
				form.bootstrapValidator('removeField', tier_1);	
			}
			
			brands.find('option').remove();
			$.each(response.brands, function(i, v){
				var option = $('<option />', {value:v.id, selected:user_brands.indexOf(v.id) > - 1}).text(v.name);
				brands.append(option);
			});
			brands.trigger('chosen:updated').closest('.form-group').removeClass('hidden');
			
			$('input[name="first_name"]', modal).val(response.first_name);
			$('input[name="last_name"]', modal).val(response.last_name);
			$('input[name="email"]', modal).val(response.email);
			$('#edit_username', modal).html(response.username);
			$('#edit-user-modal .btn-update').data('admin_id', response.id);
			modal.modal('show');
		});
	});	
	
	
	/**
	 * Edit User Navigation
	 */
	
	$('table').on('click', '.edit-user-access', function(){
		$('#eua-alert').hide();
		var modal = $('#edit-user-access-modal');
		var admin_id = $(this).data('id');
		var tr = $(this).closest('tr');
		var row = t.row(tr).data();
		var user_id = row[0];
		var user_name = row[1];
		$("#user_id").val(user_id);
		//modal.modal('show');
		$.ajax({
			type: "POST",
			url: site_url + 'admin/users/ajax/get_user_navigations/',
			data: {
				"user_id": user_id
			},
			success: function(result){
				
				if(result){
					var admin = result.admin;
					var admin_navs = result.admin_navs;
					var users_navs = result.users_navs;
					var data = "";	
					
					$('#user_name').html(admin.full_name);
					
					$.each(admin_navs, function(o, e){
						
						data += "<tr>";
						data += "<td>"
						data += "<strong>" + e.name + "</strong>";	
						data += "</td>"
						data += "<td>"
						
						if(users_navs.length!=0){
							if($.inArray(e.nav_id, users_navs)>=0){
								data += "<input type='checkbox' id='"+e.nav_id+"' name='"+e.nav_id+"' class='switchbtn parent' checked>";	
							}
							else{
								data += "<input type='checkbox' id='"+e.nav_id+"' name='"+e.nav_id+"' class='switchbtn parent'>";
							}
						}
						else{
							data += "<input type='checkbox' id='"+e.nav_id+"' name='"+e.nav_id+"' class='switchbtn parent' checked>";
						}
						data += "</td>"	
						data += "</tr>"
						
						if(e.hasOwnProperty("children")){
							$.each(e.children, function(a, b){
								data += "<tr>";
								data += "<td>"
								data += "&nbsp;&nbsp; - " + b.name;	
								data += "</td>"
								data += "<td>"
								if(users_navs.length!=0){
									if($.inArray(b.nav_id, users_navs)>=0){
										data += "<input type='checkbox' id='"+b.nav_id+"' name='"+b.nav_id+"' class='switchbtn childof_"+e.nav_id+"' checked>";	
									}
									else{
										data += "<input type='checkbox' id='"+b.nav_id+"' name='"+b.nav_id+"' class='switchbtn childof_"+e.nav_id+"'>";
									}
								}
								else{
									data += "<input type='checkbox' id='"+b.nav_id+"' name='"+b.nav_id+"' class='switchbtn childof_"+e.nav_id+"' checked>";
								}	
								data += "</td>"	
								data += "</tr>"
							})
						}
					})
					
				}
				$("#uat_tbody").html(data);
				$(".switchbtn").bootstrapSwitch({
						onSwitchChange: function(event, state){
							var classname = $(this).attr('class');
							var parentclass = classname.substring(classname.lastIndexOf(" ") + 1, classname.length);
							this.value = state;
							if(parentclass=='parent'){
								if(state==false){
									$(".childof_" + this.id).bootstrapSwitch('state', false, true);
								}
								else{
									$(".childof_" + this.id).bootstrapSwitch('state', true, true);
								}
							}
							else{
								var parent_id = $(this).prop('class').split('_').pop();
								var childrencount = $(".childof_" + parent_id).length;
								var checked_children = $(".childof_" + parent_id + ":checked").length;
								if(checked_children==0){
									$("input[name="+parent_id+"]").bootstrapSwitch('state', false, true);

								}
								else{
									console.log(checked_children + ">0");
									$("input[name="+parent_id+"]").bootstrapSwitch('state', true, true);
									
								}
							}
						}	
				});
				
				modal.modal('show');
			}
		});
		
	});	
	$('#edit-user-access-modal .btn-update').click(function(){
		$('#edit_user_access_bt').click();
	});
	
	$('#edit-user-access-form').submit(function(e){
		e.preventDefault();
		var btn = $('#edit-user-access-modal .btn-update'),
			url = site_url + 'admin/users/ajax/update_user_access',
			form_data = $(this).serializeArray();
		btn.button('loading');					
		$.post(url, form_data, function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#lu-alert'));				
				$('#lu-alert').data('show_alert', true);
				$('#edit-user-access-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#eua-alert'));
				$('#edit-user-access-modal').scrollTop(0);
			}
		});
	});
	
	
	/**
	 * remove user
	 */
	$('#remove-user-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/users/ajax/delete';
		btn.button('loading');
		$.post(url, {admin_id:btn.data('admin_id')}, function(response){
			btn.button('reset');					
			showAlert(response, $('#lu-alert'));
			$('#lu-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#remove-user-modal').modal('hide');
		});
	});
	$('table').on('click', '.remove-user', function(){
		var admin_id = $(this).attr('data-id'),
			user = $(this).closest('tr').find('td:eq(1)').html();
		$('#remove-user-modal .modal-body p span.user-name').html(user);
		$('#remove-user-modal .btn-remove').data('admin_id', admin_id);
	});	
});