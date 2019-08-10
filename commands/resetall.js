
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'resetall',
	description: 'Releases gm control',
	format: "!resetall",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		client.votes.fetchEverything();

		///*

		const gm = client.votes.get("GM");

		if (!gm.includes(message.author.id)) {
			message.channel.send("Only the Gamemaster can use this command.")
			return;
		}

		//*/

		const keys = client.votes.indexes;
		for (i in keys) {
			client.votes.set(keys[i], undefined);
		}

		message.channel.send("All data has been cleared.");
	}
};