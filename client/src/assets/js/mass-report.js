$(document).ready(function(){
	$('#example').dataTable({
		"sPaginationType": "full_numbers",
		"aLengthMenu": [[10, 25, 50, 100, 200, -1], [10, 25, 50, 100, 200, "All"]],
	});
	
	$('input[name=checkAll]').click(function(){
		$('input[name=tledetails]').prop('checked',false);
		
		if($(this).is(':checked'))
			$('input[name=tledetails]').prop('checked', true);
	});
	
	$("#startdate").on("dp.change",function (e) {
	  $('input[name=enddate]').val('');
	  $('#enddate').data("DateTimePicker").setMinDate(e.date);
	  $('#enddate').data("DateTimePicker").setMaxDate(moment(e.date).add(1, 'day'));
	});
});


var _tleUrls = new Array();
var _i = 0;

_ajax.submitForm = function(__this__){
	_tleUrls = [];
	_i = 0;
//	$('.myBtn23').hide();
//	$('.myBtn23').removeClass('btn-danger btn-warning');
	
	$('input[name=tledetails]').each(function( index ) {
		if($(this).is(':checked'))
		 _tleUrls.push($( this ).val());
	});
	
	_ajax.extractData(__this__);
	_ajax.exec();
}

_ajax.extractData = function(__this__){
	_ajax.params.url = $(__this__).closest('form').attr('action');
	_ajax.params.type = $(__this__).closest('form').attr('method');
	var _data = {};
	
	_ajax.disableValidationForReport($(__this__).closest('form'));
	_ajax.validateFields($(__this__).closest('form'));
	
	_ajax.is_valid_submission = $($(__this__).closest('form')).parsley( 'validate' );
	
	$(__this__).closest('form').find('.forms_field').each(function(index,element){
		if($(element).attr('type') == 'radio'){
			if($(element).parent('label').hasClass('active'))
				_data[$(element).attr('name')] = $(element).val();
		}else{
			_data[$(element).attr('name')] = $(element).val();
		}
	});
	
	_ajax.params.data = _data;
	
	if(_tleUrls.length <= 0){
		var form_id = $(__this__).closest('form').attr('id');
		var _msg = '<div class="alert alert-block alert-danger fade in"><button type="button" class="close close-sm" data-dismiss="alert"> <i class="icon-remove"></i> </button><strong>Error!</strong><span>&nbsp;</span>';
			_msg += 'Please select a TLE from the list below.';
			_msg += '</div>';
			
		$('#' + form_id).before(_msg);
		
		_ajax.is_valid_submission = false;
	}
}

_ajax.exec = function(){
	if(_ajax.is_valid_submission){
		if(_tleUrls[_i] != undefined){
			var _tleUrl = _tleUrls[_i].split(',');
			
			_ajax.params.data['_isMassReport'] = true;
			_ajax.params.data['_baseurl'] = _tleUrl[0];
			_ajax.params.data['_key'] = _tleUrl[1];
			_ajax.params.data['_certkey'] = _tleUrl[2];
			_ajax.params.data['_certfile'] = _tleUrl[3];
			_ajax.params.data['_tleid'] = _tleUrl[4]; //brand structure ID
			_ajax.params.data['_brandId'] = _tleUrl[5];
			
			$.ajax({
				url : _ajax.params.url,
				type : _ajax.params.type,
				data : _ajax.params.data,
				dataType : _ajax.params.dataType,
				success : _ajax.customCallBack
			});
		}
	}
}

_ajax.customCallBack = function(data){
	var btn_class = 'btn-danger';
	var _msg = 'No available result.';
	var _btnText = 'Failed';
	
	if(typeof data.result.result == 'object'){
		btn_class = 'btn-warning';
		$('#_tleTd' + data.tleid).children('button').text('Sucess');
		_btnText = 'Success';
		
		if(data.result.result.length > 0){
			_msg = '';
		
			for(var i in data.result.result){
				  $.each(data.result.result[i], function(key, value){
					  _msg += key + ' : ' + value + '<br>';
				  });
				 _msg += '------------------------------<br><br>';
			}
		}
	}else{
		if(typeof data.result.error == 'object')
			_msg = data.result.error;
	}
	
	$('#_tleTd' + data.tleid).children('textarea').val(_msg);
	
	$('#_tleTd' + data.tleid).children('button').addClass(btn_class);
	$('#_tleTd' + data.tleid).children('button').show();
	
	$('#_tleTd' + data.tleid).parents('tr').children('td:nth-child(6)').text(_btnText);
	
	_i++;
	_ajax.exec();
}

var btnResult = function(__this__){
	$('#myModalLabel23').text($(__this__).parents('tr').children('td:nth-child(2)').text());
	$('#modal-body-p23').html($(__this__).siblings('textarea').val());
}




