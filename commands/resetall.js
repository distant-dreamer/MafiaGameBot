
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'resetall',
	description: 'Releases gm control',
	format: "!resetall",
	guildonly: true,
	execute(client, message, args, votes) {

		//Check that the GM is giving command.
		votes.fetchEverything();

		const gm = votes.get("GM");

		if (!gm.includes(message.author.id)) {
			message.channel.send("Only the Gamemaster can use this command.")
			return;
		}

		const keys = votes.indexes;
		for (i in keys) {
			votes.set(keys[i], undefined);
		}

		message.channel.send("All data has been cleared.");
	}
};