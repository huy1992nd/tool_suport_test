$(document).ajaxStop($.unblockUI);

$(function(){
	var btn_create = $('#btn_create_installer'),
	btn_download = $('#btn_download_installer');
	
	$('.colorpicker').spectrum({
	    color: "#000",
		showPalette: true,
		palette: [["black", "white", "green", "yellow", "blue", "red", "orange", "indigo", "violet"]],
		showInitial: true,
		showInput: true,
		hideAfterPaletteSelect:true,
		preferredFormat: "hex"
		
	});

	$('#casino-instance-name').multiselect({
		includeSelectAllOption: false,
        enableFiltering: true,
        maxHeight: 200,
		buttonWidth: '700px',
		disableIfEmpty: true,
		enableCaseInsensitiveFiltering: true,
		onChange: function(element, checked){
			if(typeof element !== 'undefined'){
			var domain_name = element.parent().attr('label');
			$("#email").val('email@' + domain_name + '.com');
			}
		}
	})
	
	var selected_domain_name_option = $('#casino-instance-name option:selected').val();
	var selected_domain_name = selected_domain_name_option.split('___')[0];
	$("#email").val('email@' + selected_domain_name + '.com');
	
	
	
	$('#installer_languages').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        maxHeight: 200,
		buttonWidth: '260px',
		disableIfEmpty: true,
		enableCaseInsensitiveFiltering: true,
		onChange: function(element, checked){
			var $langs = $('#installer_languages').val();
			
			if($langs){
				$("#default_language").html('');
				$.each($langs, function(o, e){
					
					if($('#' + e + '__fieldset').length>0){
					}
					else{
						
						$.ajax({
							 type: "POST",
							 url: site_url + 'admin/installer/ajax/languages_properties',
							 data: {
								"lang_key" : e, 
								"brand_name" : $("#brand-name").val(),
								"lang_text": $('#installer_languages option[value="'+e+'"]').text()
							 },
							 success: function(result){
								 //console.log(result);
								 
								 if(result.success){
									var $show_eula = $("#show_eula").val();
									$('#languages_tabs').append(result.data);
									$("#show_eula").trigger('change');
									$("#show_uninstall_survey").trigger('change');
									
									$('#installer-form').bootstrapValidator('destroy');
									
									$('#installer-form').bootstrapValidator({
								      message: 'This value is not valid',
								      feedbackIcons: {
								          valid: 'glyphicon glyphicon-ok',
								          invalid: 'glyphicon glyphicon-remove',
								          validating: 'glyphicon glyphicon-refresh'
								      },
								      fields: {
								    	  brand_name: {
								              group: '.form-group',
								              trigger: 'keyup'
								          },
								      	 installer_icon: {
								             group: '.form-group',
								             feedbackIcons: 'false',
								             trigger: 'blur'
								         },
								      	 shortcut_icon: {
								             group: '.form-group',
								             feedbackIcons: 'false',
								             trigger: 'blur'
								         },
								      	 splash: {
								             group: '.form-group',
								             feedbackIcons: 'false',
								             trigger: 'blur'
								         },
								      	 bg_image: {
								             group: '.form-group',
								             feedbackIcons: 'false',
								             trigger: 'blur'
								         }
								      }
								  }).on('success.form.bv', function(e){
										e.preventDefault();
										
										bootbox.confirm("Create installer?", function(result) {
											if(result){
												$.blockUI({ message: $('#domMessage') }); 
												
												var btn_create = $('#btn_create_installer'),
													btn_download = $('#btn_download_installer');
												btn_create.button('loading');
												$.ajax({
													 type: "POST",
													 url: site_url + 'admin/installer/ajax/create',
													 data: new FormData( $("#installer-form")[0] ),
												     processData: false,
												     contentType: false,
													 success: function(result){
														 btn_create.button('reset');
														 if(result.success){
															 btn_download.removeClass('disabled');
															 btn_download.attr("href", result.url);
															 btn_download.addClass('glowbutton');
														 }
													 }
												});
											}
										})
										
										
									
									});
									
								 }
							 }
						});
					}
					
					$("#default_language").append("<option value='"+e+"'>"+$('#installer_languages option[value="'+e+'"]').text()+"</option>")
					
				})
				
				
				
				
			}
			else{
				$('#languages_tabs').html('&nbsp;');
			}
			
			
			$('#languages_tabs').children('fieldset').each(function(){
				var fieldset_id = this.id;
				var lang = fieldset_id.split("__")
								
				if($.inArray(lang[0], $langs)<0){
					$("#" + lang[0] + "__fieldset").remove();
				}
			});
				
		}
	});
	
	$('#installer_languages').multiselect('select', ['en'], true);
	
	$("#installer-form :input").change(function() {
		btn_download.addClass('disabled');
		btn_download.attr("href", "#");
		btn_download.removeClass('glowbutton');
		
	});
	
	$("#btn_reset_installer").on('click',  function(e){
		e.preventDefault();
		
		 $(this).closest('form').get(0).reset();

		$brand_name_to_replace = "<brand_name>";
		btn_download.addClass('disabled');
		btn_download.attr("href", "#");
		btn_download.removeClass('glowbutton');
		
		$('#wrapper-color').spectrum("set", "#000000");
		$('#text-color').spectrum("set", "#000000");
		$('#button-bg-color1').spectrum("set", "#000000");
		$('#button-bg-color2').spectrum("set", "#000000");
		$('#button-text-color').spectrum("set", "#000000");
		$('#uninstall-link-color').spectrum("set", "#000000");
		$('#progressbar-color1').spectrum("set", "#000000");
		$('#progressbar-color2').spectrum("set", "#000000");
		$('#installer_languages').multiselect('select', 'en', true);
		$("#use_operating_system_language").prop('checked', true);
		$("#use_operating_system_language").trigger('change');
	
	});
	
	
	$('#installer-form').on('click', '.btn-upload', function(){
		$(".alert-info").hide();
		var kind = $(this).attr('data-kind');
		$('#' + kind).click();

	});
	
	
	
	/**
	 * File upload validation
	 */
	
	$('#installer_icon').fileupload({
		url: site_url + 'admin/installer/ajax/validate_file_type',
		dataType: 'json',
		done: function (e, data) {
			var $image_type = "image/x-icon";
			var btn = $('.btninstaller');
			
			if(data.result.image_type==$image_type){
				$("#installer-icon").val(data.result.image_url);
				$('#installer-icon').popover('destroy');
				
				$('#installer-icon').css('border-color', '#756560');
				var $group = $('#installer-icon').parentsUntil( ".col-md-9" );
				$group.find('small').html('');
				$('#installer-icon').blur();
			}
			else{
				$("#installer-icon").val('');
				$('#installer-icon').css('color: black');
				$('#installer-icon').popover('show');
				
			}
			btn.button('reset');

		},

		add: function (e, data) {
			var btn = $('.btninstaller');
			btn.button('loading');
			var jqXHR = data.submit()
			.success(function (result, textStatus, jqXHR) {
			})
            .error(function (jqXHR, textStatus, errorThrown) {
            	$("#installer-icon").val('');
				$('#installer-icon').css('color: black');
				$('#installer-icon').popover('show');
				btn.button('reset');
            })
            .complete(function (result, textStatus, jqXHR) {/* ... */});

		}
	});
	
	$('#shortcut_icon').fileupload({
		url: site_url + 'admin/installer/ajax/validate_file_type',
		dataType: 'json',
		done: function (e, data) {
			var $image_type = "image/x-icon";
			var btn = $('.btnshortcut');
			if(data.result.image_type==$image_type){
				$("#shortcut-icon").val(data.result.image_url);
				$('#shortcut-icon').popover('destroy');
				
				$('#shortcut-icon').css('border-color', '#756560');
				var $group = $('#shortcut-icon').parentsUntil( ".col-md-9" );
				$group.find('small').html('');
				$('#shortcut-icon').blur();
			}
			else{
				$("#shortcut-icon").val('');
				$('#shortcut-icon').css('color: black');
				$('#shortcut-icon').popover('show');
			}
			btn.button('reset');

		},

		add: function (e, data) {
			var btn = $('.btnshortcut');
			btn.button('loading');
			var jqXHR = data.submit()
			.success(function (result, textStatus, jqXHR) {})
            .error(function (jqXHR, textStatus, errorThrown) {
            	$("#shortcut-icon").val('');
				$('#shortcut-icon').css('color: black');
				$('#shortcut-icon').popover('show');
				btn.button('reset');
            })
            .complete(function (result, textStatus, jqXHR) {/* ... */});

		}
	});
	
	$('#splash').fileupload({
		url: site_url + 'admin/installer/ajax/validate_file_type',
		dataType: 'json',
		done: function (e, data) {
			var $image_type = "image/png";
			var btn = $('.btnsplash');
			
			if(data.result.image_type==$image_type){
				$("#splash_url").val(data.result.image_url);
				$('#splash_url').popover('destroy');
				
				$('#splash_url').css('border-color', '#756560');
				var $group = $('#splash_url').parentsUntil( ".col-md-9" );
				$group.find('small').html('');
				$('#splash_url').blur();
			}
			else{
				$("#splash_url").val('');
				$('#splash_url').css('color: black');
				$('#splash_url').popover('show');
			}
			btn.button('reset');

		},

		add: function (e, data) {
			var btn = $('.btnsplash');
			btn.button('loading');
			var jqXHR = data.submit()
			.success(function (result, textStatus, jqXHR) {})
            .error(function (jqXHR, textStatus, errorThrown) {
            	$("#splash_url").val('');
				$('#splash_url').css('color: black');
				$('#splash_url').popover('show');
				btn.button('reset');
            })
            .complete(function (result, textStatus, jqXHR) {/* ... */});

		}
	});
	
	$('#logo').fileupload({
		url: site_url + 'admin/installer/ajax/validate_file_type',
		dataType: 'json',
		done: function (e, data) {
			var $image_type = "image/png";
			var btn = $('.btnlogo');
			
			if(data.result.image_type==$image_type){
				$("#logo_url").val(data.result.image_url);
				$('#logo_url').popover('destroy');
			}
			else{
				$("#logo_url").val('');
				$('#logo_url').css('color: black');
				$('#logo_url').popover('show');
			}
			btn.button('reset');

		},

		add: function (e, data) {
			var btn = $('.btnlogo');
			btn.button('loading');
			var jqXHR = data.submit()
			.success(function (result, textStatus, jqXHR) {})
            .error(function (jqXHR, textStatus, errorThrown) {
            	$("#logo_url").val('');
				$('#logo_url').css('color: black');
				$('#logo_url').popover('show');
				btn.button('reset');
            })
            .complete(function (result, textStatus, jqXHR) {/* ... */});

		}
	});
	
	$('#bg_image').fileupload({
		url: site_url + 'admin/installer/ajax/validate_file_type',
		dataType: 'json',
		done: function (e, data) {
			var $image_type = "image/jpeg";
			var btn = $('.btnbg_image');
						
			if(data.result.image_type==$image_type){
				$("#bg-image").val(data.result.image_url);
				$('#bg-image').popover('destroy');
				
				$('#bg-image').css('border-color', '#756560');
				var $group = $('#bg-image').parentsUntil( ".col-md-9" );
				$group.find('small').html('');
				$('#bg-image').blur();
				
			}
			else{
				$("#bg-image").val('');
				$('#bg-image').css('color: black');
				$('#bg-image').popover('show');
			}
			btn.button('reset');

		},

		add: function (e, data) {
			var btn = $('.btnbg_image');
			btn.button('loading');	
			var jqXHR = data.submit()
			.success(function (result, textStatus, jqXHR) {})
            .error(function (jqXHR, textStatus, errorThrown) {
            	$("#bg-image").val('');
				$('#bg-image').css('color: black');
				$('#bg-image').popover('show');
				btn.button('reset');
            })
            .complete(function (result, textStatus, jqXHR) {/* ... */});

		}
	});
	
	var $brand_name_to_replace = "<brand_name>";
	
	$("#brand-name").keyup(function(n){
		var $th = $(this);
        $th.val( $th.val().replace(/[^a-zA-Z0-9]/g, function(str) { 
        	alert(translate.brand_code_validate); return ''; 
        	} 
        ));
		
	});
	
	$("#brand-name").blur(function(n){
		$("#registry-folder").val($(this).val());
		$("#creferer").val('BRAND:' + $(this).val());
	});
	
	
	var table = $('table').DataTable({
		processing: true,
		pagingType: 'full_numbers',
		ajax: {
			url: site_url + 'admin/installer/ajax/get_templates'
		},
		displayLength: 5,
		lengthChange: true,
		info: true,
		ordering: true,
		searching: true,
		columns: [
		    {'data':'id'},
			{'data':'brand_name'},
			{'data':'bg_image'},
			{'data':'installer_icon'},
			{'data':'shortcut_icon'},
			{'data':'logo'},
			{'data':'splash'},
			{'data':'button_bg_and_text_color'},
			{'data':'wrapper'},
			{'data':'progressbar_color'},
			{'data':'action', "width": "100%"}
			
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language',
	    },
		columnDefs: [
           {
               "targets": [ 0 ],
               "visible": false,
               "searchable": false
           }
       ],
		initComplete: function () {
           
        }
	});
	
	
	
	$('#installer-templates-modal').on('show.bs.modal', function(){
		table.ajax.reload();
	}).on('shown.bs.modal', function(){
	}).on('hide.bs.modal', function(){
	});
	
	
	$('#installer-preview-modal').on('show.bs.modal', function(){
		var bg_image_url = "";
		bg_image_url = $("#bg-image").val();
		if(bg_image_url){
			$("#installer-container").css("background-image",  "url('"+bg_image_url+"')");
			$("#installer-wrapper").removeClass('hidden');
			$("#installer-text-color").removeClass('hidden');
			$("#installer-select-language").removeClass('hidden');
			$("#installer-install-button").removeClass('hidden');
			$("#installer-progressbar").removeClass('hidden');
			$("#progressbar_text").removeClass('hidden');
			
			if($("#x-color").val()=='b'){
				$("#xbutton").css('color', '#000000');
			}
			else{
				$("#xbutton").css('color', '#ffffff');
			}
			
			
			$("#xbutton").removeClass('hidden');
		}
		
		var logo_image_url = $("#logo_url").val();
		var logo_offset_x = $("#logo-offset-x").val();
		var logo_offset_y = $("#logo-offset-y").val();
		if(logo_image_url){
			$("#logo-container").attr("src",  logo_image_url);
			$("#logo-container").css("left",  logo_offset_x + "px");
			$("#logo-container").css("top",  logo_offset_y + "px");
		}
		
		var text_color = $("#text-color").val();
		if(text_color){
			$("#installer-text-color").css('color', text_color);
		}
		
		var wrapper_color = $("#wrapper-color").val();
		if(wrapper_color){
			var wrapper_opacity = $("#wrapper-opacity").val();
			var wrapper_width = $("#wrapper-width").val();
			
			$("#installer-wrapper").css({
				'opacity': wrapper_opacity/100,
				'filter' : 'alpah(opacity="'+wrapper_opacity+'")',
				'-moz-opacity': wrapper_opacity/100,
				'-khtml-opacity': wrapper_opacity/100,
				'border-radius': '10px',
				'position': 'relative',
				'left': '43px',
				'top': '160px',
				'z-index': '2',
				'background-color': wrapper_color,
				'width': wrapper_width + 'px',
				'height': '220px'
			})
		}
		
		var button_bg_color1 = $("#button-bg-color1").val();
		var button_bg_color2 = $("#button-bg-color2").val();
		var button_text_color = $("#button-text-color").val();
		
		if(button_bg_color1){
			$("#installer-install-button").css({
				'background': button_bg_color1, 
				'background-image': '-webkit-linear-gradient(top, '+button_bg_color1+', '+button_bg_color2+')', 
				'background-image': '-moz-linear-gradient(top, '+button_bg_color1+', '+button_bg_color2+')',
				'background-image': '-ms-linear-gradient(top, '+button_bg_color1+', '+button_bg_color2+')',
				'background-image': '-o-linear-gradient(top, '+button_bg_color1+', '+button_bg_color2+')',
				'background-image': 'linear-gradient(to bottom, '+button_bg_color1+', '+button_bg_color2+')',
				'color': button_text_color 
			});
		}
		
		var progressbar_color1 = $("#progressbar-color1").val();
		var progressbar_color2 = $("#progressbar-color2").val();
		if(progressbar_color1){
			$("#installer-progressbar").css({
				'background': progressbar_color1, 
				'background-image': '-webkit-linear-gradient(top, '+progressbar_color1+', '+progressbar_color2+')', 
				'background-image': '-moz-linear-gradient(top, '+progressbar_color1+', '+progressbar_color2+')',
				'background-image': '-ms-linear-gradient(top, '+progressbar_color1+', '+progressbar_color2+')',
				'background-image': '-o-linear-gradient(top, '+progressbar_color1+', '+progressbar_color2+')',
				'background-image': 'linear-gradient(to bottom, '+progressbar_color1+', '+progressbar_color2+')'
			});
		}
		
	}).on('shown.bs.modal', function(){
		
	}).on('hide.bs.modal', function(){

	});
	
	
	
	$('#installer-form1').bootstrapValidator({
      message: 'This value is not valid',
      feedbackIcons: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
      },
      fields: {
    	  brand_name: {
              group: '.form-group',
              trigger: 'keyup'
          },
      	 installer_icon: {
             group: '.form-group',
             feedbackIcons: 'false',
             trigger: 'blur'
         },
      	 shortcut_icon: {
             group: '.form-group',
             feedbackIcons: 'false',
             trigger: 'blur'
         },
      	 splash: {
             group: '.form-group',
             feedbackIcons: 'false',
             trigger: 'blur'
         },
      	 bg_image: {
             group: '.form-group',
             feedbackIcons: 'false',
             trigger: 'blur'
         }
      }
  }).on('success.form.bv', function(e){
		e.preventDefault();
		
	});
	
	$("#show_eula").change(function(){
		var $showeula = $(this).val();
		
		if($showeula=='true'){
			$('.languages_eula').removeClass('hidden');
		}
		else{
			$('.languages_eula').addClass('hidden');
		}
		
	});
	
	$("#use_operating_system_language").change(function() {
	    if(this.checked) {
	        $("#default_language").prop('disabled', true);
	        $(".default_language_class").addClass('hidden');
	    }
	    else{
	    	$("#default_language").prop('disabled', false);
	    	$(".default_language_class").removeClass('hidden');
	    }
	});
	
	
	$("#use_operating_system_language").prop('checked', true);
	$("#use_operating_system_language").trigger('change');
	
	$("#show_uninstall_survey").change(function(){
		if($(this).val()=='true'){
			 $(".survey_ans").removeClass('hidden');
		}
		else{
			$(".survey_ans").addClass('hidden');
		}
	})
	
});

function populateInstallerText(brandname){
	var $lang = brandname.id.split("__");
	
	$.ajax({
		 type: "POST",
		 url: site_url + 'admin/installer/ajax/sample_language_properties',
		 data: {
			"langcode": $lang[0],
			"brand_name": brandname.value,
			"from_languages": 1
		 },
		 success: function(result){
			 
			$("#" + $lang[0] + "__language-installer-txt-1").val(result.installer_txt_1)
			$("#" + $lang[0] + "__language-uninstaller-txt-1").val(result.uninstaller_txt_1)
		 }
	});

}

function load_template(id){
	var $installer_form = $('#installer-form');
	var $btn_load_template = $("#btnload" + id);
	$btn_load_template.button('loading');
	$.ajax({
		 type: "POST",
		 url: site_url + 'admin/installer/ajax/load_template',
		 data: {
			"id": id
		 },
		 success: function(result){
			 if(result.success){
				 $btn_load_template.button('reset');
				 if(result.lang_survey){
					 $('#languages_tabs').html('');
				 }
				 $('#default_language').html("");
				 var $default_language = "";
				 $.each(result.lang_survey, function(o, e){
					 $('#languages_tabs').append(e);
				 });
				 
				 $("#show_uninstall_survey").trigger('change');
				 $("#show_eula").trigger('change');
				 
				 $.each(result.data, function(o, e){
					 if(o=='languages'){
						 $('#installer_languages').multiselect('select', e, true);
						 
						 $.each(e, function(k, v){
							 $default_language += "<option value='" +v+ "'>"+v+"</option>;"
						 })
						 
					 }
					 else if(o=='casino_instance_name'){
						 //console.log(e);
						 $("#casino-instance-name").multiselect('select', result.instance_name + "___" + e, true);
					 }
					 else if(o=='wrapper_color' ||o=='text_color' || o=='button_bg_color1' || o=='button_bg_color2' || o=='button_text_color' || o=='uninstall_link_color' || o=='progressbar_color1' || o=='progressbar_color2'){
						 $('input[name="'+o+'"]').spectrum({
						    color: e,
							showPalette: true,
							palette: [["black", "white", "green", "yellow", "blue", "red", "orange", "indigo", "violet"]],
							showInitial: true,
							showInput: true,
							hideAfterPaletteSelect:true,
							preferredFormat: "hex"
						});
						 $('input[name="'+o+'"]').spectrum("set", e);
					 }
					 else if(o=='default_language'){
						 $('#use_operating_system_language').prop('checked', true);
						 $("#default_language").prop('disabled', true);
					     $(".default_language_class").addClass('hidden');
					 }
					 else{
						 $("#installer-form input[name='"+o+"']").val(e);
					 }
					 
				 });
				 $('#default_language').html($default_language);
				 $('#default_language').val(result.data.default_language);
				 $("#installer-templates-modal").modal('hide');
			 }
		 }
	});
	
}

function remove_template(id){
	bootbox.confirm("Are you sure?", function(result) {
		  if(result){
			  var $installer_form = $('#installer-form');
				var $btn_load_template = $("#btnremove" + id);
				$btn_load_template.button('loading');
				$.ajax({
					 type: "POST",
					 url: site_url + 'admin/installer/ajax/remove_template',
					 data: {
						"id": id
					 },
					 success: function(result){
						 if(result.success){
							 $btn_load_template.button('reset');
							 $("#installer-templates-modal").modal('hide');
							 table.ajax.reload();
						 }
					 }
				});
		  }
	}); 
}
