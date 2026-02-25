require('dotenv').config();

module.exports = {
  username: process.env.TWITCH_USERNAME,
  oauth: process.env.TWITCH_OAUTH,
  channel: process.env.TWITCH_CHANNEL,
  port: process.env.PORT || 3000
};
