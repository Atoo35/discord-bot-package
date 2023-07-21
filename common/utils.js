const { ChannelType } = require("discord.js");

const getSetupChannels = async (guild) => {
    let [channel, category] = await Promise.all([
        await guild.channels.cache.find((channel) => channel.name === 'ticket-bot'),
        await guild.channels.cache.find((channel) => channel.name === 'Tickets' && channel.type === ChannelType.GuildCategory),
    ])
    const transcriptChannel = await guild.channels.cache.find((channel) => channel.name === 'transcripts')
    return { channel, category, transcriptChannel }
}

module.exports = {
    getSetupChannels,
};