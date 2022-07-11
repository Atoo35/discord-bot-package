exports.run = async (client, interaction) => {
  if (!interaction.isCommand())
    return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command)
    return;
  try {
    command.execute(client, interaction);
  } catch (error) {
    console.error(error);
    return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
};