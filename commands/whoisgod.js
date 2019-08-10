
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'whoisgod',
	description: 'reveals who the gm is',
	format: "!whoisgod",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");

		if (!gm) {message.channel.send("There is no current Game Master!"); return;}

		message.channel.send("The current Game Master(s): ");
		var masters = '';
		for (i in gm) {
			var user = client.fetchUser(gm[i]).then(user => {
				message.channel.send(user.username);
			});
		}

	}
};