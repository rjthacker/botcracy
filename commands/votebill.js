module.exports = {
  name: 'votebill',
  description: 'Votes on a new bill',
  execute(message, args) {
    let yes = 0;
    let no = 0;
    message.channel.send('The vote begins!').then((message) => {
      message.react(`👍`).then(() => message.react('👎'));
      const filter = (reaction, user) => {
        return [`👍`, '👎'].includes(reaction.emoji.name);
      };

      const collector = message.createReactionCollector(filter, {
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
          message.channel.send(`The ${bill} bill has passed!`);
          bill = '';
          message.guild.members.forEach((member) => {
            if (member.id != client.user.id && !member.user.bot)
              member.send(text);
          });
        } else if (yes < no) {
          message.channel.send(`The ${bill} bill has failed!`);
          bill = '';
        } else {
          message.channel.send(`The ${bill} bill has tied!`);
          bill = '';
        }
      });
    });
  },
};
