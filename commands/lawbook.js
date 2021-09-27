const { prefix } = require('../config.json');
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
  name: 'lawbook',
  description: `Shows information about active laws\n\n**${prefix} lawbook** - Provides a list of all active laws\n**${prefix} lawbook [Law Name]** - Provides a detailed information about the law\n`,
  args: false,
  guildOnly: true,
  execute(message, args) {
    console.log(
      chalk.bgGreen.bold(`${message.author.tag} used the lawbook command`)
    );

    if (args === undefined || args.length == 0) {
      lawModel
        .find({ guildID: message.guild.id })
        .then(function (law) {
          let fields = [];
          for (let i = 0; i < law.length; i++) {
            fields.push({
              name: capitalizeFirstLetters(law[i].name),
              value: capitalizeFirstLetter(law[i].description),
            });
          }
          const lawEmbed = {
            color: 0x0099ff,
            author: {
              name: `${message.guild.name}'s' law book`,
              icon_url: message.guild.iconURL(),
            },
            thumbnail: {
              url: 'https://res.cloudinary.com/botcracy/image/upload/v1632259302/discord/Presidential_Seal_No_BG_tu45sz.png',
            },
            fields,
          };
          message.channel.send({ embed: lawEmbed });
        })
        .catch(function (error) {
          console.log(error);
          message.channel.send('That law does not exist!');
        });
    } else {
      lawModel
        .find({
          guildID: message.guild.id,
          name: args[0].toLowerCase(),
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
                value: moment(law[0].createdDate).format('dddd, MMMM Do YYYY'),
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
          message.channel.send('That law does not exist!');
        });
    }
  },
};
