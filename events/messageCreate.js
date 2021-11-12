// Setup vars
const {Formatters} = require("discord.js");
const fs = require("fs");
const twilio = require("twilio")(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

// Event handler
module.exports = async function(UnivBot, msg, nmsg) {
	// Only in the set channel
	if(msg.channel.id != process.env.CHANNEL)
		return;

	// Don't send our own messages back
	if(msg.webhookId == process.env.WEBHOOK_ID)
		return;

	console.log((new Date()).toLocaleString(), msg.author.username, msg.content);

	let nickname = msg.webhookId ? undefined : await msg.guild.members.fetch(msg.author.id).then(r => r.nickname);

	// Send SMS
	twilio.messages.create({
		body: `${(nickname ?? msg.author.username)}: ${msg.content}`.replace(/[^\x20-\x7F]/g, "?"),
		to: process.env.SMS_NUMBER,
		from: process.env.TWILIO_NUMBER,
	}, (err, sms) => {
		if(err)
			console.error(err);
		else
			console.log(`SMS Sent: ${sms.sid}`);
	});
}
