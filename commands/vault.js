const Functions = require("../Functions");
module.exports = {
	name: 'vault',
	description: 'Sets the secretvault channel',
	notGMMessage: "You leave the vault channel alone.",
	execute(client, message, args, gameState) {
		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};