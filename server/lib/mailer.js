/**
 * Created by dang.kien.thanh on 2/12/18.
 */
'use strict'
var config = require('config');
var fs = require('fs');
var define_a = require('./../define');
var path = require('path');
var appDir = path.dirname(require.main.filename).replace(new RegExp("\\\\", 'g'), '/');
const mailer = require('nodemailer');
var ejs = require('ejs');
//110664331  
//test bug 111110931

function   getDate(){
    return new Date().toISOString().split('T')[0];
}

exports.sendMail = function( msg, sendTo, subject, path_file, file_name, task_name, account, date = getDate()) {

	let transporter = mailer.createTransport({
	host: config.get('mailServer').host,
	port: config.get('mailServer').port,
	secure: true,
	auth: {
		user: config.get('mailServer').user,
		pass: config.get('mailServer').pass
	}
	});

	fs.readFile(path_file, function (err, data) {
		var path_file_ejs = appDir + define_a.pathFileEJS + task_name + ".ejs";
		let mailOptions = {
			from: config.get('mailServer').user,
			to: sendTo,
			subject: subject,
			attachments: [{'filename': file_name, 'content': data}],
			html: ejs.render( fs.readFileSync(path_file_ejs, 'utf-8') , {account: account , date : date })
		};
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				return console.log(error);
			}
			console.log('send mail success');
		});
	});
	
}

exports.sendMailNotAttack = function(sendTo, msg, subject , task_name, account) {

	let transporter = mailer.createTransport({
	host: config.get('mailServer').host,
	port: config.get('mailServer').port,
	secure: true,
	auth: {
		user: config.get('mailServer').user,
		pass: config.get('mailServer').pass
	}
	});

	var path_file_ejs = appDir + define_a.pathFileEJS + task_name + ".ejs";
	let mailOptions = {
		from: config.get('mailServer').user,
		to: sendTo,
		subject: subject,
		html: ejs.render( fs.readFileSync(path_file_ejs, 'utf-8') , {account: account , message : msg })
	};
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('send mail success');
	});
	
	
}
