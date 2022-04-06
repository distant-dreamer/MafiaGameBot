
const Enmap = require("enmap");

module.exports = {
	name: 'mod',
	description: 'Gives a player control over the bot (use for joint moderation or a tech helper)',
	notGMMessage: "I'll mod your ass.",
	execute(client, message, args) {

		const gm = client.votes.get("GM");

		if (!args.length) {
			return message.channel.send("What? I need a user id.")
		}

		let inputUser = args.shift();

		let player = message.guild.members.cache.find(m => m.user.username.toLowerCase() == inputUser.toLowerCase());
		if (!player)
			return message.channel.send(`No player found mathching input: **${inputUser}** (it must be exact)`);

		if (gm.includes(player.username)) {
			message.channel.send(`${player.username} already has mod contorl.`);
			return;
		}

		gm.push(player.id);
		client.votes.set("GM", gm);
		message.channel.send(player.user.username + " has been given moderation permissions.");
		return;

	}
};