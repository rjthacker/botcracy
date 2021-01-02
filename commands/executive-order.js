module.exports = {
  name: 'executive-order',
  description: '',
  args: false,
  guildOnly: true,
  execute(message, args) {
    let targetMember = message.member.user;
    let filter = (m) => m.author.id === message.author.id;
    console.log('!!!!!!!!! executive-order command used !!!!!!!!!');
    message.channel
      .send(
        `${targetMember} is issuing a executive order. Please provide the order name.`
      )
      .then(() => {
        message.channel
          .awaitMessages(filter, {
            max: 1,
            time: 30000,
            errors: ['time'],
          })
          .then((message) => {
            message = message.first();
            let executiveOrder = message.content;
            message.channel.send(
              `The ${executiveOrder} executive order has been issued.`
            );
          })
          .catch(() => {
            message.channel.send('Time has ran out.');
          });
      });
  },
};
