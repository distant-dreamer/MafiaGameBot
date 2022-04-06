const Functions = require("../Functions");

module.exports = {
	name: 'unmod',
	description: 'Revokes mod control. Cannot revoke form admins.',
	notGMMessage: "Stop that. I'm not an old console. Go play with a modded XBOX or something.",
	execute(client, message, args, gameState) {

		if (!args.length) 
			return message.channel.send("What? I need a user to revoke as a moderator.");

		let member = Functions.GetMemberInGuildFromInput(message, message.guild, args.shift()); 
		if (!member) return;

		if (!gameState.gms.includes(member.id)) 
			return message.channel.send(`Huh? But **${member.user.username}** doesn't have mod contorl.`);

		if (member.permissions.has('ADMINISTRATOR'))
			return message.channel.send(`You can't revoke mod permissions from **${member.user.username}** because they have admin permissions.`);

		gameState.gms = gameState.gms.filter(g => g != member.id);
		Functions.SetGameState(client, message, gameState);
		
		message.channel.send(`No more mod permissions for you, **${member.user.username}**! They can no longer use the bot as a GM.`);
	}
};