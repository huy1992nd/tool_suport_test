function commaSeparateNumber(val){
	while (/(\d+)(\d{3})/.test(val.toString())){
		val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	}
	return val;
}

$("#btn_console").click(function(){
	var params = $("#apiparams").val();
	
	if(params.length>0){
		$.ajax({
		 type: "POST",
		 url: "ajax/api_call",
		 data: {
		  "params": params
		 },
		 success: function(result){
			var obj = jQuery.parseJSON(result);
			$("#console_response_url").html("<span style='color: white'>" + obj.url + "</span>");
			$("#httpheader").html(obj.header);
			$("#console_response").html("<span style='color: white'>" + JSON.stringify(obj.json_format, null, 4)+ "</span>");
			$("#console_response_readable").html("<span style='color: white'>" + JSON.stringify(obj.json_format, null, 4) + "</span>");
			$("#httpcode").html("<a href='http://en.wikipedia.org/wiki/List_of_HTTP_status_codes' title='Click to view list of entity codes \n and definitions.' id='httpcode' target='_blank'>" + obj.httpcode + "</a>");
			$("#httpcodedesc").html(obj.httpdesc);
		 }
		});
	}
	else{
		alert('Please input API call');
		$("#apiparams").focus();
	}
});

$("small").hover(
   
  function () {
    originalText=$(this).text();
    $(this).text('CLICK TO UPDATE');
  },

  function () {
    $(this).text(originalText);
  }
);

$body = $("body");
$(document).on({
	ajaxStart: function() { $body.addClass("loading"); },
	ajaxStop: function() { $body.removeClass("loading"); }    
});

$(window).load(function(event) {
	 
	event.preventDefault();
	$("#listofentities").html(
		'<table class="display" id="entitylist">' +
			'<thead style="color:#FFFFFF;">' +
				'<tr>' +
					'<th>Entity Name</th>' +
					'<th>Deposit</th>' +
					'<th>Bonus</th>' +
				'</tr>' +
			'</thead>' +
			'<tbody>' +
				'<tr>' +
					'<td colspan="4" class="dataTables_empty">Empty data</td>' +
				'</tr>' +
			'</tbody>' +
		'</table>'
	);

	$('#entitylist').dataTable( {
		"bInfo" : false,
		"bJQueryUI": false,
		"bProcessing": false,
		"sPaginationType": "full_numbers",
		"iDisplayLength":3,
		"bPaginate": true,
		"sAjaxSource": "welcome/get_list_of_entity",
		"sServerMethod": "POST",
		"oLanguage": {
			"sSearch": "Filter records:",
		 	"sProcessing": "<img src='application/sandbox-template/images/loader.gif'>"
	   	},
	   "sDom": '<"H"lTfr>t<"F"<"toolbar">ip>',
		"oTableTools": {
			"sSwfPath": "application/sandbox-template/misc/copy_csv_xls_pdf.swf",
			"aButtons": [
				
			]
		},
		"fnServerParams": function ( aoData ) {
			/*
			aoData.push( 
				{ 
					"name": "name", 
					"value": name
				},
				{
					"name":"parent",
					"value": parent
				},
				{
					"name": "kioskname",
					"value": kioskname
				},
				{
					"name": "total_deposit_balance",
					"value" : total_deposit_balance
				},
				{ 	
					"name": "total_bonus_balance",
					"value": total_bonus_balance
				}
			);
			*/
		},

		"fnDrawCallback": function (nRow, aData, iDisplayIndex) {
			
			var rows 				 = this.fnGetData();  
			var footer_entity_list   = 0;
			var footer_parent_name   = 0;
			var footer_kiosk_name    = 0;
			var footer_total_deposit = 0;
			var footer_total_bonus   = 0;
		},

		"fnInitComplete": function(oSettings, json) {
			//return;
		}
	}); 

	$(".first.paginate_button").remove(); 
 	$(".last.paginate_button").remove(); 
 	$('.dataTables_paginate.paging_full_numbers > span').remove();

});
 

