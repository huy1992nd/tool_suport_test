$(function(){
	
	var nodeCounter = function(){
			$('#memcached .node-count').each(function(i){
				$(this).text(i + 1);
			});
		};
	
	$('#memcached .btn-add-more').click(function(){
		var current_fg = $(this).closest('.form-group'),
			form_group = current_fg.siblings(':eq(0)').clone(),
			button = $('<button />', {
				'type': 'button',
				'class': 'close',
				'data-dismiss': 'form-group',
				'aria-hidden': 'true'
			}).css({
				'position': 'absolute',
				'top': '5px',
				'right': '20px'
			}).html('&times;');
		form_group.find('input').val('').before(button);
		current_fg.prev().before(form_group);
		nodeCounter();
	});
	
	$('#memcached form').on('click', 'button.close', function(){
		$(this).closest('.form-group').fadeOut('slow', function(){
			$(this).remove();
			nodeCounter();
		});		
	})
	
	$('#memcached form, #gateway form').submit(function(e){
		e.preventDefault();
		var btn = $(this).find('button[type="submit"]');
		btn.button('loading');
		$.post(this.action, $(this).serializeArray(), function(response){
			btn.button('reset');
			showAlert(response, $('#gs-alert'));
		});
	});

	$('#performance .toggle').click(function(e){
		e.preventDefault();
		var group = $(this).data('toggle'),
			title = $(this).attr('title'),
			id = $(this).attr('href');
		$('#performance .toggle[data-toggle="' + group + '"]').not(this).parent('li').removeClass('active');		
		$(this).parent('li').addClass('active');
		$('.' + group).hide();
		if(title)
			$(id).closest('.panel').find('.panel-title').text(title);
		$(id).show();
		$(id).siblings('#result').html('');
	});
		
	$('#performance .apt-form').submit(function(e){
		e.preventDefault();
		var btn = $(this).find('button[type="submit"]');
		btn.button('loading');
		$('#performance #result').html('');
		$.post(this.action, $(this).serializeArray(), function(response){
			btn.button('reset');
			console.log(response);
			$('#performance #result').html('<p>Time Elapsed: ' + response.curl_time_elapsed + ' seconds </p><p>Total Processes: ' + response.processes + '</p><p>Total RPS: ' + response.total_rps + '</p><p>Average RPS: ' + response.average_rps + '</p><p>Memory Usage: ' + response.script_memory_usage + '</p><p>Response:</p>').append(renderjson.set_show_to_level(3)(response.result));
		});		
	});
});