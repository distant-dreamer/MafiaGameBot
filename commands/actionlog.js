const Functions = require("../Functions");

module.exports = {
	name: 'actionlog',
	description: 'Sets the action log channel',
	format: "!actionlog <channelid>",
	notGMMessage: "You know what rhymes with action log? Action pog!",
	execute(client, message, args, gameState) {
		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};