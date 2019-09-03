$(function(){
	var t = $('table').DataTable({

					'processing': true,

					'serverSide': true,

					'pagingType': 'full_numbers',

					'ajax': {

						'url': site_url + 'admin/assets/ajax/read'

					},

					'order': [[6, 'desc']],

					'columns': [
					
						{'name' : 'id', 'sClass':'center'},
						{'orderable':false, 'width':'35%', 'searchable':false, 'sClass' : 'center'},
						{'name':'asset_type', 'width':'25%', 'sClass':'center'},
						{'name':'game_name', 'width':'30%', 'sClass':'center'},
						{'name':'png', 'orderable':false, 'searchable':false},
						{'name':'jpg', 'orderable':false, 'searchable':false},
						{'name':'gif', 'orderable':false, 'searchable':false},
						{'name':'xcf', 'orderable':false, 'searchable':false},
						{'name':'ai', 'orderable':false, 'searchable':false},
						{'name':'psd', 'orderable':false, 'searchable':false},
						{'orderable':false, 'searchable':false}
						

		

					],

					'language': {

						'processing': '<img src="' + template_dir + '/images/loader.gif" />',
						'url' : site_url + 'admin/language/ajax/get_datatables_language'

					}

	});
	$('#assets_type').blur(function(){
		var assetsVal = $(this).val();
		var value     = $('[name="file_name"]').val();
		if(value == '' || assetsVal == '')
		{
			$(".btn-upload").prop('disabled', true);
		}
		else
		{
			$(".btn-upload").removeAttr('disabled');
		}
	});
	$('[name="file_name"]').blur(function(){
		var value = $(this).val();
		var assetsVal = $('#assets_type').val();
		if(value == '' || assetsVal == '')
		{
			$(".btn-upload").prop('disabled', true);
		}
		else
		{
			$(".btn-upload").removeAttr('disabled');
		}
	});
	
	$('#add-assets-form').submit(function(e){
		e.preventDefault();
		var btn = $('#add-assets-modal .btn-create');
		btn.button('loading');
		$.ajax({
			     type:"POST",
				 data: $(this).serializeArray(),
				 dataType:"json",
				 url:site_url + 'admin/assets/ajax/create',
				 beforeSend:function(){
						btn.button('loading');
				 },
				 success: function(data){
						if(data.success)
						{
							
							$('#add-assets-form')[0].reset();
							$('input[name="ai"], input[name="jpg"], input[name="xcf"], input[name="png"], input[name="gif"], input[name="psd"]').attr('value', '');
							$('#add-assets-modal').modal('hide');
							$('.alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html(data.success).end().show();
							t.draw();
							btn.button('reset');
							$(".btn-upload").prop('disabled', true);
						}
						else
						{

							$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>Oh snap!</strong> ' + data.error).end().show();
							$('#add-assets-form')[0].reset();
							$('input[name="ai"], input[name="jpg"], input[name="xcf"], input[name="png"], input[name="gif"], input[name="psd"]').attr('value', '');
							$('#add-assets-modal').modal('hide');
							btn.button('reset');	
							$(".btn-upload").prop('disabled', true);							

						}
						//$('.alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html(data.success).end().show();
				  }
				 
			  });
	});
	$('#add-assets-modal .btn-create').click(function(){
			$('#add_assets_bt').click();
	});
	$('#assets_type').change(function(){
		var assetsVal = $(this).val();
		var fileName  = $('[name="file_name"]').val();
		switch(assetsVal){
			case 'Main Banner':
				$(".assets_type_upload").val(assetsVal);
				$(".max_width").val('614');
				$(".max_height").val('300');
				$(".upload_dir").val('assets/Main Banner/');
				$(".upload_url").val(site_url + 'assets/Main Banner/');
				break;
			case 'Horizontal Banner':
				$(".assets_type_upload").val(assetsVal);
				$(".max_width").val('694');
				$(".max_height").val('240');
				$(".upload_dir").val('assets/Horizontal Banner/');
				$(".upload_url").val(site_url + 'assets/Horizontal Banner/');
				break;
			case 'Vertical Banner':
				$(".assets_type_upload").val(assetsVal);
				$(".max_width").val('200');
				$(".max_height").val('540');
				$(".upload_dir").val('assets/Vertical Banner/');
				$(".upload_url").val(site_url + 'assets/Vertical Banner/');
				break;
			case 'Logo':
				$(".assets_type_upload").val(assetsVal);
				$(".max_width").val('240');
				$(".max_height").val('80');
				$(".upload_dir").val('assets/Logo/');
				$(".upload_url").val(site_url + 'assets/Logo/');
				break;
			case 'Icons':
				$(".assets_type_upload").val(assetsVal);
				$(".max_width").val('225');
				$(".max_height").val('120');
				$(".upload_dir").val('assets/Icons/');
				$(".upload_url").val(site_url + 'assets/Icons/');
				break;
			case 'General':
				$(".assets_type_upload").val(assetsVal);
				$(".upload_dir").val('assets/General/');
				$(".upload_url").val(site_url + 'assets/General/');
				break;
			case 'Source':
				$(".assets_type_upload").val(assetsVal);
				$(".upload_dir").val('assets/Source/');
				$(".upload_url").val(site_url + 'assets/Source/');
				break;
			default:
				$(".btn-upload").prop('disabled');
				$(".assets_type_upload").val('');
				$(".max_width").val('');
				$(".max_height").val('');
		}
	});
	$('#png_file').fileupload({
		url: site_url + 'admin/assets/ajax/upload_assets',
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#png_file').data('btn');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					$('.alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Invalid file format ' + file.error).end().show();
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('#' + $('#png_file').data('modal') + ' input[name="png"]').attr('value', file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#png_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#png_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	$('#jpg_file').fileupload({
		url: site_url + 'admin/assets/ajax/upload_assets',
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#jpg_file').data('btn');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					$('.alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Invalid file format ' + file.error).end().show();
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('#' + $('#jpg_file').data('modal') + ' input[name="jpg"]').attr('value', file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#jpg_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#jpg_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	$('#gif_file').fileupload({
		url: site_url + 'admin/assets/ajax/upload_assets',
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#gif_file').data('btn');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					$('.alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Invalid file format ' + file.error).end().show();
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('#' + $('#gif_file').data('modal') + ' input[name="gif"]').attr('value', file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#gif_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#gif_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	$('#psd_file').fileupload({
		url: site_url + 'admin/assets/ajax/upload_assets',
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#psd_file').data('btn');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					$('.alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Invalid file format ' + file.error).end().show();
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('#' + $('#psd_file').data('modal') + ' input[name="psd"]').attr('value', file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#psd_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#psd_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	$('#xcf_file').fileupload({
		url: site_url + 'admin/assets/ajax/upload_assets',
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#xcf_file').data('btn');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					$('.alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Invalid file format ' + file.error).end().show();
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('#' + $('#xcf_file').data('modal') + ' input[name="xcf"]').attr('value', file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#xcf_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#xcf_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	$('#ai_file').fileupload({
		url: site_url + 'admin/assets/ajax/upload_assets',
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#ai_file').data('btn');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					$('.alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<strong><span class="glyphicon glyphicon-exclamation-sign"></span> Oh snap!</strong> Invalid file format ' + file.error).end().show();
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('#' + $('#ai_file').data('modal') + ' input[name="ai"]').attr('value', file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#ai_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#ai_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	$('.modal').on('click', '.btn-upload', function(){
			var kind = $(this).attr('data-kind');
			$('#' + kind + '_file').data({'modal': $(this).closest('.modal').attr('id'), 'btn':$(this)});
			$('#' + kind + '_file').click();
	});
	$('#remove-assets-modal').on('click', '.btn-remove', function(){
			var btn = $(this),
			url = site_url + 'admin/assets/ajax/delete';
			btn.button('loading');
			$.post(url, {asset_id:btn.data('asset_id')}, function(response)
			{						
				if(response.success)
				{
					
					t.draw();
					$('.alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html(response.success).end().show();
					$('#remove-assets-modal').modal('hide');
					btn.button('reset');
				}
				else
				{
					$('#lg-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html(response.error).end().show();
					$('#remove-assets-modal').modal('hide');
					btn.button('reset');
				}

			});
	});
	$('table').on('click', '.remove-asset', function(){
		var asset_id = $(this).attr('data-id'),
		asset_name = $(this).attr('data-image');
		asset = $(this).closest('tr').find('td:eq(2)').html();
		$('#remove-assets-modal .modal-body p').html('Are you sure you want to remove image \'' + asset_name + '\'?');
		$('#remove-assets-modal .btn-remove').data('asset_id', asset_id);
	});
	$('table').on('click', '.edit-asset', function(){
		var url = site_url + 'admin/assets/ajax/get' + '/' + $(this).attr('data-id');
		$.get(url, function(response){
			var modal_obj = $('#edit-assets-modal');
			$('input[name="file_name"]', modal_obj).attr('value', response.filename);
			$('input[name="old_file_name"]', modal_obj).attr('value', response.filename);
			$('input[name="old_asset_type"]', modal_obj).attr('value', response.asset_type);
			$('input[name="file_id"]', modal_obj).attr('value', response.id);
			$('select[name="assets_type"] option', modal_obj).each(function(){
				$(this).attr('selected', this.value == response.asset_type);
			});
			$('select[name="games"] option', modal_obj).each(function(){
				$(this).attr('selected', this.value == response.game_id);
			});
			$('input[name="png"]', modal_obj).attr('value', response.png);
			$('input[name="jpg"]', modal_obj).attr('value', response.jpg);
			$('input[name="gif"]', modal_obj).attr('value', response.gif);
			$('input[name="xcf"]', modal_obj).attr('value', response.xcf);
			$('input[name="psd"]', modal_obj).attr('value', response.psd);
			$('input[name="ai"]', modal_obj).attr('value', response.ai);
			if(response.asset_type == 'Main Banner'){
				$(".btn-upload").removeAttr('disabled');
				$(".assets_type_upload").val(response.asset_type);
				$(".max_width").val('614');
				$(".max_height").val('300');
				$(".upload_dir").val('assets/Main Banner/');
				$(".upload_url").val(site_url + 'assets/Main Banner/');
			}
			else if(response.asset_type == 'Horizontal Banner')
			{
				$(".btn-upload").removeAttr('disabled');
				$(".assets_type_upload").val(response.asset_type);
				$(".max_width").val('694');
				$(".max_height").val('240');
				$(".upload_dir").val('assets/Horizontal Banner/');
				$(".upload_url").val(site_url + 'assets/Horizontal Banner/');
			}
			else if(response.asset_type == 'Vertical Banner')
			{
				$(".btn-upload").removeAttr('disabled');
				$(".assets_type_upload").val(response.asset_type);
				$(".max_width").val('200');
				$(".max_height").val('540');
				$(".upload_dir").val('assets/Vertical Banner/');
				$(".upload_url").val(site_url + 'assets/Vertical Banner/');
			}
			else if(response.asset_type == 'Logo')
			{
				$(".btn-upload").removeAttr('disabled');
				$(".assets_type_upload").val(response.asset_type);
				$(".max_width").val('240');
				$(".max_height").val('80');
				$(".upload_dir").val('assets/Logo/');
				$(".upload_url").val(site_url + 'assets/Logo/');
			}
			else if(response.asset_type == 'Icons')
			{
				$(".btn-upload").removeAttr('disabled');
				$(".assets_type_upload").val(response.asset_type);
				$(".max_width").val('225');
				$(".max_height").val('120');
				$(".upload_dir").val('assets/Icons/');
				$(".upload_url").val(site_url + 'assets/Icons/');
			}
			else if(response.asset_type == 'General')
			{
				$(".btn-upload").removeAttr('disabled');
				$(".assets_type_upload").val(response.asset_type);
				$(".upload_dir").val('assets/General/');
				$(".upload_url").val(site_url + 'assets/General/');
			}
			else if(response.asset_type == 'Source'){
				$(".btn-upload").removeAttr('disabled');
				$(".assets_type_upload").val(response.asset_type);
				$(".upload_dir").val('assets/Source/');
				$(".upload_url").val(site_url + 'assets/Source/');
			}
				
			modal_obj.modal('show');
		});
	});
	/**
	 * edit asset
	 */
	$('#edit-assets-form').submit(function(e){
			e.preventDefault();
			var btn = $('#edit-assets-modal .btn-update'),
				url = site_url + 'admin/assets/ajax/update';
				form_data = $(this).serializeArray();
				btn.button('loading');					
				form_data.push({name:'id', value:btn.data('asset_id')});
				$.post(url, form_data, function(response){
					btn.button('reset');					
					if(response.success)
					{
						$('#add-assets-modal').modal('hide');
						$('.alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html(response.success).end().show();
						t.draw(false);
						$('#edit-assets-modal').modal('hide');
					}
					else
					{
					    $('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>Oh snap!</strong> ' + data.error).end().show();$('#eg-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>Oh snap!</strong> ' + response.error).end().show();
						$('#edit-assets-modal').scrollTop(0);
					}

				});
		});
		$('#edit-assets-modal .btn-update').click(function(){
				$('#edit_assets_bt').click();
		});
		$(document).on('click', '.download', function(e){
			e.preventDefault();
			var fileName = $(this).attr('filename');
			var fileType = $(this).attr('filetype');
			var assetType = $(this).attr('asset_type');
			$.ajax({
				type:"GET",
				data:{fileName:fileName, fileType:fileType, assetType:assetType},
				dataType:"json",
				url:site_url + 'admin/assets/ajax/download',
				success:function(response){
					if(response.error){
						$('#ld-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>Oh snap!</strong> ' + data.error).end().show();$('#eg-alert').removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>Oh snap!</strong> ' + response.error).end().show();
					}
				}
				
			});
		});

});

