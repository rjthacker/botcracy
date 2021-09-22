const chalk = require('chalk');
const lawModel = require('../src/models/law');

module.exports = {
  name: 'repeal-law',
  description: 'Vote to repeal a active law',
  args: false,
  guildOnly: true,
  execute(message) {
    let targetMember = message.member.user;
    let yes = 0;
    let no = 0;
    let filter = (m) => m.author.id === message.author.id;
    console.log(
      chalk.bgRed.bold(`${message.author.tag} used the repeal-law command used`)
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
              let guildsLaws = [];
              lawModel
                .find({ guildID: message.guild.id })
                .then((laws) => {
                  for (let i = 0; i < laws.length; i++) {
                    guildsLaws.push(laws[i].name);
                  }
                })
                .then(() => {
                  if (guildsLaws.includes(law)) {
                    message.channel.send(`The law is "${law}".`);
                    message.channel
                      .send('The vote begins! \nYou have 1 minute to vote!')
                      .then((message) => {
                        message.react(`👍`).then(() => message.react('👎'));
                        const filter = (reaction) => {
                          return [`👍`, '👎'].includes(reaction.emoji.name);
                        };

                        const collector = message.createReactionCollector(
                          filter,
                          {
                            time: 50000,
                          }
                        );
                        collector.on('collect', (reaction) => {
                          if (reaction.emoji.name === `👍`) {
                            yes += 1;
                          } else if (reaction.emoji.name === `👎`) {
                            no += 1;
                          }
                        });
                        collector.on('end', () => {
                          if (yes > no) {
                            lawModel.find(
                              {
                                guildID: message.guild.id,
                                name: law.toLowerCase(),
                              },
                              function (err, law) {
                                if (err) {
                                  res.send(err);
                                }
                                let id = law[0]._id;
                                lawModel.findByIdAndDelete(
                                  id,
                                  function (err, docs) {
                                    if (err) {
                                      console.log(err);
                                      message.channel.send(
                                        `There was an issue deleting the law. Please contact the bot owner with information regarding the issue.`
                                      );
                                    } else {
                                      message.channel.send(
                                        `The "${law[0].name}"" law has been repealed and removed from your laws!`
                                      );
                                    }
                                  }
                                );
                              }
                            );
                          } else if (yes < no) {
                            message.channel.send(`The repeal has failed!`);
                          } else {
                            message.channel.send(
                              `The repeal has tied! The law was not repealed.`
                            );
                          }
                        });
                      });
                  } else {
                    message.channel.send(`That law does not exist`);
                  }
                })
                .catch((e) => {
                  console.log(e);
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
