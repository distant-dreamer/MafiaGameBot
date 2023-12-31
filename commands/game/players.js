const Functions = require("../../Functions");

module.exports = {
	name: 'players', 
	description: 'shows playerlist and majority',
	format: "!players",
	notGMMessage: "Just look at the playerlist yo.",
	execute(client, message, args, gameState) {

		if (!gameState.players.length) 
			return message.channel.send("You don't have any players to see! Setup the game first with `!setup`.");

		message.channel.send(Functions.GetPlayerList(gameState));
	}
};