var $oTable;
var $startdatetime = '';
var $enddatetime = '';
$(function(){
	
	$('.optional_params_panel').hide();
	$('#select-brand-structure-id').select2({
		  placeholder: translate.select_entity,
		  allowClear: true
	});
	
	$('#select-brand-structure-id').change(function(){
		if($(this).val()){
			$.ajax({
			    type: "POST",
			    url: site_url + "admin/rolling_management/ajax/get_action_params",
			    data: {
			    	'action': 'list'
			    },
			    success: function(result) {
			    	$('.rolling_parameters').html(result.action_fields);
		    		
		    		$( "input[name=entityname]" ).prop('disabled', true);
		    		$( "input[name=entityname]" ).parent().parent().parent().hide();
		    	
		    		$( "input[name=startdate]" ).datetimepicker({
			    		mask: true,
			    		format: 'Y-m-d H:i'
	                });
		    		$( "input[name=enddate]" ).datetimepicker({
			    		mask: true,
			    		format: 'Y-m-d H:i'
	                });
			    	
		    		$('.optional_params_panel').show();
				}
			});
		}
		$('.rolling_table').hide();
	}).trigger('change');
	
	
	$('#rollcomform').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		var $action = $('#rc_action').val();
		var $brand_structure_id = $("select[name=brand_structure_id]").val();
		var btn = $("#btn-rollcomform-submit");
		btn.button('loading');
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/rolling_management/ajax/process_action",
		    data: {
		    	'action': $action,
		    	'brand_structure_id': $brand_structure_id,
		    	'params': $params,
		    	'entityname': $("select[name=brand_structure_id] option:selected").text()
		    },
		    success: function(result) {
		    	btn.button('reset');
		    	$('#rc-fields-modal').modal('hide');
				 $('.div_rcresult').html(result[0]);
				 $('#rc-result-modal').modal('show'); 
		    }
		});
	});
	
	$('#rolling_commission_form').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		var $action = 'list';
		var $brand_structure_id = $("select[name=brand_structure_id]").val();
		var $include_expired_rc = $('#include_expired_rc').is(':checked') ? 1 : 0;
		
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/rolling_management/ajax/process_action",
		    data: {
		    	'action': $action,
		    	'brand_structure_id': $brand_structure_id,
		    	'params': $params,
		    	'entityname': $("select[name=brand_structure_id] option:selected").text(),
		    	'include_expired_rc': $include_expired_rc
		    },
		    success: function(result) {
		    	$('#tbl_rolling_list').html('');
		    	$('.rolling_table').show();
				$('.rolling_non_table').hide();
		    	if(result.data.result.hasOwnProperty('error')){
		    		$('#tbl_rolling_list').html(result.data.result.error);
		    		$('#btn_add').hide();
		    		$('#rc_buttons').hide();
		    	}
		    	else{
		    		if($action=='list'){
			    		var dataSet = result.tabular.data;
						var colnames = result.tabular.colnames;
						
						$('#btn_add').show();
						if(dataSet.length>0){

							if ( $.fn.dataTable.isDataTable( '#tbl_rolling_list' ) ) {
								$('#tbl_rolling_list').dataTable().fnClearTable(); 
								$('#tbl_rolling_list').dataTable().fnDestroy();
								$("thead", $oTable).remove();
								
								$oTable = $('#tbl_rolling_list').dataTable({
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
								$oTable = $('#tbl_rolling_list').dataTable({
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
					                return 'Show/Hide Columns';
					            }
							});
							
							$('#rc_buttons').show();
						 }
						 else{
							 if ($.fn.dataTable.isDataTable( '#tbl_rolling_list' ) ) {
								 $('#tbl_rolling_list').dataTable().fnClearTable(); 
								 $('#tbl_rolling_list').dataTable().fnDestroy();
								 $('#tbl_rolling_list').html(translate.no_data_found);

							 }
							 else{
								 $('#tbl_rolling_list').html(translate.no_data_found);
							 }
							 $("#div_toggle_columns").html('');
							 $('#rc_buttons').hide();
						 }
						 $("#div_toggle_columns").show();
			    	}
		    	}
		    	
		    	
			}
		});
	});
	
	
	$('#tmpformfields').hide();
	
	$('#btn_add_rc').hide();
	
	$('select[name=rolling_action]').change(function(){
		var $action = $(this).val();
		$('.rolling_table').hide();
		$('.rolling_non_table').hide();
		
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/rolling_management/ajax/get_action_params",
		    data: {
		    	'action': $action
		    },
		    success: function(result) {
		    	
		    	$('.rolling_parameters').html(result.action_fields);
	    		$('.paramstable').html('')
	    		
		    	if($action=='list'){
		    		$( "input[name=entityname]" ).prop('disabled', true);
		    		$( "input[name=entityname]" ).parent().parent().parent().hide();
		    		
		    		$( "input[name=startdate]" ).datetimepicker({
		    			mask: true,
			    		format: 'Y-m-d H:i'
	                });
		    		$( "input[name=enddate]" ).datetimepicker({
		    			mask: true,
			    		format: 'Y-m-d H:i'
	                });
		    		
		    	}
		    	
			}
		});
		
	}).trigger('change');
	
	
	$('#frm_rc_list').submit(function(e){
		e.preventDefault();
		var $params = $(this).serializeArray();
		var $action = $("select[name=rolling_action]").val();
		var $brand_structure_id = $("select[name=brand_structure_id]").val();
		
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/rolling_management/ajax/process_action",
		    data: {
		    	'action': $action,
		    	'brand_structure_id': $brand_structure_id,
		    	'params': $params,
		    	'entityname': $("select[name=brand_structure_id] option:selected").text()
		    },
		    success: function(result) {
		    	$('#tbl_rolling_list').html('');
		    	if($action=='list'){
		    		var dataSet = result.tabular.data;
					var colnames = result.tabular.colnames;
				
					$('.rolling_table').show();
					$('.rolling_non_table').hide();
					if(dataSet.length>0){

						if ( $.fn.dataTable.isDataTable( '#tbl_rolling_list' ) ) {
							$('#tbl_rolling_list').dataTable().fnClearTable(); 
							$('#tbl_rolling_list').dataTable().fnDestroy();
							$("thead", table).remove();
							
							$oTable = $('#tbl_rolling_list').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "scrollX": false,
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    }
								,"dom": 'T<"clear">lfrtip'
								,"drawCallback": function( settings ) {
							    }
						    });
							
						}
						else{
							$oTable = $('#tbl_rolling_list').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "scrollX": false,
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
				                return 'Show/Hide Columns';
				            }
						});
						
					 }
					 else{
						 if ($.fn.dataTable.isDataTable( '#tbl_rolling_list' ) ) {
							 $('#tbl_rolling_list').dataTable().fnClearTable(); 
							 $('#tbl_rolling_list').dataTable().fnDestroy();
							 $('#tbl_rolling_list').html(translate.no_data_found);

						 }
						 else{
							 $('#tbl_rolling_list').html(translate.no_data_found);
						 }
						 $("#div_toggle_columns").html('');
					 }
					 $("#div_toggle_columns").show();
		    	}
		    	
			}
		});
	});
	
	
	$("#rc-add-form").on('submit', function(e){
		e.preventDefault();
		var btn = $(".btn-addrcsubmit");
		btn.button('loading');
		
		var $params = $("#rc-add-form").serializeArray();
		var $brand_structure_id = $("select[name=brand_structure_id]").val();
		var $entityname = $("select[name=brand_structure_id] option:selected").text();
		
		$.ajax({
			 type: "POST",
			 url: site_url + "admin/rolling_management/ajax/process_action",
			 data: {
				'action': 'add',
		 		'brand_structure_id': $brand_structure_id,
		    	'params': $params,
		    	'entityname': $entityname
			 },
			 success: function(result){
				 btn.button('reset');
				 $('#rc-add-modal').modal('hide');
				 $('.div_rcresult').html(result[0]);
				 $('#rc-result-modal').modal('show'); 
				 
			 }
		});
		
	})


	$(".btn-addrcsubmit").click(function(){
		$("#btn-submit-addrc").click();
	});
	
	
	$('#rc-result-modal').on('hidden.bs.modal', function (e) {
		$startdatetime = '';
		$enddatetime = '';
		$('#btn-submit-list').submit();
	})
		
});

function add_rc(){
	$("#rc_thead").html('');
	$("#rc_tbody").html('');
	$('#btn_add_rc').hide();
	$('.add_rc_params').html('');
	
	$.ajax({
	    type: "POST",
	    url: site_url + "admin/rolling_management/ajax/get_action_params",
	    data: {
	    	'action': 'add'
	    },
	    success: function(result) {
	    	var $gamelist = '';
	    			    	
	    	var $select = "<select class='form-control' id='gamelist' name='gametype' multiple='multiple' size='5'>";
	    	
	    		$.each(result.gamelist, function(obj, ele){
	    			$select += "<option value='"+ele.game_code+"'>"+ele.game_name+"</option>";	
	    		})
	    	 	$select += "</select>";
	    		
	    		$gamelist += '<div class="control-group">';
	    		$gamelist += '<div class="col-md-6">';
	    		$gamelist += '<label for="gametype" class="control-label" style="word-wrap: break-word;">'+translate.game_type+'</label>';
	    		$gamelist += '</div>';
	    		$gamelist += '<div class="col-md-6">';
	    		$gamelist += '<div class="form-group">';
	    		$gamelist += $select;
	    		$gamelist += '</div>';
	    		$gamelist += '</div>';
	    		$gamelist += '</div>';
	    		
                
	    	$('.add_rc_params').html(result.action_fields);
    		$('input[name=gametype]').parent().parent().parent().hide();
    		
    		$( ".add_rc_params input[name=startdate]" ).datetimepicker({
    			mask: true,
	    		format: 'Y-m-d H:i',
	    		onChangeDateTime:function(dp,$input){
	    		    $startdatetime = $input.val();
	    		    
	    		}
    		});
    		$( ".add_rc_params input[name=enddate]" ).datetimepicker({
    			mask: true,
	    		format: 'Y-m-d H:i',
	    		onChangeDateTime:function(dp,$input){
	    		    $enddatetime = $input.val();
	    		}
    		});
    		
    		$('.add_rc_params').append($gamelist);
    		$('#rc-add-fields').html('')
    		
    		
    		
    		var $colcount = 1;
    		var $thead = "<tr>";
    		$thead += '<th>' +translate.game_type+'</th>';
    		if($('#player_viplevel').length){
    			$thead += '<th>'+translate.vip_level+'</th>';
    			$colcount ++;
    		}
    		
    		if($('#playercommission').length){
    			$thead += '<th>'+translate.commission+'</th>';
    			$colcount ++;
    		
    		}
    		if($('#playercommissiontype').length){
    			$thead += '<th>'+translate.commission_type+'</th>';
    			$colcount ++;
    		
    		}
    		if($('#startdate').length){
    			$thead += '<th>'+translate.start_date+'</th>';
    			$colcount ++;
    		
    		}
    		if($('#enddate').length){
    			$thead += '<th>'+translate.end_date+'</th>';
    			$colcount ++;
    		
    		}
    		$thead += "</tr>";
    		
    		$('#gamelist').multiselect({
	            includeSelectAllOption: false,
	            enableFiltering: true,
	            maxHeight: 150,
	    		buttonWidth: '100%',
	            buttonClass: 'form-control',
	            nonSelectedText: 'Select Game',
	    		disableIfEmpty: true,
	    		enableCaseInsensitiveFiltering: true,
	    		onChange: function(element, checked){
	    			var $game_types = $('#gamelist option:selected');
	    			var $selected_games = [];
	    	        $($game_types).each(function(obj, ele){
	    	        	$selected_games.push($(this).val());
	    	        });

	    	        var $current_game_type_list = [];
	    	   
	    	        $('#rc-add-form *').filter(':input').each(function(o, e){
	    	        	if(e.name=='gametype'){
	    	        		$current_game_type_list.push(e.value);
	    	        	}
					});
	    	        
	    	        var $current_gt_count = $current_game_type_list.length;
	    	        var $selected_games_count = $selected_games.length;
	    	        
		    		var $tbody = "";
		    		var $pviplevel = "";
		    		var $playercommission = "";
		    		var $playercommissiontype = "";
		    		var $startdate = "";
		    		var $enddate = "";
		    		if ($selected_games.length === 0) {
		    			$('#rc_tbody').html('');
		    			$('#btn-submit').hide();
		    			$('#btn_add_rc').hide();
	    			}
	    			else{
	    				$('#btn_add_rc').show();
	    				if($selected_games_count>$current_gt_count){
	    				
	    					$('#rc_thead').html($thead);
	    					
	    					$.each($selected_games, function(o, e){
	    						
	    						if($.inArray(e, $current_game_type_list)>=0){

	    						}
	    						else{

	    							$tbody += '<tr>';
	    	    					$tbody += '<td><input class="form-control" name="gametype" value='+e+' style="width: 150px" readonly="readonly"></td>';
	    	    					if($('#player_viplevel').length){
	    	    						$pviplevel = $('#player_viplevel').clone().prop({ id: e+"__player_viplevel", name: e+"__player_viplevel"});
	    	    						$($pviplevel[0]).val($('input[name=player_viplevel]').val());
	    	    						$tbody += '<td>'+$pviplevel[0].outerHTML+'</td>';
	    	    						
	    				    		}
	    				    		if($('#playercommission').length){
	    				    			$playercommission = $('#playercommission').clone().prop({ id: e+"__playercommission", name: e+"__playercommission"});
	    				    			$($playercommission[0]).val($('input[name=playercommission]').val());
	    				    			$tbody += '<td>'+$playercommission[0].outerHTML+'</td>';
	    				    		
	    				    		}
	    				    		if($('#playercommissiontype').length){
	    				    			$playercommissiontype = $('#playercommissiontype').clone().prop({ id: e+"__playercommissiontype", name: e+"__playercommissiontype"});
	    				    			$($playercommissiontype[0]).val($('select[name=playercommissiontype]').val());
	    				    			$tbody += '<td>'+$playercommissiontype[0].outerHTML+'</td>';
	    				    		}
	    				    		if($('#startdate').length){
	    				    			
	    				    			$startdate = '<div class="input-group date rc_date" id="'+e+'__startdate">';
	    				    			$startdate += '<input type="text" name="'+e+'__startdate" class="forms_field form-control">';
	    				    			$startdate += '<span class="input-group-addon"><span class="icon-calendar"></span>';
	    				    			$startdate += '</span>';
	    				    			$startdate += '</div>';
	    				    			
	    				    			$tbody += '<td>'+$startdate+'</td>';
	    				    			
	    				    			
	    				    		}
	    				    		if($('#enddate').length){
	    				    			$enddate = '<div class="input-group date rc_date" id="'+e+'__enddate">';
	    				    			$enddate += '<input type="text" name="'+e+'__enddate" class="forms_field form-control">';
	    				    			$enddate += '<span class="input-group-addon"><span class="icon-calendar"></span>';
	    				    			$enddate += '</span>';
	    				    			$enddate += '</div>';
	    				    			
	    				    			
	    				    			$tbody += '<td>'+$enddate+'</td>';
	    				    		}
	    	    					$tbody += '</tr>';	
	    							
	    	    					$('#rc_tbody').append($tbody);
	    	    					
	    	    					$("#" + e +"__player_viplevel").val($($pviplevel[0]).val());
	    	    					$("#" + e +"__playercommission").val($($playercommission[0]).val());
	    	    					$("#" + e +"__playercommissiontype").val($($playercommissiontype[0]).val());
	    	    					
	    	    					
	    	    					$("input[name=" + e +"__startdate]").datetimepicker({
	    	    						mask: true,
	    	    			    		format: 'Y-m-d H:i'
	    			                });
	    	    					$("input[name=" + e +"__startdate]").val($startdatetime);
	    	    					
	    	    					$("input[name=" + e +"__enddate]").datetimepicker({
	    	    						mask: true,
	    	    			    		format: 'Y-m-d H:i',
	    	    			    		defaultDate: $enddatetime
	    			                });
	    	    					$("input[name=" + e +"__enddate]").val($enddatetime);
	    	    					
	    						}
	    							
	    					});
	    				}
	    				else{
	    					
	    					$.each($current_game_type_list, function(o, e){
	    						if($.inArray(e, $selected_games)>=0){
	    						}
	    						else{
	    							$('input[name="gametype"][value="'+e+'"]').closest('tr').remove()
	    						}
	    						
	    					})
	    					
	    				}
	    			
	    				
	    				$('#btn-submit').show();
	    			}
			    	
		    		
	    		}
	    	});	
    		
    		
    	
    		$('#rc-add-modal').modal('show');
	    	
		}
	});
	
}

function process_action($action){
	var params = $('input[name=chkbox_rc]:checked', $oTable.fnGetNodes() );
	var $params = [];
	var $brand_structure_id = $("select[name=brand_structure_id]").val();
	var $entityname = $("select[name=brand_structure_id] option:selected").text();
	$.each(params, function(o, e){
		$params.push($(e).data('rcparams'));
	})
	
	
	if($params.length >0){
		$.ajax({
		    type: "POST",
		    url: site_url + "admin/rolling_management/ajax/get_action_fields",
		    data: {
		    	'action': $action,
		    	'brand_structure_id': $brand_structure_id,
		    	'params': $params,
		    	'entityname': $entityname
		    },
		    success: function(result) {
		    	$('#tmpformfields').html(result.action_fields);
		    	
		    	var $tbody = "";
	    		var $pviplevel = "";
	    		var $playercommission = "";
	    		var $playercommissiontype = "";
	    		var $startdate = "";
	    		var $enddate = "";
		    	var $colcount = 0;
		    	var $thead = '<th>'+translate.game_type+'</th>';
		    	
	    		if($('#tmpformfields input[name=player_viplevel]').length){
	    			$thead += '<th>'+translate.vip_level+'</th>';
	    			$colcount ++;
	    		
	    		}
	    		if($('#tmpformfields input[name=playercommission]').length){
	    			$thead += '<th>'+translate.commission+'</th>';
	    			$colcount ++;
	    		
	    		}
	    		if($('#tmpformfields select[name=playercommissiontype]').length){
	    			$thead += '<th>'+translate.commission_type+'</th>';
	    			$colcount ++;
	    		
	    		}
	    		if($('#tmpformfields input[name=startdate]').length){
	    			$thead += '<th>'+translate.start_date+'</th>';
	    			$colcount ++;
	    		
	    		}
	    		if($('#tmpformfields input[name=enddate]').length){
	    			$thead += '<th>'+translate.end_date+'</th>';
	    			$colcount ++;
	    		
	    		}
		    	
	    		var $i=0;
	    		$.each($params, function(o, e){
	    			$i++;
					$tbody += '<tr>';
					$tbody += '<td><input class="form-control" name="gametype" value='+e.gametype+' style="width: 150px" readonly="readonly"></td>';
					if($('#tmpformfields input[name=player_viplevel]').length){
						$pviplevel = $('#tmpformfields input[name=player_viplevel]').clone(true).prop({ id: e.gametype+"__player_viplevel", name: e.gametype+"__player_viplevel"});
						$($pviplevel).attr('value', e.player_viplevel);
						$tbody += '<td>'+$pviplevel[0].outerHTML+'</td>';
		    		}
		    		if($('#tmpformfields input[name=playercommission]').length){
		    			$playercommission = $('#tmpformfields input[name=playercommission]').clone().prop({ id: e.gametype+"__playercommission", name: e.gametype+"__playercommission"});
		    			$($playercommission).attr('value', e.playercommission);
		    			$tbody += '<td>'+$playercommission[0].outerHTML+'</td>';
		    		
		    		}
		    		if($('#tmpformfields select[name=playercommissiontype]').length){
		    			$playercommissiontype = $('#tmpformfields select[name=playercommissiontype]').clone().prop({ id: e.gametype+"__playercommissiontype", name: e.gametype+"__playercommissiontype"});
		    			
		    			$($playercommissiontype).find('option').each(function($a, $b){
		    				if($b.value==e.playercommissiontype){
		    					 $(this).attr("selected","selected");
		    				}
		    			
		    			});
		    			
		    			
		    			$tbody += '<td>'+$playercommissiontype[0].outerHTML+'</td>';
		    		}
		    		if($('#tmpformfields input[name=startdate]').length){
		    			
		    			$startdate = '<div class="input-group date rc_date" id="'+e.gametype+'__startdate">';
		    			$startdate += '<input type="text" name="'+e.gametype+'__startdate" value="'+e.startdate+'" class="forms_field form-control">';
		    			$startdate += '<span class="input-group-addon"><span class="icon-calendar"></span>';
		    			$startdate += '</span>';
		    			$startdate += '</div>';
		    			
		    			$tbody += '<td>'+$startdate+'</td>';
		    			
		    			
		    		}
		    		if($('#tmpformfields input[name=enddate]').length){
		    			$enddate = '<div class="input-group date rc_date" id="'+e.gametype+'__enddate">';
		    			$enddate += '<input type="text" name="'+e.gametype+'__enddate" value="'+e.enddate+'" class="forms_field form-control">';
		    			$enddate += '<span class="input-group-addon"><span class="icon-calendar"></span>';
		    			$enddate += '</span>';
		    			$enddate += '</div>';
		    			
		    			
		    			$tbody += '<td>'+$enddate+'</td>';
		    		}
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
	    		
	    		$('#rc-fields-modal .paramstable').html($paramstable)
	    		$('#rc_action').val($action);
	    		
	    		$.each($params, function(o, e){
	    			$( "input[name="+e.gametype+"__startdate" ).datetimepicker({
		    			mask: true,
			    		format: 'Y-m-d H:i'
	                });
	    			
	    			$( "input[name="+e.gametype+"__enddate" ).datetimepicker({
		    			mask: true,
			    		format: 'Y-m-d H:i'
	                });
	    		})
	    		
	    		
	    		if($action=='freeze' || $action=='remove' || $action=='unfreeze'){
	    			$('#rollcomform input').attr('readonly', 'readonly');
	    		}
	    		else{
	    			$('#rollcomform input').removeAttr('readonly');
	    		}
		    	
	    		if($action=='freeze'){
	    			$('#rcFieldsModalLabel').html(translate.freeze_rolling_commission);
	    			$('#btn-rollcomform-submit').html(translate.freeze);
	    		}
	    		if($action=='remove'){
	    			$('#rcFieldsModalLabel').html(translate.remove_rolling_commission);
	    			$('#btn-rollcomform-submit').html(translate.remove);
	    		}
	    		if($action=='set'){
	    			$('#rcFieldsModalLabel').html(translate.set_rolling_commission);
	    			$('#btn-rollcomform-submit').html(translate.update);
	    		}
	    		if($action=='unfreeze'){
	    			$('#rcFieldsModalLabel').html(translate.unfreeze_rolling_commission);
	    			$('#btn-rollcomform-submit').html(translate.unfreeze);
	    		}
	    		
	    		
		    	$('#rc-fields-modal').modal('show');
		    }
		});
	}
	else{
		alert(translate.please_select_rolling_commission_on_the_list);
	}

}


$(document).on({
	 ajaxStart: function() { $('#loading-indicator').show();},
	 ajaxStop: function() { $('#loading-indicator').hide(); }    
});