const { SlashCommandBuilder } = require('@discordjs/builders');
const moment = require('moment');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Get the uptime of the bot'),
  async execute (client, interaction) {
    return interaction.reply(`Bot has been up for since: ${moment(Date.now() - client.uptime).format('LLLL')}, and it has been ${Math.floor(client.uptime / 1000 / 60)} minutes`)
  },
};