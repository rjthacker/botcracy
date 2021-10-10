const { prefix } = require("../config.json");
const settingsModel = require("../src/models/settings");

const chalk = require("chalk");

module.exports = {
  name: "settings",
  description: `Displays the servers settings\n\n**${prefix} settings voting-time [Amount of minutes]** - Sets the amount of minutes a vote will last\n**${prefix} settings law-required-votes [Amount of votes]** - Sets the amount of votes needed to pass a law\n`,
  args: false,
  guildOnly: true,
  execute(message, args) {
    // Declarations
    let action = args[0];
    let value = args[1];

    // Logs name of user who called the command
    console.log(
      chalk.bgGreen.bold(`${message.author.tag} used the set-settings command`)
    );

    // If settings do not exist create them with default values
    settingsModel
      .find(
        {
          guildID: message.guild.id,
        },
        function (err, settings) {
          if (err) {
            res.send(err);
          }

          if (!settings[0]) {
            const newSettings = new settingsModel({
              guildID: message.guild.id,
            });
            newSettings.save();
          }
        }
      )
      .clone()
      .then((guildSettings) => {
        // If no action, return the settings to the user
        if (action === undefined) {
          console.log(guildSettings[0]);
          const settingsEmbed = {
            color: 0x0099ff,
            author: {
              name: `${message.guild.name}'s' settings`,
              icon_url: message.guild.iconURL(),
            },
            thumbnail: {
              url: "https://res.cloudinary.com/botcracy/image/upload/v1632259302/discord/Presidential_Seal_No_BG_tu45sz.png",
            },
            fields: [
              {
                name: "Voting Time",
                value: `${guildSettings[0].votingTime / 60000} Minutes`,
              },
              {
                name: "Votes needed to pass a law",
                value: guildSettings[0].lawRequiredVotes,
              },
            ],
          };
          return message.channel.send({ embed: settingsEmbed });
        }

        // Handles the action for changing the voting time
        if (action == "voting-time") {
          if (value == undefined || value == 0) {
            return message.channel.send(
              `You must provide the amount of minutes for the voting time`
            );
          }
          settingsModel.findByIdAndUpdate(
            guildSettings[0].id,
            { votingTime: value * 60000 },
            function (err, setting) {
              if (err) {
                console.log(err);
              } else {
                message.channel.send(`Voting time set to ${value} minutes!`);
              }
            }
          );
        } else if (action == "law-required-votes") {
          if (value == undefined || value == 0) {
            return message.channel.send(
              `You must provide the amount of required votes`
            );
          }
          settingsModel.findByIdAndUpdate(
            guildSettings[0].id,
            { lawRequiredVotes: value },
            function (err, setting) {
              if (err) {
                console.log(err);
              } else {
                message.channel.send(
                  `Required votes to pass a law set to ${value} votes!`
                );
              }
            }
          );
        } else {
          message.channel.send("That is not a setting!");
        }
      })
      .catch((error) => {
        console.log("Error!", error);
      });
  },
};

// else if (action == "role-required-votes") {
//           if (value == undefined || value == 0) {
//             return message.channel.send(
//               `You must provide the amount of required votes`
//             );
//           }
//           settingsModel.findByIdAndUpdate(
//             guildSettings[0].id,
//             { roleRequiredVotes: value },
//             function (err, setting) {
//               if (err) {
//                 console.log(err);
//               } else {
//                 message.channel.send(
//                   `Required votes to pass a role set to ${value} votes!`
//                 );
//               }
//             }
//           );
//         }
