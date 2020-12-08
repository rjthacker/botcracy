module.exports = {
  name: 'help',
  description: 'Provides bot commands',
  execute(message, args) {
    let targetMember = message.member.user;
    message.channel.send(
      `Hi ${targetMember}! This bot is currently being developed. New features will be added periodically. For more info or if you wish to contribute, please message <@248030367666274304>.

      Bot Commands:
      #help - Shows a list of commands
      #bill - Creates a bill to be voted on
      #repealbill - Clears the active bill
      #vote - Starts a vote on the current bill
      #clear - Clears 100 previous channel messages
      #randomnumber - Provides a random number between 1 and 10`
    );
  },
};
