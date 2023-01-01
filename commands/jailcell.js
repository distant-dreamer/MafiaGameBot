const Functions = require("../Functions");
module.exports = {
	name: 'jailcell',
	description: 'Sets the jail cell channel, where a jailed player can speak to an anonymous jailor. GMs are ignored in jail channels.',
	format: "!jailcell <channelid>",
	notGMMessage: "You leave the designated jail cell alone.",
	execute(client, message, args, gameState) {
		if (Functions.CheckIfChannelVisible(message)) return;

		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};