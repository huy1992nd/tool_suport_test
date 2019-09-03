$(document).ready(function(){

	

	var _excludeLangEventIsTrigger = false;

	var _delEditLiBtnTemplate = '<i title="Remove." data-flag="remove-language" class="remove-lang icon-trash" style="color:gray;"></i><i title="Edit." data-flag="edit-language" class="edit-lang icon-edit-sign" style="color:gray;"></i>';

	

	var getSelectedLangSet = function(){

		var _selected_li = ''

		$('#myTabright > li').each(function(){

		    if($(this).hasClass('active'))

		    	_selected_li = $(this).data('lang');

		});

		return _selected_li;

	}

	

	var getExtraParams = function(){

		var _params = {code : 'en', domain : 0};

		

		if(typeof $('#btn-translation').data('code') != 'undefined')

			_params.code = $('#btn-translation').data('code');

		

		if(typeof $('#btn-lang-domains').data('domain') != 'undefined')

			_params.domain = $('#btn-lang-domains').data('domain');

		

		return _params;

	} 

	

	var t = $('#tbl_translation').DataTable({

				'processing': true,

				'serverSide': true,

				'cache' : false,

				'pagingType': 'full_numbers',
				
				'ajax': {

					'url': window.location.pathname + '/' + getSelectedLangSet(),

					'data': function(d){	

						d.extraParams = getExtraParams();

					}

				},

				'order': [[1, 'desc']],

				'columns': [

					{'orderable':false, 'searchable':false},

					{'name':'key'},

					{'name':'translation'},

					{'orderable':false, 'searchable':false}

				],

				'language': {

					'url' : site_url + 'admin/language/ajax/get_datatables_language',

				}

			});

	

	var _tDrawInterval = function(){

		setTimeout(function(){

				reloadTranslationTbl();

			}, 1000);

	}

	

	$('#myTabright > li > a').click(function(){

		if($(this).parent('li').data('lang')){

			$('#myTabright > li').removeClass('active');

			$(this).parent('li').addClass('active');

			reloadTranslationTbl();

		}

	});

	

	$('#tab-optional-lang > li > a').click(function(){

		$('#myTabright > li').removeClass('active');

		$('#li-optional-lang').data('lang', $(this).parent('li').data('lang'));

		$('#li-optional-lang').addClass('active');

		$('#li-optional-lang > a').html($(this).text() + ' <b class="caret"></b>');

		reloadTranslationTbl();

	});

	

	var reloadTranslationTbl = function(){

		t.ajax.url(window.location.pathname + '/' + getSelectedLangSet()).load();

	}

	

	var showAlert = function(response, obj){

		if(response.success)

			obj.addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>'+translate.well_done+'!</strong> ' + response.success).end().show();

		else

			obj.removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>'+translate.oh_snap+'!</strong> ' + response.error).end().show();	

	}

	

	$('#remove-lang-modal, #edit-lang-modal, #add-lang-modal, #create-lang-modal, #del-lang-modal, #modify-lang-modal').on('click', '.btn-remove-lang, .btn-edit-lang, .btn-add-lang, .btn-create-lang, .btn-del-lang, .btn-modify-lang', function(e){

		var btn = $(this),

			url = site_url + 'admin/language/ajax';

		

		btn.button('loading');

		if(btn.hasClass('btn-remove-lang')){

			submitPost(url + '/delete', {translation_key:btn.data('key'), language_file:getSelectedLangSet(), extraParams:getExtraParams()}, btn);

		}else if(btn.hasClass('btn-edit-lang')){

			if($('#edit-lang-form').parsley( 'validate' )){

				$('#edit-lang-modal').modal('hide');

				submitPost(url + '/update', {translation_key:btn.data('key'), key:$('#edit-lang-modal input[name=key]').val(), translation:$('#edit-lang-modal input[name=translation]').val(), language_file:getSelectedLangSet(), extraParams:getExtraParams()}, btn);

			}

		}else if(btn.hasClass('btn-add-lang')){

			if($('#add-lang-form').parsley( 'validate' )){

				$('#add-lang-modal').modal('hide');

				submitPost(url + '/create', {key:$('#add-lang-modal input[name=key]').val(), translation:$('#add-lang-modal input[name=translation]').val(), language_file:getSelectedLangSet(), extraParams:getExtraParams()}, btn);

				$('#add-lang-modal input[name=key]').val('');

				$('#add-lang-modal input[name=translation]').val('');

			}

		}else if(btn.hasClass('btn-create-lang')){

			if($('#create-lang-form').parsley( 'validate' )){

				$('#create-lang-modal').modal('hide');

				submitPost(url + '/create_language', {
					code:$('#create-lang-modal input[name=code]').val(), 
					language:$('#create-lang-modal input[name=language]').val(), 
					notes:$('#create-lang-modal input[name=notes]').val(),
					extraParams:getExtraParams()
				}, btn);

				$('#create-lang-modal input[name=code]').val('');

				$('#create-lang-modal input[name=language]').val('');
				
				$('#create-lang-modal input[name=notes]').val('');

			}

		}else if(btn.hasClass('btn-del-lang')){

			submitPost(url + '/delete_language', {id:btn.data('langid'), code:btn.data('code')}, btn);

		}else if(btn.hasClass('btn-modify-lang')){

			if($('#modify-lang-form').parsley('validate')){

				$('#modify-lang-modal').modal('hide');

				submitPost(url + '/modify_language', {
					code:$('#modify-lang-modal input[name=code]').val(), 
					name:$('#modify-lang-modal input[name=language]').val(), 
					notes:$('#modify-lang-modal input[name=notes]').val(),
					id:btn.data('langid'), 
					flag:btn.data('flag')}, btn);

				$('#modify-lang-modal input[name=code]').val('');

				$('#modify-lang-modal input[name=language]').val('');
				
				$('#modify-lang-modal input[name=notes]').val('');

			}

		}

		

		btn.button('reset');

	});
	

	var submitPost = function(url, params, btn){

		$.post(url, params).done(function(response){

			btn.button('reset');					

			if(response.success)

			{

				if(typeof response.added_language == 'object'){

					$('#ul-translation').append('<li rel="'+response.added_language['id']+'"><a tabindex="-1" href="#demo" class="" data-code="'+response.added_language['code']+'" data-notes="'+response.added_language['notes']+'" data-langid="'+response.added_language['id']+'">'+response.added_language['name']+'<i title="Exclude." data-flag="exclude" class="exlude-lang icon-check" style="color:gray;"></i>' + _delEditLiBtnTemplate + '</a></li>');

					_ulTranslationEvent();

					_excludeLanguageEvent();

				}else if(response.removed_language_id){

					$('#ul-translation li[rel='+response.removed_language_id+']').remove();

				}else if(typeof response.updated_language == 'object'){

					var _excludedClass = 'icon-check';

					

					if(response.updated_language['flag'] == 'include')

						_excludedClass = 'icon-check-empty';

					

					var _updated_str = $.trim(response.updated_language['name']) + '<i title="'+response.updated_language['flag']+'" data-flag="'+response.updated_language['flag']+'" class="exlude-lang '+_excludedClass+'" style="color:gray;"></i>' + _delEditLiBtnTemplate;

					$('#ul-translation li[rel='+response.updated_language['id']+'] a').html(_updated_str);

					$('#ul-translation li[rel='+response.updated_language['id']+'] a').data('code', response.updated_language['code']);
					
					$('#ul-translation li[rel='+response.updated_language['id']+'] a').data('notes', response.updated_language['notes']);

				

					_ulTranslationEvent();

					_excludeLanguageEvent();

				}else{

					_tDrawInterval();

				}

			}

			showAlert(response, $('#ld-alert'));

		});

	}

	

	$('table').on('click', '.remove-lang, .edit-lang', function(){

		var language_key = $(this).data('key'),

			translation = $(this).closest('tr').find('td:eq(2)').html();

		

		if($(this).hasClass('remove-lang')){

			$('#remove-lang-modal .modal-body p').html(translate.remove + " " + translation + '?');

			$('#remove-lang-modal .btn-remove-lang').data('key', language_key);

		}else if($(this).hasClass('edit-lang')){

			$('#edit-lang-modal input[name=key]').val(language_key);

			$('#edit-lang-modal input[name=translation]').val(translation);

			$('#edit-lang-modal .btn-edit-lang').data('key', language_key);

		}

	});

	

	$('#edit-lang-form').parsley({

		successClass: 'has-success',

		errorClass: 'has-error',

		errors: {

		classHandler: function(el) {

			return $(el).closest('.form-group');

		},

			errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',

			errorElem: '<li></li>'

		}

	}); 

	

	$('#add-lang-form').parsley({

		successClass: 'has-success',

		errorClass: 'has-error',

		errors: {

		classHandler: function(el) {

			return $(el).closest('.form-group');

		},

			errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',

			errorElem: '<li></li>'

		}

	});

	

	$('#create-lang-form').parsley({

		successClass: 'has-success',

		errorClass: 'has-error',

		errors: {

		classHandler: function(el) {

			return $(el).closest('.form-group');

		},

			errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',

			errorElem: '<li></li>'

		}

	});

	

	$('#modify-lang-form').parsley({

		successClass: 'has-success',

		errorClass: 'has-error',

		errors: {

		classHandler: function(el) {

			return $(el).closest('.form-group');

		},

			errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',

			errorElem: '<li></li>'

		}

	});

	

	$('#ul-lang-domains > li > a').bind('click', function(){

		$('#btn-lang-domains > span').text($(this).text());

		$('#btn-lang-domains').data('domain', $(this).data('domain'));

		_reloadUlTranslation($(this).data('domain'));

	});

	

	var _ulTranslationEvent = function(){

		$('#ul-translation > li > a').bind('click', function(){

			if(_excludeLangEventIsTrigger)

				return false;

			

			if(!_excludeLangEventIsTrigger){

				if($(this).data('code') == '0'){

					var _selectedDomainText = 'to ' + $.trim($('#btn-lang-domains > span').text());

					if(_selectedDomainText == 'to Domains' ||  _selectedDomainText == 'to Default')

						_selectedDomainText = '';

					$('#language-create-modal').text('Add Language ' + _selectedDomainText);

				}else{

					$('#btn-translation > span').text($(this).text());

					$('#btn-translation').data('code', $(this).data('code'));
					
					$('#btn-translation').data('notes', $(this).data('notes'));

					reloadTranslationTbl();

				}

			}

		});

	}

	_ulTranslationEvent();

	

	var _excludeLanguageEvent = function(){

			$('.exlude-lang, .remove-lang, .edit-lang').on({

				mouseover : function(){

					_excludeLangEventIsTrigger = true;

				},

				mouseout : function(){

					_excludeLangEventIsTrigger = false;

				},

				click : function(){

					_excludeLangEventIsTrigger = true;

					if($(this).hasClass('exlude-lang'))

						_excludeLanguage(this);

					else if($(this).hasClass('remove-lang')){

						_delLanguage(this);

					}else if($(this).hasClass('edit-lang')){

						_editLanguage(this);

					}

				}

			});

	}

	_excludeLanguageEvent();

	

	var _delLanguage = function(__this__){

		$('#del-lang-modal').modal('show');

		$('#del-lang-modal .modal-body p').html('Are you sure you want to remove language \'' + $.trim($(__this__).parent('a').text()) + '\' ?');

		$('#del-lang-modal .btn-del-lang').data('langid', $(__this__).parent('a').data('langid'));

		$('#del-lang-modal .btn-del-lang').data('code', $(__this__).parent('a').data('code'));

	}

	

	var _editLanguage = function(__this__){
	
		
		$('#modify-lang-modal').modal('show');

		$('#modify-lang-modal input[name=code]').val($.trim($(__this__).parent('a').data('code')));
		
		$('#modify-lang-modal input[name=notes]').val($.trim($(__this__).parent('a').data('notes')));

		$('#modify-lang-modal input[name=language]').val($.trim($(__this__).parent('a').text()));

		$('#modify-lang-modal .btn-modify-lang').data('langid', $(__this__).parent('a').data('langid'));

		$('#modify-lang-modal .btn-modify-lang').data('flag', $(__this__).parent('a').children(':first-child').data('flag'));

	}

	

	var _excludeLanguage = function(__this__){

			if(_excludeLangEventIsTrigger){

				if($(__this__).data('flag') == 'include')

					$(__this__).removeClass('icon-check-empty').addClass('icon-check');

				else if($(__this__).data('flag') == 'exclude')

					$(__this__).removeClass('icon-check').addClass('icon-check-empty');

				

				$.post(site_url + 'admin/language/ajax/exclude_language', {code : $(__this__).parent('a').data('code'), extraParams:getExtraParams(), flag: $(__this__).data('flag')}).done(function(response){

					if(response.success)

					{

						if($(__this__).data('flag') == 'include'){

							$(__this__).data('flag', 'exclude');

							$(__this__).removeClass('icon-check-empty').addClass('icon-check');

						}else if($(__this__).data('flag') == 'exclude'){

							$(__this__).data('flag', 'include');

							$(__this__).removeClass('icon-check').addClass('icon-check-empty');

						}

					}

					showAlert(response, $('#ld-alert'));

				});

			}

	}

	

	var _reloadUlTranslation = function(domain_id){

		$.get(site_url + 'admin/language/ajax/get_languages/' + domain_id).done(function(response){

			if(typeof response == 'object')

			{

				var _cntr = 1;

				var _canAddLanguage = false;

				

				if($('#ul-translation > li:nth-child(1) > a').data('target') == '#create-lang-modal')

					_canAddLanguage = true;

				

				$('#ul-translation').html('');

				

				if(_canAddLanguage)

					$('#ul-translation').append('<li rel="0"><a tabindex="-1" href="#" class="" data-code="0" data-toggle="modal" data-target="#create-lang-modal">Add Language</a></li>');

				

				$.each(response, function(key, val){

					if(_cntr == 1){

						$('#btn-translation > span').text(val['name']);

						$('#btn-translation').data('code', val['code']);
						
						$('#btn-translation').data('notes', val['notes']);

					}

					var _excludedClass = 'icon-check-empty';

					var _excludedData = 'include';

					

					if(val['included']){

						_excludedClass = 'icon-check';

						_excludedData = 'exclude';

					}

						

					$('#ul-translation').append('<li rel="'+val['id']+'"><a tabindex="-1" href="#demo" class="" data-code="'+val['code']+'" data-notes="'+val['notes']+'" data-langid="'+val['id']+'">'+val['name']+'<i title="'+_excludedData+'" data-flag="'+_excludedData+'" class="exlude-lang '+_excludedClass+'" style="color:gray;"></i>' + _delEditLiBtnTemplate + '</a></li>');

					_cntr = _cntr + 1;

				});

				_ulTranslationEvent();

				_excludeLanguageEvent();

				_tDrawInterval();

			}

		});

	}

	

});