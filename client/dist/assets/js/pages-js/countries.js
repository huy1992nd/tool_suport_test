$(function(){
	var json = {params:'', params2:''};
	var t = $('#tbl_countries').DataTable({
		'processing' : true,
		'serverSide' : true,
		'cache'		 : false,
		'pagingType' : 'full_numbers',
		'ajax'		 : {
			'url': site_url + 'admin/countries/ajax/read',
		},
		//'order': [[4, 'desc']],
		'columns' : [
		    {'name':'name'},
		    {'name':'currency_code'},
		    {'name': 'currency_name'},
		    {'name': 'ban'},
		    {'orderable':false, 'searchable':false}
		 ],
		'language': {

			'url' : site_url + 'admin/language/ajax/get_datatables_language',

		}
	});
	
	$(document).on('click', '#status_dropdown li', function(){
		$('#status_dropdown li').removeClass('active');
		$(this).addClass('active');
		var statusText = $(this).find('a').html();
		var statusVal  = $(this).data('status');
		$('#status-text').html(statusText);
		json.params = statusVal;
		t.ajax.url(site_url + 'admin/countries/ajax/read?params=' + json.params+'&params2=' + json.params2).load();
		
	});
	$(document).on('click', '#currency_dropdown li', function(){
		$('#currency_dropdown li').removeClass('active');
		$(this).addClass('active');
		var currencyText = $(this).find('a').html();
		var currencyVal  = $(this).data('currency');
		$('#currency-text').html(currencyText);
		json.params2 = currencyVal;
		t.ajax.url(site_url + 'admin/countries/ajax/read?params=' + json.params+'&params2=' + json.params2).load();
		
	});
	$(document).on('click', '.ban-unban', function(){
		var id = $(this).data('id');
		var ban = $(this).data('ban');
		var country = $(this).data('country');
		var text = (ban == 0) ? ban_text : unban_text;
		$('.action-ban-unban').html(text);
		$('.country').html(country);
		$('#country_id').val(id);
		$('#ban').val(ban);
	});
	$(document).on('click', '.btn-ban-country', function(){
		var countryId = $('#country_id').val();
		var ban		  = $('#ban').val();
		var that 	  = $(this).button('loading');
		$.ajax({
			type:"POST",
			data:{countryId:countryId, ban:ban},
			url:site_url + 'admin/countries/ajax/update_ban',
			beforeSend:function(){
				$(that).button('loading');
			},
			success:function(data){
				t.draw(false);
				$(that).button('reset');
				$.scrollTo('.page-content');
				$('#ld-alert').addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + data.success).end().show();
				$('#ban-unban-modal').modal('hide'); 
				
			}
		});
	});
});