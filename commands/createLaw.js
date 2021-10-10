const { prefix } = require("../config.json");
const lawModel = require("../src/models/law");
const settingsModel = require("../src/models/settings");

const chalk = require("chalk");

module.exports = {
  name: "create-law",
  description: `Starts the voting process for creating a new law\n\n**${prefix} create-law** - Starts the law creation process by asking for law name, and description\n**${prefix} create-law [Law Name]** - Skips asking for the law name\n`,
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
      chalk.bgGreen.bold(`${message.author.tag} used the create-law command`)
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

        // Checks if arguments were provided
        if (args === undefined || args.length == 0) {
          message.channel
            .send(
              `${targetMember} is proposing a law! Please provide the name.`
            )
            .then(() => {
              message.channel
                .awaitMessages(filter, {
                  max: 1,
                  time: 50000,
                  errors: ["time"],
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
                                  errors: ["time"],
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
                                            errors: ["time"],
                                          })
                                          .then((message) => {
                                            message = message.first();
                                            if (
                                              message.content === "START" ||
                                              "start" ||
                                              "Start"
                                            ) {
                                              message.channel
                                                .send(
                                                  `The vote begins! \nYou have ${
                                                    votingTime / 60000
                                                  } minutes to vote!`
                                                )
                                                .then((message) => {
                                                  message
                                                    .react(`👍`)
                                                    .then(() =>
                                                      message.react("👎")
                                                    );
                                                  const filter = (reaction) => {
                                                    return [
                                                      `👍`,
                                                      "👎",
                                                    ].includes(
                                                      reaction.emoji.name
                                                    );
                                                  };

                                                  const collector =
                                                    message.createReactionCollector(
                                                      filter,
                                                      {
                                                        time: votingTime,
                                                      }
                                                    );
                                                  collector.on(
                                                    "collect",
                                                    (reaction) => {
                                                      if (
                                                        reaction.emoji.name ===
                                                        `👍`
                                                      ) {
                                                        yes += 1;
                                                        totalVotes += 1;
                                                      } else if (
                                                        reaction.emoji.name ===
                                                        `👎`
                                                      ) {
                                                        no += 1;
                                                        totalVotes += 1;
                                                      }
                                                    }
                                                  );
                                                  collector.on("end", () => {
                                                    if (
                                                      yes > no &&
                                                      totalVotes >=
                                                        lawRequiredVotes
                                                    ) {
                                                      const newLaw =
                                                        new lawModel({
                                                          guildID:
                                                            message.guild.id,
                                                          guildName:
                                                            message.guild.name,
                                                          name: law,
                                                          description:
                                                            description,
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
                                                            "Error!",
                                                            error
                                                          );
                                                        });
                                                    } else if (
                                                      yes < no &&
                                                      totalVotes >=
                                                        lawRequiredVotes
                                                    ) {
                                                      message.channel.send(
                                                        `\nThe ${law} law has failed!`
                                                      );
                                                    } else if (
                                                      yes === no &&
                                                      totalVotes >=
                                                        lawRequiredVotes
                                                    ) {
                                                      message.channel.send(
                                                        `\nThe ${law} law has tied!`
                                                      );
                                                    } else {
                                                      message.channel.send(
                                                        `\nThe vote did not meet the required amount of votes of ${lawRequiredVotes}!`
                                                      );
                                                    }
                                                  });
                                                });
                                            } else if (
                                              message.content === "REVOKE" ||
                                              "revoke" ||
                                              "Revoke"
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
                                            message.channel.send(
                                              "Time has ran out."
                                            );
                                          });
                                      });
                                  } else {
                                    message.channel.send(
                                      `Denied: Invalid Response`
                                    );
                                  }
                                })
                                .catch(() => {
                                  message.channel.send("Time has ran out.");
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
              if (!guildsLaws.includes(law.toLowerCase())) {
                message.channel
                  .send(`Please provide a description of the law.`)
                  .then(() => {
                    message.channel
                      .awaitMessages(filter, {
                        max: 1,
                        time: 50000,
                        errors: ["time"],
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
                                  errors: ["time"],
                                })
                                .then((message) => {
                                  message = message.first();
                                  if (
                                    message.content === "START" ||
                                    "start" ||
                                    "Start"
                                  ) {
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

                                        const collector =
                                          message.createReactionCollector(
                                            filter,
                                            {
                                              time: votingTime,
                                            }
                                          );
                                        collector.on("collect", (reaction) => {
                                          if (reaction.emoji.name === `👍`) {
                                            yes += 1;
                                            totalVotes += 1;
                                          } else if (
                                            reaction.emoji.name === `👎`
                                          ) {
                                            no += 1;
                                            totalVotes += 1;
                                          }
                                        });
                                        collector.on("end", () => {
                                          if (
                                            yes > no &&
                                            totalVotes >= lawRequiredVotes
                                          ) {
                                            const newLaw = new lawModel({
                                              guildID: message.guild.id,
                                              guildName: message.guild.name,
                                              name: law,
                                              description: description,
                                              representative: targetMember.tag,
                                            });
                                            newLaw
                                              .save()
                                              .then(() => {
                                                message.channel.send(
                                                  `\nThe "${law}" law has passed!`
                                                );
                                              })
                                              .catch((error) => {
                                                console.log("Error!", error);
                                              });
                                          } else if (
                                            yes < no &&
                                            totalVotes >= lawRequiredVotes
                                          ) {
                                            message.channel.send(
                                              `\nThe ${law} law has failed!`
                                            );
                                          } else if (
                                            yes === no &&
                                            totalVotes >= lawRequiredVotes
                                          ) {
                                            message.channel.send(
                                              `\nThe ${law} law has tied!`
                                            );
                                          } else {
                                            message.channel.send(
                                              `\nThe vote did not meet the required amount of votes of ${lawRequiredVotes}!`
                                            );
                                          }
                                        });
                                      });
                                  } else if (
                                    message.content === "REVOKE" ||
                                    "revoke" ||
                                    "Revoke"
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
                                  message.channel.send("Time has ran out.");
                                });
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
                message.channel.send(`This law already exists!`);
              }
            });
        }
      })
      .catch((error) => {
        console.log("Error!", error);
      });
  },
};
