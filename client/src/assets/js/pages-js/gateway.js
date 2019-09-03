$(function(){
	Highcharts.setOptions({
		global: {
			timezoneOffset: (new Date()).getTimezoneOffset()
		}
	});
	$('#ags-chart').highcharts({
		chart: {
			type: 'area',
			zoomType: 'x',
			backgroundColor: 'transparent',
			animation: Highcharts.svg, // don't animate in old IE
			marginRight: 10,
			events: {
				load: function () {
					var ags_series = this.series;
					// set up the updating of the chart each second
					$('#daterange-btn-graph').daterangepicker( {
						/*ranges: {
							'Today': [moment(), moment()],
							'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
							'Last 7 Days': [moment().subtract(6, 'days'), moment()],
							'Last 30 Days': [moment().subtract(29, 'days'), moment()],
							'This Month': [moment().startOf('month'), moment().endOf('month')],
							'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
						},*/
						singleDatePicker: true,
						showDropdowns: true,
						startDate: moment(), //moment().startOf('month'),
						endDate: moment()
					}, function (start, end) {
						//$('#daterange-btn-graph span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
						$('#daterange-btn-graph span').html(start.format('MMMM D, YYYY')); 
						var url = $('#daterange-btn-graph').data('url');
						$('#loading-indicator').show();
						$.get(url, {from:start.format('YYYY-MM-DD'), to:end.format('YYYY-MM-DD')}, function(response){
							$('#loading-indicator').hide();
							var success_data = [],
								error_data = [];
							ags_data = response;
							if(response.success)
							{
								$.each(response.success, function(i, v){
									success_data.push({
										x: (new Date(v.date_string)).getTime(),
										y: parseInt(v.total)
									});
								});
							}
							if(response.error)
							{
								$.each(response.error, function(i, v){
									error_data.push({
										x: (new Date(v.date_string)).getTime(),
										y: parseInt(v.total)
									});
								});
							}
							ags_series[0].setData(success_data);
							ags_series[1].setData(error_data);
						});
					});	
				}
			}
		},
		title: {
			text: 'Galaxy API Requests',
			style: {color:'#fff'}
		},
		subtitle: {
			text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in',
			style: {color:'#fff'}
		},				
		plotOptions: {
			area: {
				turboThreshold: 11000
			},
			series: {
				pointInterval: 24 * 3600 * 1000 // one day				
			}
		},				
		xAxis: {
			type: 'datetime',
			labels: {
				style: {color: '#fff'}
			},
		},
		yAxis: {
			title: {
				text: 'Total',
				style: {color: '#fff'}
			},
			labels: {
				style: {color: '#fff'}
			},
			gridLineColor: '#fff',
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			formatter: function () {
				return '<b>' + this.series.name + '</b><br/>' +
					Highcharts.dateFormat('%a, %B %d %Y %H:%m', this.x) + '<br/>' +
					Highcharts.numberFormat(this.y, 0);
			}
		},
		legend: {
			enabled: true,
			style: {color: '#fff'},
			itemStyle: {color: '#fff'}
		},
		series: [{
			name: 'Success',
			data: (function () {
				// generate an array of random data
				var data = [];
				if(ags_data.success)
				{
					$.each(ags_data.success, function(i, v) {
						data.push({
							x: (new Date(v.date_string)).getTime(),
							y: parseInt(v.total),
							events: {
								click: function(){
									console.log((new Date(v.date_string)).getTime());
								}
							}
						});
					});
				}
				return data;
			}())
		}, {
			name: 'Error',
			data: (function () {
				// generate an array of random data
				var data = [];
				if(ags_data.error)
				{
					$.each(ags_data.error, function(i, v) {
						data.push({
							x: (new Date(v.date_string)).getTime(),
							y: parseInt(v.total),
							events: {
								click: function(){
									console.log((new Date(v.date_string)).getTime());
								}
							}
						});
					});
				}
				return data;
			}())
		}]
	});	
	
	/**
	 * Logs
	 */
	
	var t = $('table').DataTable({
		'processing': true,
		'serverSide': true,
		'pagingType': 'full_numbers',
		'ajax': {
			'url': site_url + 'admin/gateway/ajax/logs',
		},
		'order': [[0, 'desc']],
		'columns': [
		    {'name':'id'},
			{'name':'uri'},
			{'name':'status'},
			{'name':'date_requested'},
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language',
	    }
	});	
			
	$('a[href="#logs"]').one('shown.bs.tab', function(){
		var options = {
				/*ranges: {
				'Today': [moment(), moment()],
				'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
				'Last 7 Days': [moment().subtract(6, 'days'), moment()],
				'Last 30 Days': [moment().subtract(29, 'days'), moment()],
				'This Month': [moment().startOf('month'), moment().endOf('month')],
				'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
				},*/
				singleDatePicker: true,
				showDropdowns: true,
				startDate: moment(), //moment().startOf('month'),
				timePicker: false,
				timePickerIncrement: 15				
			},
			callback = function(start, end){
				$('#daterange-btn-logs').data({'start':start, 'end':end});
				t.draw();
			};
			
		t.on('preXhr.dt', function(e, settings, data){
			var start = $('#daterange-btn-logs').data('start') ? $('#daterange-btn-logs').data('start') : null;
				end = $('#daterange-btn-logs').data('end') ? $('#daterange-btn-logs').data('end') : null;

			if(t.search() != '')
			{			
				if(! start)
				{
					start = moment();
					
					var lapsed = start.minutes();
					
					if(lapsed >= 45)
						start.minutes(45);
					else if(lapsed >= 30)
						start.minutes(30);
					else if(lapsed >= 15)
						start.minutes(15);
					else
						start.minutes(0);
				}
				options.timePicker = true;
			}
			else
			{
				if(! start)
					start = moment(0, 'HH');
				else
				{
					start.hours(0);
					start.minutes(0);
				}
				options.timePicker = false;
			}
			
			end = moment(start);	
			
			if(t.search() != '')
				end.add(15, 'minutes');
			else
			{
				end.hours(23);
				end.minutes(59);
			}
			
			options.startDate = start;
			
			$('#daterange-btn-logs').data('daterangepicker').remove();
			$('#daterange-btn-logs').daterangepicker(options, callback);
									
			$('#daterange-btn-logs').data({'start':start, 'end':end});				
			//$('#daterange-btn-logs').data('daterangepicker').setStartDate(start);
			
			if(t.search() != '')
				$('#daterange-btn-logs span').html(start.format('MMMM D, YYYY h:mm A') + ' - ' + end.format('MMMM D, YYYY h:mm A')); 
			else
				$('#daterange-btn-logs span').html(start.format('MMMM D, YYYY'));
			
			data.log_start = start.format('YYYY-MM-DD HH:mm'); 
			data.log_end = end.format('YYYY-MM-DD HH:mm');		
		});		
		
		$('#daterange-btn-logs').daterangepicker(options, callback);				
	});
	
	$('#logs').on('click', '.show-log', function(){
		var url = site_url + 'admin/gateway/ajax/show_log';
		$.get(url, {file:$(this).data('file'), search:t.search()}, function(r){
			if(r.logs)
				$('#log-logs').html(r.logs);
			if(r.response)
				$('#log-response').html(r.response);
		});
	})
	
});