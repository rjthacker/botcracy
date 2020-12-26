module.exports = {
  name: 'random-number',
  description: 'Provides a random number between 1 - 10',
  args: false,
  cooldown: 5,
  execute(message) {
    message.channel.send(Math.floor(Math.random() * 10 + 1));
    console.log(
      '!!!!!!!!!~~~~~~~~!!!!!!!!! random-number command used !!!!!!!!!~~~~~~~~!!!!!!!!!'
    );
  },
};
