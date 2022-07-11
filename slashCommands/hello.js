const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('A simple hello command'),
  async execute (client, interaction) {
    return interaction.reply('How are you?')
  },
};