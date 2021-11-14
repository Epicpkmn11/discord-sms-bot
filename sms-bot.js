#!/usr/bin/env node

// ===========================================================
// Setup variables
// ===========================================================
const fs = require("fs");
const { Client, Intents, WebhookClient } = require("discord.js");

// ===========================================================
// Client
// ===========================================================
const SmsBot = {
	config: require("./config.json"),
	client: new Client({
		intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
		allowedMentions: { parse: [], repliedUser: false }
	}),
	webhooks: {}
};
SmsBot.client.login(SmsBot.config.bot_token);
for(let bridge of SmsBot.config.bridges) {
	SmsBot.webhooks[bridge.webhook_id] = new WebhookClient({ id: bridge.webhook_id, token: bridge.webhook_token });
}

// ===========================================================
// Handle the events
// ===========================================================
fs.readdir("./events/", (err, files) => {
	if(err) return console.error(err);
	files.forEach(file => {
		const event = require(`./events/${file}`);
		let eventName = file.split(".")[0];
		SmsBot.client.on(eventName, event.bind(null, SmsBot));
	});
});

// ===========================================================
// Twilio
// ===========================================================
const express = require("express");
const bodyParser = require('body-parser');
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post("/sms", (req, res) => {
	console.log((new Date()).toLocaleString(), req.body.From, req.body.Body);

	// Send message to Discord
	if(req.body.Body) {
		for(let bridge of SmsBot.config.bridges) {
			SmsBot.webhooks[bridge.webhook_id].send(req.body.Body);
			break;
		}
	}

	// Respond to end the request
	const twiml = new MessagingResponse();
	res.writeHead(200, {"Content-Type": "text/xml"});
	res.end(twiml.toString());
});

app.listen(SmsBot.config.twilio_port, () => {
	console.log(`Express server listening on port ${SmsBot.config.twilio_port}`);
});