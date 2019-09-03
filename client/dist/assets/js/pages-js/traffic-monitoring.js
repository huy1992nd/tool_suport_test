$(function(){
	var getChart = function(page, fromDate, toDate){
		$.ajax({
			type:"POST",
			dataType:"json",
			url:site_url + 'admin/domains/ajax/getChart',
			data:{domain_id:domain_id, page:page, fromDate:fromDate, toDate:toDate},
			beforeSend:function(){
				$('.panel-body #tm_chart').html('<div class="loader text-center"><img src="' + template_dir + '/images/loader.gif" /></div>');
			},
			success:function(response){
				$('.panel-body #tm_chart').empty();
				var data = JSON.parse(response.plot);
				 $.jqplot('tm_chart', data, {
					    title:$.trim(page) == 'All' ? 'Total Domain Traffic' : page + ' Page',
					    axes:{xaxis:{renderer:$.jqplot.DateAxisRenderer}},
					    series:[{lineWidth:4, markerOptions:{style:'square'}}]
				 });
			}
		});
	};
	$(document).on('click', '#traffic_monitoring_tab', function(){
		 var fromDate  = $('#from-date').find('input').val();
		 var toDate	  = $('#to-date').find('input').val();
		 var pageValue = $('#page-text').html();
		getChart(pageValue, fromDate, toDate);
	});
	$(document).on('click', '#page_dropdown li', function(){
		var pageText  = $(this).find('a').html();
		var option    = $(this).data('page');
		var fromDate  = $('#from-date').find('input').val();
		var toDate	  = $('#to-date').find('input').val();
		$('#page-text').html(option);
		var pageValue = $('#page-text').html();
		getChart(pageValue, fromDate, toDate);
		
	});
	$('#from-date').datetimepicker({
		  format: 'YYYY-MM-DD'
    });
	 $('#to-date').datetimepicker({
		  format: 'YYYY-MM-DD'
     });
	 $('#from-date').on('dp.change', function(){
		 var fromDate  = $('#from-date').find('input').val();
		 var toDate	  = $('#to-date').find('input').val();
		 var pageValue = $('#page-text').html();
		 if(toDate !== '')
			 getChart(pageValue, fromDate, toDate);
		 
	 });
	 $('#to-date').on('dp.change', function(){
		 var fromDate  = $('#from-date').find('input').val();
		 var toDate	  = $('#to-date').find('input').val();
		 var pageValue = $('#page-text').html();
		 
		 if(fromDate !== '')
		 	getChart(pageValue, fromDate, toDate);
	 });
});