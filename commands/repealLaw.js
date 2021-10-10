const { prefix } = require("../config.json");
const lawModel = require("../src/models/law");
const settingsModel = require("../src/models/settings");

const chalk = require("chalk");

module.exports = {
  name: "repeal-law",
  description: `Starts the voting process for repealing a law\n\n**${prefix} repeal-law** - Asks for law name and begins vote\n**${prefix} create-law [Law Name]** - Skips asking for the law name and starts the vote\n`,
  args: false,
  guildOnly: true,
  execute(message, args) {
    //Declarations
    let targetMember = message.member.user;
    let yes = 0;
    let no = 0;
    let totalVotes = -2;
    let votingTime = 60000;
    let lawRequiredVotes = 1;
    let filter = (m) => m.author.id === message.author.id;

    console.log(
      chalk.bgGreen.bold(
        `${message.author.tag} used the repeal-law command used`
      )
    );

    // Checks if guild has settings with a voting time
    settingsModel
      .find(
        {
          guildID: message.guild.id,
        },
        function (err) {
          if (err) {
            res.send(err);
          }
        }
      )
      .clone()
      .then((guildSettings) => {
        // Sets voting time if guild settings exist
        if (guildSettings.length > 0) {
          votingTime = guildSettings[0].votingTime;
          lawRequiredVotes = guildSettings[0].lawRequiredVotes;
        }

        if (args === undefined || args.length == 0) {
          message.channel
            .send(
              `${targetMember} is proposing a repeal! Please provide the name of the law.`
            )
            .then(() => {
              message.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 30000,
                  errors: ["time"],
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
                            .send(
                              `The vote begins! \nYou have ${
                                votingTime / 60000
                              } minutes to vote!`
                            )
                            .then((message) => {
                              message
                                .react(`👍`)
                                .then(() => message.react("👎"));
                              const filter = (reaction) => {
                                return [`👍`, "👎"].includes(
                                  reaction.emoji.name
                                );
                              };

                              const collector = message.createReactionCollector(
                                filter,
                                {
                                  time: votingTime,
                                }
                              );
                              collector.on("collect", (reaction) => {
                                if (reaction.emoji.name === `👍`) {
                                  yes += 1;
                                  totalVotes += 1;
                                } else if (reaction.emoji.name === `👎`) {
                                  no += 1;
                                  totalVotes += 1;
                                }
                              });
                              collector.on("end", () => {
                                if (
                                  yes > no &&
                                  totalVotes >= lawRequiredVotes
                                ) {
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
                                } else if (
                                  yes < no &&
                                  totalVotes >= lawRequiredVotes
                                ) {
                                  message.channel.send(
                                    `The repeal has failed!`
                                  );
                                } else if (
                                  yes === no &&
                                  totalVotes >= lawRequiredVotes
                                ) {
                                  message.channel.send(
                                    `The repeal has tied! The law was not repealed.`
                                  );
                                } else {
                                  message.channel.send(
                                    `\nThe repeal did not meet the required amount of votes of ${lawRequiredVotes}!`
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
                  message.channel.send("Time has ran out.");
                });
            });
        } else {
          // Declarations
          let law = args.join(" ");
          // Stores the servers laws
          let guildsLaws = [];

          lawModel
            .find({ guildID: message.guild.id })
            .then((laws) => {
              for (let i = 0; i < laws.length; i++) {
                guildsLaws.push(laws[i].name);
              }
            })
            .then(() => {
              if (guildsLaws.includes(law.toLowerCase())) {
                message.channel.send(`The law is "${law}".`);
                message.channel
                  .send(
                    `The vote begins! \nYou have ${
                      votingTime / 60000
                    } minutes to vote!`
                  )
                  .then((message) => {
                    message.react(`👍`).then(() => message.react("👎"));
                    const filter = (reaction) => {
                      return [`👍`, "👎"].includes(reaction.emoji.name);
                    };

                    const collector = message.createReactionCollector(filter, {
                      time: votingTime,
                    });
                    collector.on("collect", (reaction) => {
                      if (reaction.emoji.name === `👍`) {
                        yes += 1;
                        totalVotes += 1;
                      } else if (reaction.emoji.name === `👎`) {
                        no += 1;
                        totalVotes += 1;
                      }
                    });
                    collector.on("end", () => {
                      if (yes > no && totalVotes >= lawRequiredVotes) {
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
                      } else if (yes < no && totalVotes >= lawRequiredVotes) {
                        message.channel.send(`The repeal has failed!`);
                      } else if (yes === no && totalVotes >= lawRequiredVotes) {
                        message.channel.send(
                          `The repeal has tied! The law was not repealed.`
                        );
                      } else {
                        message.channel.send(
                          `\nThe repeal did not meet the required amount of votes of ${lawRequiredVotes}!`
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
        }
      })
      .catch((error) => {
        console.log("Error!", error);
      });
  },
};
