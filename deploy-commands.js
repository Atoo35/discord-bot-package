const fs = require('fs')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const commands = [];
const deploySlashCommands = async (arrayDir) => {
  const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN);
  const applicationId = 'YOUR_APPLICATION_ID'
  const guildId = 'YOUR_GUILD_ID'
  arrayDir.forEach(dir => {
    const commandFiles = fs.readdirSync(`./slashCommands/${dir}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`./slashCommands/${dir}/${file}`);
      commands.push(command.data.toJSON());
    }
  })

  // This commented code should be uncommented if you want to deploy the commands globally in all the servers
  /* rest.put(Routes.applicationCommands(applicationId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
  */
  // Comment this if you are deploying commands globally
  rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);
}

const commandFilesDir = ['']
deploySlashCommands(commandFilesDir);


