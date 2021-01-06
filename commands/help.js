const { prefix } = require('../config.json');

module.exports = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  execute(message, args) {
    const data = [];
    const { commands } = message.client;
    console.log(
      `!!!!!!!!! ${message.author.tag} used the help command used !!!!!!!!!`
    );

    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(commands.map((command) => command.name).join(', '));
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );
      data.push(
        `\nThis bot is currently being developed, and new features are being added periodically. \nFor more info, feedback, or suggestions, please join the Botcracy support channel.\n \nhttps://discord.com/invite/w9cAN4Ym29`
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return;
          message.reply("I've sent you a direct message with all my commands!");
        })
        .catch((error) => {
          console.error(
            `Could not send help direct message to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "it seems like I can't direct message you! Do you have direct messages disabled?"
          );
        });
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }

    data.push(`**Name:** ${command.name}`);

    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(', ')}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage)
      data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });
  },
};
