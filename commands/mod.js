
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'mod',
	description: 'Gives a player control over the bot (use for joint moderation or a tech helper)',
	guildonly: true,
	execute(client, message, args) {

		const gm = client.votes.get("GM");

		if (!gm.includes(message.author.id)) {
			message.channel.send("I'll mod your ass.");
			return;
		}

		if (!args.length) {
			return message.channel.send("What? I need a user id.")
		}

		else {

			const userid = args[0];

			if (gm.includes(userid)) {
				message.channel.send(client.users.get(userid).username + " has already has mod control.");
				return;
			} 

			gm.push(userid)
			client.votes.set("GM", gm); 
			message.channel.send(client.users.get(userid).username + " has been given moderation permissions.");
			return;
		}
		
	}
};