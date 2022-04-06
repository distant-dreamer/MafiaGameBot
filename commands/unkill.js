
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');
const Functions = require("../Functions");

module.exports = {
	name: 'unkill', 
	description: 'adds a player to the playerlist',
	format: "!unkill <player>",
	notGMMessage: "You do not have the power over life and death, simpleton.",
	execute(client, message, args) {

		//Check that the GM is giving command.
		var voteDataArray = client.votes.get("VOTE_DATA"); //[player, votes, voter]
		let deadUsernames = client.votes.get("DEAD_USERNAMES");
		let playerListMessageID = client.votes.get("PLAYER_LIST_MESSAGE_ID");
		let playerListChannelID = client.votes.get("PLAYER_LIST_CHANNEL_ID");

		if (voteDataArray == undefined) {
			message.channel.send("You need to setup the game before you can do that.");
			return;
		}

		var newPlayerInput = message.content.replace(prefix+"unkill ", "");

		let player = message.guild.members.cache.find(m => m.user.username.toLowerCase() == newPlayerInput.toLowerCase());
		if (!player)
			return message.channel.send(`No player found mathching input: **${newPlayerInput}** (your input must be exact to their username)`);

		voteDataArray.push([newPlayerInput, 0, [""]]); //Add player
		voteDataArray.sort();

		var playerArray = [];
		for (var i in voteDataArray) {
			if (voteDataArray[i][0] != "No Lynch") {
				playerArray.push(voteDataArray[i][0]);
			}	
		}

		deadUsernames = deadUsernames.filter(u => u != newPlayerInput);

		Functions.UpdatePlayerList(client, message, voteDataArray, deadUsernames);

		//Majority
		const playerCount = voteDataArray.length-1;
		const majority = Math.ceil(playerCount/2.0) + (1 >> (playerCount%2));
		
		client.votes.set("VOTE_DATA", voteDataArray); 
		client.votes.set("MAJORITY", majority);

		var playerStrings = playerArray.toString().replace(/,/g, "\n");

		message.channel.send(newPlayerInput + " has been given new life.\n__Current Players (" + playerCount + "):__ \n*" + playerStrings + "*\nMajority has been readjusted to: " + majority);
		
	}
};