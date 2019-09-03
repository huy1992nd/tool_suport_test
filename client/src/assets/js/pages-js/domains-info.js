$(function(){

	'use strict';

	$(document).on('click', '.imgAsset', function(){

		$(this).toggleClass('selectedAsset');

	});

	$(document).on('click', '.imgAssetSingle', function(){

		$('.selectedAsset').removeClass('selectedAsset');

		if($(this).hasClass('selectedAsset'))

		{

			$(this).removeClass('selectedAsset');

		}

		else

		{

			$(this).addClass('selectedAsset');

		}

	});

	var currentLanguageCode = function(){

		var currentLanguage = $('#ul_languages').find('.disabled a').attr('id');

		return currentLanguage;

	};

	var loadLanguages = function(){

		$.ajax({

			type:"GET",

			url:site_url + 'admin/language/ajax/get_languages/' + domain_id,

			success:function(data){

				var opt = '';

				$.each(data, function(index, value){

					if(currentLanguageCode() == value.code)

						opt +=  "<option class='selectElem' selected value='"+value.code+"'>"+value.name+"</option>"; 

					else

						opt +=  "<option  class='selectElem' value='"+value.code+"'>"+value.name+"</option>"; 

				});

				$('.language_translation').append(opt);

			}

		});

	};

        var loadTokenExpiration = function(token_expiration){

            $('#token_expiration option').each(function(){

               if($(this).text() === token_expiration){

                   $(this).prop('selected', false).prop('selected', true);

			}

		});

	};

	var loadTranslations = function(){

		var domainId = $('#domain_id').val(),

                    module   = $('#module').val();

		$.ajax({

			type:"POST",

			url:site_url + 'admin/domains/ajax/getTranslation',

			data:{domainId:domainId, langCode:currentLanguageCode(), module:module},

			success: function(data){

				$('#subject').val(data.email_subject);

                                $('#fptitle').val(data.fp_title);

                                $('#regtitle').val(data.reg_title);

				$('#email_message').val(data.email_message);

				$('#sMessage').val(data.success_message);

                                $('#fpsmessage').val(data.fp_success_message);

				loadTokenExpiration(data.token_expiration);

			}

		});

	};

	var checkForm =  function(formId, event, data){

		if(event == 'before send'){

			if(formId == 'email_config_form')

			{

				$('#subject').val('');

				$('#email_message').val('');

			}

			else

			{

				$('#sMessage').val('');

			}

		}

		else

		{

			if(formId == 'email_config_form')

			{

				$('#subject').val(data.email_subject);

				 loadTokenExpiration(data.token_expiration);

				if(data.email_message !== '')

					$('#email_message').val(data.email_message);

			}

			else

			{

				 $('#fpsmessage').val(data.fp_success_message);

                                $('#fptitle').val(data.fp_title);

                                $('#regtitle').val(data.reg_title);

				$('#sMessage').val(data.success_message);

			}

		}

	};

	loadTranslations();

	loadLanguages();

	var registrationValue = $('#registration option:selected').val();

	if(registrationValue == 1)

		$('.reg-form-config').show();

	else

		$('.reg-form-config').hide();

	

	$(document).on('change', '.language_translation', function(){

		var langCode = $(this).val(),

			that	 = $(this),

			domainId = $('#email_config_form #domain_id').val(),

			selectElem = $(this).children('.selectElem'),

			loadingText = $(this).children('.loadingText'),

		        formId		= $(this).closest('form').prop('id'),

                        module          = $('#module').val();

			

			

		$.ajax({

			type:"POST",

			url:site_url + 'admin/domains/ajax/getTranslation',

			data:{langCode:langCode, domainId:domainId, module:module},

			beforeSend:function(){

				selectElem.hide();

				loadingText.toggleClass('hidden');

				loadingText.prop('selected', 'selected');

				checkForm(formId, 'before send');

				

			},

			success:function(data){

				selectElem.show();

				loadingText.toggleClass('hidden');

				that.val(langCode);

				checkForm(formId, 'success', data);

				

			}

		});

	});

        $(document).on('submit', '#fp-config-form', function(e){

            e.preventDefault();

            var form   = $(this),

                action = form.attr('action'),

                btn    = $('#fp_config_btn');

            $.ajax({

               type:"POST",

               url:action,

               data:form.serializeArray(),

               dataType:"json",

               beforeSend:function(){

                   btn.button('loading');

               },

               success:function(data){

                   $('#ld-alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + data.success).end().show();

		   $.scrollTo('.page-content');

                   btn.button('reset');

               }

               

               

            });

        });

        $(document).on('change', '#module', function(){

           var that = $(this),

               module = that.val(),

               domainId = $('#email_config_form #domain_id').val(),

               langCode = $('#email_config_form #language').val(),

               selectElem = that.children('.selectElemModule'),

               loadingText = that.children('.loadingText'),

               formId		= that.closest('form').prop('id');

               $.ajax({

			type:"POST",

			url:site_url + 'admin/domains/ajax/getTranslation',

			data:{langCode:langCode, domainId:domainId, module:module},

			beforeSend:function(){

				selectElem.hide();

				loadingText.toggleClass('hidden');

				loadingText.prop('selected', 'selected');

				checkForm(formId, 'before send');

				

			},

			success:function(data){

				selectElem.show();

				loadingText.toggleClass('hidden');

				that.val(module);

				checkForm(formId, 'success', data);

				

			}

		});

	});

	

	$("#assetsVerticalBannerModal .btn-update").click(function(){

		var btn   = $(this);

		var setID = $("#assetsVerticalBannerModal .selectedAsset").map(function() {

			return $(this).attr('data-id');

		}).get();

		var pageId = $('[name="page_id"]').val();

		$.ajax({

			type:"POST",

			data: {setID:setID, domain_id:domain_id, pageId:pageId},

			dataType:"json",

			url:site_url + 'admin/assets/ajax/publish_assets',

			beforeSend:function(){

				btn.button('loading');

			},

			success:function(data){

				showAlert(data, $('#ld-alert'));

				if(data.error)

				{

					$('#assetsVerticalBannerModal').modal('hide');

				}

				else

				{

					btn.button('reset');

					$.each(data.thumbnails, function(i, item) {

						left_banner_file = item;

						var cell = $('<div />').attr({class:'col-md-2 banner-cell files'}).data('file', item.name),

							thumb = $('<div />').attr({class:'thumbnail'});

							thumb = $('<div />').attr({class:'thumbnail'}).css('cursor', 'pointer');

						thumb.click(function(e){

							if(! $(e.target).is('.glyphicon-remove'))

							{

								var modal = $('#left-banner-modal'),

											preview = modal.find('.preview'),

											img = preview.find('img');												

										img.attr('src', item.url);

										modal.on('shown.bs.modal', function(){

											banner_overlay_actions(modal); 

										});

										modal.data({'filename':item.name, 'type':'page_left_banner'}).modal('show');

							}

						});

						thumb.html($('<img>').attr({src:item.thumbnailUrl}));

						thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + item.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

						cell.html(thumb);

						$('#left-banner').html(cell);

					

					});

					$('#assetsVerticalBannerModal').modal('hide');

				}

			}

		});

	});

	

	$("#assetsHorizontalBannerModal .btn-update").click(function(){

		var btn   = $(this);

		var setID = $("#assetsHorizontalBannerModal .selectedAsset").map(function() {

			return $(this).attr('data-id');

		}).get();

		var pageId = $('[name="page_id"]').val();

		$.ajax({

			type:"POST",

			data: {setID:setID, domain_id:domain_id, pageId:pageId},

			dataType:"json",

			url:site_url + 'admin/assets/ajax/publish_assets',

			beforeSend:function(){

				btn.button('loading');

			},

			success:function(data){

				showAlert(data, $('#ld-alert'));

				if(data.error)

				{

					$('#assetsHorizontalBannerModal').modal('hide');

				}

				else

				{

					btn.button('reset');

					$.each(data.thumbnails, function(i, item) {

						slider_banner_files.push(item);

						var cell = $('<div />').attr({class:'col-md-3 banner-cell files', 'data-index':slider_banner_files.length - 1}).data('file', item.name),

							thumb = $('<div />').attr({class:'thumbnail'}).css('cursor', 'pointer');

							thumb.click(function(e){

									if(! $(e.target).is('.glyphicon-remove'))

									{

											var modal = $('#banner-modal'),

												preview = modal.find('.preview').css({width:'694px', height:'245px'}),

												img = preview.find('img');

											img.attr('src', item.url);

											modal.on('shown.bs.modal', function(){

												banner_overlay_actions(modal); 

											});			

											modal.data({'filename':item.name, 'type':'page_slider_banner'}).modal('show');

									}

							});

							thumb.html($('<img>').attr({src:item.thumbnailUrl}));

							thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + item.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

							cell.html(thumb);

							$('#slider-banners').append(cell);

					});

					//$(".selectedAsset").fadeOut();

					$('#assetsHorizontalBannerModal').modal('hide');

					//$('.alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html(data.success).end().show();

					//alert(banner_files.toSource());

					$('#slider-banners').sortable('refresh');

				}

			}

		});

	});

	

	$("#assetsMainBannerModal .btn-update").click(function(){

		var btn   = $(this);

		var setID = $("#assetsMainBannerModal .selectedAsset").map(function() {

			return $(this).attr('data-id');

		}).get();

		$.ajax({

			type:"POST",

			data: {setID:setID, domain_id:domain_id},

			dataType:"json",

			url:site_url + 'admin/assets/ajax/publish_assets',

			beforeSend:function(){

				btn.button('loading');

			},

			success:function(data){

				showAlert(data, $('#ld-alert'));				

				if(data.error)

				{

					$('#assetsMainBannerModal').modal('hide');

				}

				else

				{

					btn.button('reset');

				    $.each(data.thumbnails, function(i, item) {

						banner_files.push(item);

						var cell = $('<div />').attr({class:'col-md-2 banner-cell files', 'data-index':banner_files.length - 1}).data('file', item.name),

							thumb = $('<div />').attr({class:'thumbnail'}).css('cursor', 'pointer');

						thumb.click(function(e){

							if(!$(e.target).is('.glyphicon-remove'))

								{

									var modal = $('#banner-modal'),

										preview = modal.find('.preview').css({width:'614px', height:'305px'}),

										img = preview.find('img');

									img.attr('src', item.url);

									modal.on('shown.bs.modal', function(){

										banner_overlay_actions(modal);

									});																	

									modal.data({'filename':item.name, 'type':'slider_banner'}).modal('show');

								}

						});

						thumb.html($('<img>').attr({src:item.thumbnailUrl}));

						thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + item.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

						cell.html(thumb);

						$('#banners').append(cell);

					

					});

					//$(".selectedAsset").fadeOut();

					$('#assetsMainBannerModal').modal('hide');

					//$('.alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html(data.success).end().show();

					$('#banners').sortable('refresh');

					//alert(banner_files.toSource());

				}

			}

		});

	});

	/**

	 * logo upload

	 */

	// Change this to the location of your server-side upload handler:


	$('#logo_file').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Logo ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));					

					$.scrollTo('.page-content');

				}

				else

				{

                  var logo = $('<div class="thumbnail files"></div>');

					$('#logo_box').val(file.name);

                                        logo.css({width:file.width, height:file.height});

					logo.html($('<img>').attr({src:file.url}));

					logo.append('<div class="pull-right" style="position:relative;bottom:73px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>').show();

					$('#logo').html(logo);

					logo_file = file.name;

					$('.alert').hide();

                    $('#logo_dimension').html(file.width+' x '+file.height);

                                        

                                        

                                      

                                        

				}

			});

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

	
	/**
	*
	*	DOWNLOAD CLIENT LOGIN PAGE LOGO
	*/

	/*DOWNLOAD LOGIN*/
	$('#dclp_logo_file').fileupload({

		url: base_url + 'admin/domains/ajax/dclp_logo',

		dataType: 'json',

		done: function (e, data) {
			console.log(data);
			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');

			$.each(data.result.files, function (index, file) {
				console.log(file);
				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Logo ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));					

					$.scrollTo('.page-content');

				}

				else

				{

                   var dclp_logo = $('<div class="thumbnail files dclp_logo_container"></div>');

					$('#logo_box').val(file.name);

                    dclp_logo.css({width:file.thumbnailWidth, height:file.thumbnailHeight});

					dclp_logo.html($('<img>').attr({src:file.thumbnailUrl}));

					dclp_logo.append('<div class="pull-right" style="position:relative;bottom:73px;"></div>').show();

					$('#dlcp_logo').html(dclp_logo);

					logo_file = file.name;

					$('.alert').hide();

                    //$('#logo_dimension').html(file.width+' x '+file.height);
                                        

				}

			});

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');


	/**

	 * remove file

	 */

	$('#logo, #banners, #left-banner, #slider-banners, #bg-image, #theme-image, #mobile-bg-image, #mobile-theme-image, #dclp_background, #dclp_logo_file').on('click', '.img-remove', function(e){

		e.preventDefault();

		var current = $(this),

			container = current.closest('.files'),

			holder = container.parent();

		container.hide(400, function(){

			if(container.is('.banner-cell'))

			{

				switch(holder.attr('id'))

				{

					case 'banners':

						//var i = banner_files.indexOf(container.data('file'));

						banner_files.splice(container.attr('data-index'), 1);

						$('#banners .banner-cell:gt(' + container.attr('data-index') + ')').not(this).each(function(i){

							$(this).attr('data-index', parseInt(container.attr('data-index')) + i);

						});

						break;

					case 'left-banner':

						left_banner_file = '';

						break;

					case 'slider-banners':

						//var i = slider_banner_files.indexOf(container.data('file'));

						slider_banner_files.splice(container.attr('data-index'), 1);

						$('#slider-banners .banner-cell:gt(' + container.attr('data-index') + ')').not(this).each(function(i){

							$(this).attr('data-index', parseInt(container.attr('data-index')) + i);

						});

						break;

					case 'bg-image':

						$('#themes input[name="bg_image"]').val('');

						break;

					case 'mobile-bg-image':

                                                $('#mobile-themes input[name="mobile_bg_image"]').val('');

                                                break;

					case 'theme-image':

						$('#theme-config-modal input[name="theme_image"]').val('');

						break;

                    case 'logo':

                                                $('#slider').hide();

       					break;

			        case 'mobile-theme-image':

                                                $('#save-mobile-theme-config-modal input[name="theme_image"]').val('');

                                                break;

                                        

				}

			}

			else

				logo_file = '';

			container.remove();

            $('#slider').remove();

			$('.alert').hide();		

			return false;											

		});

	});

	$('form[name=other_config_form]').submit(function(e){
		e.preventDefault();

		var $params = $(this).serializeArray();
		var $domain_id = $('#domain_id').val();
		if(confirm('Save Config?')){
			$.post(base_url + 'admin/domains/ajax/save_dclp_config', {'params': $params, 'domain_id': $domain_id}, function(result){
				alert(result.message);
			})
		}
	})

	$('#dclp_clear_background, #dclp_clear_logo').on('click', function(e){

		var $domainId = $('#domain_id').val(),
			$button_id = ($(this).attr('id'));

		switch($button_id)
		{
			case 'dclp_clear_background':
				if($('.dclp_bg_container').is(":visible")){
					if(confirm('Clear background?')){
						$.post(base_url + 'admin/domains/ajax/clear_dclp_background', {'domain_id': $domainId}, function(result){
							$('.dclp_bg_container').hide();	
						})	
					}
				}
				else{
					alert('Background already cleared.')
				}
				
				break;

			case 'dclp_clear_logo':
				if($('.dclp_bg_container').is(":visible")){
					if(confirm('Clear logo?')){
						$.post(base_url + 'admin/domains/ajax/clear_dclp_logo', {'domain_id': $domainId}, function(result){
							$('.dclp_logo_container').hide();
						})	
					}
				}
				else{
					alert('Logo already cleared.')
				}
				break;
		}

	});
	



	/**

	 * playtech configuration

	 */

	$('#currencies-form').submit(function(e){

		e.preventDefault();

		var btn = $(this).find('.btn-update'),

			url = site_url + 'admin/domains/ajax/playtech_configuration/' + domain_id;

		btn.button('loading');

		$.post(url, $(this).serializeArray(), function(response){

			$.scrollTo('.page-content');

			btn.button('reset');

			showAlert(response, $('#ld-alert'));

			domain_structure_ids = [];

			$(':checked[name="structures[]"]').each(function(){

				domain_structure_ids.push($(this).val());

			});

		});

	});

		

	$('#currency-panel').on('click', '.structure-show', function(e){

		if(! $(e.target).is(':checkbox'))

		{

			e.preventDefault();

			var structure_id = $(this).data('brand-structure-id'),

				data = $.map(brand_structures, function(v, i){

					if(structure_id == v.brand_structure_id)

						return v;

				}),

				li = $(this).closest('li');

				

			li.siblings().not(this).removeClass('active');

			li.addClass('active');

			

			data = data[0];

			$('#pas_integration_url').text(data.pas_integration_url);

			$('#flash_game_base_url').text(data.flash_game_base_url);

			$('#ims_name').text(data.ims_name);

			$('#instance_name').text(data.instance_name);

			$('#open_api_server_url').text(data.open_api_server_url);

			$('#api_certificate_key').text(data.api_certificate_key);

			$('#api_certificate_file').text(data.api_certificate_file);

			$('#structure_name').text(data.name);

			$('#entity_name').text(data.entity_name);

			$('#entity_key').text(data.entity_key);

		}

	}).find('.structure-show').has(':checked').first().click();

	$('#currency-panel').on('click', ':checkbox[name="structures[]"]', function(){

		var is_checked = $(this).is(':checked'),

			currency = $(this).data('currency');

		if(is_checked)

		{

			$(':checkbox[name="structures[]"]').not(this).filter(function(){

				return $(this).data('currency') == currency;

			}).prop('checked', false);

		}

	});

	

	/**

	 * access change

	 */

	$('select[name="access_id"]').change(function(){

		var current = $(this),

			form = current.closest('form'),

			admin = $('select[name="admin_id"]', form),

			brands = $('select[name="brand_id"]', form),

			ul = $('#currency-panel ul.nav-stacked').html('<li class="disabled">Please wait...</li>'),

			url = site_url + 'admin/domains/ajax/get_users_by_access/' + current.val();

		

		admin.html('<option>' + admin.data('please-wait') + '</option>').attr('disabled', true);

		brands.html('<option>' + admin.data('please-wait') + '</option>').attr('disabled', true);

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

			form = current.closest('form'),

			admin = $('select[name="admin_id"]', form),

			brands = $('select[name="brand_id"]', form),

			ul = $('#currency-panel ul.nav-stacked').html('<li class="disabled">' + admin.data('please-wait') + '</li>'),

			url = site_url + 'admin/domains/ajax/get_brands_by_user/' + current.val();

		brands.html('<option>' + admin.data('please-wait') + '</option>').attr('disabled', true);	

		$.get(url, function(response){

			brands.find('option').remove();			

			$.each(response, function(i, v){

				var option = $('<option />', {value:v.id}).text(v.name);

				brands.append(option);

			});

			brands.removeAttr('disabled');

			brands.change();			

		});	

	});

	

	/**

	 * brands change

	 */

	$('select[name="brand_id"]').change(function(){

		var current = $(this),

			form = current.closest('form'),

			admin = $('select[name="admin_id"]', form),

			url = site_url + 'admin/domains/ajax/get_admin_brand_structures/' + current.val() + (admin.length > 0 ? '/' + admin.val() : ''),

			ul = $('#currency-panel ul.nav-stacked').html('<li class="disabled">' + admin.data('please-wait') + '</li>');

		$.get(url, function(response){

			brand_structures = response.brand_structures;

			ul.html('');

			var has_check = false;				

			$.each(response.brand_structures, function(i, v){

				var checked = domain_structure_ids.indexOf(v.brand_structure_id) != -1 ? ' checked="checked"' : '',

					disabled = v.disabled ? ' disabled="disabled"' : '';				

				ul.append('<li><a class="structure-show" href="javascript://" data-brand-structure-id="' + v.brand_structure_id + '"><input type="checkbox" name="structures[]" data-currency="' + v.currency + '" value="' + v.brand_structure_id + '"' + checked + disabled + ' /> <span class="category-title">' + v.currency + '</span></a></li>');

			});

			ul.find('.structure-show').filter(function(){

				return has_check ? $(this).has(':checked') : true;

			}).first().click();				

		});	

	});

	

	/**

	 * disclaimer

	 */

	$('#disclaimer, #email_message, #sMessage, #fpsmessage').ckeditor();



		tinymce.init({  

				   plugins:'code',

				   mode : "specific_textareas",

        		   editor_selector : "mceEditor",

				   setup: function(ed){

				   	ed.on('change', function(e){

				   		var content = tinymce.activeEditor.getContent({format : 'raw'});

				   		var id		= this.id;

				   		var nodeId  = tinymce.activeEditor.selection.getNode().id;

				   		var new_content = content.split('{{language}}').join(language_code);

				   		tinymce.activeEditor.setContent(new_content);

				   		

				   		

				   	});

				   	ed.on('init', function(e){

				   		var id = this.id;

				   		var content = $('#true_'+id).val();

				   		var new_content = content.split('{{language}}').join(language_code);

				   		tinymce.activeEditor.setContent(new_content);

				   	});

				   }

				});



	

	/**

	 * tabs

	 */

	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){

		$('.aliases-tab-buttons').toggleClass('hidden', $(this).attr('href') != '#aliases');

		$('.alert').hide();

	})				

	/**

	 * draggable

	 */

	var drag_opts = {

		helper: function(event){

			var clone = $(this).clone();

			clone.css('width', '100%');

			return clone;

		},

		handle: '.media-object',

		cursor: 'move',

		containment: 'document',

		//stack: '.media',

		connectToSortable: '.panel-category'

	}

	$('#games-list .media').draggable(drag_opts);

      var drag_opts2 = {

		helper: function(event){

			var clone = $(this).clone();

			clone.css('width', '100%');

			return clone;

		},

		handle: '.media-object',

		cursor: 'move',

		containment: 'document',

		//stack: '.media',

		connectToSortable: '.mobile-panel-category'

	}

	$('#mobile-games-list .media').draggable(drag_opts2);

				

	/**

	 * droppable

	 */

	var btn_remove = $('<button type="button" class="btn btn-default btn-sm btn-game-remove"><span class="glyphicon glyphicon-remove"></span> Remove</button>').click(function(){

			$(this).closest('.media').slideUp('fast', function(){

				var panel = $(this).closest('.panel-category');

				$(this).remove();

				$('.alert').hide();

				$('#filter_games').trigger('keyup');

				if(panel.find('.media').length == 0)

					panel.append('<p class="text-muted">' + panel.data('no-games-added') + '</p>');

				panel.sortable('refresh');

			});

		}),

		

		btn_new = $('<button type="button" data-placement="top" title="New" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-star"></span></button>').click(function(){

			//alert('Help! Can you think a function for this button? :-)');

			$(this).toggleClass('btn-default btn-red');

		}),

		

		sort_receive = function(event, ui){

			var game_id = ui.item.attr('data-id');

			$('.alert').hide();

			ui.item.hide();

			$('.panel-category').find('.media[data-id="' + game_id + '"] .media-body').find('.btn-add-to-list').after(btn_new.clone(true).attr('title', $('.panel-category').data('tooltip-new')).tooltip().data('game_id', game_id), '&nbsp; &nbsp;', btn_remove.clone(true).html('<span class="glyphicon glyphicon-remove"></span> ' + $('.panel-category').data('button-remove'))).remove();	

			$('.panel-category').find('.text-muted').remove();

	},

                mobile_sort_receive = function(event, ui){

			var game_id = ui.item.attr('data-id');

			$('.alert').hide();

			ui.item.hide();

			$('.mobile-panel-category').find('.media[data-id="' + game_id + '"] .media-body').find('.btn-add-to-list').after(btn_new.clone(true).attr('title', $('.mobile-panel-category').data('tooltip-new')).tooltip().data('game_id', game_id), '&nbsp; &nbsp;', btn_remove.clone(true).html('<span class="glyphicon glyphicon-remove"></span> ' + $('.mobile-panel-category').data('button-remove'))).remove();	

			$('.mobile-panel-category').find('.text-muted').remove();

		};

		

	$('.panel-category').sortable({

		handle: '.media-object',

		receive: sort_receive,

	update: function(event, ui){

			$('.alert').hide();

		}

	});

        $('.mobile-panel-category').sortable({

		handle: '.media-object',

		receive: mobile_sort_receive,

		update: function(event, ui){

			$('.alert').hide();

		}

	});

	

	/**

	 * add games to list

	 */

	$('#games-list').on('click', '.btn-add-to-list', function(e){

		var media = $(this).closest('.media'),

			clone = media.clone();

		$('.panel-category').prepend(clone).sortable('refresh').find('.text-muted').remove();

		sort_receive(e, {item:media});

	});

 $('#mobile-games-list').on('click', '.btn-add-to-list', function(e){

		var media = $(this).closest('.media'),

			clone = media.clone();

		$('.mobile-panel-category').prepend(clone).sortable('refresh').find('.text-muted').remove();

		mobile_sort_receive(e, {item:media});

	});

	

	$('#games-list .btn-add-all-games').click(function(e){

		$('#games-list .media').each(function(){

			var clone = $(this).clone();

			$('.panel-category').prepend(clone).sortable('refresh').find('.text-muted').remove();

			sort_receive(e, {item:$(this)});			

		});

	});

        $('#mobile-games-list .btn-add-all-games').click(function(e){

		$('#mobile-games-list .media').each(function(){

			var clone = $(this).clone();

			$('.mobile-panel-category').prepend(clone).sortable('refresh').find('.text-muted').remove();

			mobile_sort_receive(e, {item:$(this)});			

		});

	});

	

	/**

	 * show panel

	 */

	$('#games').on('click', '.panel-show', function(e){

		e.preventDefault();

		$('.alert').hide();

		var url = site_url + 'admin/domains/ajax/get_domain_games/' + domain_id,

			field_id = $(this).data('field-id'),

			field = $(this).data('field') + '_id',

			category_name = $(this).find('.category-title').text(),

			panel_category = $('.panel-category'),

			panel = panel_category.closest('.panel'),

			li = $(this).closest('li');

		panel.data({'field_id':field_id, 'field':field});

		panel.find('.panel-title-text').text(category_name);

		panel_category.html('<p class="text-muted">' + panel_category.data('please-wait') + '</p>');

		$('.panel-show').closest('li').removeClass('active');

		li.addClass('active');					

		$.post(url, {'field':field, 'field_id':field_id}, function(response){

			$('.media, .text-muted', panel_category).remove();

			if(response.error)

				$('.panel-category').append('<p class="text-muted">' + response.error + '</p>');

			else

			{

				$.each(response, function(i, row){

					var media = $('<div class="media" data-id="' + row['id'] + '"></div>'),

						a = $('<a class="pull-left" href="#"></a>').css('width', '120px'),

						btn_new_clone = btn_new.clone(true).attr('title', panel_category.data('tooltip-new')).tooltip().data('game_id', row['id']);

					

					if(row['new'] == '1')

						btn_new_clone.toggleClass('btn-default btn-red');

					a.append('<img class="media-object" src="' + row['icon_url'] + '">');

					media.append(a);

					media.append('<div class="media-body"><h4 class="media-heading">' + row['name'] + '</h4><p>Type: ' + row['category_name'] + '</p></div>');

					media.find('.media-body').append(btn_new_clone, '&nbsp; &nbsp;', btn_remove.clone(true).html('<span class="glyphicon glyphicon-remove"></span> ' + panel_category.data('button-remove')));

					panel_category.append(media);

				});

			}

			panel_category.sortable('refresh');						

			$('#filter_games').trigger('keyup');						

		});

	}).find('.panel-show:first').click()

$('#mobile-games').on('click', '.mobile-panel-show', function(e){

           e.preventDefault();

           $('.alert').hide();

           

           var url = site_url + 'admin/domains/ajax/get_domain_mobile_games/' + domain_id,

			field_id = $(this).data('field-id'),

			field = $(this).data('field') + '_id',

			category_name = $(this).find('.mobile-category-title').text(),

			panel_category = $('.mobile-panel-category'),

			panel = panel_category.closest('.panel'),

			li = $(this).closest('li');

                        

                panel.data({'field_id':field_id, 'field':field});

		panel.find('.panel-title-text').text(category_name);

		panel_category.html('<p class="text-muted">' + panel_category.data('please-wait') + '</p>');

                $('.mobile-panel-show').closest('li').removeClass('active');

		li.addClass('active');

               $.post(url, {'field':field, 'field_id':field_id}, function(response){

			$('.media, .text-muted', panel_category).remove();

			if(response.error)

				$('.mobile-panel-category').append('<p class="text-muted">' + response.error + '</p>');

			else

			{

				$.each(response, function(i, row){

					var media = $('<div class="media" data-id="' + row['id'] + '"></div>'),

						a = $('<a class="pull-left" href="#"></a>').css('width', '120px'),

						btn_new_clone = btn_new.clone(true).attr('title', panel_category.data('tooltip-new')).tooltip().data('game_id', row['id']);

					

					if(row['new'] == '1')

						btn_new_clone.toggleClass('btn-default btn-red');

					a.append('<img class="media-object" src="' + row['icon_url'] + '">');

					media.append(a);

					media.append('<div class="media-body"><h4 class="media-heading">' + row['name'] + '</h4><p>Type: ' + row['category_name'] + '</p></div>');

					media.find('.media-body').append(btn_new_clone, '&nbsp; &nbsp;', btn_remove.clone(true).html('<span class="glyphicon glyphicon-remove"></span> ' + panel_category.data('button-remove')));

					panel_category.append(media);

				});

			}

			panel_category.sortable('refresh');						

			$('#mobile_filter_games').trigger('keyup');						

		});

            

                        

           //alert("Pag gumana to matatapos ko to at magiging successful yung mobile sites sa tulong ng Panginoon.");

        }).find('.mobile-panel-show:first').click();

	

	/**

	 * clear panel

	 */

	$('#games .btn-panel-clear').click(function(){

		var panel = $(this).closest('.panel'),

			panel_category = panel.find('.panel-category');

		panel.find('.media').remove();

		panel_category.html('<p class="text-muted">' + panel_category.data('no-games-added') + '...</p>');

		panel_category.sortable('refresh');

		$('#filter_games').trigger('keyup');

	});

$('#mobile-games .btn-panel-clear').click(function(){

		var panel = $(this).closest('.panel'),

		panel_category = panel.find('.mobile-panel-category');

		panel.find('.media').remove();

		panel_category.html('<p class="text-muted">' + panel_category.data('no-games-added') + '...</p>');

		panel_category.sortable('refresh');

		$('#mobile_filter_games').trigger('keyup');

	});

	

	/**

	 * shuffle games

	 */

	$('#games .btn-panel-shuffle').click(function(){

		var btn = $(this),

			panel = $(this).closest('.panel'),

			panel_category = panel.find('.panel-category'),

		content = panel_category.find('.media');

		shuffle(content, 'media');

		panel_category.append(content);

	});

        $('#mobile-games .btn-panel-shuffle').click(function(){

		var btn = $(this),

			panel = $(this).closest('.panel'),

			panel_category = panel.find('.mobile-panel-category'),

			content = panel_category.find('.media');

		shuffle(content, 'media');

		panel_category.append(content);

	});

	

	/**

	 * save panel

	 */

	$('#games .btn-panel-save').click(function(){

		

		var btn = $(this),

			games = $('.panel-category').sortable('toArray', {attribute:'data-id'}),

			panel = $(this).closest('.panel'),

			field = panel.data('field'),

			field_id = panel.data('field_id'),

			url = site_url + 'admin/domains/ajax/games_management',

		new_games = [];

		panel.find('.btn-red').each(function(){

			new_games.push($(this).data('game_id'));

		});

		btn.button('loading');

		$.post(url, {'games':games, 'new_games':new_games, 'field':field, 'field_id':field_id, 'domain_id':domain_id}, function(response){

			$.scrollTo('.page-content');

			btn.button('reset');

			showAlert(response, $('#ld-alert'));

			if(! response.error)

			{

				var section_panel = $('#' + field.replace('_id', 's') + '-panel');

				section_panel.find('[data-section="' + field.replace('_id', '_') + field_id + '"] .badge').text(response.total);

			}

		});

	});

        $('#mobile-games .btn-panel-save').click(function(){

		

		var btn = $(this),

			games = $('.mobile-panel-category').sortable('toArray', {attribute:'data-id'}),

			panel = $(this).closest('.panel'),

			field = panel.data('field'),

			field_id = panel.data('field_id'),

			url = site_url + 'admin/domains/ajax/mobile_games_management',

			new_games = [];

		panel.find('.btn-red').each(function(){

			new_games.push($(this).data('game_id'));

		});

		btn.button('loading');

		$.post(url, {'games':games, 'new_games':new_games, 'field':field, 'field_id':field_id, 'domain_id':domain_id}, function(response){

			$.scrollTo('.page-content');

			btn.button('reset');

			showAlert(response, $('#ld-alert'));

			if(! response.error)

			{

				var section_panel = $('#' + field.replace('_id', 's') + '-mobile-panel');

				section_panel.find('[data-section="' + field.replace('_id', '_') + field_id + '"] .badge').text(response.total);

			}

		});

	});

	

	/**

	 * banner files upload

	 */

	$('#banner_files').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Banner ' + file.name + ': ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));

					$.scrollTo('.page-content');

				}

				else

				{

				    banner_files.push(file);								

					var cell = $('<div />').attr({class:'col-md-2 banner-cell files', 'data-index':banner_files.length - 1}).data('file', file.name),

						thumb = $('<div />').attr({class:'thumbnail'}).css('cursor', 'pointer');

						

					thumb.click(function(e){

						if(! $(e.target).is('.glyphicon-remove'))

						{

							var modal = $('#banner-modal'),

								preview = modal.find('.preview').css({width:'614px', height:'305px'}),

								img = preview.find('img');

							img.attr('src', file.url);

							modal.on('shown.bs.modal', function(){

								banner_overlay_actions(modal);

							});							

							modal.data({'filename':file.name, 'type':'slider_banner'}).modal('show');

						}

					});

					thumb.html($('<img>').attr({src:file.thumbnailUrl}));

					//thumb.append('<div class="caption text-center"><a href="' + file.deleteUrl + '" class="btn btn-primary img-remove temporary"><span class="glyphicon glyphicon-remove"></span> Remove</a></div>');	

					thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

					cell.html(thumb);

					$('.alert').hide();

					$('#banners').append(cell);

				}

			});

			$('#banners').sortable('refresh');

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

	

	/**

	 * banners

	 */

	$('#banners').sortable({

		handle: '.thumbnail',

		cursor: 'move',

		distance: 20

	});

	

	$('#slider-banners').sortable({

		handle: '.thumbnail',

		cursor: 'move',

		distance: 20,

		cursorAt: {left:100, top:25},

		placeholder: 'col-md-3',

		start: function(event, ui){

			var height = $(ui.helper).height(),

				width = $(ui.helper).width();

			$(ui.placeholder).html($(ui.helper).html());

			$(ui.placeholder).css('visibility', 'hidden');

		}

	});	

	

	$('#banners .thumbnail').click(function(e){

		if(! $(e.target).is('.glyphicon'))

		{

			var modal = $('#banner-modal'),

				preview = modal.find('.preview').css({width:'624px', height:'310px'}),

				img = preview.find('img'),

				index = $(this).closest('.banner-cell').attr('data-index'), //$('#banners .thumbnail').index(this),

				file = banner_files[index];

			img.attr('src', file.url);

			modal.on('shown.bs.modal', function(){

				banner_overlay_actions(modal);

			});

			modal.data({'filename':file.name, 'type':'slider_banner'}).modal('show');

		}

	});

	

	/**

	 * content management

	 */

	$('#content-management-form').submit(function(e){

		e.preventDefault();

		var btn = $(this).find('.btn-update'),

			banner_sort = $('#banners').sortable('toArray', {attribute:'data-index'}),

			url = site_url + 'admin/domains/ajax/content_management',

			registration_val = $(this).find("[name='registration']").val(),

 			form_data = $(this).serializeArray(),

			regIsChecked = $('#registration').prop('checked'),

			fpIsChecked  = $('#forgot_password').prop('checked'),

			isEmailConfigured = $('#isEmailConfigured').val();

                    

                    if((regIsChecked || fpIsChecked) && isEmailConfigured == 'false')

                    {

                       $('#warning_config_email_modal').modal('show');                  

                    }

                    else

                    {		

		form_data.push({name:'domain_id', value:domain_id});

		form_data.push({name:'logo', value:logo_file});

		$.each(banner_files, function(index, banner){

			form_data.push({name:'banners[]', value:banner.name});

			if(banner.data)

			{

				$.each(banner.data, function(i, v){

					form_data.push({name:'banners_data[' + index + '][' + v.name + ']', value:v.value});

				});

			}	

			form_data.push({name:'banners_data[' + index + '][sort]', value:banner_sort.indexOf(index.toString()) + 1});			

		});

		btn.button('loading');

		$.post(url, form_data, function(response){

			$.scrollTo('.page-content');

			btn.button('reset');	

			showAlert(response, $('#ld-alert'));

			if(response.success)

			{

				if(registration_val == 1)

				{

					 $('.reg_menu').removeClass('hidden');

					$('.reg-form-config').show();

				}

				else

				{

					 $('.reg_menu').addClass('hidden');

					 $('.reg-form-config').hide();

				}

				$('.img-remove').removeClass('temporary');

				var main = $('.widget-header'),

					domain_name = $('> h3 > a', main).text();

				if($('#domain').val() != domain_name)

					$('> h3 > a', main).text($('#domain').val()).attr('href', 'http://' + $('#domain').val());

			}

		});

	   }

	});

	

	/**

	 * manage button on banners

	 */

	var banner_overlay_actions = function(modal){

		var form = modal.find('form'),

			//btn = modal.find('.drag'),

			filename = modal.data('filename'),

			modal_type = modal.data('type'),

			data = null;

		switch(modal_type)

		{

			case 'page_slider_banner':

				$.each(slider_banner_files, function(i, v){

					if(v.data && v.name == filename)

					{

						data = v.data;

						return false;

					}

				});

				break;

			case 'slider_banner':

				$.each(banner_files, function(i, v){

					if(v.data && v.name == filename)

					{

						data = v.data;

						return false;

					}

				});

				break;

			case 'page_left_banner':

				if(left_banner_file.data)

					data = left_banner_file.data;

				break;

		}

		

		form[0].reset();

		modal.find('fieldset:gt(1)').remove();

		modal.find('.preview .drag:gt(0)').remove();

		modal.find('.preview .drag:eq(0)').attr('data-button', '1').addClass('hidden').text(function(){return $(this).data('button-text') + ' 1'}).css({left:0, top:0, background:'', 'font-size':'', padding:'', color:'', 'border-color':''}).off('mouseenter mouseleave');

		modal.find('fieldset:eq(1)').addClass('hidden').find('.legend-text').text(modal.find('.preview .drag:eq(0)').data('button-text') + ' 1');

		$('input, select', modal.find('fieldset:eq(1)')).attr('disabled', true);	

		

		$('select[name$="action"]', modal).change();		

		$('select[name$="game"]', modal).trigger('chosen:updated');							

				

		if(data != null)

		{

			$.each(data, function(i, v){

				var input_type = v.name.replace(/(image|button_\d)_/, ''),

					number = v.name.match(/\d/);

				if(number != null)

				{

					if(modal.find('fieldset[data-drag="' + number[0] + '"]:visible').length == 0)	

						$('.btn-add-button', modal).triggerHandler("click");

				}

				switch(input_type)

				{

					case 'action':

						$('select[name="' + v.name + '"]', modal).val(v.value).change();

					case 'action_game':

						$('select[name="' + v.name + '"]', modal).val(v.value).trigger('chosen:updated');

						break;

					case 'description':

						$('textarea[name="' + v.name + '"]', modal).val(v.value);

						break;

					case 'x_position':

					case 'y_position':

						$('input[name="' + v.name + '"]', modal).val(v.value).trigger('change', {'modal':modal});

						break;

					case 'text_color':

					case 'bg_color':

					case 'hover_bg_color':

						$('input[name="' + v.name + '"]', modal).val(v.value).colorpicker('setValue', v.value).colorpicker('update');

						break;

					default:

						$('input[name="' + v.name + '"]', modal).val(v.value).change();

						break;

				}

			});

		}

	};

	

	$('#banner-modal, #left-banner-modal').each(function(){

		var modal = $(this);

		

		$('.drag', modal).draggable({

			containment: 'parent',

			drag: function(event, ui){

				var y_input = $('input.y-position', modal.find('fieldset[data-drag="' + $(this).attr('data-button') + '"]')),

					x_input = $('input.x-position', modal.find('fieldset[data-drag="' + $(this).attr('data-button') + '"]'));

				y_input.val(ui.position.top + 'px');

				x_input.val(ui.position.left + 'px');

			}

		});

		$('select[name$="game"]', modal).chosen({

			width: '100%'

		});	

					

		$('select[name$="action"]', modal).on('change', function(){

			var value = $(this).val(),

				form_group = $('<div />', {class:'form-group'}),

				container = $(this).closest('fieldset');

			switch(value)

			{

				case 'popup_window':

					$('.action-width, .action-height, .action-url', container).closest('.form-group').removeClass('hidden');

					$('.action-game', container).closest('.form-group').addClass('hidden');

					break;

				case 'open_game':

					$('.action-game', container).closest('.form-group').removeClass('hidden');;

					$('.action-width, .action-height, .action-url', container).closest('.form-group').addClass('hidden');

					break;

				default:

					$('.action-url', container).closest('.form-group').removeClass('hidden');

					$('.action-width, .action-height, .action-game', container).closest('.form-group').addClass('hidden');

					break;

			}

		}).change();

		

		modal.on('change', 'input[name$="size"]', function(){

			var value = $(this).val(),

				fieldset = $(this).closest('fieldset'),

				drag = $('.drag[data-button="' + fieldset.attr('data-drag') + '"]', modal),

				name = $(this).attr('name').replace(/button_\d_/, '');

			if(name == 'font_size')

				drag.css({'font-size':value == '' ? 'auto' : value, 'font-family':'Tahoma'});

			else

				drag.css({'padding': value == '' ? 'auto' : value, 'line-height':'20px'});

		});

		

		modal.on('changeColor', 'input[name$="color"]',  function(){

			var value = $(this).val(),

				fieldset = $(this).closest('fieldset'),

				drag = $('.drag[data-button="' + fieldset.attr('data-drag') + '"]', modal),

				name = $(this).attr('name').replace(/button_\d_/, '');

			if(name == 'text_color')

				drag.css('color', value == '' ? 'auto' : value);

			else if(name == 'bg_color')

				drag.css({'background':value == '' ? 'auto' : value, 'border-color':value == '' ? 'auto' : value});

			else if(name == 'hover_bg_color')

			{

				drag.data('old_background', drag.css('background'));

				drag.hover(function(){

					$(this).css('background', value == '' ? 'auto' : value);

				}, function(){

					$(this).css('background', $(this).data('old_background'));

				});

			}

		});

		

		modal.on('change', 'input[name$="url"]', function(){

			var pattern = /^http/,

				value = $(this).val();

			if(value != '' && ! pattern.test(value))

				$(this).val('http://' + value);

		});

		

		var position_change = function(event){

			var fieldset = $(this).closest('fieldset'),

				x_input = $('input.x-position', fieldset),

				y_input = $('input.y-position', fieldset),

				modal_type = event.data.modal.data('type'),

				btn = $('.drag[data-button="' + fieldset.attr('data-drag') + '"]', event.data.modal),

				x = x_input.val(),

				y = y_input.val(),

				x_pos = x.match(/\d+/),

				y_pos = y.match(/\d+/),

				x_max = 525,

				y_max = 265;

			

			switch(modal_type)

			{

				case 'page_slider_banner':

					x_max = 620;

					y_max = 210;

					break;

				case 'page_left_banner':

					x_max = 130;

					y_max = 515;

					break;

			}

			if(x_pos != null)

			{

				if(parseInt(x_pos) > x_max)

					x_pos = x_max;

				btn.css('left', x_pos + 'px');

				if(x != x_pos + 'px')

					x_input.val(x_pos + 'px');

			}

			if(y_pos != null)

			{

				if(parseInt(y_pos) > y_max)

					y_pos = y_max

				btn.css('top', y_pos + 'px');

				if(y != y_pos + 'px')

					y_input.val(y_pos + 'px');

			}

		};

		

		$('input.x-position', modal).on('change', {'modal':modal}, position_change);

		$('input.y-position', modal).on('change', {'modal':modal}, position_change);

				

		$('input.button-text', modal).on('change', function(){

			var value = $(this).val(),

				fieldset = $(this).closest('fieldset'),

				btn = modal.find('.preview .drag[data-button="' + fieldset.attr('data-drag') + '"]');

			if(value == '')

				value = 'Button ' + fieldset.attr('data-drag');

			btn.text(value);

			fieldset.find('.legend-text').text(value);

		});

							

		$('.btn-update', modal).on('click', function(){

			

			var form = modal.find('form'),

				filename = modal.data('filename'),

				modal_type = modal.data('type');

			switch(modal_type)

			{

				case 'page_slider_banner':

					$.each(slider_banner_files, function(i, v){

						if(v.name == filename)

						{

							slider_banner_files[i].data = form.serializeArray();

							return false;

						}

					});

					break;

				case 'slider_banner':

					$.each(banner_files, function(i, v){

						if(v.name == filename)

						{

							banner_files[i].data = form.serializeArray();

							return false;

						}

					});

					break;

				case 'page_left_banner':

					left_banner_file.data = form.serializeArray();

					break;

			}

			modal.modal('hide');

		});

		

		$('.toggle-button', modal).on('click', function(e){

			e.preventDefault();

			var fieldset = $(this).closest('fieldset');

			fieldset.find('.toggle-form-group').toggleClass('hidden');

			$(this).find('.glyphicon').toggleClass('glyphicon-minus glyphicon-plus');

		})

		

		$('.btn-add-button', modal).on('click', function(){

			var form_group = $(this).closest('.form-group'),

				prev_fieldset = form_group.prev('fieldset'),

				fieldset = prev_fieldset.clone(true),

				action_game = prev_fieldset.find('select.action-game').clone(),

				button_bg_color = prev_fieldset.find('input.button-bg-color').clone(),

				drag = modal.find('.drag:first').clone(),

				number = modal.find('fieldset:visible').length,

				preview = modal.find('.preview');

			

			if(number <= 1)

			{

				prev_fieldset.toggleClass('hidden');

				modal.find('.drag:first').toggleClass('hidden');

				$('input, select', prev_fieldset).removeAttr('disabled');

				$('.action-game', prev_fieldset).trigger('chosen:updated');

				if(prev_fieldset.find('.toggle-form-group').hasClass('hidden'))

					prev_fieldset.find('.toggle-button').triggerHandler('click');

				return true;

			}

			

			fieldset.attr('data-drag', number);

			fieldset.find('.legend-text').text(drag.data('button-text') + ' ' + number);

			drag.text(drag.data('button-text') + ' ' + number).attr('data-button', number).css({left:0, top:0, background:'', 'font-size':'', padding:'', color:'', 'border-color':''});

						

			fieldset.find('input, select').each(function(){

				var old_name = $(this).attr('name');

				if(old_name != undefined)

				{

					var new_name = old_name.replace(/button_\d/, 'button_' + number);

					$(this).attr('name', new_name).val('');

				}

				if($(this).is('.action-game'))

					$(this).siblings().remove().end().replaceWith(action_game);

				if($(this).is('.colorpicker'))

				{

					var replacement = prev_fieldset.find('input[name="' + old_name + '"]').clone();

					replacement.attr('name', new_name).val('');

					$(this).replaceWith(replacement);

				}

			});

						

			preview.append(drag);

			form_group.before(fieldset);

			

			$('.colorpicker', fieldset).colorpicker();

			

			if(fieldset.find('.toggle-form-group').hasClass('hidden'))

				fieldset.find('.toggle-button').triggerHandler('click');

			

			fieldset.find('select[name="button_' + number + '_action"]').change();

			

			action_game.val('').attr('name', 'button_' + number + '_game').chosen({

				width: '100%'

			});							



			drag.draggable({

				containment: 'parent',

				drag: function(event, ui){

					var y_input = $('input.y-position', fieldset),

						x_input = $('input.x-position', fieldset);

					y_input.val(ui.position.top + 'px');

					x_input.val(ui.position.left + 'px');

				}

			});	

		});

		

		$('.btn-remove-button', modal).on('click', function(){

			var fieldset = $(this).closest('fieldset');

			if(modal.find('fieldset:visible').length <= 2)

			{

				fieldset.toggleClass('hidden');

				modal.find('.drag:first').toggleClass('hidden');

				$('input, select', fieldset).attr('disabled', true);

				$('.action-game', fieldset).trigger('chosen:updated');

				return true;

			}

			modal.find('.drag[data-button="' + fieldset.attr('data-drag') + '"]').remove();

			fieldset.remove();

			

			modal.find('fieldset:gt(0)').each(function(i){

				var number = i + 1,

					legend_text = $('.legend-text', $(this)),

					drag = modal.find('.preview .drag[data-button="' + $(this).attr('data-drag') + '"]');

				if(legend_text.text().search(new Regexp(drag.data('button-text') + '\d')) != -1)

				{

					legend_text.text(drag.data('button-text') + ' ' + number);

					drag.text(drag.data('button-text') + ' ' + number);

				}

				drag.attr('data-button', number);

				$(this).attr('data-drag', number);

				$('input, select', $(this)).each(function(){

					var old_name = $(this).attr('name');

					if(old_name != undefined)

					{

						var new_name = old_name.replace(/button_\d/, 'button_' + number);

						$(this).attr('name', new_name);

					}

				});

			});

		});

	});	  



			

	/**

	 * refresh panel

	 */

	$('#games .btn-panel-refresh').click(function(e){

		e.preventDefault();

		var panel = $(this).closest('.panel'),

			field = $(this).data('field'),

			url = site_url + 'admin/domains/ajax/get_domain_games_total/' + domain_id,

			default_panel = $('.panel-category').closest('.panel');

		panel.find('.panel-body').html('<p class="text-muted">' + $(this).data('please-wait') + '</p>');

		$.get(url, {section:field}, function(response){

			panel.find('.panel-body').html('<ul class="nav nav-pills nav-stacked"></ul>');

			var ul = panel.find('.panel-body ul.nav-stacked');

			$.each(response, function(i, v){

				var is_active = false;

				if((field == 'page' && default_panel.data('field') == 'page_id' && v.id == default_panel.data('field_id')) || (field == 'widget' && default_panel.data('field') == 'widget_id' && v.id == default_panel.data('field_id')))

					is_active = true;

				var li = '<li' + (is_active ? ' class="active"' : '') + '><a class="panel-show" href="#" data-section="' + field + '_' + v.id + '" data-field="' + field + '" data-field-id="' + v.id + '"><span class="badge pull-right">' + v.total + '</span><span class="category-title">' + v.name + '</span></a></li>';

				ul.append(li);

			});

		});

	});

$('#mobile-games .btn-panel-refresh').click(function(e){

		e.preventDefault();

		var panel = $(this).closest('.panel'),

			field = $(this).data('field'),

			url = site_url + 'admin/domains/ajax/get_domain_mobile_games_total/' + domain_id,

			default_panel = $('.mobile-panel-category').closest('.panel');

		panel.find('.panel-body').html('<p class="text-muted">' + $(this).data('please-wait') + '</p>');

		$.get(url, {section:field}, function(response){

			panel.find('.panel-body').html('<ul class="nav nav-pills nav-stacked"></ul>');

			var ul = panel.find('.panel-body ul.nav-stacked');

			$.each(response, function(i, v){

				var is_active = false;

				if((field == 'page' && default_panel.data('field') == 'page_id' && v.id == default_panel.data('field_id')) || (field == 'widget' && default_panel.data('field') == 'widget_id' && v.id == default_panel.data('field_id')))

					is_active = true;

				var li = '<li' + (is_active ? ' class="active"' : '') + '><a class="panel-show" href="#" data-section="' + field + '_' + v.id + '" data-field="' + field + '" data-field-id="' + v.id + '"><span class="badge pull-right">' + v.total + '</span><span class="category-title">' + v.name + '</span></a></li>';

				ul.append(li);

			});

		});

	});

	

	/**

	 * filter games

	 */ 

	var xhr;

	$('#filter_games').on('keyup keydown', function(){

		var url = site_url + 'admin/domains/ajax/filter_games',

			exclude = $('.panel-category').sortable('toArray', {attribute:'data-id'}),

			panel_body = $('#games-list .panel-body');

		if(xhr != null)

			xhr.abort();

		$('.media, .text-muted', $('#games-list .panel-body')).remove();

		$('#games-list .btn-add-all-games').attr('disabled', true);

		/*if($('.loader', $('#games-list .panel-body')).length > 0)

			$('.loader', $('#games-list .panel-body')).show();

		else

			$('#games-list .panel-body').append('<div class="loader text-center"><img src="' + template_dir + '/images/loader.gif" /></div>')*/

		panel_body.append('<p class="text-muted">' + panel_body.data('please-wait') + '</p>');

		xhr = $.ajax({

				url: url,

				type: 'POST',

				data: {keyword:$(this).val(), filter_by:$('#filter-games-bt').data('filter_by'), ids:exclude}, 

				success: function(response){

					xhr = null;

					//$('.loader', $('#games-list .panel-body')).remove();

					$('.text-muted', panel_body).remove();

					$('#games-list .btn-add-all-games').removeAttr('disabled');

					if(response.error)

						$('#games-list .panel-body').append('<p class="text-muted">' + response.error + '</p>');

					else

					{

						$.each(response, function(i, row){

							var media = $('<div class="media" data-id="' + row['id'] + '"></div>'),

								a = $('<div class="pull-left"></div>').css({'width':'120px', 'cursor':'move'});

							a.append('<img class="media-object" src="' + row['icon_url'] + '" style="margin:0 auto;">');

							media.append(a);

							media.append('<div class="media-body"><h4 class="media-heading">' + row['translatable_name'] + '</h4><p>Type: ' + row['category_name'] + '</p><button type="button" class="btn btn-default btn-sm btn-add-to-list"><span class="glyphicon glyphicon-plus"></span> ' + panel_body.data('button-add-to-list') + '</button></div>');

							$('#games-list .panel-body').append(media);

						});

						$('#games-list .media').draggable(drag_opts);

					}

				}

			});

	});

	$('.filter-games').click(function(e){

		e.preventDefault();

		var value = $(this).data('field');

		switch(value)

		{

			case 'all':

				var filter_text = $(this).data('filter-by');

				break;

			default:

				var filter_text = $(this).text();

				break;

				

		}

		$('#filter-games-bt').data('filter_by', value).html(filter_text + ' <span class="caret"></span>');

		$('#filter_games').keyup();

	});

 var xhr2;

        $('#mobile_filter_games').on('keyup keydown', function(){

            var url = site_url + 'admin/domains/ajax/filter_mobile_games',

			exclude = $('.mobile-panel-category').sortable('toArray', {attribute:'data-id'}),

			panel_body = $('#mobile-games-list .panel-body');

		if(xhr2 != null)

			xhr2.abort();

                $('.media, .text-muted', $('#mobile-games-list .panel-body')).remove();

		$('#mobile-games-list .btn-add-all-games').attr('disabled', true);

                panel_body.append('<p class="text-muted">' + panel_body.data('please-wait') + '</p>');

                xhr2 = $.ajax({

				url: url,

				type: 'POST',

				data: {keyword:$(this).val(), filter_by:$('#mobile-filter-games-bt').data('mobile_filter_by'), ids:exclude}, 

				success: function(response){

					xhr = null;

					//$('.loader', $('#games-list .panel-body')).remove();

					$('.text-muted', panel_body).remove();

					$('#mobile-games-list .btn-add-all-games').removeAttr('disabled');

					if(response.error)

						$('#mobile-games-list .panel-body').append('<p class="text-muted">' + response.error + '</p>');

					else

					{

						$.each(response, function(i, row){

							var media = $('<div class="media" data-id="' + row['id'] + '"></div>'),

								a = $('<div class="pull-left"></div>').css({'width':'120px', 'cursor':'move'});

							a.append('<img class="media-object" src="' + row['icon_url'] + '" style="margin:0 auto;">');

							media.append(a);

							media.append('<div class="media-body"><h4 class="media-heading">' + row['translatable_name'] + '</h4><p>Type: ' + row['category_name'] + '</p><button type="button" class="btn btn-default btn-sm btn-add-to-list"><span class="glyphicon glyphicon-plus"></span> ' + panel_body.data('button-add-to-list') + '</button></div>');

							$('#mobile-games-list .panel-body').append(media);

						});

						$('#mobile-games-list .media').draggable(drag_opts2);

					}

				}

			});

                       

        });

        $('.filter-mobile-games').click(function(e){

		e.preventDefault();

		var value = $(this).data('field');

		switch(value)

		{

			case 'all':

				var filter_text = $(this).data('mobile-filter-by');

				break;

			default:

				var filter_text = $(this).text();

				break;

				

		}

		$('#mobile-filter-games-bt').data('mobile_filter_by', value).html(filter_text + ' <span class="caret"></span>');

		$('#mobile_filter_games').keyup();

	});

	

	/**

	 * themes

	 */

	$('#themes .btn-radio, #mobile-themes .btn-radio').click(function(){

		var rb_obj = $(this).find(':radio'),

			theme = $('#themes');

		$(this).siblings().find('span').removeClass('glyphicon-check').addClass('glyphicon-unchecked');

		$(this).find('span').removeClass('glyphicon-unchecked').addClass('glyphicon-check');

		if(rb_obj.attr('name') == 'layout_style')

		{

			$('.bg-pattern-group', theme).toggleClass('hidden', ! rb_obj.is('#layout_style_boxed'));

			$('.custom-config', theme).toggleClass('hidden', ! rb_obj.is('#layout_style_custom'));

			$('.reg-form-config ', theme).toggleClass('hidden' , ! rb_obj.is('#layout_style_custom'));

		}

	});

	$('#themes :radio[name="layout_style"]:checked').click();

	$('#theme-configuration-form, #mobile-theme-configuration-form').submit(function(e){

		e.preventDefault();

		var btn = $(this).find('.btn-update'),

			url = site_url + 'admin/domains/ajax/theme_configuration/' + domain_id;

		btn.button('loading');

		$.post(url, $(this).serializeArray(), function(response){

			$.scrollTo('.page-content');

			btn.button('reset');					

			showAlert(response, $('#ld-alert'));

		});

	});		

	$('#save-theme-config-form').submit(function(e){

		e.preventDefault();

		var modal = $(this).closest('.modal'),

			btn = modal.find('.btn-save'),

			url = site_url + 'admin/domains/ajax/save_theme_configuration',

			data = $.merge($('#theme-configuration-form').serializeArray(), $(this).serializeArray());

		btn.button('loading');

		$.post(url, data, function(response){

			btn.button('reset');

			if(response.error)

			{

				showAlert(response, $('#tc-alert'));

				$.scrollTo('.page-content');				

			}

			else

			{

				modal.one('hidden.bs.modal', function(){

					var theme_image_url = modal.find('#theme-image img').attr('src'),

						theme_name = modal.find('input[name="theme_name"]').val(),

						theme_image = modal.find('input[name="theme_image"]').val(),

						radio = $('#themes .theme-options :radio[name="theme_id"][value="' + response.theme_id + '"]'),

						theme_option = '<div class="col-md-2">' +

												'<div class="radio">' +

													'<label>' +

														'<div class="thumbnail">' +

															'<img src="' + theme_image_url + '" />' +

															'<div class="caption text-center">' +

																'<input type="radio" name="theme_id" value="' + response.theme_id + '" data-theme-name="' + theme_name + '" data-theme-image="' + theme_image + '" /> ' + theme_name +

															'</div>' +

															'<div style="position:absolute; top:10px; right:5px;"><a href="#remove-theme-modal" data-toggle="modal" class="theme-remove" data-theme-name="' + theme_name + '" data-theme-id="' + response.theme_id + '"><span class="glyphicon glyphicon-remove"></span></a></div>' +

													'</div>' +

												'</label>' +

											'</div>' +

										'</div>';

					if(radio.length == 0)

						$('#themes .theme-options').append(theme_option);

					else

					{

						var holder = radio.closest('.col-md-2');

						holder.replaceWith(theme_option);

					}

					$('#themes .theme-options :radio[name="theme_id"][value="' + response.theme_id + '"]').click();					

					$('#themes .btn-update-config').removeClass('hidden');					

					showAlert(response, $('#ld-alert'));

					$.scrollTo('.page-content');

				});

				modal.modal('hide');

			}

		});

	});

$('#save-mobile-theme-config-form').submit(function(e){

		e.preventDefault();

		var modal = $(this).closest('.modal'),

			btn = modal.find('.btn-save'),

			url = site_url + 'admin/domains/ajax/save_mobile_theme_configuration',

			data = $.merge($('#mobile-theme-configuration-form').serializeArray(), $(this).serializeArray());

		btn.button('loading');

		$.post(url, data, function(response){

			btn.button('reset');

			if(response.error)

			{

				showAlert(response, $('#tc-alert'));

				$.scrollTo('.page-content');				

			}

			else

			{

				modal.one('hidden.bs.modal', function(){

					var theme_image_url = modal.find('#mobile-theme-image img').attr('src'),

						theme_name = modal.find('input[name="theme_name"]').val(),

						theme_image = modal.find('input[name="theme_image"]').val(),

						radio = $('#mobile-themes .theme-options :radio[name="mobile_theme_id"][value="' + response.theme_id + '"]'),

						theme_option = '<div class="col-md-2">' +

												'<div class="radio">' +

													'<label>' +

														'<div class="thumbnail">' +

															'<img src="' + theme_image_url + '" />' +

															'<div class="caption text-center">' +

																'<input type="radio" name="mobile_theme_id" value="' + response.theme_id + '" data-theme-name="' + theme_name + '" data-theme-image="' + theme_image + '" /> ' + theme_name +

															'</div>' +

															'<div style="position:absolute; top:10px; right:5px;"><a href="#remove-mobile-theme-modal" data-toggle="modal" class="theme-remove" data-theme-name="' + theme_name + '" data-theme-id="' + response.theme_id + '"><span class="glyphicon glyphicon-remove"></span></a></div>' +

													'</div>' +

												'</label>' +

											'</div>' +

										'</div>';

					if(radio.length == 0)

						$('#mobile-themes .theme-options').append(theme_option);

					else

					{

						var holder = radio.closest('.col-md-2');

						holder.replaceWith(theme_option);

					}

					$('#mobile-themes .theme-options :radio[name="mobile_theme_id"][value="' + response.theme_id + '"]').click();					

					$('#mobile-themes .btn-update-config').removeClass('hidden');					

					showAlert(response, $('#ld-alert'));

					$.scrollTo('.page-content');

				});

				modal.modal('hide');

			}

		});

	});

	$('#save-theme-config-modal .btn-save').click(function(){

		$('#save_theme_config_bt').click();

});

        $('#save-mobile-theme-config-modal .btn-save').click(function(){

           $('#save_mobile_theme_config_bt').click(); 

	});

	$('#themes .theme-options').on('click', ':radio', function(){

		var url = site_url + 'admin/domains/ajax/get_theme_configuration/' + $(this).val(),

			form = $('#theme-configuration-form');

		if($(this).val() == '1')

		{

			url += '/' + domain_id;

			$('#themes .btn-update-config').addClass('hidden');

		}

		else

		{

			$('#themes .btn-update-config').data({

				'theme_id': $(this).val(),

				'theme_name': $(this).attr('data-theme-name'),

				'theme_image': $(this).attr('data-theme-image'),

				'theme_image_url': $(this).closest('.thumbnail').find('img').attr('src'),

			}).removeClass('hidden');			

		}

		$('#loading-indicator').show();

		$.get(url, function(response){

			$.each(response, function(k, v){

				if(k == 'color_style' || k == 'layout_style' || k=='mobile_color_style')

					$(':radio[name="' + k + '"][value="' + v + '"]', form).click();

				else if(k == 'bg_image_url')

					$('#bg-image img').attr('src', v);

				else

					$('input[name="' + k + '"]', form).val(v);

	});

			$('#loading-indicator').hide();

		});

	});

$('#mobile-themes .theme-options').on('click', ':radio', function(){

                 var url = site_url + 'admin/domains/ajax/get_mobile_theme_configuration/' + $(this).val() + '/' + domain_id,

		     form = $('#mobile-theme-configuration-form');

               $('#mobile-bg-image').html('');

               $('input[name=mobile_bg_image]').val("");

              

		if($(this).val() == '5'){

			$('#mobile-themes .btn-update-config').addClass('hidden');

		}

		else

		{

			$('#mobile-themes .btn-update-config').data({

				'theme_id': $(this).val(),

				'theme_name': $(this).attr('data-theme-name'),

				'theme_image': $(this).attr('data-theme-image'),

				'theme_image_url': $(this).closest('.thumbnail').find('img').attr('src')

			}).removeClass('hidden');			

		}

		$('#loading-indicator').show();

		$.get(url, function(response){

			$.each(response, function(k, v){

                                

				if(k=='mobile_color_style')

					$(':radio[name="' + k + '"][value="' + v + '"]', form).click();

                                else if(k == 'mobile_bg_image'){

                                    if(v == '')

                                       $('input[name=mobile_bg_image]').val("");

                                    else

                                       $('input[name=mobile_bg_image]').val(v);

                                        

                                    

                                }

				else if(k == 'mobile_bg_image_url'){

                                    var imageDiv = '<div class="col-md-2 banner-cell files" style="padding-left:0;">' +

                                                        '<div class="thumbnail">' +

                                                            '<img src="'+v+'">' +

                                                            '<div style="position:absolute; top:5px; right:20px;">' +

                                                                '<a href="file.deleteUrl" class="img-remove temporary">' +

                                                                    '<span class="glyphicon glyphicon-remove"></span>' +

                                                                 '</a>' +

                                                            '</div>'+

                                                        '</div>' +

                                                   '</div>';

                                    $('#mobile-bg-image').html(imageDiv);

                                    

                                }

                                else

				  $(':text[name="' + k + '"]', form).val(v);

			});

			$('#loading-indicator').hide();

		});

	});

	$('.colorpicker').colorpicker();

	$('#themes .theme-options').on('click', '.theme-remove', function(e){

		e.preventDefault();

		var theme_name = $(this).attr('data-theme-name'),

			theme_id = $(this).attr('data-theme-id');

		$('#remove-theme-modal .modal-body p span.theme-name').html(theme_name);

		$('#remove-theme-modal .btn-remove').data('theme_id', theme_id);

	});

	 $('#mobile-themes .theme-options').on('click', '.theme-remove', function(e){

		e.preventDefault();

		var theme_name = $(this).attr('data-theme-name'),

			theme_id = $(this).attr('data-theme-id');

                        

		$('#remove-mobile-theme-modal .modal-body p span.theme-name').html(theme_name);

		$('#remove-mobile-theme-modal .btn-remove').data('theme_id', theme_id);

	});

	$('#remove-theme-modal').on('click', '.btn-remove', function(){

		var btn = $(this),

			url = site_url + 'admin/domains/ajax/remove_theme_configuration', 

			modal = btn.closest('.modal');

		btn.button('loading');

		$.post(url, {theme_id:btn.data('theme_id')}, function(response){

			btn.button('reset');

			if(response.success)

			{

				modal.one('hidden.bs.modal', function(){

					var radio = $('#themes .theme-options :radio[name="theme_id"][value="' + btn.data('theme_id') + '"]');

					if(radio.is(':checked'))

						$('#themes .theme-options :radio:first').click();

					radio.closest('.col-md-2').remove();

					showAlert(response, $('#ld-alert'));

					$.scrollTo('.page-content');

				});

				modal.modal('hide');

			}

			else

			{

				showAlert(response, $('#rt-alert'));

				$.scrollTo('.page-content');

			}

		});

	});	

	$('#remove-mobile-theme-modal').on('click', '.btn-remove', function(){

		var btn = $(this),

			url = site_url + 'admin/domains/ajax/remove_theme_configuration', 

			modal = btn.closest('.modal');

		btn.button('loading');

		$.post(url, {theme_id:btn.data('theme_id')}, function(response){

			btn.button('reset');

			if(response.success)

			{

				modal.one('hidden.bs.modal', function(){

					var radio = $('#mobile-themes .theme-options :radio[name="mobile_theme_id"][value="' + btn.data('theme_id') + '"]');

					if(radio.is(':checked'))

						$('#mobile-themes .theme-options :radio:first').click();

					radio.closest('.col-md-2').remove();

					showAlert(response, $('#ld-alert'));

					$.scrollTo('.page-content');

				});

				modal.modal('hide');

			}

			else

			{

				showAlert(response, $('#rt-alert'));

				$.scrollTo('.page-content');

			}

		});

	});		

	$('#themes .btn-save-as-new-config').click(function(){

		var modal = $('#save-theme-config-modal'),

			form = modal.find('#save-theme-config-form');

		form[0].reset();

		form.find('input[name="custom_theme_id"]').val('');

		modal.find('#theme-image').html('');

	modal.modal('show');

	});

	 $('#mobile-themes .btn-save-as-new-config').click(function(){

            var modal = $('#save-mobile-theme-config-modal'),

			form = modal.find('#save-mobile-theme-config-form');

		form[0].reset();

		form.find('input[name="custom_mobile_theme_id"]').val('');

		modal.find('#mobile-theme-image').html('');

		modal.modal('show');

	});

	$('#themes .btn-update-config').click(function(){

		var theme_id = $(this).data('theme_id'),

			modal = $('#save-theme-config-modal');

		if(theme_id == '1')

		{

			console.log('something went wrong...');

			location.reload(true);

		}

		else

		{

			var theme_name = $(this).data('theme_name'),

				theme_image = $(this).data('theme_image'),

				theme_image_url = $(this).data('theme_image_url'),

				cell = $('<div />').attr({class:'banner-cell files'}).data('file', theme_image).css('padding-left', 0),

				thumb = $('<div />').attr({class:'thumbnail'});

		

			thumb.html($('<img>').attr({src:theme_image_url}));

			thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="#" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

			cell.html(thumb);

			$('#theme-image').html(cell);

			

			modal.find('input[name="custom_theme_id"]').val(theme_id);

	modal.find('input[name="theme_name"]').val(theme_name);

			modal.find('input[name="theme_image"]').val(theme_image);

		}

	});

	$('#mobile-themes .btn-update-config').click(function(){

		var theme_id = $(this).data('theme_id'),

			modal = $('#save-mobile-theme-config-modal');

		if(theme_id == '1')

		{

			console.log('something went wrong...');

			location.reload(true);

		}

		else

		{

			var theme_name = $(this).data('theme_name'),

				theme_image = $(this).data('theme_image'),

				theme_image_url = $(this).data('theme_image_url'),

				cell = $('<div />').attr({class:'banner-cell files'}).data('file', theme_image).css('padding-left', 0),

				thumb = $('<div />').attr({class:'thumbnail'});

                        

		

			thumb.html($('<img>').attr({src:theme_image_url}));

			thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="#" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

			cell.html(thumb);

			$('#mobile-theme-image').html(cell);

			

			modal.find('input[name="custom_mobile_theme_id"]').val(theme_id);

			modal.find('input[name="theme_name"]').val(theme_name);

			modal.find('input[name="theme_image"]').val(theme_image);

		}

	});

	

	/**

	 * pages

	 */

	$('#pages ul.nav-stacked').on('click', '.panel-show', function(e){

		e.preventDefault();

		if($(e.target).is('span.page-remove'))

			return false;

		var section_title = $(this).find('.category-title').text(),

			page_id = $(this).data('page-id'),

			panel = $('#edit-section-panel'),

			url = site_url + 'admin/domains/ajax/get_page_info/' + page_id;

		panel.find('.panel-title').text(section_title);

		panel.data({'page_id':page_id});

		panel.find('#edit-section-form').addClass('hidden').after('<p class="text-muted">' + panel.data('please-wait') + '</p>');

		$.get(url, function(response){

			$('input[name="page_name"]', panel).val(response.name).data('old_page_name', response.name);;

			$('input[name="page_title"]', panel).val(response.title);

			$('input[name="page_path"]', panel).val(response.path);

			$('input[name="page_id"]', panel).val(response.id);

			$('#slider-banners, #left-banner').html('');

			slider_banner_files = [];

			left_banner_file = '';

			if(response.banners)

			{

				$.each(response.banners, function(size, page_banners){

					$.each(page_banners, function(i, file){

						var cell = $('<div />', {class:'col-md-' + (size == '694x240' ? '3' : '2') + ' banner-cell files'}).data('file', file.name),

							thumb = $('<div />', {class:'thumbnail'}).css('cursor', 'pointer');

				

						thumb.html($('<img />', {src:file.thumbnailUrl}));

						thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="#" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

						cell.html(thumb);

						

						if(size == '694x240')

						{

							slider_banner_files.push(file);

							thumb.click(function(e){

								if(! $(e.target).is('.glyphicon-remove'))

								{

									var modal = $('#banner-modal'),

										preview = modal.find('.preview').css({width:'704px', height:'250px'}),

										img = preview.find('img');												

									img.attr('src', file.url);

									modal.on('shown.bs.modal', function(){

										banner_overlay_actions(modal); 

									});

									modal.data({'filename':file.name, 'type':'page_slider_banner'}).modal('show');

								}

							});

							cell.attr('data-index', slider_banner_files.length - 1);

							$('#slider-banners').append(cell);								

						}

						else if(size == '200x540')

						{

							left_banner_file = file;

							thumb.click(function(e){

								if(! $(e.target).is('.glyphicon-remove'))

								{

									var modal = $('#left-banner-modal'),

										preview = modal.find('.preview'),

										img = preview.find('img');												

									img.attr('src', file.url);

									modal.on('shown.bs.modal', function(){

										banner_overlay_actions(modal); 

									});

									modal.data({'filename':file.name, 'type':'page_left_banner'}).modal('show');

								}

							});

							$('#left-banner').html(cell);

						}

					});

				});

				$('#slider-banners').sortable('refresh');				

			}

			panel.find('#edit-section-form').removeClass('hidden').next('.text-muted').remove();

			$('.alert').hide();

		});

	}).find('.panel-show:first').click();

	

	$('.btn-upload').click(function(){

		var kind = $(this).data('input-file');

		$('#' + kind).data('btn', $(this)).click();

		if($(this).closest('.modal').length > 0)

			$('#' + kind).data('modal', $(this).closest('.modal'));

	});

	

	$('#edit-section-form').submit(function(e){

		e.preventDefault();

		var btn = $(this).find('.btn-update'),

			banner_sort = $('#slider-banners').sortable('toArray', {attribute:'data-index'}),		

			url = site_url + 'admin/domains/ajax/page_management',

			form_data = $(this).serializeArray();

		form_data.push({name:'domain_id', value:domain_id});

		form_data.push({name:'sort', value:$('#pages ul.nav-stacked li').length + 1});

		form_data.push({name:'banners[200x540][]', value:left_banner_file.name});

		if(left_banner_file.data)

		{

			$.each(left_banner_file.data, function(i, v){

				form_data.push({name:'banners_data[200x540][0][' + v.name + ']', value:v.value});

			});

		}

		$.each(slider_banner_files, function(index, banner){

			form_data.push({name:'banners[694x240][' + index + ']', value:banner.name});

			if(banner.data)

			{

				$.each(banner.data, function(i, v){

					form_data.push({name:'banners_data[694x240][' + index + '][' + v.name + ']', value:v.value});

				});

			}

			form_data.push({name:'banners_data[694x240][' + index + '][sort]', value:banner_sort.indexOf(index.toString()) + 1});						

		});						

		btn.button('loading');

		$.post(url, form_data, function(response){

			$.scrollTo('.page-content');

			btn.button('reset');

			showAlert(response, $('#ld-alert'));

			if(response.success)

			{

				$('.img-remove').removeClass('temporary');

				var esp = $('#edit-section-panel'),

					section_title = esp.find('input[name="page_name"]').val();

				if(esp.data('page_id') == undefined)

				{

					esp.data('page_id', response.page_id);

					var ul = $('#pages ul.nav-stacked'),

						li = '<li class="active" data-sort-id="' + response.page_id + '">' +

								'<a class="panel-show" role="tab" href="#" data-toggle="tab" data-page-id="' + response.page_id + '">' +

									'<i class="icon-reorder" style="cursor:move;"></i> ' +

									'<span class="category-title">' + section_title + '</span>' +

									'<span class="glyphicon glyphicon-remove pull-right page-remove"></span>' + 

								'</a>' + 

							'</li>';

					ul.find('li.active').removeClass('active');

					ul.append(li);

					ul.sortable('refresh');

					

					$('#pages .btn-create').click();

				}

				

				if(esp.find('input[name="page_name"]').data('old_page_name') != section_title)

				{

					$('[data-page-id="' + esp.data('page_id') + '"]').find('.category-title').text(section_title);

					esp.find('.panel-title').text(section_title);

					esp.find('input[name="page_name"]').data('old_page_name', section_title);

				}

			}

		});

	});

	

	if(language_code == 'en')

	{

		$('#pages input[name="page_name"]').change(function(){

			var current = $(this),

				value = current.val(),

				url = site_url + 'admin/domains/ajax/get_unique_path';

			current.after('<p class="help-block">' + current.data('please-wait') + '</p>');						

			$.get(url, {page_name:value, domain_id:domain_id, page_id:$('#edit-section-panel').data('page_id')}, function(response){

				current.next('p.help-block').remove();

				$('#pages input[name="page_path"]').val(response.path);

				$('#pages input[name="page_title"]').val(value);

			});

		});

	}

				

	/**

	 * sort pages

	 */

	$('#pages ul.nav-stacked').sortable({

		handle: '.icon-reorder',

		axis: 'y',

		update: function(event, ui){

			$('.alert').hide();

		}

	});

	

	$('#pages-list-panel .btn-update').click(function(){

		var pages = $('#pages ul.nav-stacked').sortable('toArray', {attribute:'data-sort-id'}),

			url = site_url + 'admin/domains/ajax/sort_pages',

			btn = $(this);

		btn.button('loading');

		$.post(url, {'pages':pages}, function(response){

			$.scrollTo('.page-content');

			btn.button('reset');

			showAlert(response, $('#ld-alert'));				

		});

	});

				

	/**

	 * create page

	 */

	$('#pages .btn-create').click(function(e){

		e.preventDefault();

		var panel = $('#edit-section-panel'),

			form = $('form', panel);

		panel.removeData('page_id');

		form[0].reset();

		$('input[name="page_id"]', form).val('');

		panel.find('.panel-title').text('Add Page');

		$('#left-banner', panel).html('');

		left_banner_file = '';

		$('#slider-banners', panel).html('');

		slider_banner_files = [];

		$('.alert').hide();

	});

				

	/**

	 * remove page

	 */

	$('#pages ul.nav-stacked').on('click', '.page-remove', function(e){

		e.preventDefault();

		var page_id = $(this).parent().data('page-id'),

			page_name = $(this).prev().text(),

			modal = $('#remove-page-modal');

		$('#rp-alert').hide();

		$('.modal-body p span.page-name', modal).html(page_name);

		$('.btn-remove', modal).data('page_id', page_id);	

		modal.modal('show');

	});

	$('#remove-page-modal').on('click', '.btn-remove', function(){

		var btn = $(this),

			url = site_url + 'admin/domains/ajax/remove_page';

		btn.button('loading');

		$.post(url, {page_id:btn.data('page_id')}, function(response){

			btn.button('reset');	

			showAlert(response, $('#rp-alert'));

			if(response.success)

			{

				$('#pages ul.nav-stacked li[data-sort-id="' + btn.data('page_id') + '"]').remove();

				$('#remove-page-modal').modal('hide');							

			}

		});

	});

				

	/**

	 * page left banner upload

	 */

	$('#left_banner_file').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Left Banner ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));

					$.scrollTo('.page-content');

				}

				else

				{

					

					left_banner_file = file;

													

					var cell = $('<div />').attr({class:'col-md-2 banner-cell files'}).data('file', file.name),

						thumb = $('<div />').attr({class:'thumbnail'});

					thumb.click(function(e){

						if(! $(e.target).is('.glyphicon-remove'))

						{

							var modal = $('#left-banner-modal'),

								preview = modal.find('.preview'),

								img = preview.find('img');												

							img.attr('src', file.url);

							modal.on('shown.bs.modal', function(){

								banner_overlay_actions(modal); 

							});

							modal.data({'filename':file.name, 'type':'page_left_banner'}).modal('show');

						}

					});								

					thumb.html($('<img>').attr({src:file.thumbnailUrl}));

					thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

					cell.html(thumb);

					$('#left-banner').html(cell);	

					$('.alert').hide();

				}

			});

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

	var getAssetsModalHeader = function(assetType){

		var langModalHeader = '';

		if(assetType == 'Main Banner')

			langModalHeader = slider_banner_lang;

		else if(assetType == 'Horizontal Banner')

			langModalHeader = horizontal_banner_lang;

		else if(assetType == 'Vertical Banner')

			langModalHeader = vertical_banner_lang;

		

		$('#assetsBannerModal #assetLibraryModalHeader').html(langModalHeader);

		

	};

	$(document).on('click', '.assetsMainBannerBtn', function(e){

		var assetType = $(this).data('type'),

		assetsModal = $('#assetsBannerModal'),

		mainBannerDiv = $('#assetsBannerDiv');

		getAssetsModalHeader(assetType);

		$('#assetsBannerModal .modal-footer #asset_type_field').val(assetType);

		assetsModal.modal('show');

		$.ajax({

			type:"POST",

			data:{assetType:assetType},

			dataType:"json",

			url:site_url + 'admin/domains/ajax/getAssets',

			beforeSend:function(){

				mainBannerDiv.html('<div class="loader text-center"><img src="' + template_dir + '/images/loader.gif" /></div>');

			},

			success:function(data){

				var img = '';

				$.each(data.result, function(i, val){

					if(assetType == 'Vertical Banner')

						img += '<img data-id="'+i+'" class="imgAssetSingle" style="margin-top:10px;cursor:pointer" src="'+val+'">';

					else

						img += '<img data-id="'+i+'" class="imgAsset" style="margin-top:10px;cursor:pointer" src="'+val+'">';

				});

				mainBannerDiv.empty();

				mainBannerDiv.html(img);

				

			}

		});

	});

	$('#assetsBannerModal').on('click', '.btn-update', function(){

		var btn   = $(this);

		var setID = $("#assetsBannerModal .selectedAsset").map(function() {

			return $(this).attr('data-id');

		}).get();

		var assetType = $('#assetsBannerModal .modal-footer #asset_type_field').val();

		var pageId = $('[name="page_id"]').val();

		$.ajax({

			type : "POST",

			data: {setID:setID, domain_id:domain_id, pageId:pageId},

			dataType:"json",

			url:site_url + 'admin/assets/ajax/publish_assets',

			beforeSend:function(){

				btn.button('loading');

			},

			success : function(data){

				showAlert(data, $('#ld-alert'));

				if(data.error)

				{

					$('#assetsBannerModal').modal('hide');

				}

				else

				{

					btn.button('reset');

					$.each(data.thumbnails, function(i, item){

						var thumb = $('<div />').attr({class:'thumbnail'}).css('cursor', 'pointer');

						if(assetType == 'Main Banner'){

							banner_files.push(item);

							var cell = $('<div />').attr({class:'col-md-2 banner-cell files', 'data-index':banner_files.length - 1}).data('file', item.name);

						}

						else if(assetType == 'Horizontal Banner'){

							slider_banner_files.push(item);

							var cell = $('<div />').attr({class:'col-md-3 banner-cell files', 'data-index':slider_banner_files.length - 1}).data('file', item.name);

						}

						else if(assetType == 'Vertical Banner'){

							left_banner_file = item;

							var cell = $('<div />').attr({class:'col-md-2 banner-cell files'}).data('file', item.name);

							

							

						}

						thumb.click(function(e){

							if(!$(e.target).is('.glyphicon-remove'))

							{

								//alert(assetType);

								if(assetType == 'Main Banner'){

								   var modal = $('#banner-modal'),

									 preview = modal.find('.preview').css({width:'614px', height:'305px'}),

									 img = preview.find('img');

								   img.attr('src', item.url);

								   modal.on('shown.bs.modal', function(){

									  banner_overlay_actions(modal);

								    });																	

								   modal.data({'filename':item.name, 'type':'slider_banner'}).modal('show');

								}

								else if(assetType == 'Horizontal Banner'){

									var modal = $('#banner-modal'),

									preview = modal.find('.preview').css({width:'694px', height:'245px'}),

									img = preview.find('img');

								    img.attr('src', item.url);

								   modal.on('shown.bs.modal', function(){

									  banner_overlay_actions(modal); 

								   });			

								   modal.data({'filename':item.name, 'type':'page_slider_banner'}).modal('show');

								}

								else if(assetType == 'Vertical Banner'){

									var modal = $('#left-banner-modal'),

										preview = modal.find('.preview'),

										img = preview.find('img');												

									img.attr('src', item.url);

									modal.on('shown.bs.modal', function(){

										banner_overlay_actions(modal); 

									});

									modal.data({'filename':item.name, 'type':'page_left_banner'}).modal('show');

								}

								/*img = preview.find('img');												

								img.attr('src', item.url);

								modal.on('shown.bs.modal', function(){

									banner_overlay_actions(modal); 

								});

								modal.data({'filename':item.name, 'type':type}).modal('show');*/

							}

						});

						thumb.html($('<img>').attr({src:item.thumbnailUrl}));

						thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + item.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

						cell.html(thumb);

						if(assetType == 'Main Banner')

							$('#banners').append(cell);

						else if(assetType == 'Horizontal Banner')

							$('#slider-banners').append(cell);

						else if(assetType == 'Vertical Banner')

							$('#left-banner').html(cell);

				});

				//$(".selectedAsset").fadeOut();

				$('#assetsBannerModal').modal('hide');

				//$('.alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html(data.success).end().show();

				if(assetType == 'Main Banner')

					$('#banners').sortable('refresh');

				else if(assetType == 'Horizontal Banner')

					$('#slider-banners').sortable('refresh');

				//alert(banner_files.toSource());



			}



		  }

		});

		

		

	});

				

	/**

	 * page slider banner upload

	 */

	$('#slider_banner_files').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');					

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Banner ' + file.name + ': ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));

					$.scrollTo('.page-content');

				}

				else

				{

					slider_banner_files.push(file);					

					var cell = $('<div />').attr({class:'col-md-3 banner-cell files', 'data-index':slider_banner_files.length - 1}).data('file', file.name),

						thumb = $('<div />').attr({class:'thumbnail'});

			

					thumb.html($('<img>').attr({src:file.thumbnailUrl}));

					thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

					thumb.click(function(e){

						if($(e.target).is('.glyphicon-remove'))

							return false;

						var modal = $('#banner-modal'),

							preview = modal.find('.preview').css({width:'694px', height:'245px'}),

							img = preview.find('img');

						img.attr('src', file.url);

						modal.on('shown.bs.modal', function(){

							banner_overlay_actions(modal); 

						});						

						modal.data({'filename':file.name, 'type':'page_slider_banner'}).modal('show');

					});

						

					cell.html(thumb);

					$('.alert').hide();

					$('#slider-banners').append(cell);

				}

			});

			$('#slider-banners').sortable('refresh');

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},	

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},				

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

	

	/**

	 * background image upload

	 */

	$('#bg_image_file').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Left Banner ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));

					$.scrollTo('.page-content');

				}

				else

				{

					$('#themes input[name="bg_image"]').val(file.name);

					var cell = $('<div />').attr({class:'col-md-2 banner-cell files'}).data('file', file.name).css('padding-left', 0),

						thumb = $('<div />').attr({class:'thumbnail'});

					

					thumb.html($('<img>').attr({src:file.thumbnailUrl}));

					thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

					cell.html(thumb);

					$('#bg-image').html(cell);	

					$('.alert').hide();

				}

			});

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

 /**

	 * mobile background image upload

	 */

	$('#mobile_bg_image_file').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Left Banner ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));

					$.scrollTo('.page-content');

				}

				else

				{

					$('#mobile-themes input[name="mobile_bg_image"]').val(file.name);

					var cell = $('<div />').attr({class:'col-md-2 banner-cell files'}).data('file', file.name).css('padding-left', 0),

						thumb = $('<div />').attr({class:'thumbnail'});

					

					thumb.html($('<img>').attr({src:file.thumbnailUrl}));

					thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

					cell.html(thumb);

					$('#mobile-bg-image').html(cell);	

					$('.alert').hide();

				}

			});

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

	

	

	/**

	 * theme image upload

	 */

	$('#theme_image_file').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			var btn = $('#theme_image_file').data('btn'),

				modal = $('#theme_image_file').data('modal');

			btn.button('reset');

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					showAlert(file, $('.alert', modal));

					$.scrollTo('.page-content');

				}

				else

				{

					$('input[name="theme_image"]', modal).val(file.name);

					//$('#themes input[name="theme_image"]').val(file.name);

					var cell = $('<div />').attr({class:'banner-cell files'}).data('file', file.name).css('padding-left', 0),

						thumb = $('<div />').attr({class:'thumbnail'});

					

					thumb.html($('<img>').attr({src:file.url}));

					thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

					cell.html(thumb);

					$('#theme-image').html(cell);	

					$('.alert').hide();

				}

			});

		},

		add: function (e, data) {

			var btn = $('#theme_image_file').data('btn');

			btn.button('loading');

			data.submit();

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10),

			btn = $('#theme_image_file').data('btn');

	btn.attr('data-progress-text', progress + '%');

			btn.button('progress');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');

	 

	/**

	 * theme image upload

	 */

	$('#mobile_theme_image_file').fileupload({

		url: upload_url,

		dataType: 'json',

		done: function (e, data) {

			var btn = $('#mobile_theme_image_file').data('btn'),

				modal = $('#mobile_theme_image_file').data('modal');

    

			btn.button('reset');

			$.each(data.result.files, function (index, file) {

				if(file.error)

				{

					showAlert(file, $('.alert', modal));

					$.scrollTo('.page-content');

				}

				else

				{

					$('input[name="theme_image"]', modal).val(file.name);

					//$('#themes input[name="theme_image"]').val(file.name);

					var cell = $('<div />').attr({class:'banner-cell files'}).data('file', file.name).css('padding-left', 0),

						thumb = $('<div />').attr({class:'thumbnail'});

					

					thumb.html($('<img>').attr({src:file.url}));

					thumb.append('<div style="position:absolute; top:5px; right:20px;"><a href="' + file.deleteUrl + '" class="img-remove temporary"><span class="glyphicon glyphicon-remove"></span></a></div>');

					cell.html(thumb);

					$('#mobile-theme-image').html(cell);	

					$('.alert').hide();

				}

			});

		},

		add: function (e, data) {

			var btn = $('#mobile_theme_image_file').data('btn');

			btn.button('loading');

			data.submit();

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10),

			btn = $('#mobile_theme_image_file').data('btn');

			btn.attr('data-progress-text', progress + '%');

			btn.button('progress');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');	

				

	

	/**

	 * domain aliases

	 */

	

	var t = $('table').DataTable({

		'processing': true,

		'serverSide': true,

		'pagingType': 'full_numbers',

		'ajax': {

			'url': site_url + 'admin/domains/ajax/domain_aliases/' + domain_id

		},

		'order': [[0, 'desc']],

		'columns': [

		    {'name':'id'},

			{'name':'alias'},

			{'name':'force_https', 'orderable':false, 'searchable':false},

			{'name':'action', 'orderable':false, 'searchable':false}

		],

		language: {

	        url: site_url + 'admin/language/ajax/get_datatables_language',

	    }

	});

	

	/**

	 * add domain aliases

	 */

	var aliasCounter = function(form){

		$('.alias-count', form).each(function(i){

			$(this).text(i + 1);

		});

	};



	$('#add-alias-modal .btn-add-more').click(function(){

		var modal = $('#add-alias-modal'),

			form = modal.find('form'),

			form_group = form.find('.form-group:eq(0)').clone(),

			form_group2 = form.find('.form-group:eq(1)').clone(),

			button = $('<button />', {

				'type': 'button',

				'class': 'close',

				'data-dismiss': 'form-group',

				'aria-hidden': 'true',

				'tabindex': '-1'

			}).css({

				'position': 'absolute',

				'top': '5px',

				'right': '20px'

			}).html('&times;');

		form_group.find('input').val('').before(button);

		;

		form.append(form_group);

		form.append(form_group2);

		aliasCounter(form);

	});

	

	$('#add-alias-modal form').on('click', 'button.close', function(){

		var form = $(this);

		form.closest('.form-group').fadeOut('slow', function(){

			$(this).remove();

			aliasCounter(form);

		});		

	});

	

	$('#add-alias-modal form').submit(function(e){

		e.preventDefault();

		var modal = $('#add-alias-modal'),

			form = $(this),

			btn = $('.btn-save', modal);

		btn.button('loading');

		$.post(this.action, $(this).serializeArray(), function(response){

			btn.button('reset');

			if(response.error)

				showAlert(response, $('#aa-alert'));

			else

			{

				$('.form-group:gt(0)', form).remove();

				form[0].reset();

				showAlert(response, $('#ld-alert'));

				$('#ld-alert').data('show_alert', true);			

				if(response.success)

					t.draw();

				modal.modal('hide');				

			}

		});

	});

	

	$('table').on('draw.dt', function(){

		var alert = $('#ld-alert');

		if(alert.data('show_alert'))

			alert.data('show_alert', false);

		else

			$('.alert').hide();	

	});		

	

	$('#add-alias-modal .btn-save').click(function(){

		$('#add_alias_bt').click();

	});	

	

	$('#add-alias-modal, #edit-alias-modal, #remove-alias-modal').on('show.bs.modal', function(){

		$('.alert').hide();

	});

	

	/**

	 * edit domain alias

	 */

	$('#aliases').on('click', '.edit-alias', function(){

		var modal = $('#edit-alias-modal'),

			form = $('form', modal),

			current = $(this);

		$('input[name="alias_id"]', form).val(current.data('id'));

		$('input[name="alias"]', form).val(current.data('alias'));

		$(':checkbox', form).bootstrapToggle(current.data('force-https') == '1' ? 'on' : 'off');

		modal.modal('show');

	});

	

	$('#edit-alias-modal form').submit(function(e){

		e.preventDefault();

		var modal = $('#edit-alias-modal'),

			form = $(this),

			btn = $('.btn-save', modal);

		btn.button('loading');

		$.post(this.action, $(this).serializeArray(), function(response){

			btn.button('reset');

			if(response.error)

				showAlert(response, $('#ea-alert'));

			else

			{

				//$('.form-group:gt(1)', form).remove();

				form[0].reset();

				showAlert(response, $('#ld-alert'));

				$('#ld-alert').data('show_alert', true);			

				if(response.success)

					t.draw();

				modal.modal('hide');				

			}

		});

	});

	

	$('#edit-alias-modal .btn-save').click(function(){

		$('#edit_alias_bt').click();

	});	

	

	/**

	 * remove domain alias

	 */

	$('#remove-alias-modal').on('click', '.btn-remove', function(){

		var btn = $(this),

			url = site_url + 'admin/domains/ajax/remove_domain_alias';

		btn.button('loading');

		$.post(url, {alias_id:btn.data('alias_id')}, function(response){

			btn.button('reset');					

			showAlert(response, $('#ld-alert'));

			$('#ld-alert').data('show_alert', true);			

			if(response.success)

				t.draw();

			$('#remove-alias-modal').modal('hide');

		});

	});

	$('#aliases table').on('click', '.remove-alias', function(){

		var alias_id = $(this).data('id'),

			domain = $(this).closest('tr').find('td:eq(1)').html();

		$('#remove-alias-modal .modal-body p span.alias-name').html(domain);

		$('#remove-alias-modal .btn-remove').data('alias_id', alias_id);

	});

	$(document).on('submit', '.dynamic_banner_form', function(e){

            e.preventDefault();

            var form          = $(this);

            var not_logged_in = form.find('[name=logged_out]').val();

            var btn           = form.find('.dynamic_banners_btn');

            var logged_in     = form.find('[name=logged_in]').val();

            var action        = form.attr('action');

            //if(not_logged_in !== '' || logged_in !== '')

            //{

                $.ajax({

                    url : action,

                    type:'POST',

                    data:form.serializeArray(),

                    dataType:'json',

                    beforeSend:function(){

                       btn.button('loading');

                    },

                    success:function(data){

                        $('#ld-alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + data.success).end().show();

                        $.scrollTo('.page-content');

                        btn.button('reset');

                    }

                            

                });

            //}

            

        });
	//reload checkboxes per page
	//var game_page_sync = $("#game_page_sync").val();
	
	$("#pages-nav li a").each(function(){
		var page_id = $(this).attr("data-page-id");
		//set default selected categories
		
		if($(this).parent().hasClass("active")){
			$("input[name='game_categories[]']").each(function(){
				var gc = $(this);
				var gcParent = $(this).parent();
				gc.removeAttr("checked");
				gcParent.removeClass("active");
				var gcVal = $(this).val();
				
				for(var x=0;x<game_page_sync.length;x++){
					var obj = game_page_sync[x];
					if(page_id==obj.page_id){
						if(obj.category_id==gcVal){
							gc.attr("checked","checked");
							gcParent.addClass("active");
						}
					}
				}	
			});
		}
		
		$(this).click(function(){
			
			$("input[name='game_categories[]']").each(function(){
				var gc = $(this);
				var gcParent = $(this).parent();
				var gcVal = $(this).val();
				
				gc.attr("checked",false);
				gcParent.removeClass("active");
				
				
				for(var x=0;x<game_page_sync.length;x++){
					var obj = game_page_sync[x];
					if(page_id==obj.page_id){
						if(obj.category_id==gcVal){
							gc.attr("checked","checked");
							gcParent.addClass("active");
						}
					}
				}	
			});
		})
		
	});
	

	$('#show_payment_method').bootstrapToggle();

	$('.is_activated').bootstrapToggle();

	

	$('#welcome_text_size').numeric();

    $('#mobile_see_all_link_size').numeric();

    $('#mobile_settings_link_size').numeric();

    $('#mobile_disclaimer_link_size').numeric();

    $('#mobile_game_category_text_size').numeric();

	$('#navbar_text_size').numeric();

	$('#new_jackpot_game_name_text_size').numeric();

	$('#new_jackpot_games_text_size').numeric();

	$('#new_jackpot_game_ticker_text_size').numeric();

	$('#most_popular_games_header_text_size').numeric();

	$('#most_popular_game_name_text_size').numeric();

	$('#most_popular_game_ticker_text_size').numeric();

	$('#disclaimer_header_text_size').numeric();

	$('#disclaimer_text_size').numeric();

	$('#copyright_text_size').numeric();

	$('.numeric_val').numeric();


	/*DOWNLOAD LOGIN*/
	$('#download_bg_image').fileupload({

		url: base_url + 'admin/domains/ajax/dclp_background',

		dataType: 'json',

		done: function (e, data) {
			console.log(data);
			$('#progress-modal').off('hide.bs.modal');

			$('#progress-modal').modal('hide');

			$.each(data.result.files, function (index, file) {
				console.log(file);
				if(file.error)

				{

					//$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Logo ' + file.error).end().show();

					showAlert(file, $('#ld-alert'));					

					$.scrollTo('.page-content');

				}

				else

				{

                   var dclp_background = $('<div class="thumbnail files dclp_bg_container"></div>');

					$('#logo_box').val(file.name);

                    dclp_background.css({width:file.thumbnailWidth, height:file.thumbnailHeight});

					dclp_background.html($('<img>').attr({src:file.thumbnailUrl}));

					dclp_background.append('<div class="pull-right" style="position:relative;bottom:73px;"></div>').show();

					$('#dclp_background').html(dclp_background);

					logo_file = file.name;

					$('.alert').hide();

                    //$('#logo_dimension').html(file.width+' x '+file.height);
                                        

				}

			});

		},

		add: function (e, data) {

			var jqXHR = data.submit();

			$('#progress-modal').on('hide.bs.modal', function(){

				jqXHR.abort();

			});

			$('#progress-modal').modal('show');

		},

		always: function (e, data) {

			$('#progress-modal .progress-bar').css('width', '0%');

		},

		progressall: function (e, data) {

			var progress = parseInt(data.loaded / data.total * 100, 10);

			$('#progress-modal .progress-bar').css('width', progress + '%');

		}

	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');




});



function shuffle(nodes, switchableSelector) {

    var length = nodes.length;



    //Create the array for the random pick.

    var switchable = nodes.filter("." + switchableSelector);

    var switchIndex = [];



    $.each(switchable, function(index, item) {

       switchIndex[index] = $(item).index(); 

    });



    //The array should be used for picking up random elements.

    var switchLength = switchIndex.length;

    var randomPick, randomSwap;



    for (var index = length; index > 0; index--) {

        //Get a random index that contains a switchable element.

        randomPick = switchIndex[Math.floor(Math.random() * switchLength)];



        //Get the next element that needs to be swapped.

        randomSwap = nodes[index - 1];



        //If the element is 'switchable' continue, else ignore

        if($(randomSwap).hasClass(switchableSelector)) {

            nodes[index - 1] = nodes[randomPick];

            nodes[randomPick] = randomSwap;

        }

    }



    return nodes;

}