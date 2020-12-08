module.exports = {
  name: 'repealbill',
  description: 'Repeals a bill',
  execute(message, args) {
    message.channel.send(`The bill has been repealed.`);
    bill = '';
  },
};
