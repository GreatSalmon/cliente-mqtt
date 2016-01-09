var nodemailer = require('nodemailer');
var smtpapi = require('smtpapi');
var settings  = {
	host: "smtp.sendgrid.net",
	port: parseInt(587, 10),
	requiresAuth: true,
	auth: {
		user: "apikey",
		pass: "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"
	}
};

// send email to this address
var tgTargetAddress = 'support@tablegetter.com';

function SendShareEmail(emails, message, rsv, res){
	var email_body = "<p>Hello,</p><p>Your friend " + rsv.diner_name + " made a reservation for " + rsv.people;
	email_body += " at the delicious " + rsv.restaurant + " restaurant on "+rsv.date+" at "+rsv.time+". </p>";
	if (message){
		email_body += "<p>" +rsv.diner_name + " has sent you a personal message: </p>";
		email_body+= "<p>"+message + "</p>";
	}

	email_body += "<p>Greetings from Tablegetter</p>";


	var header = new smtpapi();
	for (var i=0; i<emails.length; i++){
		header.addTo(emails[i]);
	}

	var headers = { 'x-smtpapi': header.jsonString() };
	var smtpTransport = nodemailer.createTransport(settings);
	var mailOptions = {
		from:     "Tablegetter <tablegetter@tablegetter.com>",
		to:       "Tablegetter <tablegetter@tablegetter.com>",
		subject:  'Your friend '+ rsv.diner_name +' just made a reservation',
		text:     email_body,
		html:     email_body,
		headers:  headers
	};

	smtpTransport.sendMail(mailOptions, function(error, response) {
		smtpTransport.close();
		if (error) {
			console.log(error);
			var errmessage = "Not able to send the email: \n" + error;
			res.json(errmessage);

		} else {
			console.log("Message sent: " + response);
			res.json({email:"OK"});
		}
	});
}


function emailCallback(err,responseStatus,res){

	if (err){
		var errmessage = "Not able to send the email: \n" + err;
		console.log(errmessage);
		res.json(errmessage);
	}
	else{
		res.json({email:"OK"});
	}
}

function SendContactEmail(body,res){
	var header = new smtpapi();
	header.addTo(tgTargetAddress);
	

	var headers = { 'x-smtpapi': header.jsonString() };
	var smtpTransport = nodemailer.createTransport(settings);
	var mailOptions = {
		from:     "Tablegetter <tablegetter@tablegetter.com>",
		to:       "Support <" + tgTargetAddress + ">",
		subject:  'Contact form message from: ' + body.rsv_client_email,
		text:     body.rsv_client_message,
		headers:  headers
	};


	smtpTransport.sendMail(mailOptions, function(error, response) {
		smtpTransport.close();
		if (error) {
			console.log(error);
			var errmessage = "Not able to send the email: \n" + error;
			res.json(errmessage);

		} else {
			console.log("Message sent: " + response);
			res.json({email:"OK"});
		}
	});
}

function SendRsvEmailToClient(rsv, diner){
	var header = new smtpapi();
	header.addTo(tgTargetAddress);
	header.addTo(diner.din_email);
	var headers = { 'x-smtpapi': header.jsonString() };
	
	var mailOptions = {
		from:     	"Tablegetter <tablegetter@tablegetter.com>",
		to:       	diner.din_name + " <"+diner.din_email+">",
		subject:  	'New Reservation confirmed for:' + diner.din_name,
		text: 		"A reservation has been made for: \n" +
					"Name: " + diner.din_name + "\n" +
					"Email: " +diner.din_email+ "\n" +
					"Phone: " +diner.din_phone+ "\n" +
					"Restaurant: " +rsv.res.res_name+ "\n" +
					"Date: " +rsv.date+ "\n" +
					"Time: " +rsv.time+ "\n" +
					"Unique Hash code: " + rsv.code + "\n" +
					"Thank you for using tablegetter",
		html: 		"<h1>A reservation has been made for:</h1>" +
					"<p>Name: " + diner.din_name + "</p>" +
					"<p>Email: " +diner.din_email+ "</p>" +
					"<p>Phone: " +diner.din_phone+ "</p>" +
					"<p>Restaurant: " +rsv.res.res_name+ "</p>" +
					"<p>Date: " +rsv.date+ "</p>" +
					"<p>Time: " +rsv.time+ "</p>" +
					"<p>Unique Hash code: " + rsv.code + "</p>" +
					"<p>Thank you for using tablegetter</p>",
		headers:  headers
	};
	FinalizeSendRsvMail(mailOptions);

}

function SendRsvEmailToRestaurant(rsv,diner){
	var header = new smtpapi();
	header.addTo(tgTargetAddress);
	header.addTo(diner.din_email);
	var headers = { 'x-smtpapi': header.jsonString() };
	var smtpTransport = nodemailer.createTransport(settings);
	var mailOptions = {
		from:     	"Tablegetter <tablegetter@tablegetter.com>",
		to:       	diner.din_name + " <"+diner.din_email+">",
		subject:  	'New Reservation at your restaurant ' +  rsv.res.res_name,
		text: 		"A reservation has been made for your restaurant:"+ rsv.res.res_name +"\n" +
					"Name: " + diner.din_name + "\n" +
					"Email: " +diner.din_email+ "\n" +
					"Phone: " +diner.din_phone+ "\n" +
					"Date: " +rsv.date+ "\n" +
					"Time: " +rsv.time+ "\n" +
					"Unique Hash code: " + rsv.code + "\n" +
					"Thank you for using tablegetter",
		html: 		"<h1>A reservation has been made for your restaurant:" + rsv.res.res_name+"</h1>" +
					"<p>Name: " + diner.din_name + "</p>" +
					"<p>Email: " +diner.din_email+ "</p>" +
					"<p>Phone: " +diner.din_phone+ "</p>" +
					"<p>Restaurant: " +rsv.res.res_name+ "</p>" +
					"<p>Date: " +rsv.date+ "</p>" +
					"<p>Time: " +rsv.time+ "</p>" +
					"<p>Unique Hash code: " + rsv.code + "</p>" +
					"<p>Thank you for using tablegetter</p>",
		headers:  headers
	};
	FinalizeSendRsvMail(mailOptions);
	
}

function FinalizeSendRsvMail(mailOptions){
	var smtpTransport = nodemailer.createTransport(settings);
	smtpTransport.sendMail(mailOptions, function(error, response) {
		smtpTransport.close();
		if (error) {
			console.log(error);
			var errmessage = "Not able to send the email: \n" + error;

		} else {
			console.log("Message sent: " + response);
		}
	});
}


function SendRsvEmail(diner,res,date,time,code){
	var rsv = {
		res: res,
		date: date,
		time:time,
		code: code
	};

	SendRsvEmailToClient(rsv,diner);
	SendRsvEmailToRestaurant(rsv,diner);
}

exports.SendContactEmail = SendContactEmail;
exports.SendRsvEmail = SendRsvEmail;
exports.SendShareEmail = SendShareEmail;
