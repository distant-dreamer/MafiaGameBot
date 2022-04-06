
const Enmap = require("enmap");

module.exports = {
	name: 'resetall',
	description: 'Releases gm control',
	format: "!resetall",
	notGMMessage: "Ha. Very funny. No.",
	execute(client, message, args) {

		client.votes.fetchEverything();

		const keys = client.votes.indexes;
		for (i in keys) {
			client.votes.set(keys[i], undefined);
		}

		message.channel.send("All data has been cleared.");
	}
};