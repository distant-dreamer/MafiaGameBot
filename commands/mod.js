const Functions = require("../Functions");

module.exports = {
	name: 'mod',
	description: 'Gives a player control over the bot (use for joint moderation or a tech helper)',
	notGMMessage: "I'll mod your ass.",
	execute(client, message, args, gameState) {

		if (!args.length) 
			return message.channel.send("What? I need a user to add as a moderator.");

		let member = Functions.GetMemberInGuildFromInput(message, message.guild, args.shift()); 
		if (!member) return;

		if (gameState.gms.includes(member.id)) 
			return message.channel.send(`${member.user.username} already has mod contorl.`);

		gameState.gms.push(member.id);
		Functions.SetGameState(client, message, gameState);
		
		message.channel.send(`**${member.user.username}** has been given moderation permissions. Use \`!unmod\` to revoke them.`);
	}
};