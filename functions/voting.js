const {
  MessageActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Events,
} = require("discord.js");

const lawModel = require("../src/models/law");

let yes = 0;
let no = 0;
let totalVotes = 0;
let votingTime = 60000;
let lawRequiredVotes = 1;

async function voting(interaction, lawName, lawDescription) {
  let users = [];

  if (process.env.NODE_ENV === "development") {
    votingTime = 10000;
  }

  // await interaction.reply({ components: [row] });

  // await interaction.reply(
  //   interaction.customId === "createLawModal"
  //     ? `${interaction.user} has started a vote on the law "${lawName}"\nThe law description is: "${lawDescription}"`
  //     : `${interaction.user} has started a vote to repeal the law "${lawName}\n${noButton}"`
  // );

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(lawName)
    .setDescription(lawDescription);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("yes")
      .setLabel("Vote Yes")
      .setStyle(ButtonStyle.Primary),
    new ButtonBuilder()
      .setCustomId("no")
      .setLabel("Vote No")
      .setStyle(ButtonStyle.Danger)
  );

  const channelMessage = await interaction.channel.send(
    `You have ${votingTime / 60000} minute to vote!`
  );

  await interaction.reply({
    content: `You have ${votingTime / 60000} minute to vote!`,
    embeds: [embed],
    components: [row],
  });

  const filter = (vote) => vote.customId === "yes" || vote.customId === "no";

  const collector = interaction.channel.createMessageComponentCollector({
    filter,
    time: votingTime,
  });

  collector.on("collect", (vote) => {
    if (vote.customId === "yes" && !users.includes(interaction.user.id)) {
      users.push(interaction.user.id);
      yes += 1;
      totalVotes += 1;
      console.log("yes");
      vote.update({
        content: "Thanks for voting!",
        ephemeral: true,
        components: [],
        setDisabled: true,
      });
    } else if (vote.customId === "no" && !users.includes(interaction.user.id)) {
      users.push(interaction.user.id);
      no += 1;
      totalVotes += 1;
      console.log("no");
      vote.update({
        content: "Thanks for voting!",
        ephemeral: true,
        components: [],
        setDisabled: true,
      });
    }
  });

  return new Promise((resolve) => {
    collector.on("end", () => {
      if (yes > no && totalVotes >= lawRequiredVotes) {
        resolve("passed");
      } else if (yes < no && totalVotes >= lawRequiredVotes) {
        resolve("failed");
      } else if (yes === no && totalVotes >= lawRequiredVotes) {
        resolve("tied");
      } else {
        resolve(
          interaction.channel.send(
            `\nThe vote did not meet the required amount of votes of ${lawRequiredVotes}!`
          )
        );
      }
    });
  });
}

async function isExistingLaw(lawName, guildID) {
  let guildsLaws = [];

  await lawModel.find({ guildID: guildID }).then((laws) => {
    for (let i = 0; i < laws.length; i++) {
      guildsLaws.push(laws[i].name);
    }
  });
  if (guildsLaws.includes(lawName.toLowerCase())) {
    return true;
  } else {
    return false;
  }
}

async function createLaw(interaction) {
  let lawName = interaction.fields.getTextInputValue("lawNameInput");
  let lawDescription = interaction.fields.getTextInputValue(
    "lawDescriptionInput"
  );

  const existingLaw = await isExistingLaw(lawName, interaction.guild.id);

  if (existingLaw) {
    return interaction.reply({
      content: "That law already exists",
      ephemeral: true,
    });
  }

  const votingResult = await voting(interaction, lawName, lawDescription);

  const newLaw = new lawModel({
    guildID: interaction.guild.id,
    guildName: interaction.guild.name,
    name: lawName,
    description: lawDescription,
    representative: interaction.user.id,
    createdDate: new Date(),
    totalVotes: totalVotes,
    yes: yes,
    no: no,
  });

  switch (votingResult) {
    case "passed":
      newLaw.save();
      interaction.channel.send(`The ${lawName} has passed!`);
      break;
    case "failed":
      interaction.channel.send(`The ${lawName} law has failed to pass!`);
      break;
    case "tied":
      interaction.channel.send(`The ${lawName} law has tied!`);
      break;
    default:
      interaction.channel.send(
        `The vote did not meet the required amount of votes of ${lawRequiredVotes}!`
      );
      break;
  }
}

async function repealLaw(interaction) {
  let lawName = interaction.fields.getTextInputValue("lawNameInput");

  const existingLaw = await isExistingLaw(lawName, interaction.guild.id);

  if (!existingLaw) {
    return interaction.reply({
      content: "That law does not exist",
      ephemeral: true,
    });
  }

  const votingResult = await voting(interaction, lawName);

  switch (votingResult) {
    case "passed":
      const lawID = await lawModel.find({
        guildID: interaction.guild.id,
        name: lawName.toLowerCase(),
      });

      lawModel.findByIdAndDelete(lawID, function (err, docs) {
        if (err) {
          console.log(err);
        }
      });
      interaction.channel.send(`The ${lawName} has been repealed!`);
      break;
    case "failed":
      interaction.channel.send(`The ${lawName} law has failed to repeal!`);
      break;
    case "tied":
      interaction.channel.send(`The ${lawName} law has tied!`);
      break;
    default:
      interaction.channel.send(
        `The vote did not meet the required amount of votes of ${lawRequiredVotes}!`
      );
      break;
  }
}

module.exports = { createLaw, repealLaw };
