require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ['MESSAGE'],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Help command

client.on('message', (msg) => {
  let targetMember = msg.member.user;
  if (msg.content === '!help' || msg.content === '!commands') {
    msg.channel.send(
      `Hello ${targetMember}! This bot is currently being developed. Features will be added in the future, however for more info or if you wish to contribute, please message <@248030367666274304>.`
    );
  }
});

// Remove 100 previous messages from channel command

client.on('message', (msg) => {
  if (msg.content === '!clear') {
    (async () => {
      let fetched;
      do {
        fetched = await msg.channel.messages.fetch({ limit: 100 });
        msg.channel.bulkDelete(fetched);
      } while (fetched.size >= 2);
    })();
  }
});

// Bill for voting command

let bill;
let activeLaws = [];

//Create Bill

client.on('message', (msg) => {
  let targetMember = msg.member.user;
  let filter = (m) => m.author.id === msg.author.id;
  if (msg.content === '!bill') {
    msg.channel
      .send(`${targetMember} is proposing a bill! Please provide the name.`)
      .then(() => {
        msg.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
          })
          .then((msg) => {
            msg = msg.first();
            if (msg.content !== null) {
              bill = msg.content;
              msg.channel.send(`The bills name is "${bill}".`);
            } else {
              msg.channel.send(`Denied: Invalid Response`);
            }
          })
          .catch((collected) => {
            msg.channel.send('Time has ran out');
          });
      });
  }
});

//Clear Bill

client.on('message', (msg) => {
  if (msg.content === '!repealbill') {
    bill = '';
    msg.channel.send(`The bill has been repealed.`);
  }
});

// Basic Vote command

client.on('message', function (msg) {
  let yes = 0;
  let no = 0;

  if (msg.content.toLowerCase().startsWith('!vote')) {
    if (msg.member.hasPermission('Admin')) {
      msg.channel.send('The vote begins!').then((msg) => {
        msg.react(`👍`).then(() => msg.react('👎'));
        const filter = (reaction, user) => {
          return [`👍`, '👎'].includes(reaction.emoji.name);
        };

        const collector = msg.createReactionCollector(filter, {
          time: 20000,
        });
        collector.on('collect', (reaction, reactionCollector) => {
          if (reaction.emoji.name === `👍`) {
            yes += 1;
          } else if (reaction.emoji.name === `👎`) {
            no += 1;
          }
        });
        collector.on('end', (reaction, reactionCollector) => {
          if (yes > no) {
            msg.channel.send(`The ${bill} bill has passed!`);
            activeLaws.push(` ${bill}`);
          } else if (yes < no) {
            msg.channel.send(`The ${bill} bill has failed!`);
          } else {
            msg.channel.send(`The ${bill} bill has tied!`);
          }
        });
      });
    }
  }
});

// Active Bills

client.on('message', (msg) => {
  if (msg.content === '!activelaws') {
    msg.channel.send(`The active laws:${activeLaws}`);
  }
});

// Random Number

client.on('message', (msg) => {
  if (msg.content === '!randomnumber') {
    msg.channel.send(Math.floor(Math.random() * 10 + 1));
  }
});

client.login(process.env.BOT_TOKEN);
