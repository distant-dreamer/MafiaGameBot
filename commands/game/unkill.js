
const Enmap = require("enmap");
const { Player } = require("../../Classes");
const { prefix, token } = require('../../config.json');
const Functions = require("../../Functions");

module.exports = {
	name: 'unkill',
	description: 'Adds a player to the Alive playerlist. Can be a dead player or anyone in the server.',
	format: "!unkill <player>",
	notGMMessage: "You do not have the power over life and death, simpleton.",
	async execute(client, message, args, gameState) {

		if (await Functions.CheckIfChannelVisible(message)) return;

		if (!args.length)
			return message.channel.send("Please include a player to bring to life. It can be anyone in the server.");

		let inputUsername = args.shift().toLowerCase();
		let player = gameState.players.find(p => !p.alive && p.username.toLowerCase().includes(inputUsername));
		if (!player) {
			let member = Functions.GetMemberInGuildFromInput(message, message.guild, inputUsername); 
			if (!member) return;
			if (gameState.players.some(p => p.discordID == member.id))
				return message.channel.send(`**${member.user.username}** is already alive and in the game. I'm not adding them again!`);
			let avatarURL = await Functions.GetStoredUserURL(client, message, message.guild, member.id);
			player = new Player(member.user.username, member.id, avatarURL);
			gameState.players.push(player);
		}
		player.alive = true;
		gameState.majority = Functions.CalculateMajority(gameState.players);
		Functions.SetGameState(client, message, gameState);

		let playerListString = await Functions.UpdatePlayerList(message, gameState);
		message.channel.send(`**${player.username}** has been given new life!\n\n${playerListString}`);
	}
};