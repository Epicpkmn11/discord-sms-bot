// Setup vars
const {Formatters} = require("discord.js");
const fs = require("fs");

// Event handler
module.exports = async function(SmsBot, msg, nmsg) {
	// Check if this is a bridged channel
	for(let bridge of SmsBot.config.bridges) {
		if(msg.channel.id != bridge.channel_id)
			continue;

		// Don't send our own messages back
		if(msg.webhookId == bridge.webhook_id)
			break;

		console.log((new Date()).toLocaleString(), msg.author.username, msg.content);

		let nickname = msg.webhookId ? undefined : await msg.guild.members.fetch(msg.author.id).then(r => r.nickname);

		let body = `${(nickname ?? msg.author.username)}: ${msg.content}`.replace(/[^\x20-\x7F\x0A\x0D]/g, "?");
		let attachment = SmsBot.config.mms_images ? msg.attachments.find(r => r.contentType?.startsWith("image/"))?.url : undefined;
		let attachmentLinks = msg.attachments
				.filter(r => !SmsBot.config.mms_images || !r.contentType?.startsWith("image/"))
				.map(r => r.attachment)
				.join("\n");
		if(attachmentLinks)
			body += "\n\n" + attachmentLinks;

		// Send SMS
		const twilio = require("twilio")(bridge.twilio_sid, bridge.twilio_token);
		twilio.messages.create({
			body: body,
			to: bridge.sms_number,
			from: bridge.twilio_number,
			mediaUrl: attachment
		}, (err, sms) => {
			if(err)
				console.error(err);
			else
				console.log(`SMS Sent: ${sms.sid}`);
		});

		break;
	}
}
