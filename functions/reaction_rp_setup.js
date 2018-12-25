module.exports.run = async (setting, config, client, reaction, RPChannelLog, con, user) => {
  con.query(`SELECT * FROM rp_owner WHERE ownerID = '${user.id}' AND channelID = '${reaction.message.channel.id}'`, async (err, rows) => {
    if (err) throw err;

    if (rows[0] || user.lastMessage.member.roles.get(config.team)) {
      switch (setting) {
        case 'RPPrivate':
          reaction.message.channel.overwritePermissions(config.checkinRole, { SEND_MESSAGES: false });
          reaction.remove(user);
          return;

        case 'RPPublic':
          reaction.message.channel.overwritePermissions(config.checkinRole, { SEND_MESSAGES: true });
          reaction.remove(user);
          return;

        case 'TypeSFW':
          reaction.message.channel.setNSFW(false);
          reaction.message.channel.overwritePermissions(config.noNSFW, { VIEW_CHANNEL: null });
          reaction.message.channel.overwritePermissions(config.NSFL, { VIEW_CHANNEL: null });
          reaction.message.channel.send('This channel is now marked at a SFW-channel!');
          client.channels.get(RPChannelLog).send(`The channel <#${reaction.message.channel.id}> (${reaction.message.channel.id}) is now marked as SFW.`);
          reaction.remove(user);
          return;

        case 'TypeNSFW':
          reaction.message.channel.setNSFW(true);
          reaction.message.channel.overwritePermissions(config.noNSFW, { VIEW_CHANNEL: false });
          reaction.message.channel.overwritePermissions(config.NSFL, { VIEW_CHANNEL: null });
          reaction.message.channel.send('This channel is now marked at a NSFW-channel!');
          client.channels.get(RPChannelLog).send(`The channel <#${reaction.message.channel.id}> (${reaction.message.channel.id}) is now marked as NSFW.`);
          reaction.remove(user);
          return;

        case 'TypeNSFL':
          reaction.message.channel.setNSFW(true);
          reaction.message.channel.overwritePermissions(reaction.message.channel.guild.id, { VIEW_CHANNEL: false });
          reaction.message.channel.overwritePermissions(config.noNSFW, { VIEW_CHANNEL: false });
          reaction.message.channel.overwritePermissions(config.NSFL, { VIEW_CHANNEL: true });
          reaction.message.channel.send('This channel is now marked at a NSFL-channel!');
          client.channels.get(RPChannelLog).send(`The channel <#${reaction.message.channel.id}> (${reaction.message.channel.id}) is now marked as NSFL.`);
          reaction.remove(user);
          return;

        default:
          reaction.message.channel.send('It seems something went wrong. Please contact the owners of the server with following error-code: `err in: reaction_rp_setup`');
          return;
      }
    } else {
      reaction.message.channel.send('Sorry you are not allowed to change settings in this room!');
      reaction.remove(user);
    }
  });
};

module.exports.help = {
  name: 'reaction_rp_setup',
};
