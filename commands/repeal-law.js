module.exports = {
  name: 'repeal-law',
  description: 'Repeals a law',
  args: false,
  guildOnly: true,
  execute(message, args) {
    message.channel.send(`The law has been repealed.`);
    bill = '';
  },
};
