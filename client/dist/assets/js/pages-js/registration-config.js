 $(function() { 
	$('#reg-config-form :checkbox').bootstrapToggle();
	$(document).on('submit', '#reg-config-form', function(e){
		e.preventDefault();
		var checkedFields  = getCheckedFields(this);
		var fields         = $("#fields").val(checkedFields);
		var regConfigBtn = $("#reg_config_btn");
		$.ajax({
			type:"POST",
			data: $(this).serializeArray(),
			dataType:"json",
			url:$(this).attr('action'),
			beforeSend:function(){
				regConfigBtn.button('loading');
			},
			success:function(response){
				$('#reg_config_id').val(response.lastInsertId);
				$('#ld-alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + response.success).end().show();
				$.scrollTo('.page-content');
				regConfigBtn.button('reset');
			}
			
		
		});
		
	});
	var getCheckedFields = function($form){
		var field_id = '';
		$($form).find('input:checkbox:checked').each(function(){
			field_id += $(this).val() + ',';
		});
		return field_id = field_id.substring(0, field_id.length - 1); 
	};
 });
