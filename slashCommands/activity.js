const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActivityType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('activity')
    .setDescription('Set the bots activity')
    .addStringOption(option => option.setName('activity').setDescription('The activity to set')
      .addChoices({ name: "playing", value: "playing" },
        { name: "streaming", value: "streaming" },
        { name: "listening", value: "listening" },
        { name: "watching", value: "watching" },
        { name: "default", value: "default" }
      ).setRequired(true)
    )
    .addStringOption(option => option.setName('content').setDescription('The content of the activity. Not required if default is selected'))
    .addStringOption(option => option.setName('url').setDescription('The url of the stream. Only required if streaming is selected')),
  async execute (client, interaction) {
    const { guild, member } = interaction;
    const adminRole = member.roles.cache.find(role => role.name.toLowerCase() === 'Admin'.toLowerCase());
    if (!member.roles.cache.has(adminRole.id)) {
      return interaction.reply('You cannot use this command')
    }
    // get the activity and content from the interaction
    const activity = interaction.options.getString('activity');
    const content = interaction.options.getString('content') || `tickets in ${client.guilds.cache.size} servers with ${client.guilds.cache.reduce((x, y) => x + y.memberCount, 0)} members`;
    const url = interaction.options.getString('url');
    // set the activity
    switch (activity) {
      case "playing":
        client.user.setActivity({ name: content, type: ActivityType.Playing });
        break;
      case "streaming":
        client.user.setActivity({ name: content, type: ActivityType.Streaming, url });
        break;
      case "listening":
        client.user.setActivity({ name: content, type: ActivityType.Listening });
        break;
      case "watching":
        client.user.setActivity({ name: content, type: ActivityType.Watching, url });
        break;
      case "default": {
        client.user.setActivity({ name: content, type: ActivityType.Listening });
        break;
      }
    }
    // reply to the interaction
    return interaction.reply(`Activity set to ${activity} ${content}`);

  },
};