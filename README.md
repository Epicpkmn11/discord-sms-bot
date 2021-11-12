# SMS-Bot
Bridges a Discord channel to SMS.

## Running it yourself
1. Install [Node.js](https://nodejs.org)
2. Run `npm install`
3. Copy `sample.env` to `.env` and fill in the info
    - You can make a bot at the [Discord Developer Portal](https://discord.com/developers/applications)
        1. Click `New Application` in the top right
        2. Click `Bot` in the sidebar
        3. Click `Add Bot`
        4. Click `Copy` to copy the token
    - Sign up for [Twilio](https://twilio.com) and:
        1. Create an `Account` for this
        2. The SID and Auth Token are shown on the account home page
        3. Get a trial phone number and that'll be your Twilio number
        4. Go to `Phone numbers` -> `Manage` -> `Active numbers` in the sidebar, then click your number
        5. Scroll down to the `Messaging` category and set `A MESSAGE COMES IN` to `Webhook`, a URL that points to your server, and `HTTP POST`
        6. The Twilio port can be anything, `4501` is what I'm using so left it as a default, make sure to use this port in the webhook URL
5. Run `npm start`

### Running in the background
1. Install `pm2` with `npm install -g pm2`
2. Start with `pm2 start sms-bot.js`
