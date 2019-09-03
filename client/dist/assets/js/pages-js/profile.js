$(function(){

	$('#user-form').bootstrapValidator({
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
        						id: $('#user-form .btn-update').data('id')
        					};
        				}
        			}
        		}
        	}
        }        
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var form = $(this),
			btn = form.find('button[type="submit"]');
		btn.button('loading');	
		console.log('test');
		$.post(this.action, form.serializeArray(), function(response){
			btn.button('reset');
			showAlert(response, $('#alert'));
			$.scrollTo($('#alert'));
			if(response.success)
			{
				var full_name = form.find('#first_name').val() + ' ' + form.find('#last_name').val(),
					email = form.find('#email').val();
				form.find('.brief-profile .full-name').html(full_name);
				form.find('.brief-profile .email').html(email).attr('href', 'mailto:' + email);
				form.find('input[type="password"]').val('');
			}
		});		
	});
});