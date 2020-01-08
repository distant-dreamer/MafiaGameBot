
const Enmap = require("enmap");

module.exports = {
	name: 'players', 
	description: 'shows playerlist and majority',
	format: "!players",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("Just look at the playerlist yo.");
			return;
		}

		var voteDataArray = client.votes.get("VOTE_DATA"); //[player, votes, voter]
		const majority = client.votes.get("MAJORITY");

		if (voteDataArray == undefined) {
			message.channel.send("You don't have any players to see! Setup the game first.");
			return;
		}

		var playerArray = [];

		for (const i in voteDataArray) {
			if (voteDataArray[i][0] != "No Lynch") {
				playerArray.push(voteDataArray[i][0]);
			}
		}

		const playerStrings = playerArray.toString().replace(/,/g, "\n");

		message.channel.send("__Current Players (" + playerArray.length + "):__ \n*" + playerStrings + "*\nMajority: " + majority);
	}
};