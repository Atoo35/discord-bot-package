const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Play ping pong!! not really duhh!!'),
  async execute (client, interaction) {
    return interaction.reply('pong!!')
  },
};