
$(function(){
	$("#accordion").hide();
	$("#btn-back").hide();
	
	var table;

	$("#btn_search").click(function(){
		var $btn = $("#btn_search");
		if($("#select-brand-structure-id").val()==null){
			alert(translate.please_select_entity);
		}
		else{
			if($("#search-playername").val()==''){
				alert('Player name should not be empty.');
			}
			else{
				search_player($("#search-playername").val());
			}
		}
	});
	
	
	$("#btn-display-all").click(function(){
		
		var $btn = $("#btn-display-all");
		if($("#select-brand-structure-id").val()==null){
			alert(translate.please_select_entity);
		}
		else{
			display_all();
		}
		
	});

	$("#btn-back").click(function(){
		$('#search_result_list').show();
		$('#search_result_info').hide();
		
		$("#div_toggle_columns").show();
		 $("#btn-back").hide();
		 $("#accordion").hide();
		 
		 $(this).hide();
		 display_all();
		 
	})
	
	
	$('#personal-info-form').submit(function(e){
		e.preventDefault();
		var $formdata = $(this).serializeArray();
		update_player($formdata, '0', 'dialog_container');
	});
	
	$("#btn_freeze").click(function(){
		var  $formdata = [{name: "frozen", value: "1"}];
		update_player($formdata, '1', 'dialog_container');
	})
	
	$("#btn_changepassword").click(function(){
		var $new_password = $("#playerinfo_newpassword").val();
		
		if($new_password!=""){
			var  $formdata = [{name: "password", value: $new_password}];
			update_player($formdata, '0', 'dialog_container_account_info');
		}
		else{
			alert(translate.please_enter_new_password);
			$("#playerinfo_newpassword").focus();
		}
		
		
	});
	
	$("#btn_updateviplevel").click(function(){
		var $viplevel = $("#playerinfo_viplevel").val();
		
		if($viplevel!=""){
			var  $formdata = [{name: "viplevel", value: $viplevel}];
			update_player($formdata, '0', 'dialog_container_account_info');
		}
		else{
			alert(translate.please_enter_vip_level);
			$("#playerinfo_viplevel").focus();
		}
		
		
	})
	
	$("#btn_reset_failed_login").click(function(){
		$.ajax({
			 type: "POST",
			 url: site_url + "admin/playermanagement/ajax/reset_failed_login",
			 data: {
			  "brand_structure_id": $("#select-brand-structure-id").val(),
			  "playername": $("#playerinfo_playername").html()
			 },
			 success: function(result, textStatus, jqXHR){
				$("#dialog_container").html(result.msg); 	
			 },
			 error: function(jqXHR, textStatus, errorThrown){
				
			 }
		});
	})
		
	
	//deposit
	$("#player-deposit-modal").on('hidden.bs.modal', function (e) {
		 $("#player-deposit-form").find("input[type=text]").val("");
	});
	
	$("#player-deposit-modal").on('shown.bs.modal', function (e) {
		$("#player-deposit-form input[name=playername]").val($("#search-playername").val());
	});
	
	$("#player-deposit-form").on('submit', function(e){
			var btn = $(".btn-deposit");
			e.preventDefault();
			btn.button('loading');
			var $formdata = $("#player-deposit-form").serializeArray();
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/player_request",
				 data: {
				  "brand_structure_id": $("#select-brand-structure-id").val(),
				  "params": $formdata,
				  "request": 'player/deposit/'
				 },
				 success: function(result){
					if(result.result.error){
						alert(result.result.error);
					}
					else{
						alert(result.result.result.result);
						$("#player-deposit-modal").modal('hide');
					}
				 	btn.button('reset');
				 }
			});
		
	})
	
	$(".btn-deposit").click(function(){
		$("#submit-btn-deposit").click();
	})

	$("#btn-deposit").click(function(){
		if($("#select-brand-structure-id").val()==null){
			alert(translate.please_select_entity);
		}
		else{
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/get_player_form",
				 data: {
				  "request": 'player/deposit/'
				 },
				 success: function(result){
					if(result){
						var $form_fields = $.parseHTML(result.player_form_fields);
						$("#player-deposit-form-fields").html($form_fields);
					}
					$("#player-deposit-modal").modal('show');
				 }
				 
			});
			
		}
		
	})
	
	//withdraw
	$("#player-withdraw-modal").on('hidden.bs.modal', function (e) {
		 $("#player-withdraw-form").find("input[type=text]").val("");
	});
	
	$("#player-withdraw-modal").on('shown.bs.modal', function (e) {
		$("#player-withdraw-form input[name=playername]").val($("#search-playername").val());
	});
	
	$("#player-withdraw-form").on('submit', function(e){
		
			var btn = $(".btn-withdraw");
			e.preventDefault();
			btn.button('loading');
			var $formdata = $("#player-withdraw-form").serializeArray();
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/player_request",
				 data: {
				  "brand_structure_id": $("#select-brand-structure-id").val(),
				  "params": $formdata,
				  "request": 'player/withdraw/'
				 },
				 success: function(result){
					if(result.result.error){
						alert(result.result.error);
					}
					else{
						alert(result.result.result.result);
						$("#player-withdraw-modal").modal('hide');
					}
				 	btn.button('reset');
				 }
			});
		
		
	})
	
	$(".btn-withdraw").click(function(){
		$("#submit-btn-withdraw").click();
	})

	$("#btn-withdraw").click(function(){
		if($("#select-brand-structure-id").val()==null){
			alert(translate.please_select_entity);
		}
		else{
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/get_player_form",
				 data: {
				  "request": 'player/withdraw/'
				 },
				 success: function(result){
					if(result){
						var $form_fields = $.parseHTML(result.player_form_fields);
						$("#player-withdraw-form-fields").html($form_fields);
					}
					$("#player-withdraw-modal").modal('show');
				 }
				 
			});
			
		}
		
	})
	
	
	//player logout
	$("#player-logout-modal").on('hidden.bs.modal', function (e) {
		 $("#player-logout-form").find("input[type=text]").val("");
	});
	
	$("#player-logout-modal").on('shown.bs.modal', function (e) {
		$("#player-logout-form input[name=playername]").val($("#search-playername").val());
	});
	
	$("#player-logout-form").on('submit', function(e){
		
			var btn = $(".btn-logout");
			e.preventDefault();
			btn.button('loading');
			var $formdata = $("#player-logout-form").serializeArray();
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/player_request",
				 data: {
				  "brand_structure_id": $("#select-brand-structure-id").val(),
				  "params": $formdata,
				  "request": 'player/logout/'
				 },
				 success: function(result){
					if(result.result.error){
						alert(result.result.error);
					}
					else{
						alert(result.result.result.result);
						$("#player-logout-modal").modal('hide');
					}
				 	btn.button('reset');
				 }
			});
		
		
	})
	
	$(".btn-logout").click(function(){
		$("#submit-btn-logout").click();
	})

	$("#btn-logout").click(function(){
		if($("#select-brand-structure-id").val()==null){
			alert(translate.please_select_entity);
		}
		else{
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/get_player_form",
				 data: {
				  "request": 'player/logout/'
				 },
				 success: function(result){
					if(result){
						var $form_fields = $.parseHTML(result.player_form_fields);
						$("#player-logout-form-fields").html($form_fields);
					}
					$("#player-logout-modal").modal('show');
				 }
				 
			});
			
		}
		
	});
	
	$("#btn-freeze").click(function(){
		if($("#select-brand-structure-id").val()==null){
			alert(translate.please_select_entity);
		}
		else if($("#search-playername").val()==''){
			alert(translate.please_input_player_name);
		}
		else{
			var $params = [{name: 'frozen', value: '1'}];
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/update_player",
				 data: {
				  "brand_structure_id": $("#select-brand-structure-id").val(),
				  "playername": $("#search-playername").val(),
				  "params": $params
				 },
				 success: function(result){
					if(result){
						$(".result_msg").html($.parseHTML(result.msg));
					}
				 }
				 
			});
		}
	});
	
	$("#btn-unfreeze").click(function(){
		if($("#select-brand-structure-id").val()==null){
			alert(translate.please_select_entity);
		}
		else if($("#search-playername").val()==''){
			alert(translate.please_input_player_name);
		}
		else{
			var $params = [{name: 'frozen', value: '0'}];
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/update_player",
				 data: {
				  "brand_structure_id": $("#select-brand-structure-id").val(),
				  "playername": $("#search-playername").val(),
				  "params": $params
				 },
				 success: function(result){
					if(result){
						$(".result_msg").html($.parseHTML(result.msg));
					}
				 }
				 
			});
		}
	})
	
	
	$('#search-playername').keypress(function (e) {
		
	 var key = e.which;
	 if(key == 13)  // the enter key code
	  {
	    $('#btn_search').click();
	    return false;  
	  }
	});
	
	$('#last_ten_transactions').on('show.bs.collapse', function () {
			$("#div_toggle_columns_last10trans").html("");
			
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/get_player_other_info",
				 data: {
					 "brand_structure_id": $("#select-brand-structure-id").val(),
					 "playername": $("#playerinfo_playername").html(),
					 "requestparams": 'transactions'
				 },
				 success: function(result){
					 $('#search_result_list').hide();
					 $('#search_result_info').show();
					 					
					 var dataSet = result.data.data;
					 var colnames = result.data.colnames;
					 
					 if(typeof(dataSet)==='undefined'){
						 if(typeof(result.data)==='object'){
							 if('result' in result.data){
								 $('.div_last_ten_trans').html(JSON.stringify(result.data.result));
							 }
							 else{
								 $('.div_last_ten_trans').html(result.data);
							 }
						 }
						 else{
							 $('.div_last_ten_trans').html(result.data);
						 }
					 }
					 else{
						 if(dataSet.length>0){
							 if ( $.fn.dataTable.isDataTable( '#tbl_last_ten_trans' ) ) {
								$('#tbl_last_ten_trans').dataTable().fnDestroy();
								last10transtable = $('#tbl_last_ten_trans').dataTable({
									"autoWidth": false,
									"retrieve": true,
									"bdestroy": true,
									"pagingType": "full_numbers", 	
							        "data": dataSet,
							        "columns": colnames,
							        "language": {
								        url: site_url + 'admin/language/ajax/get_datatables_language',
								    }
							    });
							}
							else{
								last10transtable = $('#tbl_last_ten_trans').dataTable({
									"autoWidth": false,
									"retrieve": true,
									"bdestroy": true,
									"pagingType": "full_numbers", 	
							        "data": dataSet,
							        "columns": colnames,
							        "language": {
								        url: site_url + 'admin/language/ajax/get_datatables_language',
								    }
							    });
							}
							 
							 
							 	$options = '<select id="toggle_columns_last10trans" class="combobox multiselect" multiple="multiple">';
								$.each(colnames, function(o, e){
									$options += "<option value='"+o+"' selected='selected'>"+e.title+"</option>";
								})
								$options += "</select>";
			
								$("#div_toggle_columns_last10trans").html($options);
								
								$('#toggle_columns_last10trans').multiselect({
							        includeSelectAllOption: false,
							        enableFiltering: true,
							        maxHeight: 200,
									buttonWidth: '300px',
									disableIfEmpty: true,
									enableCaseInsensitiveFiltering: true,
									onChange: function(element, checked){
										var column = last10transtable.api().column($(element).val());
								        column.visible( ! column.visible() );
									},
									buttonText: function(options, select) {
						                return 'Show/Hide Columns';
						            }
								}); 
							 
						 }
						 else{
							 $('.div_last_ten_trans').html(translate.no_data_found);
						 }
							 
					 }
					 
					 
					 $("#div_toggle_columns").hide();

				 }
			});
	});
	
	$('#last_ten_sessions').on('show.bs.collapse', function () {
			$("#div_toggle_columns_last10sessions").html("");
			
			$.ajax({
				 type: "POST",
				 url: site_url + "admin/playermanagement/ajax/get_player_other_info",
				 data: {
					 "brand_structure_id": $("#select-brand-structure-id").val(),
					 "playername": $("#playerinfo_playername").html(),
					 "requestparams" : 'sessions'
				 },
				 success: function(result){
					 $('#search_result_list').hide();
					 $('#search_result_info').show();
					 					
					 var dataSet = result.data.data;
					 var colnames = result.data.colnames;
					 
					 if(typeof(dataSet)==='undefined'){
						 if(typeof(result.data)==='object'){
							 if('result' in result.data){
								 $('.div_last_ten_sessions').html(JSON.stringify(result.data.result));
							 }
							 else{
								 $('.div_last_ten_sessions').html(result.data);
							 }
						 }
						 else{
							 $('.div_last_ten_sessions').html(result.data);
						 }
					 }
					 else{
						 if(dataSet.length>0){
							 if ( $.fn.dataTable.isDataTable( '#tbl_last_ten_sessions' ) ) {
								$('#tbl_last_ten_sessions').dataTable().fnDestroy();
								last10sessionstable = $('#tbl_last_ten_trans').dataTable({
									"autoWidth": false,
									"retrieve": true,
									"bdestroy": true,
									"pagingType": "full_numbers", 	
							        "data": dataSet,
							        "columns": colnames,
							        "language": {
								        url: site_url + 'admin/language/ajax/get_datatables_language',
								    }
							    });
							}
							else{
								last10sessionstable = $('#tbl_last_ten_sessions').dataTable({
									"autoWidth": false,
									"retrieve": true,
									"bdestroy": true,
									"pagingType": "full_numbers", 	
							        "data": dataSet,
							        "columns": colnames,
							        "language": {
								        url: site_url + 'admin/language/ajax/get_datatables_language',
								    }
							    });
							}
							 
							 
							 	$options = '<select id="toggle_columns_last10sessions" class="combobox multiselect" multiple="multiple">';
								$.each(colnames, function(o, e){
									$options += "<option value='"+o+"' selected='selected'>"+e.title+"</option>";
								})
								$options += "</select>";
			
								$("#div_toggle_columns_last10sessions").html($options);
								
								$('#toggle_columns_last10sessions').multiselect({
							        includeSelectAllOption: false,
							        enableFiltering: true,
							        maxHeight: 200,
									buttonWidth: '300px',
									disableIfEmpty: true,
									enableCaseInsensitiveFiltering: true,
									onChange: function(element, checked){
										var column = last10sessionstable.api().column($(element).val());
								        column.visible( ! column.visible() );
									},
									buttonText: function(options, select) {
						                return 'Show/Hide Columns';
						            }
								}); 
							 
						 }
						 else{
							 $('.div_last_ten_sessions').html(translate.no_data_found);
						 }
							 
					 }
					 
					 
					 $("#div_toggle_columns").hide();
					/* if($("#search-playername").val()==''){
						 $("#btn-back").show();
					 }*/
					 
					 //$("#accordion").show();
				 }
			});
	});
	
	$('#last_ten_broken_games').on('show.bs.collapse', function () {
		
		$("#div_toggle_columns_last10brokengames").html("");
		$.ajax({
			 type: "POST",
			 url: site_url + "admin/playermanagement/ajax/get_player_other_info",
			 data: {
				 "brand_structure_id": $("#select-brand-structure-id").val(),
				 "playername": $("#playerinfo_playername").html(),
				 "requestparams" : 'brokengames'
			 },
			 success: function(result){
				 $('#search_result_list').hide();
				 $('#search_result_info').show();
				 					
				 var dataSet = result.data.data;
				 var colnames = result.data.colnames;
				 
				 if(typeof(dataSet)==='undefined'){
					 if(typeof(result.data)==='object'){
						 if('result' in result.data){
							 $('.div_last_ten_broken_games').html(JSON.stringify(result.data.result));
						 }
						 else{
							 $('.div_last_ten_broken_games').html(result.data);
						 }
					 }
					 else{
						 $('.div_last_ten_broken_games').html(result.data);
					 }
				 }
				 else{
					 if(dataSet.length>0){
						 if ( $.fn.dataTable.isDataTable( '#tbl_last_ten_broken_games' ) ) {
							$('#tbl_last_ten_broken_games').dataTable().fnDestroy();
							last10broken_gamestable = $('#tbl_last_ten_broken_games').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    }
						    });
						}
						else{
							last10broken_gamestable = $('#tbl_last_ten_broken_games').dataTable({
								"autoWidth": false,
								"retrieve": true,
								"bdestroy": true,
								"pagingType": "full_numbers", 	
						        "data": dataSet,
						        "columns": colnames,
						        "language": {
							        url: site_url + 'admin/language/ajax/get_datatables_language',
							    }
						    });
						}
						 
						 
						 	$options = '<select id="toggle_columns_last10brokengames" class="combobox multiselect" multiple="multiple">';
							$.each(colnames, function(o, e){
								$options += "<option value='"+o+"' selected='selected'>"+e.title+"</option>";
							})
							$options += "</select>";
		
							$("#div_toggle_columns_last10brokengames").html($options);
							
							$('#toggle_columns_last10brokengames').multiselect({
						        includeSelectAllOption: false,
						        enableFiltering: true,
						        maxHeight: 200,
								buttonWidth: '300px',
								disableIfEmpty: true,
								enableCaseInsensitiveFiltering: true,
								onChange: function(element, checked){
									var column = last10broken_gamestable.api().column($(element).val());
							        column.visible( ! column.visible() );
								},
								buttonText: function(options, select) {
					                return 'Show/Hide Columns';
					            }
							}); 
						 
					 }
					 else{
						 $('.div_last_ten_broken_games').html(translate.no_data_found);
					 }
						 
				 }
				 
				 
				 $("#div_toggle_columns").hide();
				/* if($("#search-playername").val()==''){
					 $("#btn-back").show();
				 }*/
				 
				 //$("#accordion").show();
			 }
		});
	})
	
});


function update_player($formdata, $freeze, $container){
	if (typeof($freeze)==='undefined') $freeze = 0;
	if (typeof($container)==='undefined') $freeze = "";
	$.ajax({
		 type: "POST",
		 url: site_url + "admin/playermanagement/ajax/update_player",
		 data: {
		  "params": $formdata,
		  "brand_structure_id": $("#select-brand-structure-id").val(),
		  "playername": $("#playerinfo_playername").html()
		 },
		 success: function(result, textStatus, jqXHR){
			$("#" + $container).html(result.msg); 	
		 },
		 error: function(jqXHR, textStatus, errorThrown){
			
		 }
	});
	
	$("#frozen").html($freeze);
}

function display_all(){
	var $formdata = $("#player_list_form").serializeArray();
	$.ajax({
		 type: "POST",
		 url: site_url + "admin/playermanagement/ajax/get_players",
		 data: {
			 "brand_structure_id": $("#select-brand-structure-id").val(),
			 "form_data": $formdata
		 },
		 success: function(result){
			
			 var dataSet = result.data;
			 var colnames = result.colnames;
			 if(result.apicall=='playerlist'){
				 
				 $('#search_result_info').hide();
				 $('#search_result_list').show();
				 if(dataSet.length>0){
					$('#tbl_playerlist').html('');
					if ( $.fn.dataTable.isDataTable( '#tbl_playerlist' ) ) {
						$('#tbl_playerlist').dataTable().fnDestroy();
						table = $('#tbl_playerlist').dataTable({
							"autoWidth": false,
							"retrieve": true,
							"bdestroy": true,
							"pagingType": "full_numbers", 	
					        "data": dataSet,
					        "columns": colnames,
					        "language": {
						        url: site_url + 'admin/language/ajax/get_datatables_language',
						    }
					    });
					}
					else{
						table = $('#tbl_playerlist').dataTable({
							"autoWidth": false,
							"retrieve": true,
							"bdestroy": true,
							"pagingType": "full_numbers", 	
					        "data": dataSet,
					        "columns": colnames,
					        "language": {
						        url: site_url + 'admin/language/ajax/get_datatables_language',
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
					 if ($.fn.dataTable.isDataTable( '#tbl_playerlist' ) ) {
						 $('#tbl_playerlist').dataTable().fnClearTable(); 
						 $('#tbl_playerlist').dataTable().fnDestroy();
						 $('#tbl_playerlist').html('-No Record Found');
						 
					 }
					 else{
						 $('#tbl_playerlist').html('-No Record Found');
					 }
					 $("#div_toggle_columns").html('');
				 }
				 $("#div_toggle_columns").show();
				 $("#btn-back").hide();	
			 }
				 
		 }
	});

}



function search_player($playername){
	$("#div_toggle_columns_last10trans").html("");
	$("#div_toggle_columns_last10sessions").html("");
	$("#div_toggle_columns_last10brokengames").html("");
	
	$.ajax({
		 type: "POST",
		 url: site_url + "admin/playermanagement/ajax/search_player",
		 data: {
			 "brand_structure_id": $("#select-brand-structure-id").val(),
			 "playername": $playername
			 //"form_data": $formdata
		 },
		 success: function(result){
			 $('#search_result_list').hide();
			 $('#search_result_info').show();
			 
			 $("#player_search_form input[name='playername']").val($playername);
			 
			 if(result.player_info.error){
				 alert(result.player_info.error);
			 }
			 else{
				 if('result' in result.player_info){
					 $.each(result.player_info.result, function(o, e){
						 if($("#playerinfo_" + o.toLowerCase()).length){;
							 if($("#playerinfo_" + o.toLowerCase()).is('input:text, select')){
								 $("#playerinfo_" + o.toLowerCase()).val(e);
							 }
							 else{
								 $("#playerinfo_" + o.toLowerCase()).html(e);
							 }
							 
						 }
					 })
				 }
	
				 if('result' in result.player_online){
					 if(result.player_online.result==0){
						 $("#playerinfo_playerstatus").html('Offline')
					 }
					 else{
						 $("#playerinfo_playerstatus").html('Online')
					 }
				 }
				 
				 $("#div_toggle_columns").hide();
				 $("#accordion").show();
			 }
			
		 }
	});
}

function showPlayerInfo($playername){
	search_player($playername)
	$("#btn-back").show();
	
	$("#accordion .panel-collapse").removeClass('in');
	$("#accordion .panel-collapse").css("height", "0");
	$("#signup_info").addClass('in');
	$("#signup_info").css("height", "auto");
}

function open_playergame_sessions($url){
	window.open($url, '_blank');
}

function show_playergame_session($sessid, $playername){
	
	$.ajax({
		 type: "POST",
		 url: site_url + "admin/playermanagement/ajax/game_session",
		 data: {
			 "sessionid": $sessid,
			 "playername": $playername,
			 "brand_structure_id": $("#select-brand-structure-id").val()
		 },
		 success: function(result){
			 $("#playersession_playername").html($('#search-playername').val());
			 var dataSet = result.data.data;
			 var colnames = result.data.colnames;
			 
			 if(typeof(dataSet)==='undefined'){
				 if(typeof(result.data)==='object'){
					 if('result' in result.data){
						 $('.div_player_gamesession').html(JSON.stringify(result.data.result));
					 }
					 else{
						 $('.div_player_gamesession').html(result.data);
					 }
				 }
				 else{
					 $('.div_player_gamesession').html(result.data);
				 }
			 }
			 else{
				 if(dataSet.length>0){
					 if ( $.fn.dataTable.isDataTable( '#tblplayer_game_session' ) ) {
						$('#tblplayer_game_session').dataTable().fnDestroy();
						playersessions_gamestable = $('#tblplayer_game_session').dataTable({
							"autoWidth": false,
							"retrieve": true,
							"bdestroy": true,
							"pagingType": "full_numbers", 	
					        "data": dataSet,
					        "columns": colnames,
					        /*"sScrollX": "100%",
					        "sScrollXInner": "110%",
					        "bScrollCollapse": true,*/
					        "language": {
						        url: site_url + 'admin/language/ajax/get_datatables_language',
						    }
					    });
					}
					else{
						playersessions_gamestable = $('#tblplayer_game_session').dataTable({
							"autoWidth": false,
							"retrieve": true,
							"bdestroy": true,
							"pagingType": "full_numbers", 	
					        "data": dataSet,
					        "columns": colnames,
					        /*"sScrollX": "100%",
					        "sScrollXInner": "110%",
					        "bScrollCollapse": true,*/
					        "language": {
						        url: site_url + 'admin/language/ajax/get_datatables_language',
						    }
					    });
					}
					 
					 
					 	$options = '<select id="toggle_columns_playersessions" class="combobox multiselect" multiple="multiple">';
						$.each(colnames, function(o, e){
							$options += "<option value='"+o+"' selected='selected'>"+e.title+"</option>";
						})
						$options += "</select>";
	
						$("#div_toggle_columns_game_session").html($options);
						
						$('#toggle_columns_playersessions').multiselect({
					        includeSelectAllOption: false,
					        enableFiltering: true,
					        maxHeight: 200,
							buttonWidth: '300px',
							disableIfEmpty: true,
							enableCaseInsensitiveFiltering: true,
							onChange: function(element, checked){
								var column = playersessions_gamestable.api().column($(element).val());
						        column.visible( ! column.visible() );
							},
							buttonText: function(options, select) {
				                return 'Show/Hide Columns';
				            }
						}); 
					 
				 }
				 else{
					 $('.div_player_gamesession').html(translate.no_data_found);
				 }
					 
			 }
				 
			 $("#player-gamesession-modal").modal('show');
		 }
	});
	
	
	
}