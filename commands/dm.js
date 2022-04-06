
const Enmap = require("enmap");
const { Dm } = require("../Classes");
const { prefix, token } = require('../config.json');
const Functions = require("../Functions");

module.exports = {
	name: 'dm',
	description: 'allows players to DM each other',
	format: "!dm",
	public: true,
	execute(client, message, args, gameState) {

		if (!args.length)
			return message.channel.send(`Ok. You're DMing nobody. Got it.`);

		let dmedPlayer = Functions.GetPlayerFromInput(message, args.shift(), gameState.players);
		if (!dmedPlayer) return;

		let dm = new Dm(message.author.username, dmedPlayer.username);

		if (gameState.dms.some(d => d.senderUsername == dm.senderUsername && d.receiverUsername == dm.receiverUsername))
			return message.channel.send(`You're already DMing ${dmedPlayer.username}`);

		gameState.dms.push(dm);
		Functions.SetGameState(client, message, gameState);
		return message.channel.send(`${message.author.username} may now DM **${dmedPlayer.username}**`);
	}
};