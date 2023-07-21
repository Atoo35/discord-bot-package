const fs = require('fs')
const { Client, Collection, GatewayIntentBits, Partials, Events, ChannelType, PermissionFlagsBits, ActivityType } = require('discord.js');
const { getSetupChannels } = require('./common/utils');
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.MessageContent],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
client.slashCommands = new Collection();


const readSlashCommands = (arrayDirs) => {
  arrayDirs.forEach(dir => {
    fs.readdir(`./slashCommands/${dir}/`, (err, files) => {
      if (err) return console.log(err);
      files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./slashCommands/${dir}/${file}`);
        console.log("Successfully loaded " + props.data.name)
        client.slashCommands.set(props.data.name, props);
      });
    });
  });
}
readSlashCommands([''])

client.on(Events.ClientReady, async () => {
  var memCount = client.guilds.cache.reduce((x, y) => x + y.memberCount, 0);
  console.log(`Bot has started, with ${memCount} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  client.user.setPresence({ activities: [{ name: 'fun in ' + client.guilds.cache.size + ' servers', type: ActivityType.Listening }], status: 'online' })
})

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;

  const reactedChannel = client.channels.cache.get(reaction.message.channelId);
  const guild = client.guilds.cache.get(reaction.message.guildId);
  const { channel, category, transcriptChannel } = await getSetupChannels(guild);
  if (channel && category && transcriptChannel) {
    if (reactedChannel.name === 'ticket-bot') {
      if (reaction.emoji.name === '🎟️') {
        if (guild.channels.cache.find(channel => channel.name === `ticket-${user.username}`)) {
          user.send('You already have a ticket open');
          reaction.users.remove(user.id);
          return;
        }
        const ticket = await guild.channels.create({
          name: `ticket-${user.username}`,
          type: ChannelType.GuildText,
          parent: reactedChannel.parentId,
          permissionOverwrites: [
            {
              id: user.id,
              allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel],
            },
            {
              id: reaction.message.guild.roles.everyone,
              deny: [PermissionFlagsBits.ViewChannel],
            },
          ],
        });
        // console.log('created', ticket)
        ticket.send(`<@${user.id}>, A Moderator will be here soon to talk to you about the issue you are facing. :D`);
        reaction.users.remove(user.id);
      }
    }
  } else {
    user.send('Please run the setup command first');
  }
});


fs.readdir('./events/', (err, files) => {
  if (err) console.log(err);
  files.forEach(file => {
    let eventFunc = require(`./events/${file}`);
    console.log("Successfully loaded " + file)
    let eventName = file.split(".")[0];
    client.on(eventName, (...args) => eventFunc.run(client, ...args));
  });
});
client.login(process.env.BOT_TOKEN);
