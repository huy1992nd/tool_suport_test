$(document).ajaxStop($.unblockUI);
var site_url = $("input[name='site_url']").val();
$(function(){
	
	$('.colorpicker').spectrum({
	    color: "#000",
		showPalette: true,
		palette: [["black", "white", "green", "yellow", "blue", "red", "orange", "indigo", "violet"]],
		showInitial: true,
		showInput: true,
		hideAfterPaletteSelect:true,
		preferredFormat: "hex"
	});
	$("select[name='product']").change(function(){
		var product = $(this).val();
		var template = $("select[name='template']").val();
		
		var url = site_url+"admin/apkinstaller/ajax/get_template?product="+product;
		
		if($("select[name='template']")!=null){
			var template = $("select[name='template']").val();
			var url2 = site_url+"admin/apkinstaller/ajax/get_parameters?product="+product+"&template="+template;
		}
		$.ajax({url:url,
			   type:"GET",
			   success:function(res){
				   $("#templates-container").html(res.result);
			    }
		});
	});
	$("select[name='template']").change(function(){
		var product = $("select[name='product']").val();
		var template = $(this).val();
	
		var url = site_url+"admin/apkinstaller/ajax/get_parameters?product="+product+"&template="+template;
				
		$.ajax({url:url,
			   type:"GET",
			   success:function(res){
				   $("#parameters-container").html(res.result);
			    }
		});
	});
	$("#installer-form").submit(function(e){
		e.preventDefault();
		var btn = $("#btn_create_installer");
		var frm = $(this);
		var data = frm.serialize();
		var url = site_url+"admin/apkinstaller/ajax/order_product";
		btn.button("loading");
		
		$.ajax({
			url:url,
			data:data,
			type:"GET",
			dataType:"json",
			success:function(res){
				//alert(res);
				var orderID = "";
				$("input[name='order_id']").val("");
				if(res.result.orderId!=null){ var orderID = res.result.orderId;}
				else{alert(res.result.message)}
				if(res.curl_info!=null){debuggerDisplay(res.curl_info,res.result,'POST',data);}
				$("input[name='order_id']").val(orderID);	
				$("input[name='order_id']").trigger("change");
				btn.button("reset");
				//var url2 = window.location.href+"/ajax/check_order_status";
				//var data2 = "order_id="+orderID;
				if(orderID!=""){
				$("#statusBtn").trigger("click");
				}
				/*
				if(orderID!=""){
					$.ajax({
							url:url2,
							data:data,
							type:"GET",
							dataType:"json",
							success:function(res2){
								$("input[name='order_status']").val("");
								if(res2.result.status!=null){
									$("input[name='order_status']").val(res2.result.status);
									$("input[name='artifact']").val(res2.result.artifacts[0].toString());
								}
								else{alert(res2.result.message);}
								$("#btn_download_installer").removeClass("disabled");
								if($("input[name='artifact']").val().length>0){$("#btn_download_installer").removeClass("disabled");}
								else{$("#btn_download_installer").addClass("disabled");}
								btn.button("reset");
							}
					});
				}
				*/
			}
		});
		
	});
	$("input[name='order_id']").change(function(){
			if($(this).val().length!=""){$("#statusBtn").removeClass("disabled");}
			else{$("#statusBtn").addClass("disabled");}
	});
	$("#statusBtn").click(function(){
			var order_id = $("input[name='order_id']").val();
			var url = site_url+"admin/apkinstaller/ajax/check_order_status";
			var data = "order_id="+order_id;
			var btn = $(this);
			btn.button("loading");
			//alert(url);
			$.ajax({
				url:url,
				data:data,
				type:"GET",
				dataType:"json",
				success:function(res){
					$("input[name='order_status']").val("");
					//alert(res.curl_info)
					if(res.curl_info!=null){debuggerDisplay(res.curl_info,res.result,'GET',data);}
					if(res.result.status!=null){
						$("input[name='order_status']").val(res.result.status);
						$("input[name='artifact']").val(res.result.artifacts[0].toString());
					}
					else{//alert(res.result.message);
					$("input[name='order_status']").val(res.result.message)
					}
					$("#btn_download_installer").removeClass("disabled");
					if($("input[name='artifact']").val().length>0){$("#btn_download_installer").removeClass("disabled");}
					else{$("#btn_download_installer").addClass("disabled");}
					btn.button("reset");
				}
			});
	});
	$("#btn_download_installer").click(function(){
		var artifact = $("input[name='artifact']").val();
		var url = $("input[name='download_url']").val()+"&artifact="+artifact;
		window.location.href = url;
	});
	
}
);
function createDebugger(debug_fields){
	var str = '';
	for(i in debug_fields){
		str +='<div class="form-group">';
		str +='<label for="'+i+'" class="control-label">'+i+'</label>';
		str +='<input type="text" class="form-control" name="'+i+'" value="'+debug_fields[i]+'">';
		str +='</div>';
	}
	return str;
}
function debuggerDisplay(debug_fields,resp,type,params){
	var params = decodeURI(params);
	var current_val = $("#db-list").html();
	str = '\n';
	str +='********************************************************************************************************************************************************************************';
	str +='\n';
	
	str +='URL: '+debug_fields.url+'\n';
	str +='HTTP_CODE: '+debug_fields.http_code+'\n';
	str +='Type: '+type+'\n';
	str +='Params:\n';
	var params_arr = params.split("&");
	
	for(var x=0;x<params_arr.length;x++){
		var params_arr2 = params_arr[x].toString().split("=");
		var req = 0;
		if(type=="POST"){
			if(params_arr2[0]=="order_id"){ req = 1;}
			if(params_arr2[0]=="order_status"){req = 1;}
		}
		var idx = params_arr2[0].toString().trim();
		var params2_val = params_arr2.join(": ");
		if(req==0){
			str +='\t'+params2_val+'\n';
		}
		
		
	}
	//str +=params+'\n';
	str +='Response: \n';
	str +='\t'+JSON.stringify(resp)+'\n';
	//str +='********************************************************************************************************************************************************************************';
	$("#db-list").html(current_val+str);
}
