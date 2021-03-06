$(function() {
	
	var folder = this.location.pathname.split('/').pop();
	
	Dropzone.options.myDropzone = {
			
			
			acceptedFiles: "image/*, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/zip, application/x-compressed-zip, application/x-pkcs12, application/pkcs8, application/x-pem-file",	
		    init: function() {
		        thisDropzone = this;
		               
		        //$.get('documentation/display_files', function(data) {
		        $.get(folder + '/display_files', function(data) {
		        	
		            $.each(data, function(key,value){
		                var mockFile = { name: value.name, size: value.size };
		                
		                thisDropzone.emit("addedfile", mockFile);
		                
		                display_thumbnail(thisDropzone, value.type, mockFile);
		                
		            });
		            

		        });
		        
		        thisDropzone.on("removedfile", function(file) {
		        	console.log(file);
		            // Ajax to unlink/delete the file in the server
		        	if(confirm('Are you sure you want to delete this file?')){
		        		$.post(folder+"/remove_file",
		        		  {
		        		    filename: file.name
		        		  },
		        		  function(data,status){
		        			if(status==='success'){
		        				//alert('File has been deleted.');
		        			}  
		        		    
		        		  });
		        	}
		        	else{
		        		
		        		var mockFile = {name: file.name, size: file.size};
		        		
		        		thisDropzone.emit("addedfile", mockFile);
		        		
		        		display_thumbnail(thisDropzone, file.type, file);
		        	
		        	}
		        	  
	        		
		        	
		        });
		        
		        thisDropzone.on("addedfile", function(file) {
		        	
	        		var filetype = file.name.split('.').pop();
		        	
		        	display_thumbnail(thisDropzone, filetype, file);
		        		
		        	file.previewElement.addEventListener("dblclick", function() { 
	        		  //window.location.href = "documentation/download_file?filename=" + file.name;
		        		window.location.href = folder + "/download_file?filename=" + file.name;
		        	});
		        	
	        	});
		        
		    },
		  
		    addRemoveLinks: true
		};
	
	
	function show_tooltip(filename){
		
		$(".dz-filename span").html("<span style='font-size: 14px; font-weight: bold; word-wrap:break-word;'>" + filename + "</span>");
	}
	
	function display_thumbnail(thisobj, filetype, file){
		
		//var folder = this.location.pathname.split('/').pop();
		if(filetype=='xlsx' || filetype=='xls'){
			thisobj.emit("thumbnail", file, "application/sandbox-template/images/excel.png");
        }
        else if(filetype=='doc' || filetype=='docx'){
        	thisobj.emit("thumbnail", file, "application/sandbox-template/images/word.png");
        }
        else if(filetype=='pdf'){
        	thisobj.emit("thumbnail", file, "application/sandbox-template/images/pdf.png");
        }
        else{
        	thisobj.emit("thumbnail", file, "application/uploads/"+folder + "/"+ file.name);
        }
		
	}
	
})



