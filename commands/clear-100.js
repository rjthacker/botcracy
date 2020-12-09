module.exports = {
  name: 'clear-100',
  description: 'Remove 100 previous messages from channel',
  args: false,
  guildOnly: true,
  execute(message, args) {
    (async () => {
      let fetched;
      do {
        fetched = await message.channel.messages.fetch({ limit: 100 });
        message.channel.bulkDelete(fetched);
      } while (fetched.size >= 2);
    })();
  },
};
