require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['MESSAGE'],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (message) => {
  let targetMember = message.member.user;
  if (message.content === '!help' || message.content === '!commands') {
    message.channel.send(
      `Hello ${targetMember}! This bot is currently being developed. Features will be added in the future, however for more info or if you wish to contribute, please message <@248030367666274304>.`
    );
  }
});

client.on('message', (msg) => {
  if (msg.content === '!nuke') {
    (async () => {
      let fetched;
      do {
        fetched = await msg.channel.messages.fetch({ limit: 100 });
        msg.channel.bulkDelete(fetched);
      } while (fetched.size >= 2);
    })();
  }
});

client.login(process.env.BOT_TOKEN);
