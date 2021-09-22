const lawModel = require('../src/models/law');

module.exports = {
  name: 'create-law',
  description: 'Creates a new law',
  args: false,
  guildOnly: true,
  execute(message) {
    let targetMember = message.member.user;
    let yes = 0;
    let no = 0;
    let filter = (m) => m.author.id === message.author.id;
    console.log(
      `!!!!!!!!! ${message.author.tag} used the create-law command !!!!!!!!!`
    );
    message.channel
      .send(`${targetMember} is proposing a law! Please provide the name.`)
      .then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 50000,
            errors: ['time'],
          })
          .then((message) => {
            message = message.first();
            let law = message.content;
            if (law.content !== null) {
              let guildsLaws = [];
              lawModel
                .find({ guildID: message.guild.id })
                .then((laws) => {
                  for (let i = 0; i < laws.length; i++) {
                    guildsLaws.push(laws[i].name);
                  }
                })
                .then(() => {
                  if (!guildsLaws.includes(law.toLowerCase())) {
                    message.channel
                      .send(`Please provide a description of the law.`)
                      .then(() => {
                        message.channel
                          .awaitMessages(filter, {
                            max: 1,
                            time: 50000,
                            errors: ['time'],
                          })
                          .then((message) => {
                            message = message.first();
                            let description = message.content;
                            if (law.content !== null) {
                              message.channel.send(
                                `The laws name has been declared as: "${law}".`
                              );
                              message.channel.send(
                                `The law states the following: "${description}".`
                              );
                              message.channel
                                .send(
                                  'Reply with "Start" to begin, or "Revoke" to end the voting process.'
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
                                      if (
                                        message.content === 'START' ||
                                        'start' ||
                                        'Start'
                                      ) {
                                        message.channel
                                          .send(
                                            'The vote begins! \nYou have 1 minute to vote!'
                                          )
                                          .then((message) => {
                                            message
                                              .react(`👍`)
                                              .then(() => message.react('👎'));
                                            const filter = (reaction) => {
                                              return [`👍`, '👎'].includes(
                                                reaction.emoji.name
                                              );
                                            };

                                            const collector =
                                              message.createReactionCollector(
                                                filter,
                                                {
                                                  time: 60000,
                                                }
                                              );
                                            collector.on(
                                              'collect',
                                              (reaction) => {
                                                if (
                                                  reaction.emoji.name === `👍`
                                                ) {
                                                  yes += 1;
                                                } else if (
                                                  reaction.emoji.name === `👎`
                                                ) {
                                                  no += 1;
                                                }
                                              }
                                            );
                                            collector.on('end', () => {
                                              if (yes > no) {
                                                const newLaw = new lawModel({
                                                  guildID: message.guild.id,
                                                  guildName: message.guild.name,
                                                  name: law,
                                                  description: description,
                                                  representative:
                                                    targetMember.tag,
                                                });
                                                newLaw
                                                  .save()
                                                  .then(() => {
                                                    message.channel.send(
                                                      `\nThe "${law}" law has passed!`
                                                    );
                                                  })
                                                  .catch((error) => {
                                                    console.log(
                                                      'Error!',
                                                      error
                                                    );
                                                  });
                                              } else if (yes < no) {
                                                message.channel.send(
                                                  `\nThe ${law} law has failed!`
                                                );
                                              } else {
                                                message.channel.send(
                                                  `\nThe ${law} law has tied!`
                                                );
                                              }
                                            });
                                          });
                                      } else if (
                                        message.content === 'REVOKE' ||
                                        'revoke' ||
                                        'Revoke'
                                      ) {
                                        message.channel.send(
                                          `The vote was canceled`
                                        );
                                      } else {
                                        message.channel.send(
                                          `Denied: Invalid Response`
                                        );
                                      }
                                    })
                                    .catch(() => {
                                      message.channel.send('Time has ran out.');
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
                  } else {
                    message.channel.send(`This law already exists!`);
                  }
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
