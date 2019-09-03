var synced_pages = null;
$(function(){
	
	/**
	 * games list
	 */
	var t = $('table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/games/ajax/read'
		},
		'order': [[0, 'desc']],
		'columns': [
			{'name' : 'id'},
			{'orderable':false, 'searchable':false},
			{'name':'game'},
			{'name':'game_code'},
            {'name':'mobile_code'},
			{'name':'category'},
			{'name':'status', 'orderable':false, 'searchable':false},
			{'orderable':false, 'searchable':false}
		],
		'language': {
	         url: site_url + 'admin/language/ajax/get_datatables_language',
	     }
	});
	
	/*$('table').not('input, a').on('click', 'tr:gt(0)', function(e){
		if(! ($(e.target).is(':checkbox') || $(e.target).is('.glyphicon')))
			$(':checkbox', this).click();
	});
	
	$('table').on('draw.dt', function(){
		var alert = $('#lg-alert');
		if(alert.data('message'))
		{
			alert.addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + alert.data('message')).end().show();
			alert.data('message', null);
		}
		else
			$('.alert').hide();	
	});*/
	$('table').on('draw.dt', function(){
		var alert = $('#lg-alert');
		if(alert.data('show_alert'))
			alert.data('show_alert', false);
		else
			$('.alert').hide();	
	});				
				
	/**
	 * add game
	 */
	$('#add-game-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv', function(e){
		e.preventDefault();
		var btn = $('#add-game-modal .btn-create'),
			url = site_url + 'admin/games/ajax/create';
		btn.button('loading');						
		$.post(url, $('#add-game-form').serializeArray(), function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#lg-alert'));				
				$('#lg-alert').data('show_alert', true);
				t.draw();
				$('#add-game-form')[0].reset();
				$('#add-game-form select[name="category_id"]').change();
				$('input[name="poster_url"], input[name="icon_url"], input[name="slider_url"]').attr('value', '');
				$('#add-game-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#ag-alert'));				
				$('#add-game-modal').scrollTop(0);							
			}
		});
	});
	
	$('#add-game-modal .btn-create').click(function(){
		$('#add_game_bt').click();
	});
	
	var upload_url = site_url + 'admin/games/ajax/upload';
	
	/**
	 * upload icon 
	 */
	$('#icon_file').fileupload({
		url: upload_url,
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#icon_file').data('btn'),
				modal = $('#icon_file').data('modal');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					file.error = $('label[for$="icon_url"]', modal).text() + ': ' + file.error;					
					showAlert(file, $('.alert', modal));
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('input[name="icon_url"]', modal).val(file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var btn = $('#icon_file').data('btn');
			btn.button('loading');
			data.submit();
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
			btn = $('#icon_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	
	/**
	 * upload poster
	 */
	$('#poster_file').fileupload({
		url: upload_url,
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#poster_file').data('btn'),
				modal = $('#poster_file').data('modal');
			btn.button('reset');
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					file.error = $('label[for$="poster_url"]', modal).text() + ': ' + file.error;					
					showAlert(file, $('.alert', modal));
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('input[name="poster_url"]', modal).val(file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var jqXHR = data.submit(),
				btn = $('#poster_file').data('btn');
			btn.button('loading');
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
				btn = $('#poster_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');						
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	
	/**
	 * upload slider
	 */
	$('#slider_file').fileupload({
		url: upload_url,
		dataType: 'json',
		done: function (e, data) {
			var btn = $('#slider_file').data('btn'),
				modal = $('#slider_file').data('modal');
			btn.button('reset');						
			$.each(data.result.files, function (index, file) {
				if(file.error)
				{
					file.error = $('label[for$="slider_url"]', modal).text() + ': ' + file.error;					
					showAlert(file, $('.alert', modal));
					$.scrollTo('.breadcrumb');
				}
				else
				{
					$('input[name="slider_url"]', modal).val(file.url);
					$('.alert').hide();
				}
			});
		},
		add: function (e, data) {
			var jqXHR = data.submit(),
				btn = $('#slider_file').data('btn');
			btn.button('loading');					
		},
		progressall: function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10),
				btn = $('#slider_file').data('btn');
			btn.attr('data-progress-text', progress + '%');
			btn.button('progress');												
		}
	}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
	
	$('.modal').on('click', '.btn-upload', function(){
		var kind = $(this).attr('data-kind');
		$('#' + kind + '_file').data({'modal': $(this).closest('.modal'), 'btn':$(this)});
		$('#' + kind + '_file').click();
	});
	
	/*$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
		if($('form', this).length > 0)
		{
			if($(this).is('#add-game-modal'))
				$('select[name="category_id"]', this).change();
			$('form', this)[0].reset();
		}
	});*/
	$('.modal').on('show.bs.modal', function(){
		$('.alert').hide();
	}).on('shown.bs.modal', function(){
		if($(this).is('#add-game-modal'))
		{
			$('#add-game-form').bootstrapValidator('resetForm', true);
			$('input[name="width"]', this).val('800');
			$('input[name="height"]', this).val('600');
			$('input[name="slot_lines"], #marvel_jackpot_yes', this).closest('.form-group').toggleClass('hidden', true);			
		}
	}).on('hide.bs.modal', function(){
		if($(this).is('#edit-game-modal'))
			$('#edit-game-form').bootstrapValidator('resetForm', true);
	});
	
	$('.modal input[name="poster_url"], .modal input[name="icon_url"], .modal input[name="slider_url"]').on('focus blur', function(e){
		$(this).attr('readonly', function(id, old_value){
			return e.type == 'focus';
		});
	});
	
	$('select[name="category_id"]').change(function(){
		var value = $(this).val(),
			modal = $(this).closest('.modal');
		$('input[name="slot_lines"], #marvel_jackpot_yes', modal).closest('.form-group').toggleClass('hidden', value != '9');
	});
	
	$(':radio[name="progressive"]').click(function(){
		var value = $(this).val(),
			modal = $(this).closest('.modal');
		$('input[name="progressive_code"]', modal).closest('.form-group').toggleClass('hidden', value != 'yes');
	});				
				
	/**
	 * edit game
	 */
	$('#edit-game-form').bootstrapValidator({
		feedbackIcons: {
            valid: 'glyphicon',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        }
	}).on('success.form.bv',function(e){
		e.preventDefault();
		var btn = $('#edit-game-modal .btn-update'),
			url = site_url + 'admin/games/ajax/update';
			form_data = $(this).serializeArray();
		btn.button('loading');					
		form_data.push({name:'id', value:btn.data('game_id')});
		$.post(url, form_data, function(response){
			btn.button('reset');					
			if(response.success)
			{
				showAlert(response, $('#lg-alert'));				
				$('#lg-alert').data('show_alert', true);
				t.draw(false);
				$('#edit-game-modal').modal('hide');
			}
			else
			{
				showAlert(response, $('#eg-alert'));				
				$('#edit-game-modal').scrollTop(0);
			}
		});
	});
	
	$('#edit-game-modal .btn-update').click(function(){
		$('#edit_game_bt').click();
	});
	
	$('table').on('click', '.edit-game', function(){
		$('#lg-alert').hide();
		var url = site_url + 'admin/games/ajax/get' + '/' + $(this).attr('data-id');
		$('#loading-indicator').show();						
		$.get(url, function(response){
			$('#loading-indicator').hide();							
			var modal_obj = $('#edit-game-modal');
			$('select[name="category_id"]', modal_obj).val(response.category_id);
			$('input[name="branded"], input[name="progressive"], input[name="marvel_jackpot"]', modal_obj).attr('checked', false);
			$('input[name="game_name"]', modal_obj).val(response.name);
			$('input[name="game_code"]', modal_obj).val(response.code);
            $('input[name="mobile_code"]', modal_obj).val(response.mobile_code);
			$('input[name="translation_key"]', modal_obj).val(response.translation_key);
			
			$('input[name="slot_lines"], input[name="marvel_jackpot"]', modal_obj).closest('.form-group').toggleClass('hidden', response.category_id != '9');
			
			$('input[name="slot_lines"]', modal_obj).val(response.slot_lines);
			$('#edit_marvel_jackpot_' + (response.marvel_jackpot == '1' ? 'yes' : 'no'), modal_obj).prop('checked', true);						
			$('input[name="poster_url"]', modal_obj).val(response.poster_url);
			$('input[name="icon_url"]', modal_obj).val(response.icon_url);
			$('input[name="slider_url"]', modal_obj).val(response.slider_url);						
			$('#edit_branded_' + (response.branded == '1' ? 'yes' : 'no'), modal_obj).prop('checked', true);
			$('#edit_progressive_' + (response.progressive == '1' ? 'yes' : 'no'), modal_obj).prop('checked', true);
			$('input[name="progressive_code"]', modal_obj).val(response.progressive_code).closest('.form-group').toggleClass('hidden', response.progressive != '1');
			$('input[name="width"]', modal_obj).val(response.width);						
			$('input[name="height"]', modal_obj).val(response.height);
			$('#edit-game-modal .btn-update').data('game_id', response.id);
			modal_obj.modal('show');
		});
	});
								
	/**
	 * remove game
	 */
	$('#remove-game-modal').on('click', '.btn-remove', function(){
		var btn = $(this),
			url = site_url + 'admin/games/ajax/delete';
		btn.button('loading');
		$.post(url, {game_id:btn.data('game_id')}, function(response){
			btn.button('reset');					
			showAlert(response, $('#lg-alert'));
			$('#lg-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#remove-game-modal').modal('hide');
		});
	});
	
	$('table').on('click', '.remove-game', function(){
		var game_id = $(this).attr('data-id'),
			game = $(this).closest('tr').find('td:eq(2)').html();
		$('#remove-game-modal .modal-body p span.game-name').html(game);
		$('#remove-game-modal .btn-remove').data('game_id', game_id);
		$('#sync-game-modal .btn-save').data('game_id', game_id);
		$('#sync-game-modal .modal-body p span.game-name').html(game);
	});
	
	$('table').on('click', '.sync-game', function(){
		synced_pages = null;
		var game_id = $(this).attr('data-id'),
			game = $(this).closest('tr').find('td:eq(2)').html();
		$('#sync-game-modal .btn-save').data('game_id', game_id);
		$('#sync-game-modal .modal-body p span.game-name').html(game);
		url = site_url + 'admin/games/ajax/get_pages';
		$.ajax({
				url:url,
				data:"game_id="+game_id,
				type:"GET",
				success:function(res){
					$("#domain-pages").html(res.result);
					synced_pages = res.result_arr;
				}
		});
		
	});
	$('#sync-game-modal').on('click', '.btn-save', function(){
		var btn = $(this),
			url = site_url + 'admin/games/ajax/save_to_domain_games';
		btn.button('loading');
		var game_id = $('#sync-game-modal .btn-save').data('game_id');
		
		/*
		$.post(url, {game_id:btn.data('game_id')}, function(response){
			btn.button('reset');					
			showAlert(response, $('#lg-alert'));
			$('#lg-alert').data('show_alert', true);			
			if(response.success)
				t.draw();
			$('#sync-game-modal').modal('hide');
		});
		*/
		//window.location.href = url+"?game_id="+game_id;
		
		$.ajax({
				url:url,
				data:"game_id="+game_id,
				type:"GET",
				success:function(res){
					btn.button("reset");
					alert(res.result)
					$('#sync-game-modal').modal('hide');
				}
		});
		
	});
});