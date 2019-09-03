$(function(){
	$('#login-form').submit(function(e){
		e.preventDefault();	
		var url = site_url + 'admin/ajax/login',
			btn = $('button[type="submit"]');
		btn.button('loading');
		$('.alert').removeClass('alert-danger').addClass('alert-info').html('<span class="glyphicon glyphicon-time"></span> Authenticating...').show();

		$.post(url, $(this).serializeArray(), function(response){
			btn.button('reset');
			console.log(response);
			if(response.success)
				location.href = site_url + 'admin/' + response.landingpage;
			else
				$('.alert').removeClass('alert-success').addClass('alert-danger').html('<span class="glyphicon glyphicon-exclamation-sign"></span> ' + response.error).show();
		});
	});
});