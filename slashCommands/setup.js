const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { ChannelType, PermissionFlagsBits } = require('discord.js');
const { getSetupChannels } = require('../common/utils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup the ticket bot'),
  async execute (client, interaction) {
    const { guild } = interaction;
    let { channel, category, transcriptChannel } = await getSetupChannels(guild);
    if (!channel) {
      let parent = category;
      let createdChannel = null;
      if (!category) {
        parent = await guild.channels.create({
          name: 'Tickets',
          type: ChannelType.GuildCategory
        })
        createdChannel = await guild.channels.create({
          name: 'ticket-bot',
          type: ChannelType.GuildText,
          parent: parent.id,
          permissionOverwrites: [{
            id: guild.id,
            deny: [PermissionFlagsBits.SendMessages]
          }]
        })
      } else {
        createdChannel = await guild.channels.create({
          name: 'ticket-bot',
          type: ChannelType.GuildText,
          parent: parent.id,
          permissionOverwrites: [{
            id: guild.id,
            deny: [PermissionFlagsBits.SendMessages]
          }]
        })
      }
      channel = createdChannel;
      category = parent;
    }
    if (!transcriptChannel) {
      await guild.channels.create({
        name: 'transcripts',
        type: ChannelType.GuildText,
        parent: category.id,
        permissionOverwrites: [{
          id: guild.id,
          deny: [PermissionFlagsBits.ViewChannel]
        }]
      })
    }
    const embed = new EmbedBuilder()
      .setTitle('TicketBot')
      .setDescription('To create a ticket react with :tickets:')
      .setTimestamp()
      .setFooter({ text: 'Ticket Bot', iconURL: client.user.avatarURL() })
    await channel.send({ embeds: [embed] }).then((msg) => msg.react('🎟️'))
    return interaction.reply('Setup Completed')
  },
};