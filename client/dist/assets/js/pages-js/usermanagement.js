$(document).on({
	ajaxStart: function() { $('#loading-indicator').show();},
	ajaxStop: function() { $('#loading-indicator').hide(); }    
});

$.fn.bootstrapSwitch.defaults.size = 'mini';
$.fn.bootstrapSwitch.defaults.onColor = 'success';
$.fn.bootstrapSwitch.defaults.offColor = 'danger';

$(".switchbtn").bootstrapSwitch();

$('.switchbtn').on('switchChange.bootstrapSwitch', function(event, state) {
	
	var classname = $(this).attr('class');
	var parentclass = classname.substring(classname.lastIndexOf(" ") + 1, classname.length);
	
	this.value = state;

	if(parentclass=='parent'){
		if(state==false){
			$(".childof_" + this.id).bootstrapSwitch('state', false);
		}
		else{
			$(".childof_" + this.id).bootstrapSwitch('state', true);
		}
	}
  
});

function create_user(){
	var config_values = "";
	$('#createuser_checkbox .switchbtn').each(function(n, a, s){
		if(this.value != 'false' && this.value!=false && this.value!='off'){
			if(config_values.length > 0){
				config_values += ",";
			}
			config_values += this.id;
		}
		
	});
	
	var str = $( "#frm_createuser" ).serializeArray();
	
	$.ajax({
		 type: "POST",
		 url: "usermanagement/createuser",
		 data: {
		  "config_values": config_values,
		  "formparams": str
		 },
		 success: function(result){
			 alert(result);
		 }
	});
	
}

$("#entitylist").change(function(){
	var entityname = $(this).val();
	var uri = "entity/info/entityname/" + entityname;
	$.ajax({
		 type: "POST",
		 url: "ajax/api_request",
		 data: {
		  "params": uri
		 },
		 success: function(result){
			var obj = jQuery.parseJSON(result);
			$("#entitykey").val(obj.json_format.result.entitykey);
			//console.log(obj.json_format);
		 }
	});
	
})

$("#edit_entitylist").change(function(){
	var entityname = $(this).val();
	var uri = "entity/info/entityname/" + entityname;
	$.ajax({
		 type: "POST",
		 url: "ajax/api_request",
		 data: {
		  "params": uri
		 },
		 success: function(result){
			var obj = jQuery.parseJSON(result);
			$("#edit_entitykey").val(obj.json_format.result.entitykey);
			//console.log(obj.json_format);
			
		 }
	});
	
})


$("#liedituser").click(function(){
	showdatatable();
})

function showdatatable(){
	var tbldisplay = "<table class='display' id='userstable'>";
	tbldisplay += "<thead>";
	tbldisplay += "<tr>";
	tbldisplay += "<th>USERNAME</th>";
	tbldisplay += "<th>FIRSTNAME</th>";
	tbldisplay += "<th>LASTNAME</th>";
	tbldisplay += "<th>EMAIL</th>";
	tbldisplay += "<th>STATUS</th>";
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

	
	$("#div_userstable").html(tbldisplay);
		  var Datatable = $('#userstable').dataTable( {
		  	"bJQueryUI": false,
		  	"bProcessing": false,
		  	//"iDisplayLength": 2,
		  	//"bServerSide": true,
		  	//"bDestroy":true,
		  	"sPaginationType": "full_numbers",
		  	"bPaginate": true,
		  	"sAjaxSource": "usermanagement/getusers",
		  	"sServerMethod": "POST",
		  	"oLanguage": {
		  	 "sSearch": "Filter records:",
		  	 "sProcessing": "<img src='application/sandbox-template/images/loader.gif'>"
		     },
		     //"sDom": '<"H"lT<"#exportxls" >fr>t<"F"ip>',
		     "sDom": '<"H"lTfr>t<"F"ip>'
		  	
		  } );
	
}



function edituser(id){
	$( "#btnmodal" ).removeClass();
	$( "#btnmodal" ).addClass(id);
	$( "#btnmodal" ).trigger( "click" );
}


function updatestatus(id, data){

	if(confirm('Update status?')){
		
		$.post( "usermanagement/updatestatus", { id: id, data: data })
		  .done(function( result ) {
		    alert("Update success" + result);
		    	$("#div_userstable").html("");
		    	showdatatable();
		    
		  });
	}
	
	
}


$('#btnmodal').hide();
$( "#btnmodal" ).on( "click", function() {
	
	$.ajax({
		 type: "POST",
		 url: "usermanagement/getuserdata",
		 data: {
		  "id": $(this).attr('class')
		 },
		 success: function(result){
			var obj = jQuery.parseJSON(result);
			
			$("#adminid").val(obj.result[0].id);
			$("#adminname").val(obj.result[0].adminname);
			$("#lastname").val(obj.result[0].lastname);
			$("#username").val(obj.result[0].username);
			$("#email").val(obj.result[0].email);
			$("#edit_entitykey").val(obj.result[0].api_key);
			$("#edit_entitylist").val(obj.result[0].entityname);
			$("#edit_usertype").val(obj.result[0].admintype);
			
			if(obj.admintype=='2'){
				$("#edit_usertype").attr('disabled', true);
				$("#edituser_checkbox").html("You have no access to view permissions.");
			}
			else{
				$("#edituser_checkbox").html(obj.permissions);
			}
			
			
			
			
			
			$(".switchbtn").bootstrapSwitch();
			
			$('.switchbtn').on('switchChange.bootstrapSwitch', function(event, state) {
				
				var classname = $(this).attr('class');
				var parentclass = classname.substring(classname.lastIndexOf(" ") + 1, classname.length);
				
				this.value = state;

				if(parentclass=='parent'){
					if(state==false){
						$(".childof_" + this.id).bootstrapSwitch('state', false);
					}
					else{
						$(".childof_" + this.id).bootstrapSwitch('state', true);
					}
				}
			  
			});
			
		 }
	});
	
});


$.ajax({
    type: "POST",
    url: "ajax/api_request",
    data: {
    	'params' : 'entity/structure'
	},
    success: function(result) {
    	
    	
    	
    	var obj = jQuery.parseJSON(result);
    	
    	var res = recursiveIteration(obj.json_format);
    	
    	var items = res.split('|');
    	
    	var entity = items[1].split(',');
    	var kiosk = items[3].split(',');
    	var admins = items[5].split(',');
    	
    	//entity
    	var entity_str = '<option value="" >-Select Entity-</option>';
    	if(entity.length>0){
    		for(var i=0; i<entity.length; i++){
    			entity_str += "<option value='"+entity[i]+"'>"+entity[i]+"</option>"
    		}
    	}
    	else{
    		entity_str = '<option value="" >-No Data-</option>';
    	}
    	
    	//kiosk
    	var kiosk_str = '<option value="" >-Select Kiosk-</option>';
    	if(kiosk.length>0){
    		for(var i=0; i<kiosk.length; i++){
    			kiosk_str += "<option value='"+kiosk[i]+"'>"+kiosk[i]+"</option>"
    		}
    	}
    	else{
    		kiosk_str = '<option value="" >-No Data-</option>';
    	}
    	
    	//admins
    	var admins_str = '<option value="" >-Select Admin-</option>';
    	if(admins.length>0){
    		for(var i=0; i<admins.length; i++){
    			admins_str += "<option value='"+admins[i]+"'>"+admins[i]+"</option>"
    		}
    	}
    	else{
    		admins_str = '<option value="" >-No Data-</option>';
    	}
    	
    	$("#entitylist").html(entity_str);
    	$("#edit_entitylist").html(entity_str);
    	
	}
});
var entity = '';
var kiosk = '';
var admins = ''
var result = '';
function recursiveIteration(object, keyvalue) {
	
	
	//var i = 0;
    for (var property in object) {
    	
        if (object.hasOwnProperty(property)) {
        	
        	if(property=='entity'){
        		if (typeof object[property] == "object"){
        			
        			
        			if(object[property].ENTITYNAME!=null){
        				if(entity.length>0){
            				entity += ",";
            			}
        				entity += object[property].ENTITYNAME;
        			}
        			
        			
        			//console.log(result);
        		}
        	}
        	else if(property=='kiosk'){
        		if (typeof object[property] == "object"){
        			
        			if(object[property].KIOSKNAME!=null){
        				
        				if(kiosk.length>0){
            				kiosk += ",";
            			}
        				kiosk += object[property].KIOSKNAME;
        			}
        			
        		}
        	}
        	else if(property=='admins'){
        		
        		
        		if (typeof object[property] == "object"){
        		
        			for(var i=0; i<object[property].length; i++){
        				if(admins.length>0){
            				admins += ",";
            			}
        				admins += object[property][i].ADMINNAME;
        			}
        			
        		}
        		
        	}
        	
            if (typeof object[property] == "object"){
            	//console.log(object[property]);
            	
                recursiveIteration(object[property]);
            }else{
                //found a property which is not an object, check for your conditions here
            }
        }
        
    }
    result = 'entity|'+ entity +'|kiosk|'+ kiosk + '|admins|'+ admins;
    return result;
}


$("#btnupdateuser").click(function(){
	
	var config_values = "";
	$('#edituser_checkbox .switchbtn').each(function(n, a, s){
		if(a.value != 'false' && a.value!=false && a.value!='off'){
			if(config_values.length > 0){
				config_values += ",";
			}
			config_values += a.id;
		}
		
	});
	
	var str = $( "#frm_edituser" ).serializeArray();
	
	$.ajax({
		 type: "POST",
		 url: "usermanagement/updateuser",
		 data: {
		  "permissions": config_values,
		  "formvalues" : str
		 },
		 success: function(result){
			 alert(result);
		 }
	});
	
});


$(function () {
	/* $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
            $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
        } else {
            children.show('fast');
            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
        }
        e.stopPropagation();
    });
    */
});
