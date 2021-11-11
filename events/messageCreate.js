// Setup vars
const {Formatters} = require("discord.js");
const fs = require("fs");
const twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Event handler
module.exports = async function(UnivBot, msg, nmsg) {
	// Only in the set channel
	if(msg.channel.id != process.env.CHANNEL)
		return;

	console.log((new Date()).toLocaleString(), msg.author.username, msg.content);

	// Send SMS
	twilio.messages.create({
		body: msg.content,
		to: process.env.SMS_NUMBER,
		from: process.env.TWILIO_NUMBER,
	}, (err, sms) => {
		if(err)
			console.error(err);
		else
			console.log(`SMS Sent: ${sms.sid}`);
	});
}