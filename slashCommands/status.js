const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActivityType, Status } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Set the status of the bot')
    .addStringOption(option => option.setName('status').setDescription('The status to set')
      .addChoices({ name: "idle", value: "idle" },
        { name: "dnd", value: "dnd" },
        { name: "online", value: "online" },
        { name: "invisible", value: "invisible" },
      ).setRequired(true)
    ),
  async execute (client, interaction) {
    const { guild, member } = interaction;
    const adminRole = member.roles.cache.find(role => role.name.toLowerCase() === 'Admin'.toLowerCase());
    if (!member.roles.cache.has(adminRole.id)) {
      return interaction.reply('You cannot use this command')
    }
    // get the activity and content from the interaction
    const status = interaction.options.getString('status');
    switch (status) {
      case "idle":
        client.user.setStatus('idle')
        break;
      case "dnd":
        client.user.setStatus('dnd')
        break;
      case "online":
        client.user.setStatus('online')
        break;
      case "invisible":
        client.user.setStatus('invisible')
        break;
    }
    return interaction.reply(`Status set to ${status}`);

  },
};