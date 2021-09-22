const chalk = require('chalk');
const lawModel = require('../src/models/law');

function capitalizeFirstLetters(str) {
  return str.replace(/^\w|\s\w/g, function (letter) {
    return letter.toUpperCase();
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  name: 'show-all-laws',
  description: 'Shows all active laws',
  args: false,
  guildOnly: true,
  execute(message) {
    console.log(
      chalk.bgRed.bold(`${message.author.tag} used the show-laws command used`)
    );
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
  },
};
