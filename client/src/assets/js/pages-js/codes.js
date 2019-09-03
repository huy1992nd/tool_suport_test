$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});

$(document).ready(function(){
	$.ajax({
	    type: "POST",
	    url: site_url + "admin/codes/ajax/get_function_group",
	    success: function(result) {
	    	//var obj = jQuery.parseJSON(result);
	    	var obj = result;
	    	$("#btnfunctions").html(obj.html);
	    	$("#urlinput").html(obj.url);
			$("#httpheader").html(obj.header);
			//$("#httpcode").html(obj.httpcode);
			//$("#httpcodedesc").html(obj.httpdesc);
			$("#apiresponse_raw").html("<span style='color: white'>" + JSON.stringify(obj.result, null, 4)+ "</span>");
			$("#apiresponse_parsed").html(renderjson.set_show_to_level("all")(obj.result));
			
		}
	});
	
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href"); // activated tab
	  
	  if(target!="#errorcodes"){
		  $("#showdebug").hide();
	  }
	  else{
		  $("#showdebug").hide();
	  }
});

$("#licountries").click(function(){
	
	$.ajax({
		 type: "POST",
		 url: site_url + "admin/codes/ajax/get_countries",
		 success: function(result){
			 var dataSet = result.data;
			 var colnames = result.colnames;
			 if(dataSet.length>0){
				 $('#tbl_countrycodes').dataTable({
					"retrieve": true,
					"pagingType": "full_numbers", 	
			        "data": dataSet,
			        "columns": colnames,
			        "language": {
				        url: site_url + 'admin/language/ajax/get_datatables_language',
				    }
			    });
			 }
		 }
	});
	
});

$("#ligamecodes").click(function(){
	
	var table = $('#tbl_gamecodes').DataTable({
		retrieve: true,
		processing: false,
		pagingType: 'full_numbers',
		responsive: true,
		ajax: {
			url: site_url +  "admin/codes/ajax/getcodes",
			type: "POST"
		},
		deferRender: true,
		lengthChange: true,
		info: true,
		ordering: true,
		searching: true,
		columns: [
		    {'data':'gamename'},
			{'data':'gamecode'},
			{'data':'gametype'},
			{'data':'progressive'},
			{'data':'branded'},
			{'data':'download'},
			{'data':'flash'},
			{'data':'imagelink'}
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language',
	    }
	});
	
});

$("#lilanguagecodes").click(function(){
	
	var table = $('#tbl_languagecodes').DataTable({
		retrieve: true,
		processing: false,
		pagingType: 'full_numbers',
		responsive: true,
		ajax: {
			url: site_url +  "admin/codes/ajax/get_language_codes",
			type: "POST"
		},
		lengthChange: true,
		info: true,
		ordering: true,
		searching: true,
		columns: [
		    {'data':'name'},
			{'data':'code'},
			{'data':'notes'}
		],
		language: {
	        url: site_url + 'admin/language/ajax/get_datatables_language',
	    }
	});

});



function show_group_functions(functiongroup){
	$('#btnfunctions').slideToggle();
    $('#function_form').slideToggle();
    $("#helpform").hide();
    $('#function_form').find('legend').html('');
    $.ajax({
        type: "POST",
        url: site_url + "admin/codes/ajax/get_function_list",
        data: {
        	'params' : functiongroup
    	},
        success: function(result) {
        	//var obj = jQuery.parseJSON(result);
        	var obj = result;
        	$('#function_form').find('legend').html(obj.legend);
        	$("#helpform").html(obj.html);
        	$("#urlinput").html(obj.url);
    		$("#httpheader").html(obj.header);
    		//$("#httpcode").html(obj.httpcode);
    		//$("#httpcodedesc").html(obj.httpdesc);
    		$("#apiresponse_raw").html("<span style='color: white'>" + JSON.stringify(obj.result, null, 4)+ "</span>");
			$("#apiresponse_parsed").html(renderjson.set_show_to_level("all")(obj.result));
			 $("#helpform").show();
    	}
    });
}
 
function revertfn(){
	$('#function_form').slideToggle();
	$('#btnfunctions').slideToggle();
	//$("#helpform").html("");
}


function revertfn1(){
	$('#function_form').slideToggle();
	$('#error_form').slideToggle();
	//$("#helpform1").html("");
}

function get_error_codes(functiongroup, functionname, functionnamedesc){
	
	$('#function_form').slideToggle();
    $('#error_form').slideToggle();
    //$('#error_form').find('legend').html($(this).text() + "<a href='#' onclick='helpinfo(\""+functiongroup+"\", \""+ functionname+"\")' id='helpfn'><span style='float: right'><i class='shortcut-icon icon-info-sign' rel='tooltip' title='Click to view function information'></span></a>");
    $("#helpform1").hide();
    $('#error_form').find('legend').html('');
	 $.ajax({
	        type: "POST",
	        url: site_url + "admin/codes/ajax/get_error_codes",
	        data: {
	        	'functiongroup' : functiongroup,
	        	'functionname' : functionname,
	        	'functionnamedesc': functionnamedesc
	    	},
	        success: function(result) {
	        	//var obj = jQuery.parseJSON(result);
	        	var obj = result;
	        	$('#error_form').find('legend').html(obj.legend)
	        	
	        	$("#ec_data").html(obj.html);
	        	$("#urlinput").html(obj.url);
	    		$("#httpheader").html(obj.header);
	    		//$("#httpcode").html(obj.httpcode);
	    		//$("#httpcodedesc").html(obj.httpdesc);
	    		
	    		$("#apiresponse_raw").html("<span style='color: white'>" + JSON.stringify(obj.result, null, 4)+ "</span>");
				$("#apiresponse_parsed").html(renderjson.set_show_to_level("all")(obj.result));
				$("#helpform1").show();
	    	}
	    });
	 
}

$("#showdebug").click(function(){
	$("#showdebugdiv").fadeToggle();
});


function showimage(val){
	$('#popup').bPopup({
		easing: 'easeOutBack',
        content:'image', //'ajax', 'iframe' or 'image'
        contentContainer:'.content101',
        loadUrl:'http://c0n73n7.6k6ah7b5.com/flash/images/' + val + '.jpg'
    });
}


