module.exports = {
  name: 'repeal-law',
  description: 'Vote to repeal a active law',
  args: false,
  guildOnly: true,
  execute(message, args) {
    let targetMember = message.member.user;
    let yes = 0;
    let no = 0;
    let filter = (m) => m.author.id === message.author.id;
    console.log(
      `!!!!!!!!! ${message.author.tag} used the repeal-law command used !!!!!!!!!`
    );
    message.channel
      .send(
        `${targetMember} is proposing a repeal! Please provide the name of the law.`
      )
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
              message.channel.send(`The law is "${law}".`);
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
                    message.channel.send(`The ${law} law has been repealed!`);
                  } else if (yes < no) {
                    message.channel.send(`The repeal has failed!`);
                  } else {
                    message.channel.send(`The repeal has tied!`);
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
