
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');
const Functions = require("../Functions");

module.exports = {
	name: 'delete', 
	description: 'Deletes a player from the game',
	format: "!delete <player>",
	notGMMessage: "How would *you* like to be deleted instead?",
	async execute(client, message, args, gameState) {

		if (!gameState.players.length) 
			return message.channel.send("There's nobody left to delete.\n\nYou monster...");

		if (await Functions.CheckIfChannelVisible(message)) return;

		if (!args.length)
			return message.channel.send("Please include a player to delete from the game.");

		let player = Functions.GetPlayerFromInput(message, args.shift(), gameState.players);
		if (!player) return;

		gameState.players = gameState.players.filter(p => p.discordID != player.discordID);
		gameState.majority = Functions.CalculateMajority(gameState.players);
		Functions.SetGameState(client, message, gameState);

		let playerListString = await Functions.UpdatePlayerList(message, gameState);
		message.channel.send(`So long **${player.username}**. You will be missed.\n\n${playerListString}`);
	}
};