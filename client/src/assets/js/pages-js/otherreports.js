function revertfn(){
	$('#function_form').slideToggle();
	$('#btnfunctions').slideToggle();
	$("#helpform").html("");
}

$("#showdebug").click(function(){
	$("#showdebugdiv").fadeToggle();
});


function generate_table(data){
	var $urlinput = '<div class="row">';
	$urlinput += '<div class="col-lg-12">';
	$urlinput += '<div class="widget">';
	$urlinput += '<div class="widget-header">';
	$urlinput += '<i class="icon-table"></i>';
	$urlinput += '<h3>Result</h3>';
	$urlinput += '</div>';
	$urlinput += '<div class="widget-content">';
	$urlinput += '<div class="example_alt_pagination">';
	$urlinput += '<div id="container">';
	$urlinput += '<div class="full_width big"></div>';
	$urlinput += '<div id="display_result">Result here..</div>'
	$urlinput += '</div>';
	$urlinput += '</div>';
	$urlinput += '</div>';
	$urlinput += '</div>';
	$urlinput += '</div>';
	$urlinput += '</div>';
	
			
	if(jQuery.isEmptyObject(data)){
		
	}
	else{
		
		$("#urlinput").prepend($urlinput);
		var $table = '<table id="otherreportstable" class="display" cellspacing="0" width="100%" style="font-size: 12px">';
		for (var i in data){
			
				if(i==0){
					$table += '<thead>';
					$table += '<tr>';
					for(var j in data[i]){
						
						
						$table += '<th>';
						$table += j;
						$table += '</th>';
						
					}
					$table += '</tr>';
					$table += '</thead>';
				}		
				
				if(i==0){
					$table += "<tbody>";
					$table += "<tr>";
					for(var j in data[i]){
						
						
						$table += "<td>";
						$table += data[i][j];
						
						$table += "</td>";
					}
					$table += "</tr>";
				}
				else{
					$table += "<tr>";
					for(var j in data[i]){
						
						
						$table += "<td>";
						$table += data[i][j];
						
						$table += "</td>";
					}
					$table += "</tr>";
				}
						
			
		}
		
		
		
		$table += "</tbody>";
		$table += '</table>';
		$("#display_result").html($table);
		$('#otherreportstable').dataTable({
			//"sScrollX": "50%",
	        "sPaginationType": "full_numbers"
		});
	}
}
