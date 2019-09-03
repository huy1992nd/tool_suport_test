var $oTable;
var $startdatetime = '';
var $enddatetime = '';
$(function(){
	
	$('.optional_params_panel').hide();
	$('#adminname').select2({
		  placeholder: translate.select_admin,
		  allowClear: true
	});
	
	$('#adminname').change(function(){
			$.ajax({
			    type: "POST",
			    url: site_url + "admin/prepaidcard_management/ajax/get_prepaid_cards",
			    data: {
			    	'adminname': $(this).val()
			    },
			    success: function(result) {
		    		var dataSet = result.tabular.data;
					var colnames = result.tabular.colnames;
					
					if(dataSet.length>0){

						if ( $.fn.dataTable.isDataTable( '#tbl_pc_list' ) ) {
							$('#tbl_pc_list').dataTable().fnClearTable(); 
							$('#tbl_pc_list').dataTable().fnDestroy();
							$("thead", $oTable).remove();
							
							$oTable = $('#tbl_pc_list').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "scrollX": false,
						        "columnDefs": [
					                       { "visible": true, "targets": [0], "searchable": false, "sortable": false }
					                       ],
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    }
								,"dom": 'T<"clear">lfrtip'
								,"drawCallback": function( settings ) {
							    }
						    });
							
						}
						else{
							$oTable = $('#tbl_pc_list').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "scrollX": false,
						        "columnDefs": [
						                       { "visible": true, "targets": [0], "searchable": false, "sortable": false }
						                   ],
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    }
								,"dom": 'T<"clear">lfrtip'
								,"drawCallback": function( settings ) {
									
							    }
						    });
							
						}
						
						
						$options = '<select id="toggle_columns" class="combobox multiselect" multiple="multiple">';
						$.each(colnames, function(o, e){
							$options += "<option value='"+o+"' selected='selected'>"+e.title+"</option>";
						})
						$options += "</select>";

						$("#div_toggle_columns").html($options);
						
						$('#toggle_columns').multiselect({
					        includeSelectAllOption: false,
					        enableFiltering: true,
					        maxHeight: 150,
							buttonWidth: '300px',
							disableIfEmpty: true,
							enableCaseInsensitiveFiltering: true,
							onChange: function(element, checked){
								var column = $oTable.api().column($(element).val());
						        column.visible( ! column.visible() );
						        $oTable.width('auto')
							},
							buttonText: function(options, select) {
								return translate.show_hide_columns;
				            }
						});
					 }
					 else{
						 if ($.fn.dataTable.isDataTable( '#tbl_pc_list' ) ) {
							 $('#tbl_pc_list').dataTable().fnClearTable(); 
							 $('#tbl_pc_list').dataTable().fnDestroy();
							 $('#tbl_pc_list').html('');

						 }
						 else{
							 $('#tbl_pc_list').html('');
						 }
						 $("#div_toggle_columns").html('');
					 }
					 $("#div_toggle_columns").show();
		    	}
			});
	}).trigger('change');
	
	
	
	$('#createform').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		var btn = $(".btn-addpcsubmit");
		btn.button('loading');
		
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/prepaidcard_management/ajax/process_action",
		    data: {
		    	'params': $params,
		    	'action': 'create'
		    },
		    success: function(result) {

		    	var $error = translate.error + ": ";
		    	var $errorcode = translate.error_code + ": ";
		    	if('result' in result.result){
		    		alert(result.result.result.result);
		    	}
		    	else{
		    		if(typeof result.result.error =='object'){
		    			$.each(result.result.error, function(obj, ele){
		    				$error += obj;
		    				$.each(ele, function(a, b){
		    					$error += "\n" + a + ": " + b;
		    				})

		    			})
		    			$errorcode += (result.result.errorcode);
		    		}
		    		else{
		    			$error += result.result.error;
		    			$errorcode += result.result.errorcode;
		    		}
		    		
		    		alert($error + "\n" + $errorcode);
		    	}
				btn.button('reset');
		    }
		})
	});
	
	$('#masscreateform').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		var btn = $(".btn-massaddpcsubmit");
		btn.button('loading');
		var $adminname = '';
		var $alert = '';
		var $error_alert = '';
		var $count = 0;
		var $create_success_count = 0;
		var $create_failed_count = 0;
		
		if($('#masscreateform input[name=adminname]').length){
			$adminname = $('#masscreateform input[name=adminname]').val();
		}
		else{
			$adminname = $('#masscreateform select[name=adminname]').val();
		}
		
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/prepaidcard_management/ajax/process_action",
		    data: {
		    	'params': $params,
		    	'quantity': $('input[name=quantity]').val(),
		    	'adminname': $adminname,
		    	'action': 'masscreate'
		    },
		    success: function(result) {
		    	
		    	var $error = translate.error + ": ";
		    	var $errorcode = translate.error_code + ": ";
		    	var $create_success = false;
		    	
		    	
		    	if(result.result != null){
		    		if('result' in result.result){
			    		$count = result.result.result.length;
			    		if($count>0){
			    			$.each(result.result.result, function($x, $y){
			    				if('result' in $y){
			    					if($y['result']['result']){
				    					if($y['result']['result'] && $y['result']['result']=='Create OK'){
					    					$create_success_count++;
					    				}
					    				else{
					    					$create_failed_count++;
					    				}
				    				}
			    					$create_success = true;
			    				}
			    				else{
			    					$error_alert = 'Error: ' + $y['error'] + "\n" + 'Error Code: ' + $y['errorcode'];  
			    				}
			    				
			    				
			    			});
			    		}
			    		if($create_success){
			    			$alert += $create_success_count + translate.prepaid_card_successfully_created + '\n';
				    		$alert += $create_failed_count + translate.prepaid_card_failed;
				    		alert($alert);
			    		}
			    		else{
			    			alert($error_alert);
			    		}
			    		
			    	}
			    	else{
			    		
			    		if(typeof result.result.error =='object'){
			    			$.each(result.result.error, function(obj, ele){
			    				$error += obj;
			    				$.each(ele, function(a, b){
			    					$error += "\n" + a + ": " + b;
			    				})

			    			})
			    			$errorcode += (result.result.errorcode);
			    			
			    		}
			    		else{
			    			$error += result.result.error;
			    			$errorcode += result.result.errorcode;

			    		}
			    		
			    		alert($error + "\n" + $errorcode);
			    	}
		    	}
		    	else{
		    		/* returned null */
		    	}
		    	
				btn.button('reset');
				
		    }
		})
		
	})
	
	$('#tmpformfields').hide();
		
	
	$('#pc-add-modal, #pc-mass-add-modal').on('hidden.bs.modal', function (e) {
		$('#adminname').trigger('change');
	});
	
	
	$('#pcofform').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		var $action = $('#pc_action').val();
		var btn = $("#btn_pc_of");
		btn.button('loading');
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/prepaidcard_management/ajax/process_action",
		    data: {
		    	'action': $action,
		    	'params': $params
		    },
		    success: function(result) {
		    	btn.button('reset');
		    	var $alert = '';
		    	$.each(result.result, function($obj, $ele){
		    		
		    		$.each($ele, function($a, $b){
		    			if('result' in $b){
		    				if('error' in $b['result']){
		    					$alert += 'CARDNUMBERACTIVATE: ' + $b['result']['cardnumberactivate'] + '-' + ' \nERROR: ' +  $b['result']['error'] + ' \nERRORCODE: ' +  $b['result']['errorcode'] +  '\n\n';
		    				}
		    				else{
		    					$alert += 'CARDNUMBERACTIVATE: ' + $b['result']['cardnumberactivate'] + '-' + ' \nRESULT: ' +  $b['result']['result'] + '\n\n';
		    				}
			    		}
			    		else{
			    			$alert += 'CARDNUMBERACTIVATE: ' + $b['cardnumberactivate'] + '-' + ' \nERROR: ' +  $b['error'] + ' \nERRORCODE: ' + $b['errorcode'] + '\n\n';
			    		}
		    		})
		    		
		    		
		    	})
		    	alert($alert);

		    }
		});
	});
		
	$("#card").flip();
});

function add_pc(){
	$('.mass_add_pc_params').html('');
	var $adminname = $('select[name=adminname]').val();
	
	$.ajax({
	    type: "POST",
	    url: site_url + "admin/prepaidcard_management/ajax/get_params",
	    data: {
	    	'action': 'create'
	    },
	    success: function(result) {
	    	var $select = "";
	    	$select += '<select class="form-control" name="adminname" id="adminname" style="width: 100%;" required="required">';
	    	$select += '<option></option>';
	    	if(result.admin_list){
	    		$.each(result.admin_list, function(obj, ele){
	    			$select += '<optgroup label="'+obj+'">';
	    			$.each(ele, function(a, b){
	    				$select += '<option value="'+b.adminname+'">'+b.adminname+'</option>'
	    			})
	    			$select += '</optgroup>';
	    		})
	    			
	    	}
	    	$select += '</select>';
	    	
	    	$('.add_pc_params').html(result.action_fields);
	    	
    		$( ".add_pc_params input[name=datestarted]" ).datetimepicker({
    			mask: false,
    			timepicker:false,
	    		format: 'Y-m-d',
	    		onChangeDateTime:function(dp,$input){
	    		}
    		});
    		
    		$( ".add_pc_params input[name=dateexpired]" ).datetimepicker({
    			mask: false,
    			timepicker:false,
	    		format: 'Y-m-d',
	    		onChangeDateTime:function(dp,$input){

	    		}
    		});
    		
    		if($adminname!=''){
	    		$('input[name=adminname]').val($adminname);
	    		$('input[name=adminname]').prop('readonly', true);
	    	}
	    	else{
	    		$('input[name=adminname]').replaceWith($select);
	    	}
    		$('select[name=adminname]').select2({
    			  placeholder: translate.select_admin,
    			  allowClear: true
    		});
    		
   		
    		$('#pc-add-modal').modal('show');
	    	
		}
	});
	
}


function mass_add_pc(){

	$('.mass_add_pc_params').html('');
	var $adminname = $('select[name=adminname]').val();
	
	$.ajax({
	    type: "POST",
	    url: site_url + "admin/prepaidcard_management/ajax/get_params",
	    data: {
	    	'action': 'create'
	    },
	    success: function(result) {
	    	var $select = "";
	    	var $quantity = "";
	    	$select += '<select class="form-control" name="adminname" id="adminname" style="width: 100%;" required="required">';
	    	$select += '<option></option>';
	    	if(result.admin_list){
	    		$.each(result.admin_list, function(obj, ele){
	    			$select += '<optgroup label="'+obj+'">';
	    			$.each(ele, function(a, b){
	    				$select += '<option value="'+b.adminname+'">'+b.adminname+'</option>'
	    			})
	    			$select += '</optgroup>';
	    		})
	    			
	    	}
	    	$select += '</select>';
	    	
	    	$quantity += '<div class="control-group">';
	    	$quantity += '<div class="col-md-6">';
	    	$quantity += '<label for="quantity" class="control-label" style="word-wrap: break-word;">'+translate.quantity+'</label>';
	    	$quantity += '</div>';
	    	$quantity += '<div class="col-md-6">';
	    	$quantity += '<div class="form-group">';
	    	$quantity += '<input type="text" name="quantity" value="" id="quantity" class="forms_field parsley-validated form-control" required="required">';
	    	$quantity += '</div>';
	    	$quantity += '</div>';
	    	$quantity += '</div>';
	    	
	    	$('.mass_add_pc_params').html(result.action_fields);
	    	$('.mass_add_pc_params').append($quantity);
	    	
	    	
    		$( ".mass_add_pc_params input[name=datestarted]" ).datetimepicker({
    			mask: false,
    			timepicker:false,
	    		format: 'Y-m-d',
	    		onChangeDateTime:function(dp,$input){
	    		}
    		});
    		
    		$( ".mass_add_pc_params input[name=dateexpired]" ).datetimepicker({
    			mask: false,
    			timepicker:false,
	    		format: 'Y-m-d',
	    		onChangeDateTime:function(dp,$input){

	    		}
    		});
    		
    		if($adminname!=''){
	    		$('input[name=adminname]').val($adminname);
	    		$('input[name=adminname]').prop('readonly', true);
	    	}
	    	else{
	    		$('input[name=adminname]').replaceWith($select);
	    	}
    		$('select[name=adminname]').select2({
    			  placeholder: translate.select_admin,
    			  allowClear: true
    		});
    		
    		$('input[name=quantity]').numeric();
    		$('input[name=amount]').numeric();
    		
    		$('#pc-mass-add-modal').modal('show');
	    	
		}
	});
	

}

function refund(){
	$adminname = $('select[name=adminname]').val();
	$params = [{name: 'adminname', value: $adminname}];
	var $alert = '';
	
	if($adminname==''){
		alert(translate.please_select_admin);
	}
	else{
		if(confirm(translate.refund_from_this_admin)){
			
			$.ajax({
			    type: "POST",
			    url: site_url + "admin/prepaidcard_management/ajax/process_action",
			    data: {
			    	'params': $params,
			    	'action': 'refund'
			    },
			    success: function(result) {

			    	var $error = "Error: ";
			    	var $errorcode = "Error code: ";
			    	
			    	if('result' in result.result){
			    		$.each(result.result, function($x, $y){
			    			$.each($y, function($k, $v){
			    				$alert += 'CARDNUMBER: ' + $v['CARDNUMBER'] + ' RESULT: ' + $v['result']['result'] + '\n';
			    			})
			    			
			    		})
			    		
			    		alert($alert);
			    	}
			    	else{
			    		if(typeof result.result.error =='object'){
			    			$.each(result.result.error, function(obj, ele){
			    				$error += obj;
			    				$.each(ele, function(a, b){
			    					$error += "\n" + a + ": " + b;
			    				})

			    			})
			    			$errorcode += (result.result.errorcode);
			    		}
			    		else{
			    			$error += result.result.error;
			    			$errorcode += result.result.errorcode;
			    		}
			    		
			    		alert($error + "\n" + $errorcode);
			    	}
					
			    }
			})
		}
	}
}

function showcard($id){
	$("#tbl_pc_list tbody").on("click", "td", function(event){
	    var $btn = $(this).index();
	    var $cardnumber = $(this).siblings("td:eq(1)").text();
	    var $cardnumberactivate = $(this).siblings("td:eq(2)").text();
	    var $pinactivate = $(this).siblings("td:eq(4)").text();
	    var $currency = $(this).siblings("td:eq(5)").text();
	    var $amount = $(this).siblings("td:eq(6)").text();
	    var $dateexpired = $(this).siblings("td:eq(11)").text();
	    if($btn==1){
	    	$('#cardnumberactivate').html($cardnumberactivate);
	    	$('#pinactivate').html($pinactivate);
	    	$('#currency').html($currency);
	    	$('#amount').html($amount);
	    	$('#dateexpired').html($dateexpired);
	    	
	    	$('#view-prepaid-card-modal').modal('show');
	    	
	    }
	    
	});
}

function process_action($action){
	if ( $.fn.dataTable.isDataTable( '#tbl_pc_list' ) ) {
		var params = $('input[name=chkbox_pc]:checked', $oTable.fnGetNodes() );
		var $params = [];
		$.each(params, function(o, e){
			$params.push($(e).data('pcparams'));
		})
		
		
		if($params.length >0){

			$('#pcOfModalLabel').html($action);
			
			if($action=='cancel' || $action=='freeze' || $action=='unfreeze'){
	    		if(confirm('Are you sure you want to ' + $action + ' selected prepaid cards?')){
	    			$.ajax({
	    			    type: "POST",
	    			    url: site_url + "admin/prepaidcard_management/ajax/process_action",
	    			    data: {
	    			    	'action': $action,
	    			    	'params': $params
	    			    },
	    			    success: function(result) {
	    			    	var $result = '';
	    			    	var $tmpresult = '';
	    			    	var $i = 0;
	    			    	if('result' in result){
	    			    		$.each($params, function($c, $d){
	    			    			$.each(result.result, function($a, $b){
	    			    				
	    			    				if('result' in $b[$i]){
	    			    					$result += 'Cardnumber: ' + $b[$i].CARDNUMBER + '\n' + 'Result: ' + $b[$i].result + '\n\n';
	    			    				}
	    			    				else{
	    			    					$result += 'Cardnumber: ' + $params[$i].cardnumber + '\n' + 'Error: ' + $b[$i].error + '\nErrorcode: ' + $b[$i].errorcode  + '\n\n';
	    			    				}
	        			    		});
	    			    			$i++;
	    			    		})
	    			    		
	    			    	}
	    			    	else{
	    			    		
	    			    		$.each(result, function($a, $b){
	    			    			$cardnumber = $b.url.split('/').pop();
	    			    			if('result' in $b.result){
	    			    				$result += 'Cardnumber: ' + $b.result.result.CARDNUMBER + '\nResult: ' + $b.result.result.result + "\n\n";
	    			    			}
	    			    			else{
	    			    				$result += 'Cardnumber: ' + $cardnumber  + '\nError: ' + $b.result.error + ' \n' + 'Error Code: ' + $b.result.errorcode + "\n\n";
	    			    			}
	    			    		})
	    			    	}
	    			    	alert($result);
	    			    	$('#adminname').trigger('change');
	    			    }
	    			})
	    		}
	    	}
			else{
				$.ajax({
				    type: "POST",
				    url: site_url + "admin/prepaidcard_management/ajax/get_action_fields",
				    data: {
				    	'action': $action,
				    	'params': $params
				    },
				    success: function(result) {
				    	
				    	$('#tmpformfields').html(result.action_fields);
				    	if($action=='activate'){
				    		var $cardnumberactivate = '';
							var $pinactivate = '';
							var $playername = '';
							
							var $tbody = "";
					    	var $colcount = 0;
					    	var $thead = '';
					    	
					    	if($('#tmpformfields input[name=cardnumberactivate]').length){
				    			$thead += '<th>'+translate.cardnumber_activate+'</th>';
				    			$colcount ++;
				    		
				    		}
				    		if($('#tmpformfields input[name=pinactivate]').length){
				    			$thead += '<th>'+translate.pin_activate+'</th>';
				    			$colcount ++;
				    		
				    		}

				    			$thead += '<th>'+translate.playername+'</th>';
				    		
				    		var $i=0;
				    		$.each($params, function(o, e){
				    			$i++;
								$tbody += '<tr>';
								if($('#tmpformfields input[name=cardnumberactivate]').length){
									$tcardnumberactivate = $('#tmpformfields input[name=cardnumberactivate]').clone(true).prop({ id: e.cardnumber+"__cardnumberactivate", name: e.cardnumber+"__cardnumberactivate"});
									$($tcardnumberactivate).attr('value', e.cardnumberactivate);
									$($tcardnumberactivate).attr('readonly', 'readonly');
									$tbody += '<td>'+$tcardnumberactivate[0].outerHTML+'</td>';
					    		};
					    		if($('#tmpformfields input[name=pinactivate]').length){
					    			$tpinactivate = $('#tmpformfields input[name=pinactivate]').clone().prop({ id: e.cardnumber+"__pinactivate", name: e.cardnumber+"__pinactivate"});
					    			$($tpinactivate).attr('value', e.pinactivate);
					    			$($tpinactivate).attr('readonly', 'readonly');
					    			$tbody += '<td>'+$tpinactivate[0].outerHTML+'</td>';
					    		
					    		};
					    		if($('#tmpformfields input[name=playername]').length){
					    			$tplayername = $('#tmpformfields input[name=playername]').clone().prop({ id: e.cardnumber+"__playername", name: e.cardnumber+"__playername"});
					    			$($tplayername).attr('value', e.playername);
					    			$tbody += '<td>'+$tplayername[0].outerHTML+'</td>';
					    		
					    		};
					    		
								$tbody += '</tr>';
							})
							
							var $paramstable = '<table class="table table-striped">';
				    			$paramstable += '<thead>';
				    			$paramstable += '<tr>';
				    			$paramstable += $thead;
				    			$paramstable += '</tr>';
				    			$paramstable += '</thead>';
				    			$paramstable += '<tbody>';
				    			$paramstable += $tbody; 
				    			$paramstable += '</tbody>';
				    			$paramstable += '</table>';
				    		
				    		$('#pc-of-modal .paramstable').html($paramstable)
				    		$('#pc_action').val($action);
				    		
				    	}
				    	
				    	$('#pc-of-modal').modal('show');
				    		
			    	}
				});
			}
			
			
		}
		else{
			alert(translate.please_select_prepaid_cards_on_the_list);
		}
	}
	else{
		alert(translate.no_prepaid_card_selected);
	}
	

}


$(document).on({
	 ajaxStart: function() { $('#loading-indicator').show();},
	 ajaxStop: function() { $('#loading-indicator').hide(); }    
});