module.exports = {
  name: 'voter-count',
  description: 'Counts how many voters are on the server.',
  args: false,
  guildOnly: true,
  execute(message) {
    memberCount = message.guild.members.cache.filter((member) =>
      member.roles.cache.find((r) => r.name === 'Voter')
    ).size;
    message.channel.send(`There are ${memberCount} registered Voters.`);
  },
};
