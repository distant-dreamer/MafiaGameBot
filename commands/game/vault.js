const Functions = require("../../Functions");
module.exports = {
	name: 'vault',
	description: 'Sets the secretvault channel',
	notGMMessage: "You leave the vault channel alone.",
	async execute(client, message, args, gameState) {

		if (await Functions.CheckIfChannelVisible(message)) return;

		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};