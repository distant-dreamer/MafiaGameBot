
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');
const Functions = require("../Functions");

module.exports = {
	name: 'kill', 
	description: 'kills a player and resets majority',
	format: "!kill <player>",
	guildonly: true,
	async execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("Ah...if it were only that easy.");
			return;
		}

		var voteDataArray = client.votes.get("VOTE_DATA"); //[player, votes, voter]
		var voteOrderArray = client.votes.get("VOTE_ORDER");
		let deadUsernames = client.votes.get("DEAD_USERNAMES");

		if (voteDataArray == undefined) {
			message.channel.send("You don't have any players to kill! Setup the game first.");
			return;
		}

		var byeBye = message.content.replace(prefix+"kill ", "");
		var byeByei = undefined;

		var playerArray = [];
		for (var i in voteDataArray) {
			if (voteDataArray[i][0].toLowerCase().includes(byeBye.toLowerCase())) {
				byeBye = voteDataArray[i][0];
				byeByei = i;
			}
			else {
				if (voteDataArray[i][0] != "No Lynch") {
					playerArray.push(voteDataArray[i][0]);
				}
			}	
		}

		if (byeByei == undefined) {
			message.channel.send("Invalid input.");
			return;
		}

		if (voteOrderArray != undefined) {
			for (var player in voteOrderArray) {
				if (voteOrderArray[player] == byeBye) {
					voteOrderArray.splice(player, 1);
					break;
				}
			}
		}

		if (!deadUsernames)
			deadUsernames = [];
		deadUsernames.push(voteDataArray[byeByei][0]);
		voteDataArray.splice(byeByei, 1); //Remove player (shit gets weird if removed while looping through loop)

		//Majority
		const playerCount = voteDataArray.length-1;
		const majority = Math.ceil(playerCount/2.0) + (1 >> (playerCount%2));

		Functions.UpdatePlayerList(client, message, voteDataArray, deadUsernames);

		client.votes.set("VOTE_DATA", voteDataArray); 
		client.votes.set("VOTE_ORDER", voteOrderArray); 
		client.votes.set("MAJORITY", majority);
		client.votes.set("DEAD_USERNAMES", deadUsernames);

		var playerStrings = playerArray.toString().replace(/,/g, "\n");

		message.channel.send("Bye bye " + byeBye + "!\n__Current Players (" + playerCount + "):__ \n*" + playerStrings + "*\nMajority has been readjusted to: " + majority);
	}
};