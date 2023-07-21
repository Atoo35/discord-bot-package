const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { getSetupChannels } = require('../common/utils');
const fs = require('fs');
const path = require('path');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('close the ticket'),
  async execute (client, interaction) {
    const { guild, member } = interaction;
    const adminRole = member.roles.cache.find(role => role.name.toLowerCase() === 'Admin'.toLowerCase());
    if (!member.roles.cache.has(adminRole.id)) {
      return interaction.reply('You cannot use this command')
    }
    const interactionChannel = guild.channels.cache.get(interaction.channelId);
    let { category, transcriptChannel } = await getSetupChannels(guild);
    if (interactionChannel.parentId !== category.id)
      return;
    if (transcriptChannel) {
      var allMessages = [];
      interactionChannel.messages.fetch().then((messages) => {
        messages.forEach((message) => {
          if (message.attachments.size > 0) {
            message.attachments.every(attachIsImage)
          } else {
            let line = {
              username: message.author.username,
              message: message.content,
              date: (new Date(message.createdTimestamp)).toLocaleString()
            }
            allMessages.push(line)
          }

          function attachIsImage (msgAttach) {
            if (message.content) {
              let line = {
                username: message.author.username,
                message: message.content,
                date: (new Date(message.createdTimestamp)).toLocaleString()
              }
              allMessages.push(line)
            }
            var url = msgAttach.url;
            if ((url.match(/^http.*\.(jpeg|jpg|gif|png)$/) != null) === true) {
              let line = {
                username: message.author.username,
                url: url,
                date: (new Date(message.createdTimestamp)).toLocaleString()
              }
              allMessages.push(line)
            }
          }

        });

      }).then(async () => {
        interactionChannel.delete()
        var writeStream = fs.createWriteStream("transcript.html");
        writeStream.write(`<!DOCTYPE html><html lang="en"><head><title>Hrmm.Space</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><!--===============================================================================================--><link rel="shortcut icon" href="http://www.iconj.com/ico/v/4/v4dd4bn0av.ico" type="image/x-icon" /><link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet"><!--===============================================================================================--><style>* {margin: 0px;padding: 0px;box-sizing: border-box;font-family: 'Open Sans', sans-serif;}body,html {height: 100%;font-family: sans-serif;}input {display: block;outline: none;border: none !important;}textarea {display: block;outline: none;}textarea:focus,input:focus {border-color: transparent !important;}/* ------------------------------------ */button {outline: none !important;border: none;background: transparent;}button:hover {cursor: pointer;}iframe {border: none !important;}.limiter {width: 100%;margin: 0 auto;}.container-table100 {width: 100%;min-height: 100vh;background: #c850c0;background: -webkit-linear-gradient(45deg, #4158d0, #c850c0);background: -o-linear-gradient(45deg, #4158d0, #c850c0);background: -moz-linear-gradient(45deg, #4158d0, #c850c0);background: linear-gradient(45deg, #4158d0, #c850c0);display: -webkit-box;display: -webkit-flex;display: -moz-box;display: -ms-flexbox;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;padding: 33px 30px;}.wrap-table100 {width: 1170px;}table {border-spacing: 1;border-collapse: collapse;background: white;border-radius: 10px;overflow: hidden;width: 100%;margin: 0 auto;position: relative;}table * {position: relative;}table td,table th {padding-left: 8px;}table thead tr {height: 60px;background: #36304a;}table tbody tr {height: 50px;}table tbody tr:last-child {border: 0;}table td,table th {text-align: left;}table td.l,table th.l {text-align: right;}table td.c,table th.c {text-align: center;}table td.r,table th.r {text-align: center;}.table100-head th {font-family: OpenSans-Regular;font-size: 18px;color: #fff;line-height: 1.2;font-weight: unset;}tbody tr:nth-child(even) {background-color: #f5f5f5;}tbody tr {font-family: OpenSans-Regular;font-size: 15px;color: #808080;line-height: 1.2;font-weight: unset;}tbody tr:hover {color: #555555;background-color: #f5f5f5;cursor: pointer;}.column1 {width: 260px;padding-left: 40px;}@media screen and (max-width: 992px) {table {display: block;}table>*,table tr,table td,table th {display: block;}table thead {display: none;}table tbody tr {height: auto;padding: 37px 0;}table tbody tr td {padding-left: 40% !important;margin-bottom: 24px;}table tbody tr td:last-child {margin-bottom: 0;}table tbody tr td:before {font-family: OpenSans-Regular;font-size: 14px;color: #999999;line-height: 1.2;font-weight: unset;position: absolute;width: 40%;left: 30px;top: 0;}table tbody tr td:nth-child(1):before {content: "Username";}table tbody tr td:nth-child(2):before {content: "Message";}table tbody tr td:nth-child(3):before {content: "Timestamp";}table tbody tr td:nth-child(4):before {content: "Price";}table tbody tr td:nth-child(5):before {content: "Quantity";}table tbody tr td:nth-child(6):before {content: "Total";}tbody tr {font-size: 14px;}}@media (max-width: 576px) {.container-table100 {padding-left: 15px;padding-right: 15px;}}#search {width: 100%;font-size: 16px;padding: 12px 20px 12px 40px;border: 1px solid #ddd;margin-bottom: 12px;border-radius: 15px;}</style></head><body><div class="limiter"><div class="container-table100"><div class="wrap-table100"><input type="text" id="search" onkeyup="myFunction()" placeholder="Search by username.."title="Type in a name"><div class="table100"><table id="myTable"><thead><tr class="table100-head"><th class="column1">Username</th><th class="column1">Message</th><th class="column1">Timestamp</th></tr></thead><tbody>`)
        var i;
        for (i = allMessages.length - 1; i >= 0; i--) {

          if (!allMessages[i].message) {

            writeStream.write(`<tr><td class="column1">${allMessages[i].username}</td><td class="column1"><img src="${allMessages[i].url}" alt="${allMessages[i].url}"></td><td class="column1">${allMessages[i].date}</td></tr>` + "\n")

            // writeStream.write(`<tr><td class="column1">${allMessages[i].username}</td><td class="column1">${allMessages[i].url}</td><td class="column1">${allMessages[i].date}</td></tr>` + "\n")
          } else if (!allMessages[i].url) {
            writeStream.write(`<tr><td class="column1">${allMessages[i].username}</td><td class="column1">${allMessages[i].message}</td><td class="column1">${allMessages[i].date}</td></tr>` + "\n")
          }
        }
        writeStream.write(`</tbody></table></div></div></div></div><!--===============================================================================================--><script>function myFunction() {var input, filter, table, tr, td, i, txtValue;input = document.getElementById("search");filter = input.value.toUpperCase();table = document.getElementById("myTable");tr = table.getElementsByTagName("tr");for (i = 0; i < tr.length; i++) {td = tr[i].getElementsByTagName("td")[0];if (td) {txtValue = td.textContent || td.innerText;if (txtValue.toUpperCase().indexOf(filter) > -1) {tr[i].style.display = "";} else {tr[i].style.display = "none";}}}}</script><!--===============================================================================================--><script src="https://code.jquery.com/jquery-3.2.1.min.js"></script><!--===============================================================================================--></body></html>`)

        const embed = new EmbedBuilder()
          .setTitle("Ticket Closed")
          .addFields(
            { name: "Ticket for", value: interactionChannel.name, inline: true },
            { name: "Closed by", value: interaction.user.username, inline: true }
          )
          .setTimestamp()
          .setFooter({ text: 'Ticket Bot', iconURL: client.user.avatarURL() })

        await transcriptChannel.send({ embeds: [embed] })
        transcriptChannel.send({
          files: [{
            attachment: path.resolve(__dirname, '../transcript.html'),
            name: 'transcript.html'
          }],
        })
      })
    }
  },
};