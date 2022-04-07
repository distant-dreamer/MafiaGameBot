
const Enmap = require("enmap");

module.exports = {
	name: 'resetall',
	description: 'Resets all data in the server.',
	format: "!resetall",
	notGMMessage: "Ha. Very funny. No.",
	execute(client, message, args, gameState) {

		client.votes.set(gameState.guildID, null);
		message.channel.send("All data has been cleared.");
	}
};