
const Enmap = require("enmap");

module.exports = {
	name: 'whoisgod',
	description: 'reveals who the gm is',
	format: "!whoisgod",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");

		if (!gm) { message.channel.send("There is no current Game Master!"); return; }

		var masters = [];
		for (i in gm) {
			var member = message.guild.members.cache.find(m => m.id == gm[i]);
			if (!member)
				return message.channel.send(`...uh, idk who god is, actually. I can't find them. I have this stored though: ${gm[i]}`);
			masters.push(member.user.username);
		}
		message.channel.send(`Current Game Master(s):\n${masters.join("\n")}`);

	}
};