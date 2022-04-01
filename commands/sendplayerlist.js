const UtilityFunctions = require("../UtilityFunctions");

module.exports = {
	name: 'sendplayerlist',
	description: 'Sends a playerlist to the specified channel. The bot will keep the playerlist updated throughout the game as you use the !kill command.',
	format: "!sendplayerlist <channelID>",
	async execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) 
			return message.channel.send("No player list for you.");

		if (!args.length)
			return message.channel.send("Please insert a channel ID to send the player list in");

		let playerListChannelID = args.shift();

		let playerListChannel = client.channels.cache.get(playerListChannelID);
		if (!playerListChannel)
			return message.channel.send("Unknown channel ID");

        let voteDataArray = client.votes.get("VOTE_DATA"); //array of: [player, votes, voted]
		let deadUsernames = client.votes.get("DEAD_USERNAMES"); 
		
		let playerListString = UtilityFunctions.GetPlayerList(voteDataArray, deadUsernames);
		let listMessage = await playerListChannel.send(playerListString);
		client.votes.set("PLAYER_LIST_MESSAGE_ID", listMessage.id);
		client.votes.set("PLAYER_LIST_CHANNEL_ID", listMessage.channel.id);

		message.channel.send("Player list sent!");
	},
};