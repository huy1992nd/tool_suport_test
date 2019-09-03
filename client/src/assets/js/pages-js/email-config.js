$(function(){
	var host = $('#email_config_form #host').val();
	var password = $('#email_config_form #password').val();
	var promise  = function(url, data){
       return $.ajax({
            url:site_url + url,
            type:"POST",
            dataType: "json",
            data:data,
            beforeSend:function(){
                $('#protocol').children('.selectedProtocol').hide();
                $('#protocol').children('.loadingText').toggleClass('hidden');
                $('#protocol').children('.loadingText').prop('selected', 'selected');
            }
        });
    };

	$(document).on('change', '#protocol', function(){
            var protocolValue = $(this).val();
                data  = {'protocol':protocolValue, 'domainId': $('#domain_id').val()},
                jqxhr = promise("admin/domains/ajax/getSmtpProvider", data),
                that  = $(this),
                selectElem = that.find('.selectedProtocol'),
                loadingText = that.find('.loadingText');
        jqxhr.done(function(data){
            selectElem.show();
            loadingText.hide();
            that.closest('#protocol').val(protocolValue);
            $('#port_div').html(data.port);
            $('#host_div').html(data.host);
            $('#port').val(data.port);
            $('#host').val(data.host);
            $('#emailAddress').val(data.email);
            $('#password-smtp').val(data.password);
            if(data.email !== null && data.password !== null){
                if($('#activate_div').hasClass('hidden')){
                    $('#activate_div').removeClass('hidden');
                }
                if(data.activated == "1")
                    $('#activate').bootstrapToggle('on');
                else
                    $('#activate').bootstrapToggle('off');

            }
            else{
                if(!$('#activate_div').hasClass('hidden')){
                    $('#activate_div').addClass('hidden');
                }
            }


        });



	});
	
	$('#email_config_form').bootstrapValidator({
		excluded: [":disabled"],
		message:  'Invalid',
		feedbackIcons: {
	            valid: 'glyphicon glyphicon-ok',
	            invalid: 'glyphicon glyphicon-remove',
	            validating: 'glyphicon glyphicon-refresh'
	    },
	    fields:{
	    	email:{
	    		message: 'Invalid',
	    		validators:{
	    			notEmpty:{
	    				message:'This field is required.'
	    			},
	    			emailAddress: {
	                     message: 'The email address is not valid'
	                }
	    		}
	    	},
	    	host:{
	    		message:'Invalid',
	    		validators:{
	    			notEmpty:{
	    				message:'This field is required.'
	    			}
	    		}
	    	},
	    	password:{
	    		message:'Invalid',
	    		validators:{
	    			notEmpty:{
	    				message:'This field is required.'
	    			}
	    		}
	    	},
	    	port:{
	    		message:'Invalid',
	    		validators:{
	    			notEmpty:{
	    				message:'This field is required.'
	    			}
	    		}
	    	}
	    	
	    	
	    	
	    	
	    }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var form = $(e.target);
		var emailConfigBtn = $("#email_config_btn");
		$.ajax({
			type:"POST",
			data:form.serializeArray(),
			dataType: "json",
			url:form.attr('action'),
			beforeSend:function(){
				emailConfigBtn.button('loading');
			},
			success:function(response){
				$('#ld-alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + response.success).end().show();
				$.scrollTo('.page-content');
				emailConfigBtn.button('reset');
				$('#email_config_form input').removeClass('has-feedback');
				$('#email_config_form input').removeClass('has-success');
                if(response.action == 1){
                    $('#activate_div').toggleClass('hidden');
                    $('#activate').bootstrapToggle('off');
                }

			}
			
		});
	});
	$(document).on('click', '#testEmail', function(){
		var btn      = $(this);
		var protocol = $('#protocol').val();
		var email	 = $('#emailAddress').val();
		var from	 = $('#from').val();
		var host	 = $('#host').val();
		var password = $('#password-smtp').val();
		var port	 = $('#port').val();
		var testEmailField = $('#testEmailField').val();
		$.ajax({
			type:"POST",
			data:{protocol:protocol, email:email, from:from, host:host, password:password, port:port, testEmailField:testEmailField},
			dataType:"json",
			url:site_url + 'admin/domains/ajax/testEmail',
			beforeSend:function(){
				btn.button('loading');
			}, 
			success:function(data){
				if(data.success){
					$('#ld-alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + data.success).end().show();
					$.scrollTo('.page-content');
					btn.button('reset');
				}
				else{
					$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>Oh snap!</strong> ' + data.error).end().show();
					$.scrollTo('.page-content');
					btn.button('reset');
				}
				
			}
			
		});
	});
});
