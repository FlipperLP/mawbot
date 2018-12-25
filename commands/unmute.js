const client = module.require('discord.js');

module.exports.run = async (client, message, args, con, config) => {
  if (!message.member.roles.find(role => role.name === config.teamRole)) return message.channel.send(`Do I know you **${message.author.tag}**? Only the Devs can use this~`).then(message.react('❌'));

  const member = await message.mentions.members.first() || message.guild.members.get(args[0]);

  await member.removeRole(config.mutedRole);
  await member.addRole(config.checkinRole);
  const fetchchannel = await message.guild.channels.get(config.logChannel);
  await fetchchannel.send(`<@${message.author.id}> Unmuted User ${message.mentions.members.first()}`);
};

module.exports.help = {
  name: 'unmute',
};
