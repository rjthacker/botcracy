const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides info about Botcracy"),
  async execute(interaction) {
    await interaction.reply({
      content: `Hey there!\n\nBotcracy is being rebuilt from scratch for the new Discord API and Discord.js Version 14. This is an example of the new slash commands, however it will take some time to rebuild all the old commands with the new slash api logic.\n\nFor updates and info, join the Botcracy discord server https://discord.gg/5XFCa65S5F`,
      ephemeral: true,
    });
  },
};
