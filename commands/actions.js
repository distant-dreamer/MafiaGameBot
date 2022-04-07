const Functions = require("../Functions");

module.exports = {
	name: 'actions',
	description: 'Shows all night actions.',
	format: "!actions",
	notGMMessage: "You don't get to start the phase, buddy.",
	public: true,
	execute(client, message, args, gameState) {
		return message.channel.send(Functions.GetActions(gameState));
	}
};