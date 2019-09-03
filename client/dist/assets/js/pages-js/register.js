$(function(){
	
	$('#register-form').bootstrapValidator({
		excluded: ':disabled',
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var form = $(this),
			btn = form.find('button[type="submit"]');
		btn.button('loading');						
		$.post(this.action, form.serializeArray(), function(response){
			btn.button('reset');
			showAlert(response, $('#alert'));
			$.scrollTo(form);
			if(response.success)
				form[0].reset();					
		});
	});
});