$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});
$(document).ready(function(){
	showimstable();
	
	
	$('#imsmodal').on('hidden.bs.modal', function(){
		$("form[name=frmims]").trigger("reset");
		$("form[name=frmims] button#save").button('reset');
		$(".imsidhidden").removeAttr("name");
		$(".imsidhidden").val("");
		$("#imsmodallabel").html('Add Ims');
		
    });
	
	$('#casinoinstancemodal').on('hidden.bs.modal', function(){
		$("form[name=frmcasinoinstance]").trigger("reset");
		$("form[name=frmcasinoinstance] button#save").button('reset');
		$(".casinoinstanceidhidden").removeAttr("name");
		$(".casinoinstanceidhidden").val("");
		$("#casinoinstancemodallabel").html('Add Casino Instance');
		
    });
	
	$('#tlemodal').on('hidden.bs.modal', function(){
		$("form[name=frmtle]").trigger("reset");
		$("form[name=frmtle] button#save").button('reset');
		$(".tleidhidden").removeAttr("name");
		$(".tleidhidden").val("");
		$("#tlemodallabel").html('Add TLE');
		$("form[name=frmtle] #casino_instance_id").prop("disabled", true);
		
    });
	
	 $('a[data-toggle="tab"]').on('shown.bs.tab', function(e, a){
		 var currentTab = $.trim($(e.target).text());
		 
		 	if(currentTab=='Casino Instance'){
		 		$(".btn-add").attr("data-target", "#casinoinstancemodal");
		 		$(".btn-add").html("Add Instance");
		 		showcasinoinstancetable();
		 		populate_ims_dropdown('frmcasinoinstance');
		 	}
		 	else if(currentTab=='TLE'){
		 		$(".btn-add").attr("data-target", "#tlemodal");
		 		$(".btn-add").html("Add TLE");
		 		showtletable();
		 		populate_ims_dropdown('frmtle');
		 		//populate_casino_instance_dropdown();
		 		
		 		//$(":file").filestyle('buttonText', 'Loading...');
		 	}
		 	else{
		 		$(".btn-add").attr("data-target", "#imsmodal");
		 		$(".btn-add").html("Add Ims");
		 	}
    });
	 $("form[name=frmtle] #casino_instance_id").prop('disabled', true);
	 $("form[name=frmtle] #ims_id").change(function(){
		 $("form[name=frmtle] #casino_instance_id").prop('disabled', true);
		 $("form[name=frmtle] #casino_instance_id>option").text('Loading...')
		 $("form[name=frmtle] #ims_name").val($(this).find("option:selected").text());
		 
		 populate_casino_instance_dropdown($(this).val(), "");
		 
	 });
	 
	 $("form[name=frmtle] #casino_instance_id").change(function(){
		 $("form[name=frmtle] #casino_instance_name").val($(this).find("option:selected").text());
	 });
	 
	 
	 $("form[name=frmtle]").submit(function(event) {
		 
		 var isValid = true;
		 
		 if($("form[name=frmtle] #ims_id").val()== ""){
			 alert('Please Select IMS');
			 isValid = false;
		 }
		else if($("form[name=frmtle] #casino_instance_id").val()== ""){
			 alert('Please Select Casino Instance');
			 isValid = false;
		 }
		 
		 else if($("form[name=frmtle] #tle_name").val()== ""){
			 alert('Please input tle name');
			 isValid = false;
		 }
		 else if($("form[name=frmtle] #tle_entity_key").val()== ""){
			 //alert('Please input tle entity key');
			 //isValid = false;
		 }
		 else if($("form[name=frmtle] #userfile").val()== ""){
			 //alert('Select the key file');
			 //isValid = false;
		 }
		 else if($("form[name=frmtle] #userfile1").val()== ""){
			 //alert('Select the pem file');
			 //isValid = false;
		 }
		 else{
			 
		 }
		 
		 if($("form[name=frmtle] #userfile").val()!= ""){
			 var keytype = $("form[name=frmtle] #userfile").val().substr( ($("form[name=frmtle] #userfile").val().lastIndexOf('.') +1) );
			 if(keytype!='key'){
				 alert('Invalid key file');
				 isValid = false;
				 
			 }
		 }
		 if($("form[name=frmtle] #userfile1").val()!= ""){
			 var pemtype = $("form[name=frmtle] #userfile1").val().substr( ($("form[name=frmtle] #userfile1").val().lastIndexOf('.') +1) );
			 if(pemtype!='pem'){
				 alert('Invalid pem file');
				 isValid = false;
			 }
		 }
		 if(isValid==true)
		 {	
			 $("form[name=frmtle] button#save").button('loading');
			 
			 $.ajax({
				 type: "POST",
				 url: 'imsmgt/processtle',
				 data: new FormData( this ),
				 processData: false,
			     contentType: false,
				 success: function(result){
					 $("#tlemodal").modal('hide');
					 $("#tle_tab").html("");
					 showtletable();
					 
					 $("form[name=frmtle] button#save").button('reset');
				 }
			});
		 }
		 else{
			 $("form[name=frmtle] button#save").button('reset');
		 }
		 
		 event.preventDefault(); 
		 
		 		 
	});
	 
	/*$(".filestyle").click(function(){
		$("#userfile").val('test');
	});*/ 
	 $(":file").filestyle({iconName: 'icon-small icon-folder-open'});
	
})

function populate_casino_instance_dropdown(imsid, casinoinstanceid){
	$.ajax({
		 type: "POST",
		 url: "imsmgt/populate_casino_instance_dropdown",
		 data: {
			 'ims_id': imsid
		 },
		 success: function(result){
			 if(result.length>0){
				 $("form[name=frmtle] #casino_instance_id").html(result);
				 $("form[name=frmtle] #casino_instance_id").prop('disabled', false);
				 $("form[name=frmtle] #casino_instance_id").val(casinoinstanceid);
			 }
			 
		 }
	});
}

function populate_ims_dropdown(formname){
	$.ajax({
		 type: "POST",
		 url: "imsmgt/populate_ims_dropdown",
		 success: function(result){
			 $("form[name="+formname+"] #ims_id").html(result);
		 }
	});
}

function showtletable(){
	var tbldisplay = "<table class='display' id='tletable'>";
	tbldisplay += "<thead>";
	tbldisplay += "<tr>";
	tbldisplay += "<th>#</th>";
	tbldisplay += "<th>TLE NAME</th>";
	tbldisplay += "<th>CASINO INSTANCE NAME</th>";
	tbldisplay += "<th>IMS NAME</th>";
	tbldisplay += "<th>TLE ENTITY KEY</th>";
	tbldisplay += "<th>ACTION</th>";
	tbldisplay += "</tr>";
	tbldisplay += "</thead>";
	tbldisplay += "<tbody>";
	tbldisplay += "<tr>";
	tbldisplay += "<td colspan='5' class='dataTables_empty'>";
	tbldisplay += "Empty data";
	tbldisplay += "</td>";
	tbldisplay += "</tr>";
	tbldisplay += "</tbody>";
	tbldisplay += "</table>";

	
	$("#tle_tab").html(tbldisplay);
		  var Datatable = $('#tletable').dataTable( {
		  	"bJQueryUI": false,
		  	"bProcessing": false,
		  	//"iDisplayLength": 2,
		  	//"bServerSide": true,
		  	//"bDestroy":true,
		  	"sPaginationType": "full_numbers",
		  	"bPaginate": true,
		  	"sAjaxSource": "imsmgt/get_tle_list_tabledata",
		  	"sServerMethod": "POST",
		  	"oLanguage": {
		  	 "sSearch": "Filter records:",
		  	 "sProcessing": "<img src='application/sandbox-template/images/loader.gif'>"
		     },
		     //"sDom": '<"H"lT<"#exportxls" >fr>t<"F"ip>',
		     "sDom": '<"H"lTfr>t<"F"ip>',
		     "aoColumns": [
		                   { "sWidth": "70px" },
		                   null,
		                   null,
		                   null,
		                   null,
		                   { "sWidth": "120px" }
		                   
               ]
		  	
		  } );
		  //$("div.addcasinoinstance").html('<button type="button" class="btn btn btn-default btn-sm"  data-toggle="modal" data-target="#casinoinstancemodal">Add Instance</button>');
};

function showcasinoinstancetable(){
	var tbldisplay = "<table class='display' id='casinoinstancetable'>";
	tbldisplay += "<thead>";
	tbldisplay += "<tr>";
	tbldisplay += "<th>#</th>";
	tbldisplay += "<th>CASINO INSTANCE NAME</th>";
	tbldisplay += "<th>IMS NAME</th>";
	tbldisplay += "<th>PAS INTEGRATION URL</th>";
	tbldisplay += "<th>FLASH GAME BASE URL</th>";
	tbldisplay += "<th>ACTION</th>";
	tbldisplay += "</tr>";
	tbldisplay += "</thead>";
	tbldisplay += "<tbody>";
	tbldisplay += "<tr>";
	tbldisplay += "<td colspan='5' class='dataTables_empty'>";
	tbldisplay += "Empty data";
	tbldisplay += "</td>";
	tbldisplay += "</tr>";
	tbldisplay += "</tbody>";
	tbldisplay += "</table>";

	
	$("#casino_instance_tab").html(tbldisplay);
		  var Datatable = $('#casinoinstancetable').dataTable( {
		  	"bJQueryUI": false,
		  	"bProcessing": false,
		  	//"iDisplayLength": 2,
		  	//"bServerSide": true,
		  	//"bDestroy":true,
		  	"sPaginationType": "full_numbers",
		  	"bPaginate": true,
		  	"sAjaxSource": "imsmgt/get_casino_instance_list_tabledata",
		  	"sServerMethod": "POST",
		  	"oLanguage": {
		  	 "sSearch": "Filter records:",
		  	 "sProcessing": "<img src='application/sandbox-template/images/loader.gif'>"
		     },
		     //"sDom": '<"H"lT<"#exportxls" >fr>t<"F"ip>',
		     "sDom": '<"H"lTfr>t<"F"ip>',
		     "aoColumns": [
		                   { "sWidth": "70px" },
		                   null,
		                   null,
		                   null,
		                   null,
		                   { "sWidth": "120px" }
		                   
               ]
		  	
		  } );
		  //$("div.addcasinoinstance").html('<button type="button" class="btn btn btn-default btn-sm"  data-toggle="modal" data-target="#casinoinstancemodal">Add Instance</button>');
};

function showimstable(){
	var tbldisplay = "<table class='display' id='imstable'>";
	tbldisplay += "<thead>";
	tbldisplay += "<tr>";
	tbldisplay += "<th>#</th>";
	tbldisplay += "<th>IMS NAME</th>";
	tbldisplay += "<th>IMS URL</th>";
	tbldisplay += "<th>OPEN API SERVER URL</th>";
	tbldisplay += "<th>ACTION</th>";
	tbldisplay += "</tr>";
	tbldisplay += "</thead>";
	tbldisplay += "<tbody>";
	tbldisplay += "<tr>";
	tbldisplay += "<td colspan='5' class='dataTables_empty'>";
	tbldisplay += "Empty data";
	tbldisplay += "</td>";
	tbldisplay += "</tr>";
	tbldisplay += "</tbody>";
	tbldisplay += "</table>";

	
	$("#ims_tab").html(tbldisplay);
		  var Datatable = $('#imstable').dataTable( {
		  	"bJQueryUI": false,
		  	"bProcessing": false,
		  	//"iDisplayLength": 2,
		  	//"bServerSide": true,
		  	//"bDestroy":true,
		  	"sPaginationType": "full_numbers",
		  	"bPaginate": true,
		  	"sAjaxSource": "imsmgt/get_ims_list_tabledata",
		  	"sServerMethod": "POST",
		  	"oLanguage": {
		  	 "sSearch": "Filter records:",
		  	 "sProcessing": "<img src='application/sandbox-template/images/loader.gif'>"
		     },
		     //"sDom": '<"H"lT<"#exportxls" >fr>t<"F"ip>',
		     "sDom": '<"H"lTfr>t<"F"ip>',
		     "aoColumns": [
				{ "sWidth": "70px" },
				null,
				null,
				null,
				{ "sWidth": "120px" }
		                   
               ]
		  	
		  } );
		  //$("div.addims").html('<button type="button" class="btn btn btn-default btn-sm"  data-toggle="modal" data-target="#imsmodal">Add Ims</button>');
};

$("form[name=frmims] button#save").click(function(){
	var form_elements = $("form[name=frmims] :input");
	var form_inputs = new Object();
	var isValid = true;
	var btn = $(this);
    
	$.each(form_elements, function(obj, ele){
	
		var inputname = ele.name;
		
		form_inputs[ele.name] = ele.value;
		if(ele.name!=""){
			if(ele.value==""){	
				isValid = false;
				$("#" + ele.name).focus();
				return false;
			}
		}
	})
	
	if(isValid){
		btn.button('loading');
		var str = $( "#frmims" ).serializeArray();
		var _url = "";
		if($(".imsidhidden").val()==""){
			_url = "createims";
		}
		else{
			_url = "updateims";
		}
		
		 $.ajax({
			 type: "POST",
			 url: "imsmgt/" + _url,
			 data: {
			  "formparams": str
			 },
			 success: function(result){
				 alert(result);
				 if(result!="IMS name already exists."){
					 $("#imsmodal").modal('hide');
					 $("#ims_tab").html("");
				     showimstable();
				 }
				 btn.button('reset');
			 }
		});
		
	}
	else{
		alert('Please fill-up all the fields.');
		btn.button('reset');
	}
	
	
});


function editims(imsid){
	$("#imsmodallabel").html('Edit Ims');
	$("#frmims").hide();
	$.ajax({
		 type: "POST",
		 url: "imsmgt/get_ims_data",
		 data: {
		  "ims_id": imsid
		 },
		 success: function(result){
			 	var obj = jQuery.parseJSON(result);
			 	$.each(obj[0], function(k, v){
			 		$("#" + k).val(v);
			 		if(k=='ims_id'){
			 			$(".imsidhidden").attr("name", "ims_id").val(v);
			 		}
			 	});
			 	$("#frmims").show();
		 }
	});
}

function deleteims(imsid){
	
	bootbox.confirm("Delete IMS?", function(result) {
		  if(result){
				$.ajax({
					 type: "POST",
					 url: "imsmgt/deleteims",
					 data: {
					  "ims_id": imsid
					 },
					 success: function(result){
						 bootbox.alert(result, function(){
							 $("#ims_tab").html("");
						     showimstable();
						 });
						 	 
					 }
				});
		  }
	}); 
	
}


function editcasinoinstance(casinoinstanceid){
	$("#casinoinstancemodallabel").html('Edit Casino Instance');
	$("#frmcasinoinstance").hide();
	$.ajax({
		 type: "POST",
		 url: "imsmgt/get_casino_instance_data",
		 data: {
		  "casino_instance_id": casinoinstanceid
		 },
		 success: function(result){
			 	var obj = jQuery.parseJSON(result);
			 	$.each(obj[0], function(k, v){
			 		$("#" + k).val(v);
			 		if(k=='casino_instance_id'){
			 			$(".casinoinstanceidhidden").attr("name", "casino_instance_id").val(v);
			 		}
			 	});
			 	$("#frmcasinoinstance").show();
		 }
	});
}

function deletecasinoinstance(casinoinstanceid){
	
	bootbox.confirm("Delete Casino Instance?", function(result) {
		if(result){
			$.ajax({
				 type: "POST",
				 url: "imsmgt/deletecasinoinstance",
				 data: {
				  "casino_instance_id": casinoinstanceid
				 },
				 success: function(result){
					 bootbox.alert(result, function(){
						 $("#casinoinstance_tab").html("");
						 showcasinoinstancetable(); 
					 });
					 	
				 }
			});
		}
	});
	
}

function deletetle(tleid){
	
	bootbox.confirm("Delete TLE?", function(result) {
		if(result){
			$.ajax({
				 type: "POST",
				 url: "imsmgt/deletetle",
				 data: {
				  "tle_id": tleid
				 },
				 success: function(result){
					var obj = jQuery.parseJSON(result);
					 bootbox.alert(obj.msg, function(){
						 if(obj.reload==1){
							 location.reload();
						 }
						 else{
							 $("#tle_tab").html("");
							 showtletable(); 
						 }
					 });
				 }
			});
		}
	});
	
}

$("form[name=frmcasinoinstance] button#save").click(function(){
	var form_elements = $("form[name=frmcasinoinstance] :input");
	var form_inputs = new Object();
	var isValid = true;
	var btn = $(this);
    
	$.each(form_elements, function(obj, ele){
	
		var inputname = ele.name;
		
		form_inputs[ele.name] = ele.value;
		if(ele.name!=""){
			if(ele.value==""){	
				isValid = false;
				$("#" + ele.name).focus();
				return false;
			}
		}
	})
	
	if(isValid){
		btn.button('loading');
		var str = $( "#frmcasinoinstance" ).serializeArray();
		var _url = "";
		if($(".casinoinstanceidhidden").val()==""){
			_url = "createcasinoinstance";
		}
		else{
			_url = "updatecasinoinstance";
		}
		
		 $.ajax({
			 type: "POST",
			 url: "imsmgt/" + _url,
			 data: {
			  "formparams": str
			 },
			 success: function(result){
				 alert(result);
				 if(result!="Casino Instance Name already exist in this IMS."){
					 $("#casinoinstancemodal").modal('hide');
					 $("#casinoinstance_tab").html("");
				     showcasinoinstancetable();
				 }
				 
				 btn.button('reset'); 
			 }
		});
		
	}
	else{
		alert('Please fill-up all the fields.');
		btn.button('reset'); 
	}
	
	
});



function edittle(tleid){
	$("#tlemodallabel").html('Edit TLE');
	$("#frmtle").hide();
	
	$.ajax({
		 type: "POST",
		 url: "imsmgt/get_tle_data",
		 data: {
		  "tle_id": tleid
		 },
		 success: function(result){
			 	var obj = jQuery.parseJSON(result);
			 	var imsid = "";
			 	var casinoinstanceid = "";
			 	$.each(obj[0], function(k, v){
			 					 		
			 			if($.trim(k)=='tle_id'){
				 			$("#frmtle .tleidhidden").attr("name", "tle_id").val(v);
				 		}
			 			else if($.trim(k)=='filekey'){
				 			$("#frmtle #filekey").html(v);
				 		}
			 			else if($.trim(k)=='filepem'){
			 				$("#frmtle #filepem").html(v);
				 		}
			 			else{
			 				 if($.trim(k)=='ims_id'){
			 					imsid = v;
			 					
			 				}
			 				else if($.trim(k)=='casino_instance_id'){
			 					casinoinstanceid = v;
			 				}
			 				else{
			 					$("#frmtle #" + $.trim(k)).val(v);
			 				}
			 				
			 			}
			 			
			 	});
			 	populate_casino_instance_dropdown(imsid, casinoinstanceid);
			 	$("#frmtle #ims_id").val(imsid);
			 	$("#frmtle").show();
		 }
	});

}


