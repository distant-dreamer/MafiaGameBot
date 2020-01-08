
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');

module.exports = {
	name: 'unkill', 
	description: 'adds a player to the playerlist',
	format: "!unkill <player>",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		var voteDataArray = client.votes.get("VOTE_DATA"); //[player, votes, voter]

		if (!gm.includes(message.author.id)) {
			message.channel.send("You do not have the power over life and death, simpleton.");
			return;
		}

		if (voteDataArray == undefined) {
			message.channel.send("You need to setup the game before you can do that.");
			return;
		}

		var newPlayer = message.content.replace(prefix+"unkill ", "");

		voteDataArray.push([newPlayer, 0, [""]]); //Add player
		voteDataArray.sort();

		var playerArray = [];
		for (var i in voteDataArray) {
			if (voteDataArray[i][0] != "No Lynch") {
				playerArray.push(voteDataArray[i][0]);
			}	
		}

		//Majority
		const playerCount = voteDataArray.length-1;
		const majority = Math.ceil(playerCount/2.0) + (1 >> (playerCount%2));

		
		client.votes.set("VOTE_DATA", voteDataArray); 
		client.votes.set("MAJORITY", majority);

		var playerStrings = playerArray.toString().replace(/,/g, "\n");

		message.channel.send(newPlayer + " has been given new life.\n__Current Players (" + playerCount + "):__ \n*" + playerStrings + "*\nMajority has been readjusted to: " + majority);
		
	}
};