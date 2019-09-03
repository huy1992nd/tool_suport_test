/**
 * Created by dang.kien.thanh on 2/12/18.
 */
'use strict'
var config = require('config');

const chatwork = require('chatwork-client');
//110664331  
//test bug 111110931
exports.sendChatWork =function( msg, roomId, chatworkToken) {
	var keySearch = "";
	// var time = ((new Date()).toISOString()).slice(0,23).split("T").join(" ");
	let param = {
		chatworkToken: chatworkToken,
		roomId: roomId,
		msg: keySearch+msg
	};
	// console.log(param);

	chatwork.init(param);
	chatwork.postRoomMessages().then((data) => {
	}).catch((e) => {
		// console.log(e);
	});
	
}
