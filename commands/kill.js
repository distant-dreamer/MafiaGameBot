
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');
const Functions = require("../Functions");

module.exports = {
	name: 'kill', 
	description: 'Kills a player and resets majority.',
	format: "!kill <player>",
	notGMMessage: "Ah...if it were only that easy.",
	async execute(client, message, args, gameState) {

		if (!gameState.players.length) 
			return message.channel.send("Kill? Kill who? You have no players!");

		if (await Functions.CheckIfChannelVisible(message)) return;

		if (!args.length)
			return message.channel.send("Please include a player to kill.");

		let player = Functions.GetPlayerFromInput(message, args.shift(), gameState.players);
		if (!player) return;

		if (!player.alive)
			return message.channel.send(`No! Nooo!! Stop!! **${player.username}** is already dead!`);

		player.alive = false;
		gameState.majority = Functions.CalculateMajority(gameState.players);
		Functions.SetGameState(client, message, gameState);

		let playerListString = await Functions.UpdatePlayerList(message, gameState);
		message.channel.send(`Bye bye **${player.username}**!\n\n${playerListString}`);
	}
};