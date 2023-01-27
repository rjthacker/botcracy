const { Events } = require("discord.js");

const lawModel = require("../src/models/law");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    }

    if (interaction.isModalSubmit()) {
      console.log(interaction.fields);
      const lawName = interaction.fields.getTextInputValue("lawNameInput");
      const lawDescription = interaction.fields.getTextInputValue(
        "lawDescriptionInput"
      );

      let yes = 0;
      let no = 0;
      let totalVotes = -2;
      let votingTime = 180000;
      let lawRequiredVotes = 1;

      interaction.reply(
        `${interaction.user} has started a vote on the law "${lawName}"\nThe law description is: "${lawDescription}"`
      );

      interaction.channel
        .send(`You have ${votingTime / 60000} minutes to vote!`)

        .then((message) => {
          console.log("Message React");
          message.react(`👍`).then(() => message.react("👎"));
          const filter = (reaction) => {
            return [`👍`, "👎"].includes(reaction.emoji.name);
          };

          const collector = message.createReactionCollector({
            filter,
            time: votingTime,
          });

          const newLaw = new lawModel({
            guildID: interaction.guild.id,
            guildName: interaction.guild.name,
            name: lawName,
            description: lawDescription,
            representative: interaction.user.id,
            createdDate: new Date(),
            votes: yes,
          });

          collector.on("collect", (reaction) => {
            console.log("Collect on");
            if (reaction.emoji.name === `👍`) {
              console.log("Emoji up");
              yes += 1;
              totalVotes += 1;
            } else if (reaction.emoji.name === `👎`) {
              console.log("Emoji down");
              no += 1;
              totalVotes += 1;
            }
          });
          collector.on("end", () => {
            console.log("Collect end");
            if (yes > no && totalVotes >= lawRequiredVotes) {
              console.log("Law Passed");
              newLaw
                .save()
                .then(() => {
                  interaction.channel.send(`The law has passed!`);
                })
                .catch((error) => {
                  console.log("Error!", error);
                });
            } else if (yes < no && totalVotes >= lawRequiredVotes) {
              console.log("Failed");
              interaction.channel.send(
                `\nThe ${lawName} law has failed to pass!`
              );
            } else if (yes === no && totalVotes >= lawRequiredVotes) {
              console.log("Tied");
              interaction.channel.send(`\nThe ${lawName} law has tied!`);
            } else {
              console.log("Not enough votes");
              interaction.channel.send(
                `\nThe vote did not meet the required amount of votes of ${lawRequiredVotes}!`
              );
            }
          });
        });
    }
  },
};
