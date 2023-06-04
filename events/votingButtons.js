const { ButtonInteraction } = require("discord.js");

const votedMembers = new Set();

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async execute(interaction) {
    console.log("test")
    if (!interaction.isButton()) return;
    console.log("button");

    const splitArray = interaction.customId.split("-");
    if (splitArray[0] !== "create-law") return;

    if (votedMembers.has(`${interaction.user.id}-${interaction.message.id}`)) {
      console.log("already voted");
      return interaction.reply({
        content: "You have already voted.",
        ephemeral: true,
      });
    }

    votedMembers.add(`${interaction.user.id}-${interaction.message.id}`);
  },
};
