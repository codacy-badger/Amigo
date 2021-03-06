const {RichEmbed} = require('discord.js');
const {caseNumber} = require('../util/caseNumber.js');
const { inspect } = require("util");

exports.run = async (client, message, args, level) => {
  const settings = message.settings;
  const user = message.mentions.users.first();
  inspect((settings), {code: "json"});
  const modlog = client.channels.find('name', settings.modLogChannel);
  const caseNum = await caseNumber(client, modlog);
  if (!modlog) return message.reply('I cannot find a mod-log channel');
  if (message.mentions.users.size < 1) return message.reply('You must mention someone to warn them.').catch(console.error);
  const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator's input. Use ${settings.prefix}reason ${caseNum} <reason>.`;
  const embed = new RichEmbed()
  .setColor("#FF4848")
  .setTimestamp()
  .setDescription(`**Action:** Warning\n**Target:** ${user.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
  .setFooter(`Case ${caseNum}`);
  return client.channels.get(modlog.id).send({embed});
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "Moderator"
};

exports.help = {
  name: "warn",
  category: "Moderation",
  description: "Issues a warning to the mentioned user.",
  usage: "warn [mention] [reason]"
};
