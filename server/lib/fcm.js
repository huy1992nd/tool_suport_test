/**
 * Created by dang.kien.thanh on 2/12/18.
 */
'use strict'
var request = require('request');
//110664331  
//test bug 111110931

function formatTime(){
	var d = new Date();
	var date = d.getDate() > 10 ? d.getDate() : '0'+d.getDate();
	var month = d.getMonth()+1 > 10 ? d.getMonth()+1 : '0'+ (d.getMonth()+1);
	var y = d.getFullYear();
	var hr = d.getHours() > 10 ? d.getHours() : 0 + d.getHours();
	var min = d.getMinutes() > 10 ? d.getMinutes() : '0'+ d.getMinutes();
	var seconds = d.getSeconds() > 10 ? d.getSeconds() : '0'+d.getSeconds();

	return `${y}-${month}-${date} ${hr}:${min}:${seconds}`;
}



exports.sendFirebase = function( message, devicetoken , data) {
	console.log('device',devicetoken);
   message = {
		to: devicetoken, // required
		notification: { // for iOS
				title: data.task_name,
				id:data.id,
				task_name:data.task_name.replace(/ /g,"_"),
				type:data.type, //type off message 1 important , 0 not important
				body: message,
				badge: 1,
				sound: data.sound,
				"mutable-content":1
		},
		mutable_content : true,
		content_available: true,
		priority: "high",
		data: {
				content: message,
				time: formatTime(),
				unseen: 0 // for android
		}
};

console.log('message is',message)

	request({
		url: 'https://fcm.googleapis.com/fcm/send',
		method: 'POST',
		headers: {
		  'Content-Type' :' application/json',
		  'Authorization': 'key=AIzaSyAq9qV98y0hQ02c_taPvpa5IVCmftndlNM'
		},
		body: JSON.stringify(
		 	message
		)
	  }, function(error, response, body) {
		if (error) { 
		  console.error(error, response, body); 
		}
		else if (response.statusCode >= 400) { 
		  console.error('HTTP Error: '+response.statusCode+' - '+response.statusMessage+'\n'+body); 
		}
		else {
		  console.log('Done!')
		}
	  });
	
}
