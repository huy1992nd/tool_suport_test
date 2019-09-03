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

$('input:checkbox[name="User management"]').bootstrapSwitch('readonly', true);
$('input:checkbox[name="IMS management"]').bootstrapSwitch('readonly', true);

$("select[name='usertype']").change(function(n){
	var usertype = $(this).val();
	
	if(usertype=="1"){
		
		$('input:checkbox[name="User management"]').bootstrapSwitch('readonly', false);
		$('input:checkbox[name="User management"]').bootstrapSwitch('state', true);
		$('input:checkbox[name="User management"]').bootstrapSwitch('readonly', true);
		
		$('input:checkbox[name="IMS management"]').bootstrapSwitch('readonly', false);
		$('input:checkbox[name="IMS management"]').bootstrapSwitch('state', true);
		$('input:checkbox[name="IMS management"]').bootstrapSwitch('readonly', true);
	}
	else{
		$('input:checkbox[name="User management"]').bootstrapSwitch('readonly', false);
		$('input:checkbox[name="User management"]').bootstrapSwitch('state', false);
		$('input:checkbox[name="User management"]').bootstrapSwitch('readonly', true);
		
		$('input:checkbox[name="IMS management"]').bootstrapSwitch('readonly', false);
		$('input:checkbox[name="IMS management"]').bootstrapSwitch('state', false);
		$('input:checkbox[name="IMS management"]').bootstrapSwitch('readonly', true);
	}
})


function showdatatable(){
	var tbldisplay = "<table class='display' id='userstable'>";
	tbldisplay += "<thead>";
	tbldisplay += "<tr>";
	tbldisplay += "<th>USERNAME</th>";
	tbldisplay += "<th>FIRSTNAME</th>";
	tbldisplay += "<th>LASTNAME</th>";
	tbldisplay += "<th>DEFAULT IMS</th>";
	tbldisplay += "<th>DEFAULT INSTANCE</th>";
	tbldisplay += "<th>DEFAULT TLE</th>";
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
		  	"sAjaxSource": "usermgt/getusers",
		  	"sServerMethod": "POST",
		  	"oLanguage": {
		  	 "sSearch": "Filter records:",
		  	 "sProcessing": "<img src='application/sandbox-template/images/loader.gif'>"
		     },
		     //"sDom": '<"H"lT<"#exportxls" >fr>t<"F"ip>',
		     "sDom": '<"H"lTfr>t<"F"ip>'
		  	
		  } );
	
}

function updateuserstatus(id, data){

	if(confirm('Update status?')){
		
		$.post( "usermgt/updatestatus", { userid: id, data: data })
		  .done(function( result ) {
		    alert("Update success" + result);
		    	$("#div_userstable").html("");
		    	showdatatable();
		    
		  });
	}
	
	
}

$(function () {
	showdatatable();

	$('#myModal').on('hidden.bs.modal', function(){
		$("form[name=frmuser]").trigger("reset");
		
		
		$("#default_tle")
		.find('option')
		.remove()
		.end()
		.append('<option value="">-Select Default TLE-</option>')
	    .val('');
		
    	$("select.multiselect").val([]);
    	$("select.multiselect").multiselect('refresh');
    	
    	$('#casino_instance_ids').multiselect('disable');
    	$('#tle_ids').multiselect('disable');
		
		$(".switchbtn").bootstrapSwitch('state', true);
		$(".pword").show();
		$("#password").prop('disabled', false);
		$("#cpassword").prop('disabled', false);
		$(".useridhidden").removeAttr("name");
		$(".useridhidden").val("");
		$("#myModalLabel").html('Add user');
		
		imsonchange();
    });
	
	
	
	initialize_multiselect();
	imsonchange();
	
	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
});

function initialize_multiselect(){
	$('#ims_ids').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        maxHeight: 200,
		buttonWidth: '260px',
		disableIfEmpty: true,
		onDropdownHide: function(element, checked){
			imsonchange();
			$("#casino_instance_ids").val([]);
	    	$("#casino_instance_ids").multiselect('refresh');
			
	    	$("#tle_ids").val([]);
	    	$("#tle_ids").multiselect('refresh');
			$('#tle_ids').multiselect('disable');
			
	    	
		},
        onDropdownShow: function(element, checked){
        	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
        }
	});
	
	$('#casino_instance_ids').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        maxHeight: 200,
		buttonWidth: '260px',
		disableIfEmpty: true,
        onDropdownShow: function(element, checked) {
            get_tles();
        },
        onDropdownShow: function(element, checked){
        	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
        }
	});

	$('#tle_ids').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        maxHeight: 200,
		buttonWidth: '260px',
		disableIfEmpty: true,
        onDropdownHide: function(element, checked) {
           
        	var brands = $('#tle_ids option:selected');
	        var selected = [];
	        var $html = {};
	        var $optgrouplabel = "";
	         
	        $(brands).each(function(index, brand){
	        	
	            if($(this).parent().attr("label")!=$optgrouplabel){
	            	$optgrouplabel = $(this).parent().attr("label");
	            	$html[$optgrouplabel] = [];
	            }
	            $html[$optgrouplabel].push(brand.outerHTML);
	        });
	        var str = '<select class="form-control combobox" id="default_tle" name="default_tle" tabindex="4">';
	        $options = "";
	        $.each($html, function(o, e){
	        	$options += "<optgroup class='optiongrp' label='"+o+"'>";
	        	
	        	$.each(e, function(a, b){
	        		$options += b;
	        	});
	        	$options += "</optgroup>";
	        	
	        })
	        str += $options;
	        str += "</select>";
	        $("#div_default_tle").html(str);
            
	        $('#default_tle').multiselect({
	            includeSelectAllOption: true,
	            enableFiltering: true,
	            maxHeight: 200,
	    		buttonWidth: '260px',
	    		disableIfEmpty: true,
	            onDropdownHide: function(element, checked) {
	                
	            }
	    	});
	        
        },
        onDropdownShow: function(element, checked){
        	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
        }
	});
	
	$('#default_tle').multiselect({
        includeSelectAllOption: true,
        enableFiltering: true,
        maxHeight: 200,
		buttonWidth: '260px',
		disableIfEmpty: true,
        onDropdownHide: function(element, checked) {
            
        }
	});
	
	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
}

function imsonchange(){
	

		var ims_id = $('#ims_ids').val()
		$.ajax({
		    type: "POST",
		    url: "usermgt/get_ims_casino_instances",
		    data: {
		    	'params' : ims_id
		    },
		    success: function(result) {
		    	var obj = jQuery.parseJSON(result);
		    	var str = '<select class="form-control combobox multiselect" id="casino_instance_ids" name="casino_instance_ids" tabindex="2" multiple="multiple">';
		    	
		    	$.each( obj, function( key, value ) {
		    		str += '<optgroup label="'+key+'">';
		    		$.each( value, function( k, v ) {
		    			str += '<option value="' +v.casino_instance_id +'">' + v.casino_instance_name + '</option>';
		    		})
		    		str += '</optgroup>';
		   		});
		    	str += '</select>';
		    	//console.log(str);
		    	
		    	$("select[name='casino_instance_ids']").prop('disabled', false);
		    	$('#div_casino_instance').html(str);
		    	//$("select[name='casino_instance_ids']").trigger('change');
		    	
		    	$('#casino_instance_ids').multiselect({
		            includeSelectAllOption: true,
		            enableFiltering: true,
		            maxHeight: 150,
		            buttonWidth: '260px',
		            onDropdownHide: function(element, checked) {
		                get_tles();
		                
		            },
		            onDropdownShow: function(element, checked){
		            	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
		            }

		    	});
		    	
			}
		});
		$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');	
}




function get_tles(){
	var casino_instance_id = $('#casino_instance_ids').val();
	//console.log(casino_instance_id)
	//$("select[name='tle_ids']").prop('disabled', true);

	$.ajax({
	    type: "POST",
	    url: "usermgt/get_casino_instance_tles",
	    data: {
	    	'params' : casino_instance_id
	    },
	    success: function(result) {
	    	
	    	var obj = jQuery.parseJSON(result);
	    	var str = '<select class="form-control combobox multiselect" id="tle_ids" name="tle_ids" tabindex="3" multiple="multiple">';
	    	
	    	$.each( obj, function( key, value ) {
	    		str += '<optgroup label="'+key+'">';
	    		$.each( value, function( k, v ) {
	    			str += '<option value="' + v.tle_id +'">' + v.tle_name + '</option>';
	    		})
	    		str += '</optgroup>';
	   		});
	    	str += '</select>';
	    	//;console.log(str);
	    	
	    	$("select[name='tle_ids']").prop('disabled', false);
	    	$('#div_tle').html(str);
	    	//$("select[name='casino_instance_ids']").trigger('change');
	    	
	    	$('#tle_ids').multiselect({
	            includeSelectAllOption: true,
	            enableFiltering: true,
	            maxHeight: 150,
	            buttonWidth: '260px',
	            onDropdownHide: function(element, checked) {
	            	var brands = $('#tle_ids option:selected');
	    	        var selected = [];
	    	        var $html = {};
	    	        var $optgrouplabel = "";
	    	         
	    	        $(brands).each(function(index, brand){
	    	        	
	    	            if($(this).parent().attr("label")!=$optgrouplabel){
	    	            	$optgrouplabel = $(this).parent().attr("label");
	    	            	$html[$optgrouplabel] = [];
	    	            }
	    	            $html[$optgrouplabel].push(brand.outerHTML);
	    	        });
	    	        var str = '<select class="form-control combobox" id="default_tle" name="default_tle" tabindex="4">';
	    	        $options = "";
	    	        $.each($html, function(o, e){
	    	        	$options += "<optgroup class='optiongrp' label='"+o+"'>";
	    	        	
	    	        	$.each(e, function(a, b){
	    	        		$options += b;
	    	        	});
	    	        	$options += "</optgroup>";
	    	        	
	    	        })
	    	        str += $options;
	    	        str += "</select>";
	    	        $("#div_default_tle").html(str);
	    	        
	    	        $('#default_tle').multiselect({
	    	            includeSelectAllOption: true,
	    	            enableFiltering: true,
	    	            maxHeight: 200,
	    	    		buttonWidth: '260px',
	    	    		disableIfEmpty: true,
	    	            onDropdownHide: function(element, checked) {
	    	                
	    	            }
	    	    	});
	    	        $("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');	
	            },
	            onDropdownShow: function(element, checked){
	            	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
	            }
	    	});
		}
	});
	
	$("span.input-group-addon > i").removeClass('glyphicon glyphicon-search').addClass('icon-small icon-search');
}


function edituser(id){
	$('#permissions').html('');
	$("#myModalLabel").html('Edit user');
	$.ajax({
		 type: "POST",
		 url: "usermgt/getuserdata",
		 data: {
		  "userid": id
		 },
		 success: function(result){
			 	var obj = jQuery.parseJSON(result);
			 	
			 	$('#permissions').html(obj.permissions);
			 	$(".switchbtn").bootstrapSwitch();
			 	$('input:checkbox[name="User management"]').bootstrapSwitch('readonly', true);
			 	
			 	$("#div_ims").html(obj.imshtml);
			 	$("#div_casino_instance").html(obj.casinoinstancehtml);
			 	$("#div_tle").html(obj.tlehml);
			 	
			 	$.each(obj.result[0], function(obj, ele){
			 		if($("#" + obj).length>0){
			 			
			 			$("#" + obj).val(ele);
			 			if(obj=='password' || obj=='cpassword'){
			 				$("#cpassword").val(ele);
			 				$("#" + obj).prop('disabled', true);
			 				$("#cpassword").prop('disabled', true);
			 			}
			 			else{
			 				$("#" + obj).prop('disabled', false);
			 			}
			 			
			 		}

			 		if(obj=='userid'){
			 			$(".useridhidden").attr("name", "userid").val(ele);
			 		}
			 				 		
			 	});
			 	$(".pword").hide();
			 	
			 	
			 	var imsstr = "";
			 	
			 	
			 	//var default_tle = "";
			 	imsstr = '<select class="form-control combobox multiselect" id="ims_ids" name="ims_ids" tabindex="1" multiple>';
			 	$.each(obj.imslist, function(o, ele){
			 	
			 		if(jQuery.inArray(ele.ims_id, obj.users_ims)>=0){
			 			imsstr += '<option value="' + ele.ims_id + '" selected="selected">' + ele.ims_name + '</option>';
			 		}
			 		else{
			 			imsstr += '<option value="' + ele.ims_id + '">' + ele.ims_name + '</option>';
			 		}
			 		
			 	});
			 	imsstr += '</select>';
			 	$('#div_ims').html(imsstr);
			 	
			 	var instancestr = "";
			 	instancestr = '<select class="form-control combobox multiselect" id="casino_instance_ids" name="casino_instance_ids" tabindex="2" multiple>';
			 	$.each(obj.imslist, function(ob, ele){
			 		if(jQuery.inArray(ele.ims_id, obj.users_ims)>=0){
			 			instancestr += '<optgroup label="'+ele.ims_name+'">';
			 				//console.log(obj.casinoinstancelist);
				 			$.each(obj.casinoinstancelist, function(o, e){
				 				if(e.ims_id==ele.ims_id){
				 					
				 					if(jQuery.inArray(e.casino_instance_id, obj.users_casino_instance)>=0){
						 				instancestr += '<option value="' + e.casino_instance_id + '" selected="selected">' + e.casino_instance_name + '</option>';
							 		}
							 		else{
							 			instancestr += '<option value="' + e.casino_instance_id + '">' + e.casino_instance_name + '</option>';
							 		}
				 					
					 				
						 		}
						 		
				 			});
			 			
			 				//console.log(ele);
			 			instancestr += '</optgroup>';
			 		}
			 		
			 	});
			 	instancestr += '</select>';
			 	$('#div_casino_instance').html(instancestr);
			 	//console.log(instancestr);
			 	
			 	var tlestr = "";
			 	var defaulttlestr = "";
			 	tlestr = '<select class="form-control combobox multiselect" id="tle_ids" name="tle_ids" tabindex="2" multiple>';
			 	defaulttlestr = '<select class="form-control combobox" id="default_tle" name="default_tle" tabindex="4">';
			 	$.each(obj.casinoinstancelist, function(ob, ele){
			 		if(jQuery.inArray(ele.casino_instance_id, obj.users_casino_instance)>=0){
			 			tlestr += '<optgroup label="'+ele.casino_instance_name+'">';
			 			defaulttlestr += '<optgroup label="'+ele.casino_instance_name+'">';
			 			
				 			$.each(obj.tlelist, function(o, e){
				 				if(e.casino_instance_id==ele.casino_instance_id){
				 					
				 					if(jQuery.inArray(e.tle_id, obj.users_tle)>=0){
				 						tlestr += '<option value="' + e.tle_id + '" selected="selected">' + e.tle_name + '</option>';
							 		}
							 		else{
							 			tlestr += '<option value="' + e.tle_id + '">' + e.tle_name + '</option>';
							 		}
				 					
				 					if(obj.result[0].default_tle==e.tle_id){
				 						defaulttlestr += '<option value="' + e.tle_id + '" selected="selected">' + e.tle_name + '</option>';
					 				}
				 					else{
				 						defaulttlestr += '<option value="' + e.tle_id + '">' + e.tle_name + '</option>';
					 				}
						 		}
						 		
				 			});
			 			
				 			tlestr += '</optgroup>';
				 			defaulttlestr += '</optgroup>';
			 		}
			 		
			 	});
			 	tlestr += '</select>';
			 	defaulttlestr += '</select>';
			 	$('#div_tle').html(tlestr);
			 	$('#div_default_tle').html(defaulttlestr);
			 
			 	
			 	initialize_multiselect();
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
	
}

$("button#save").click(function(){
	var tles = "";
	var form_elements = $("form[name=frmuser] :input");
	var form_inputs = new Object();
	var isValid = true;
	
	
	
	$.each(form_elements, function(obj, ele){
	
		var inputname = ele.name;
		if(ele.title){
			tles += ele.title;
		}

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
		if($('#password').val()==$('#cpassword').val()){
			var config_values = "";
			$('#permissions .switchbtn').each(function(n, a, s){
				if(this.value != 'false' && this.value!=false && this.value!='off'){
					if(config_values.length > 0){
						config_values += ",";
					}
					config_values += this.id;
				}
				
			});
			
			var str = $( "#frmuser" ).serializeArray();
			var _url = "";
			if($(".useridhidden").val()==""){
				_url = "createuser";
			}
			else{
				_url = "updateuser";
			}
			
			
			 $.ajax({
				 type: "POST",
				 url: "usermgt/" + _url,
				 data: {
				  "config_values": config_values,
				  "formparams": str
				 },
				 success: function(result){
					 var obj = jQuery.parseJSON(result);
					 
					 if(obj.msg!='Username already exists.'){
						 if(obj.reload==1){
							 $("#myModal").modal('hide');
							 $("#div_userstable").html("");
						     showdatatable();
							 bootbox.alert(obj.msg, function(){
								 location.reload();
							 })
						 }	
						 else{
							 							 
							 $("#myModal").modal('hide');
							 bootbox.alert(obj.msg, function(){
								 $("#div_userstable").html("");
							     showdatatable();
							 })
							 
						 }
						 
					 }
					  
				 }
			});
		}
		else{
			alert('Confirmation password did not match.');
		}
	}
	else{
		alert('Please fill-up all the fields.');
	}
	
	
});
