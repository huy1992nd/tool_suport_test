var table;
var _ajax = {
		params : {
					url: '',
					type: '',
					dataType: 'json',
					data: {}
				},
		is_valid_submission : false,
		exec : function(){
					if(this.is_valid_submission){
						$.ajax({
							url : this.params.url,
							type : this.params.type,
							data : this.params.data,
							dataType : this.params.dataType,
							success : this.customCallBack
						});
					}
		},
		customCallBack : function(data){
			var _msg = '';
			if(data.result){
				_msg += '<div class="alert alert-success alert-block fade in"><button type="button" class="close close-sm" data-dismiss="alert"> <i class="icon-remove"></i></button><h4> <i class="icon-ok-sign"></i> '+data.alerts.success+'! </h4>';
				_msg += '<p>'+data.alerts.viewdetails+'.</p>';
				_msg += '</div>';
				
				if(data.form_id=='report'){
					var dataSet = data.apitabulardata.data;
					 var colnames = data.apitabulardata.colnames;
					 if(dataSet.length>0){
						$('#tbl_report_result').html('');
						if ( $.fn.dataTable.isDataTable( '#tbl_report_result' ) ) {
							
							$('#tbl_report_result').dataTable().fnDestroy();
							table = $('#tbl_report_result').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "scrollX": true,
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    }
								,"dom": 'T<"clear">lfrtip'
						    });
						}
						else{
							table = $('#tbl_report_result').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "scrollX": true,
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    }
								,"dom": 'T<"clear">lfrtip'
						    });
						}
						
						
						$options = '<select id="toggle_columns" class="combobox multiselect" multiple="multiple">';
						$.each(colnames, function(o, e){
							$options += "<option value='"+o+"' selected='selected'>"+e.title+"</option>";
						})
						$options += "</select>";
						//console.log($options);
						$("#div_toggle_columns").html($options);
						
						$('#toggle_columns').multiselect({
					        includeSelectAllOption: false,
					        enableFiltering: true,
					        maxHeight: 200,
							buttonWidth: '300px',
							disableIfEmpty: true,
							enableCaseInsensitiveFiltering: true,
							onChange: function(element, checked){
								var column = table.api().column($(element).val());
						        column.visible( ! column.visible() );
							},
							buttonText: function(options, select) {
				                return 'Show/Hide Columns';
				            }
						});
					 }
					 else{
						 if ($.fn.dataTable.isDataTable( '#tbl_report_result' ) ) {
							 $('#tbl_report_result').dataTable().fnClearTable(); 
							 $('#tbl_report_result').dataTable().fnDestroy();
							 $('#tbl_report_result').html('-No Record Found');
						 }
						 else{
							 $('#tbl_report_result').html('-No Record Found');
						 }
						 
						 $("#div_toggle_columns").html('');
					 }
					 
					 $('#tabular_tab').show();
					 $('#tabular').show();
				}
				else{
					$('#tabular_tab').hide();
					$('#tabular').hide();
				}
				
				 
				
				
			}else{
				_msg += '<div class="alert alert-block alert-danger fade in"><button type="button" class="close close-sm" data-dismiss="alert"> <i class="icon-remove"></i> </button><strong>'+data.alerts.error+'!</strong><span>&nbsp;</span>';
				
				//if(typeof data.json_format == 'object'){
				if(typeof data == 'object'){
					//for(var i in data.json_format){
					_msg += '<p>' + data.error + '.</p><p>'+data.alerts.viewdetails+'</p>';
					//for(var i in data){
						//_msg += '<p>' + data.json_format[i] + '</p>';
						//_msg += '<p>' + i + ' : ' + data.json_format[i] + '</p>';
						//_msg += '<p>' + i + ' : ' + data[i] + '</p>';
					//}
				}
				else{
					//_msg += '<p>' + data.json_format + '</p>';
					_msg += '<p>' + data + '</p>';
				}
				
				_msg += '</div>';
			}
			$('#' + data.form_id).before(_msg);
			
			$("#console_response_url").html(data.url);
			$("#httpheader").html(data.header);
			$("#console_response").html("<span style='color: white'>" + JSON.stringify(data.result, null, 4)+ "</span>");
			//$("#raw_result").html(JSON.stringify(data));
			$("#console_response_readable").html(renderjson.set_show_to_level("all")(data.result));
			//$("#parsed").html(renderjson.set_show_to_level("all")(data));
			//$("#console_response").html("<span style='color: white'>" + JSON.stringify(data.json_format, null, 4)+ "</span>");
			//$("#console_response_readable").html("<span style='color: white'>" + JSON.stringify(data.json_format, null, 4) + "</span>");
			//$("#httpcode").html("<a href='http://en.wikipedia.org/wiki/List_of_HTTP_status_codes' title='Click to view list of entity codes \n and definitions.' id='httpcode' target='_blank'>" + data.httpcode + "</a>");
			//$("#httpcodedesc").html(data.httpdesc);
		},
		extractData: function(__this__){
			this.params.url = $(__this__).closest('form').attr('action');
			this.params.type = $(__this__).closest('form').attr('method');
			var _data = {};
			
			this.disableValidationForReport($(__this__).closest('form'));
			this.validateFields($(__this__).closest('form'));
			
			this.is_valid_submission = $($(__this__).closest('form')).parsley( 'validate' );
			
			$(__this__).closest('form').find('.forms_field').each(function(index,element){
				if($(element).attr('type') == 'radio'){
					if($(element).parent('label').hasClass('active'))
						_data[$(element).attr('name')] = $(element).val();
				}else{
					_data[$(element).attr('name')] = $(element).val();
				}
				
			});
			
			this.params.data = _data;
			
			//$('.btn-group').children('.parsley-error-list').appendTo('.btn-group');
		},
		validateFields : function(__form__){
			$(__form__).parsley({
				successClass: 'has-success',
				errorClass: 'has-error',
				errors: {
				classHandler: function(el) {
					/*if($(el).attr('type') == 'radio')
						return $(el).closest('.btn-group');
					else*/
						return $(el).closest('.form-group');
				},
				errorsWrapper: '<ul class=\"help-block list-unstyled\"></ul>',
				errorElem: '<li></li>'
				}
			}); 
		},
		submitForm : function(__this__){
			this.extractData(__this__);
			this.exec();
	   },
	   disableValidationForReport : function(__form__){
		   if($('select[name=timeperiod]').val() != 'specify'){
			   $('input[name=startdate]').attr('disabled', true);
			   $('input[name=enddate]').attr('disabled', true);
		   }else{
			   $('input[name=startdate]').attr('disabled', false);
			   $('input[name=enddate]').attr('disabled', false);
		   }
	   }
}


$(document).on({
	 ajaxStart: function() { $('#loading-indicator').show();},
	 ajaxStop: function() { $('#loading-indicator').hide(); }    
});

var disableEnterKey = function(evt) {
	var evt  = (evt) ? evt : ((event) ? event : null);
	var node = (evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
	if ((evt.keyCode == 13) && (node.type=="text")) { return false; }
}
document.onkeypress = disableEnterKey;


$(document).ready(function(){
	$('select[name=timeperiod]').change(function(){
		if($(this).val() != 'specify'){
		   $('input[name=startdate]').attr('disabled', true);
		   $('input[name=enddate]').attr('disabled', true);
	    }else{
		   $('input[name=startdate]').attr('disabled', false);
		   $('input[name=enddate]').attr('disabled', false);
	    }
	});
	
	$('#startdate').datetimepicker();
	$('#enddate').datetimepicker();
	$('#reportdate').datetimepicker();
	$('#datestarted').datetimepicker({format : 'YYYY-MM-DD'});
	$('#dateexpired').datetimepicker({format : 'YYYY-MM-DD'});
	$('#tabular_tab').hide();	
	$('#tabular').hide();
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
        format: 'YYYY-MM-DD HH:mm:ss'
    };