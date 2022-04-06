const Functions = require("../Functions");
module.exports = {
	name: 'jailcell',
	description: 'Sets the jail cell channel',
	format: "!jailcell <channelid>",
	notGMMessage: "You leave the designated jail cell alone.",
	execute(client, message, args, gameState) {
		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};