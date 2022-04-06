const Functions = require("../Functions");
module.exports = {
	name: 'log',
	description: 'Sets the log channel',
	format: '!log <channelid>',
	notGMMessage: "You leave the designated log channel alone.",
	execute(client, message, args, gameState) {
		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};