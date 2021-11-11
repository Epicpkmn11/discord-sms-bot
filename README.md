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
    - [Twilio](https://twilio.com)
5. Run `npm start`

### Running in the background
6. Install `pm2` with `npm install -g pm2`
7. Start with `pm2 start sms-bot.js`
