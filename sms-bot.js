#!/usr/bin/env node

// ===========================================================
// Setup variables
// ===========================================================
const fs = require("fs");
const { Client, Intents } = require("discord.js");
require("dotenv").config();

// ===========================================================
// Client
// ===========================================================
const SmsBot = {
	client: new Client({
		intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
		allowedMentions: { parse: [], repliedUser: false }
	})
};
// SmsBot.db = require("./database.json");
SmsBot.client.login(process.env.TOKEN);

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
var bodyParser = require('body-parser');
const MessagingResponse = require("twilio").twiml.MessagingResponse;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post("/sms", (req, res) => {
	console.log((new Date()).toLocaleString(), req.From, req.body.Body);
	SmsBot.client.guilds.fetch(process.env.GUILD).then(guild => guild.channels.fetch(process.env.CHANNEL).then(channel => channel.send(req.body.Body)));
	const twiml = new MessagingResponse();

	twiml.message("The Robots are coming! Head for the hills!");

	res.writeHead(200, {"Content-Type": "text/xml"});
	res.end(twiml.toString());
});

app.listen(process.env.PORT, () => {
  console.log(`Express server listening on port ${process.env.TWILIO_PORT}`);
});