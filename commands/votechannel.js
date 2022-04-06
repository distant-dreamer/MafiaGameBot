const Functions = require("../Functions");
module.exports = {
	name: 'votechannel',
	description: 'Sets the voting channel',
	format: "!votechannel <channelid>",
	notGMMessage: "You leave the designated voting channel alone.",
	execute(client, message, args, gameState) {
		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};