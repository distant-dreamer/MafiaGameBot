const Functions = require("../../Functions");
module.exports = {
	name: 'jailintercom',
	description: 'Sets the jail intercom channel, where a jailor can speak to a jailed player anonymously. GMs are ignored in jail channels.',
	format: "!jailintercom <channelid>",
	notGMMessage: "You leave the designated jail intercom alone.",
	async execute(client, message, args, gameState) {
		if (await Functions.CheckIfChannelVisible(message)) return;

		Functions.SetGameChannel(client, message, args, gameState, this.name);
	}
};