module.exports = {
  name: 'executive-order',
  description: '',
  args: false,
  guildOnly: true,
  execute(message, args) {
    let targetMember = message.member.user;
    message.channel
      .send(
        `${targetMember} is issuing a executive order. Please provide the order name.`
      )
      .awaitMessages(filter, {
        max: 1,
        time: 30000,
        errors: ['time'],
      })
      .then((message) => {
        message = message.first();
        let executiveOrder = message.content;
        message.channel.send(
          `The ${executiveOrder} executive order has been issue.`
        );
      })
      .catch(() => {
        message.channel.send('Time has ran out.');
      });
    console.log(
      '!!!!!!!!!~~~~~~~~!!!!!!!!! executive-order command used !!!!!!!!!~~~~~~~~!!!!!!!!!'
    );
  },
};
