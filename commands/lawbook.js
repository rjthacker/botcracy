const { SlashCommandBuilder } = require("@discordjs/builders");

const lawModel = require("../src/models/law");

function capitalizeFirstLetters(str) {
  return str.replace(/^\w|\s\w/g, function (letter) {
    return letter.toUpperCase();
  });
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lawbook")
    .setDescription("Provides information about active laws"),
  async execute(interaction) {
    lawModel
      .find({ guildID: interaction.guild.id })
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
            name: `${interaction.guild.name}'s' law book`,
            icon_url: interaction.guild.iconURL(),
          },
          thumbnail: {
            url: "https://res.cloudinary.com/botcracy/image/upload/v1632259302/discord/Presidential_Seal_No_BG_tu45sz.png",
          },
          fields,
        };

        interaction.reply({ embeds: [lawEmbed] });
      })
      .catch(function (error) {
        console.log(error);
        interaction.reply("That law does not exist!");
      });
  },
};
