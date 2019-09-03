$( "#startdate" ).datepicker(
	{
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true
	}
);
$( "#enddate" ).datepicker(
	{
		dateFormat: 'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		showButtonPanel: true
	}
);

$(".showinput" ).click(function(){
	$("#div_show_input").toggle();
});


$.ajax({
    type: "POST",
    url: "ajax/api_request",
    data: {
    	'params' : 'getKiosks/1'
	},
    success: function(result) {
    	var obj = jQuery.parseJSON(result);
    	var kiosk_str = '<option value="" >-Select Kiosk-</option>';
    	
    	if(obj.success){
    		var kiosknames = obj.json_format.result;
    		if(kiosknames.length>0){
        		for(var i=0; i<kiosknames.length; i++){
        			kiosk_str += "<option value='"+kiosknames[i]['NAME']+"'>"+kiosknames[i]['NAME']+"</option>";
        		}
        	}
        	else{
        		kiosk_str = '<option value="" >-No Data-</option>';
        	}
    	}
    	else{
    		kiosk_str = '<option value="" >-No Data-</option>';
    	}
		$("#kiosk").html(kiosk_str);
	}
});


$.ajax({
    type: "POST",
    url: "ajax/api_request",
    data: {
    	'params' : 'admin/list'
	},
    success: function(result) {
    	var obj = jQuery.parseJSON(result);
    	var admin_str = '<option value="" >-Select Admin-</option>';
    	
    	if(obj.success){
    		var adminnames = obj.json_format.result;
    		if(adminnames.length>0){
        		for(var i=0; i<adminnames.length; i++){
        			admin_str += "<option value='"+adminnames[i]['name']+"'>"+adminnames[i]['name']+"</option>"
        		}
        	}
        	else{
        		
        	}
    	}
    	else{
    		admin_str = '<option value="" >-No Data-</option>';
    	}
    	
		$("#admin").html(admin_str);
	}
});

$.ajax({
    type: "POST",
    url: "ajax/api_request",
    data: {
    	'params' : 'entity/list'
	},
    success: function(result) {
    	var obj = jQuery.parseJSON(result);
    	var entity_str = '<option value="" >-Select Entity-</option>';
    	
    	if(obj.success){
    		var entitynames = obj.json_format.result;
        	
        	if(entitynames.length>0){
        		for(var i=0; i<entitynames.length; i++){
        			entity_str += "<option value='"+entitynames[i]['name']+"'>"+entitynames[i]['name']+"</option>"
        		}
        	}
        	else{
        		entity_str = '<option value="" >-No Data-</option>';
        	}
    	}
    	else{
    		entity_str = '<option value="" >-No Data-</option>';
    	}
    	
    	
    	
		$("#businessentity").html(entity_str);
	}
});


$('#showstats').click(function(){
	
	var username = $('#username').val();
	var signuptimeperiod = $('#signuptimeperiod option:selected').val();
	var startdate = $('#startdate').val();
	var enddate = $('#enddate').val();
	var admin = $('#admin option:selected').val();
	var kiosk = $('#kiosk option:selected').val();
	var businessentity = $('#businessentity option:selected').val();
	var clientplatform = $('#clientplatform option:selected').val();
	var reportby = $('#reportby option:selected').val();
	var include_current_hour = $('#include_current_hour').prop('checked')
	
	$("#display_result").html('<table class="display" id="player_stats_table"><thead><tr><th id="firstcol"></th><th>Real balance change</th><th>Deposits</th><th>Withdraws</th><th>Compensation</th><th>Active players</th><th>Progressive Share</th><th>Progressive Wins</th><th>Bets</th><th>Wins</th><th>Net Loss</th><th>Net Purchase</th><th>House earnings</th></tr></thead><tbody><tr><td colspan="4" class="dataTables_empty">Empty data</td></tr></tbody><tfoot class="playerreport_tfoot"><tr><td id="tfoot_firstcol"></td><td id="tfoot_realbalancechange"></td><td id="tfoot_deposits"></td><td id="tfoot_withdraws"></td><td id="tfoot_compensation"></td><td id="tfoot_activeplayers"></td><td id="tfoot_progressiveshare"></td><td id="tfoot_progressivewins"></td><td id="tfoot_bets"></td><td id="tfoot_wins"></td><td id="tfoot_netloss"></td><td id="tfoot_netpurchase"></td><td id="tfoot_houseearnings"></td></tr></tfoot></table>');
	$('#player_stats_table').dataTable( {
		"bJQueryUI": false,
		"bProcessing": false,
		//"iDisplayLength": 2,
		//"bServerSide": true,
		//"bDestroy":true,
		"sPaginationType": "full_numbers",
		"bPaginate": true,
		"sAjaxSource": "playerreports/show_stats",
		"sServerMethod": "POST",
		"oLanguage": {
		 "sSearch": "Filter records:",
		 "sProcessing": "<img src='application/sandbox-template/images/loader.gif'>"
	   },
	   //"sDom": '<"H"lT<"#exportxls" >fr>t<"F"ip>',
	   "sDom": '<"H"lTfr>t<"F"ip>',
		"oTableTools": {
			"sSwfPath": "application/sandbox-template/misc/copy_csv_xls_pdf.swf",
			"aButtons": [
				
			]
		},
		"fnServerParams": function ( aoData ) {
			aoData.push( 
				{ 
					"name": "username", 
					"value": username
				},
				{
					"name":"signuptimeperiod",
					"value": signuptimeperiod
				},
				{
					"name": "startdate",
					"value": startdate
				},
				{
					"name": "enddate",
					"value" : enddate
				},
				{ 	
					"name": "admin",
					"value": admin
				},
				{
					"name": "kiosk",
					"value": kiosk
				},
				{
					"name": "businessentity",
					"value": businessentity
				},
				{
					"name": "clientplatform",
					"value": clientplatform
				},
				{
					"name": "reportby",
					"value": reportby
				},
				{
					"name": "include_current_hour",
					"value": include_current_hour
				}
			);
		},
		"fnDrawCallback": function (nRow, aData, iDisplayIndex) {
		
			
		  var rows = this.fnGetData();
		  
		  var tfoot_realbalancechange = 0;
		  var tfoot_deposits = 0;
		  var tfoot_withdraws = 0;
		  var tfoot_compensation = 0;
		  var tfoot_activeplayers = 0;
		  var tfoot_progressiveshare = 0;
		  var tfoot_progressivewins = 0;
		  var tfoot_bets = 0;
		  var tfoot_wins = 0;
		  var tfoot_netloss = 0;
		  var tfoot_netpurchase = 0;
		  var tfoot_houseearnings = 0;
		  
		  if ( rows.length === 0 ) {
		  }
		  else{
		  
			   for(var i=0; i<rows.length; i++){
				currency= rows[i][1].substr(0, rows[i][1].indexOf(' ')); 
				var tfootrealbalancechange = rows[i][1].replace(currency, "");
				tfoot_realbalancechange = (parseFloat(tfoot_realbalancechange) + parseFloat(tfootrealbalancechange.replace(/,/g, ""))).toFixed(2);
				
				var tfootdeposits = rows[i][2].replace(currency, "");
				tfoot_deposits = (parseFloat(tfoot_deposits) + parseFloat(tfootdeposits.replace(/,/g, ""))).toFixed(2);
				
				var tfootwithdraws = rows[i][3].replace(currency, "");
				tfoot_withdraws = (parseFloat(tfoot_withdraws) + parseFloat(tfootwithdraws.replace(/,/g, ""))).toFixed(2);
				
				var tfootcompensation = rows[i][4].replace(currency, "");
				tfoot_compensation = (parseFloat(tfoot_compensation) + parseFloat(tfootcompensation.replace(/,/g, ""))).toFixed(2);
				
				var tfootactiveplayers = rows[i][5].replace(currency, "");
				tfoot_activeplayers = parseInt(tfoot_activeplayers) + parseInt(tfootactiveplayers.replace(/,/g, ""));
				
				var tfootprogressiveshare = rows[i][6].replace(currency, "");
				tfoot_progressiveshare = (parseFloat(tfoot_progressiveshare) + parseFloat(tfootprogressiveshare.replace(/,/g, ""))).toFixed(2);
				
				var tfootprogressivewins = rows[i][7].replace(currency, "");
				tfoot_progressivewins = (parseFloat(tfoot_progressivewins) + parseFloat(tfootprogressivewins.replace(/,/g, ""))).toFixed(2);
				
				var tfootbets = rows[i][8].replace(currency, "");
				tfoot_bets = (parseFloat(tfoot_bets) + parseFloat(tfootbets.replace(/,/g, ""))).toFixed(2);
				
				var tfootwins = rows[i][9].replace(currency, "");
				tfoot_wins = (parseFloat(tfoot_wins) + parseFloat(tfootwins.replace(/,/g, ""))).toFixed(2);
				
				var tfootnetloss = rows[i][10].replace(currency, "");
				tfoot_netloss = (parseFloat(tfoot_netloss) + parseFloat(tfootnetloss.replace(/,/g, ""))).toFixed(2);
				
				var tfootnetpurchase = rows[i][11].replace(currency, "");
				tfoot_netpurchase = (parseFloat(tfoot_netpurchase) + parseFloat(tfootnetpurchase.replace(/,/g, ""))).toFixed(2);
				
				var tfoothouseearnings = rows[i][12].replace(currency, "");
				tfoot_houseearnings = (parseFloat(tfoot_houseearnings) + parseFloat(tfoothouseearnings.replace(/,/g, ""))).toFixed(2);
				
			  } 
			  
			  $("#tfoot_firstcol").html("<b>TOTAL</b>");
			  $("#tfoot_realbalancechange").html("<b>" + currency + " " + commaSeparateNumber(tfoot_realbalancechange) + "</b>");
			  $("#tfoot_deposits").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_deposits) + "</b>");
			  $("#tfoot_withdraws").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_withdraws) + "</b>");
			  $("#tfoot_compensation").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_compensation) + "</b>");
			  $("#tfoot_activeplayers").html("<b>" + commaSeparateNumber(tfoot_activeplayers) + "</b>");
			  $("#tfoot_progressiveshare").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_progressiveshare) + "</b>");
			  $("#tfoot_progressivewins").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_progressivewins) + "</b>");
			  $("#tfoot_bets").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_bets) + "</b>");
			  $("#tfoot_wins").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_wins) + "</b>");
			  $("#tfoot_netloss").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_netloss) + "</b>");
			  $("#tfoot_netpurchase").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_netpurchase) + "</b>");
			  $("#tfoot_houseearnings").html("<b>" +currency+ " " + commaSeparateNumber(tfoot_houseearnings) + "</b>");
			}  
		},
		"fnInitComplete": function(oSettings, json) {
		
			$("#urlinput").html(json.url);
			$("#httpheader").html(json.header);
			$("#httpcode").html(json.httpcode);
			$("#httpcodedesc").html(json.httpdesc);
			$("#apiresponse_raw").html("<span style='color: white'>" + JSON.stringify(json.apiresponse, null, 4)+ "</span>");
			$("#apiresponse_parsed").html("<span style='color: white'>" + JSON.stringify(json.apiresponse, null, 4) + "</span>");
		}
	} );
	
	$("#exportxls").append(
			'<button type="button" id="btnxls" onclick="tableToExcel(\'player_stats_table\')" class="btn btn-default btn-xs">Export to excel</button>'
	);
	
	
	if(reportby=='day'){
		$("#firstcol").html("Date");
	}
	if(reportby=='month'){
		$("#firstcol").html("Month");
	}
	if(reportby=='player'){
		$("#firstcol").html("Playername");
	}
	if(reportby=='kiosk'){
		$("#firstcol").html("Kioskname");
	}
	if(reportby=='entity'){
		$("#firstcol").html("Entity");
	}
	if(reportby=='clientplatform'){
		$("#firstcol").html("Client Platform");
	}
});

var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  return function(table, name) {
    if (!table.nodeType) table = document.getElementById(table)
    var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
    window.location.href = uri + base64(format(template, ctx))
  }
})()


function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

$("#startdate").prop('disabled', true);
$("#startdate_time").prop('disabled', true);
$("#enddate").prop('disabled', true);
$("#enddate_time").prop('disabled', true);

$("#signuptimeperiod").on('change', function() {

	if($(this).val()=='Specific period'){
		$("#startdate").prop('disabled', false);
		$("#startdate_time").prop('disabled', false);
		$("#enddate").prop('disabled', false);
		$("#enddate_time").prop('disabled', false);
	}
	else{
		$("#startdate").val('');
		$("#startdate_time").val('');
		$("#enddate").val('');
		$("#enddate_time").val('');
		
		$("#startdate").prop('disabled', true);
		$("#startdate_time").prop('disabled', true);
		$("#enddate").prop('disabled', true);
		$("#enddate_time").prop('disabled', true);
	}
});



