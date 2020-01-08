
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');

module.exports = {
	name: 'printdm',
	description: 'allows players to DM each other',
	format: "!printdm",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("Can't do that chief.")
			return;
		}

		if (!client.votes.get("DMLIST")) {
			var dm_list = []
		} else {
			var dm_list = client.votes.get("DMLIST");
		}
		
		var printstring = "------DMs------\n";
		for (const i in dm_list) {
			printstring += dm_list[i][0] + " --> " + dm_list[i][1] + "\n";
		}

		message.channel.send(printstring);
		return;
		
	}
};