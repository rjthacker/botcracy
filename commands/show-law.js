const lawModel = require('../src/models/law');

const chalk = require('chalk');
const moment = require('moment');

function capitalizeFirstLetters(str) {
  return str.replace(/^\w|\s\w/g, function (letter) {
    return letter.toUpperCase();
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  name: 'show-law',
  description: 'Shows information about an active law',
  args: false,
  guildOnly: true,
  execute(message) {
    let filter = (m) => m.author.id === message.author.id;
    console.log(
      chalk.bgRed.bold(`${message.author.tag} used the show-law command`)
    );
    message.channel.send(`Please provide the name of the law.`).then(() => {
      message.channel
        .awaitMessages(filter, {
          max: 1,
          time: 30000,
          errors: ['time'],
        })
        .then((message) => {
          message = message.first();
          if (message.content) {
            lawModel
              .find({
                guildID: message.guild.id,
                name: message.content.toLowerCase(),
              })
              .then(function (law) {
                const lawEmbed = {
                  color: 0x0099ff,
                  author: {
                    name: `${message.guild.name}'s' law book`,
                    icon_url: message.guild.iconURL(),
                  },
                  thumbnail: {
                    url: 'https://res.cloudinary.com/botcracy/image/upload/v1632259302/discord/Presidential_Seal_No_BG_tu45sz.png',
                  },
                  fields: [
                    {
                      name: 'Name',
                      value: capitalizeFirstLetters(law[0].name),
                    },
                    {
                      name: 'Description',
                      value: capitalizeFirstLetter(law[0].description),
                    },
                    {
                      name: 'Representative ',
                      value: law[0].representative,
                    },
                    // {
                    //   name: '\u200b',
                    //   value: '\u200b',
                    //   inline: false,
                    // },
                    {
                      name: 'Date Passed',
                      value: moment(law[0].createdDate).format(
                        'dddd, MMMM Do YYYY'
                      ),
                      inline: false,
                    },
                    // {
                    //   name: 'Amount of positive votes',
                    //   value: 'Some value here',
                    //   inline: false,
                    // },
                    // {
                    //   name: 'Amount of negative votes',
                    //   value: 'Some value here',
                    //   inline: false,
                    // },
                  ],
                };
                message.channel.send({ embed: lawEmbed });
              })
              .catch(function (error) {
                console.log(error);
                message.channel.send('That law does not exist!');
              });
          } else {
            message.channel.send(`Denied: Invalid Response`);
          }
        })
        .catch(() => {
          message.channel.send('Time has ran out.');
        });
    });
  },
};
