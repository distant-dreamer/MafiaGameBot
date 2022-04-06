const Functions = require("../Functions");

module.exports = {
	name: 'sendplayerlist',
	description: 'Sends a playerlist to the specified channel. The bot will keep the playerlist updated throughout the game as you use the !kill command.',
	format: "!sendplayerlist <channelID>",
	notGMMessage: "No player list for you.",
	async execute(client, message, args, gameState) {

		if (!args.length)
			return message.channel.send("Please insert a channel ID to send the player list in");

		let playerListChannelID = args.shift();

		let playerListChannel = client.channels.cache.get(playerListChannelID);
		if (!playerListChannel)
			return message.channel.send("Unknown channel ID");

		let playerListString = Functions.GetPlayerList(gameState);
		let listMessage = await playerListChannel.send(playerListString);

		gameState.playerListMessageID = listMessage.id;
		gameState.playerListMessageURL = listMessage.url;
		gameState.playerListChannelID = listMessage.channel.id;
		Functions.SetGameState(client, message, gameState);

		message.channel.send(`Player list sent to ${playerListChannel.toString()}`);
	},
};