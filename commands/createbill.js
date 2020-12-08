module.exports = {
  name: 'createbill',
  description: 'Creates a new bill',
  execute(message, args) {
    let targetMember = message.member.user;
    let filter = (m) => m.author.id === message.author.id;
    message.channel
      .send(`${targetMember} is proposing a bill! Please provide the name.`)
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
              bill = message.content;
              message.channel.send(`The bills name is "${bill}".`);
            } else {
              message.channel.send(`Denied: Invalid Response`);
            }
          })
          .catch((collected) => {
            message.channel.send('Time has ran out');
          });
      });
  },
};
