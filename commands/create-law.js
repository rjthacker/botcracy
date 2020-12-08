module.exports = {
  name: 'create-law',
  description: 'Creates a new law',
  args: false,
  guildOnly: true,
  execute(message, args) {
    let targetMember = message.member.user;
    let yes = 0;
    let no = 0;
    let filter = (m) => m.author.id === message.author.id;
    message.channel
      .send(`${targetMember} is proposing a law! Please provide the name.`)
      .then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
          })
          .then((message) => {
            message = message.first();
            if (message.content !== null) {
              let law = message.content;
              message.channel.send(`The laws name is "${law}".`);
              message.channel.send('The vote begins!').then((message) => {
                message.react(`👍`).then(() => message.react('👎'));
                const filter = (reaction) => {
                  return [`👍`, '👎'].includes(reaction.emoji.name);
                };

                const collector = message.createReactionCollector(filter, {
                  time: 20000,
                });
                collector.on('collect', (reaction) => {
                  if (reaction.emoji.name === `👍`) {
                    yes += 1;
                  } else if (reaction.emoji.name === `👎`) {
                    no += 1;
                  }
                });
                collector.on('end', () => {
                  if (yes > no) {
                    message.channel.send(`The ${law} law has passed!`);
                  } else if (yes < no) {
                    message.channel.send(`The ${law} law has failed!`);
                  } else {
                    message.channel.send(`The ${law} law has tied!`);
                  }
                });
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
