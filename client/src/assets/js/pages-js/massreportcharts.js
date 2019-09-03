$(document).ready(function () {
	
	var _params = {form : null, startdate: null, enddate: null, brand: null, tle: null};
	var _excludeEventIsTrigger = false;
	
	var _paramsParser = function(){
		
		if($('#btn-lang-forms').data('form'))
			_params.form = $('#btn-lang-forms').data('form');
		
		if($('#btn-lang-tles').data('tle')){
			_params.tle = $('#btn-lang-tles').data('tle');
			
			if($('#btn-lang-tles').data('tle') == 'all'){
				_params.tle = _getSelected('tle');
			}
		}
		
		if($('#btn-lang-brands').data('brand')){
			 _params.brand = $('#btn-lang-brands').data('brand');
			 
			if($('#btn-lang-brands').data('brand') == 'all'){
				_params.brand = _getSelected('brand');
				_params.tle = 'all';
			}
		}
		
		if($('input[name=startdate]').val())
			_params.startdate = $('input[name=startdate]').val();
		
		if($('input[name=enddate]').val())
			_params.enddate = $('input[name=enddate]').val();
	};
	
	var _getSelected = function(flag){
			var _selected = [];
			$('#ul-lang-' + flag + 's li').each( function(){
				if($(this).children('a').data('flag') != 'excluded')
					_selected.push($(this).children('a').data(flag));
			});
			return _selected;
	};
	
	var _reloadChart = function(){
		 $.ajax({
		      async: false,
		      url: site_url + 'admin/massreport/ajax/get_report_data',
		      data: _params,
		      dataType:"json",
		      type: "get",
		      success: function(response) {
		    	  _clearParams();
		    	  _renderChart(response);
		      }
		});
	};
	
	var _clearParams = function(){
		_params = {form : null, startdate: null, enddate: null, brand: null, tle: null};
	};
	
	var _renderChart = function(response){
		 $('#charts-container').html('');
		 
		 if(response.success){
			  $.jqplot.config.enablePlugins = true;
	   		  var _seriesLabel = $.map(response.keys,function(v){ return {'label' : v}; });
   		  
	   		  $.each(response.data, function(brand_key,brand_val){
	   			  	$.each(brand_val, function(tle_key, tle_val){
	   			  		
	   			  		$('#charts-container').append('<div id="chart'+ tle_key +'" style="width:90%; height:350px"></div>');
	   			  		
	   				  	var _tle_datas = $.map(tle_val, function(v) { return [v]; });
	   				  	
	    				$.jqplot('chart' + tle_key, _tle_datas, {
	    					title: tle_key,
	  		    	        axes:{
	  		    	            xaxis:{
	  		    	                renderer:$.jqplot.DateAxisRenderer,
	  		    	                rendererOptions:{
	  		    	                    tickRenderer:$.jqplot.CanvasAxisTickRenderer,
	  		    	                },
		  		    	            tickOptions:{ 
		  		                        fontSize:'10pt', 
		  		                        fontFamily:'Tahoma', 
		  		                        angle:-40
		  		                    }
	  		    	            },
	  		    	            yaxis:{
	  		    	                rendererOptions:{
	  		    	                    tickRenderer:$.jqplot.CanvasAxisTickRenderer
	  		    	                },
		  		    	            tickOptions:{
		  		                        fontSize:'10pt', 
		  		                        fontFamily:'Tahoma'
		  		                    }
	  		    	            }
	  		    	        },
	  		    	        cursor:{
	  		    	            zoom:true,
	  		    	            looseZoom: true
	  		    	        },
	  		    	        legend:{
	  		    	        	renderer: $.jqplot.EnhancedLegendRenderer,
	  		    	            show:true,
		  		    	        placement: 'outside',
		  		                location:'e'
	  		    	        },
	  		    	        series: _seriesLabel
	  		    	    });
	   			  });
   		  });
   	  }else{
   		$('#charts-container').append('<div id="chart" style="width:90%; height:350px"></div>');
   	  }
   		  
	  
 	  showAlert(response, $('#ld-alert'));
	  $('#btn-generate-charts').removeAttr('disabled');
   };
	
	var _setExclude = function(){
			$('.exlude-flag').on({
				mouseover : function(){
					_excludeEventIsTrigger = true;
				},
				mouseout : function(){
					_excludeEventIsTrigger = false;
				},
				click : function(){
					_excludeEventIsTrigger = true;
					if($(this).hasClass('icon-check')){
						$(this).closest('a').data('flag', 'excluded');
						$(this).removeClass('icon-check');
						$(this).addClass('icon-check-empty');
					}else{
						$(this).closest('a').data('flag', '');
						$(this).removeClass('icon-check-empty');
						$(this).addClass('icon-check');
					}
				}
			});
	};
	_setExclude();
	
	$('#ul-lang-forms > li > a').bind('click', function(){
		$('#btn-lang-forms > span').text($.trim($(this).text()));
		$('#btn-lang-forms').data('form', $(this).data('form'));
		
		_paramsParser();
	});
	
	$('#ul-lang-brands > li > a').bind('click', function(){
		if(_excludeEventIsTrigger)
			return false;
		
		$('#btn-lang-brands > span').text($.trim($(this).text()));
		$('#btn-lang-brands').data('brand', $(this).data('brand'));
		
		_paramsParser();
		
		$('#btn-lang-tles').removeAttr('disabled');
		
		if($('#btn-lang-brands').data('brand') == 'all'){
			$('#btn-lang-tles').attr('disabled', 'disabled');
			$('#ul-lang-tles').html('');
			$('#ul-lang-tles').append('<li rel="0"><a tabindex="-1" data-tle="all">All TLEs</a></li>');
		}
	});
	
	var _ulTleEvent = function(){
		$('#ul-lang-tles > li > a').bind('click', function(){
			if(_excludeEventIsTrigger)
				return false;
			
			$('#btn-lang-tles > span').text($.trim($(this).text()));
			$('#btn-lang-tles').data('tle', $(this).data('tle'));
			
			_paramsParser();
		});
	};
	_ulTleEvent();
	
	$('#btn-generate-charts').click(function(){
		var _isValid = true;
		var _msg = { error: ''};
		
		_paramsParser();
		
		if(_params.form == null){
			_isValid = false;
			_msg.error = 'Select a report.';
		}
		
		if(_params.brand == null){
			_isValid = false;
			_msg.error = 'Select a brand.';
		}
		
		/*
		if(_params.tle == null){
			_isValid = false;
			_msg.error = 'Select a TLE.';
		}
		*/
		
		if(_params.startdate == null){
			_isValid = false;
			_msg.error = 'Select an Start Date.';
		}
		
		if(_params.enddate == null){
			_isValid = false;
			_msg.error = 'Select an End Date.';
		}
		
		if(!_isValid){
			_clearParams();
			showAlert(_msg, $('#ld-alert'));
		}
		
		if(_isValid){
			$(this).attr('disabled','disabled');
			_reloadChart();
		}
	});
	
	var showAlert = function(response, obj){
		if(response.success)
			obj.addClass('alert-success').removeClass('alert-danger alert-info').find('.message').html('<span class="glyphicon glyphicon-ok"></span> <strong>Well done!</strong> ' + response.success).end().show();
		else
			obj.removeClass('alert-success alert-info').addClass('alert-danger').find('.message').html('<span class="glyphicon glyphicon-exclamation-sign"></span> <strong>Oh snap!</strong> ' + response.error).end().show();	
	};
	
	$('#startdate').datetimepicker();
	$('#enddate').datetimepicker();
	
	
	
	
});

$(document).on({
	 ajaxStart: function() { $('#loading-indicator').show();},
	 ajaxStop: function() { $('#loading-indicator').hide();}    
});
 
$.fn.datetimepicker.defaults = {
	pickDate: true,                 //en/disables the date picker
    pickTime: true,                 //en/disables the time picker
    useMinutes: true,               //en/disables the minutes picker
    useSeconds: true,               //en/disables the seconds picker
    useCurrent: true,               //when true, picker will set the value to the current date/time     
    minuteStepping:1,               //set the minute stepping
    minDate: moment({y: 1900}),
    maxDate: moment().add(100, 'y'), 
    showToday: true,                 //shows the today indicator
    language:'en',                  //sets language locale
    defaultDate:"",                 //sets a default date, accepts js dates, strings and moment objects
    disabledDates:[],               //an array of dates that cannot be selected
    enabledDates:[],                //an array of dates that can be selected
    icons : {
        time: 'icon-time',
        date: 'icon-calendar',
        up:   'icon-caret-up',
        down: 'icon-caret-down'
    },
    useStrict: false,               //use "strict" when validating dates  
    sideBySide: false,              //show the date and time picker side by side
    daysOfWeekDisabled:[],          //for example use daysOfWeekDisabled: [0,6] to disable weekends 
    collapse: true,
    format: 'YYYY-MM-DD hh:mm:ss'
};



