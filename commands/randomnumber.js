module.exports = {
  name: 'randomnumber',
  description: 'Provides a random number between 1 - 10',
  execute(message, args) {
    message.channel.send(Math.floor(Math.random() * 10 + 1));
  },
};
