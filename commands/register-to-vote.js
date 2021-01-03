module.exports = {
  name: 'register-to-vote',
  description: 'Registers the user as a valid voter.',
  args: false,
  guildOnly: true,
  async execute(message) {
    console.log(
      `!!!!!!!!! ${message.author.tag} used the register-to-vote command !!!!!!!!!`
    );
    let targetMember = message.member.user;
    let role = message.guild.roles.cache.find((role) => role.name === 'Voter');
    if (!role) {
      role = await message.guild.roles.create({
        data: {
          name: 'Voter',
          color: 'DEFAULT',
        },
        reason: '',
      });
      console.log('Voter Role created');
      message.member.roles.add(role);
      message.channel.send('The "Voter" role has been created.');
      message.channel
        .send(`${targetMember} is now a registered voter!`)
        .catch(console.error);
    } else {
      if (message.member.roles.cache.some((role) => role.name === 'Voter')) {
        message.channel.send(
          `${targetMember} you are already registered to vote!`
        );
      } else {
        message.member.roles.add(role);
        message.channel.send(`${targetMember} is now a registered voter!`);
      }
    }
  },
};
