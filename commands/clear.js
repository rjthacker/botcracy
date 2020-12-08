module.exports = {
  name: 'clear',
  description: 'Remove 100 previous messages from channel',
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
