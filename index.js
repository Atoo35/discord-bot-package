const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
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

client.on('ready', async () => {
  var memCount = client.guilds.cache.reduce((x, y) => x + y.memberCount, 0);
  console.log(`Bot has started, with ${memCount} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  client.user.setPresence({ activities: [{ name: 'fun in ' + client.guilds.cache.size + ' servers' }], status: 'online' })
})

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