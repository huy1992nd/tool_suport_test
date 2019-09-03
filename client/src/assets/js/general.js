$(function(){
	$("ul#ul_ims > li > a").click(function(e){
		 $("#selecttlerow").hide();
		 $("#structure_modal_label").html("");
		var imsid = $(this).prop('id');
		var	imsname = $(this).data('imsname');
		$("#structure_modal_label").html(imsname);
			$.ajax({
			    type: "POST",
			    url: site_url + 'admin/structures/ajax/get_entities',
			    data: {
			    	'imsid' : imsid
			    },
			    success: function(result) {
			    	var obj = result;
					var tlestr = '<select class="form-control combobox multiselect" id="select_tle_id" name="select_tle_id" tabindex="2" size="2">';	
			    	$.each(obj, function(o, e){
				    	
			    		tlestr += '<optgroup label="'+o+'">';
							
						$.each(e, function(x,b){
							tlestr += '<option value="' + b.brand_structure_id + '">' + b.entity_name + " ("+ b.brand_name + ')</option>';
						});
						tlestr += '</optgroup>';

				    });
				
					
					tlestr += '</select>';
					$('#div_select_tle').html(tlestr);


					$('#select_tle_id').multiselect({
				        includeSelectAllOption: true,
				        enableFiltering: true,
				        maxHeight: 200,
						buttonWidth: '260px',
						disableIfEmpty: true,
						enableCaseInsensitiveFiltering: true,
						onChange: function(element, checked){

						}
					});	
					$("#selecttlerow").show();
				}
			});	
		 
	})
		
	
	$("#switchtlebtn").click(function(){
		var brand_structure_id = $('#select_tle_id').val();
		
		if(brand_structure_id){
			$("#switchtlebtn").text('Processing...');
			
			$.ajax({
			    type: "POST",
			    url: site_url + 'admin/structures/ajax/set_entity',
			    data: {
			    	'brand_structure_id' : brand_structure_id
			    },
			    success: function(result) {
					if(result){
						$("#structure_modal").modal('hide');
						$("#switchtlebtn").text('Save');
						
						location.reload();
			    	}
			    		
				}
			});
		}
		else{
			alert('Please select TLE.');
		}
		
	});
	
	$("ul#ul_languages > li > a").click(function(e){
		e.preventDefault();
		$('#loading-indicator').show();
		var language_code = $(this).prop('id');
			
			$.ajax({
			    type: "POST",
			    url: site_url + 'admin/language/ajax/set_language',
			    data: {
			    	'code' : language_code
			    },
			    success: function(result) {
			    	$("ul#ul_languages > li").css('background', '#F9F9F9');
			    	$("." + language_code).css('background', '#4D7496');
			    	$("." + language_code).css('color', '#fff');
			    	location.reload();
				}
			});	
		 
	});
	 $('ul#ul_languages > li > a').on('click', '.language-tick', function(e){
		 e.stopPropagation();
		var langCode = $(this).closest('li').attr('class');
		$('.language-tick').addClass('icon-check-empty');
		$(this).removeClass('icon-check-empty');
		$(this).addClass('icon-check');
		
		$.ajax({
			type:"POST",
			data:{'langCode':langCode},
			dataType : "json",
			url:site_url + 'admin/language/ajax/set_default_language',
			success:function(data){
			}
		});
		
	});
	
	
	 $("#btn_hidenav").click(function(){
		 $('.left-nav').hide('slide', {direction: 'left'}, 300);
		 $( ".content" ).prepend('<button class="btn btn-warning btn-xs btn_shownav" id="btn_shownav" onclick="shownav()"><i class="icon-double-angle-right"></i></button>');
	 })
	
	
});

function shownav(){
	 $('.left-nav').show('slide', {direction: 'left'}, 300);
	 $( "button.btn_shownav" ).remove();
}

/**
 * show alert
 * @param response
 * @param obj
 */
function showAlert(response, obj)
{
	var message = obj.find('.message');
	console.log(response);
	if(response.success)
	{
		obj.addClass('alert-success').removeClass('alert-danger');
		message.find('.success').show();
		message.find('.error').hide();
		message.find('.message-text').html(response.success);
		obj.show();
	}
	else if(response.error)
	{
		obj.removeClass('alert-success').addClass('alert-danger');
		message.find('.success').hide()
		message.find('.error').show();
		message.find('.message-text').html(response.error);
		obj.show();	
	}
	else if(response.session_expired)
	{
		obj.removeClass('alert-success').addClass('alert-danger');
		message.find('.success').hide()
		message.find('.error').show();
		message.find('.message-text').html('Your session has expired due to inactivity. Redirecting to login page...');
		obj.show();			
		setTimeout(function(){
			location.href = site_url + 'admin/login';
		}, 3000);
	}
	else
	{
		obj.removeClass('alert-success').addClass('alert-danger');
		message.find('.success').hide()
		message.find('.error').show();
		message.find('.message-text').html('An unknown error is found, please reload the page.');
		obj.show();			
	}
}

