const Functions = require("../Functions");

module.exports = {
	name: 'dms',
	description: 'Shows all dms sent this phase.',
	format: "!dms",
	notGMMessage: "Can't do that chief.",
	execute(client, message, args, gameState) {
		message.channel.send(Functions.GetDms(gameState));
	}
};