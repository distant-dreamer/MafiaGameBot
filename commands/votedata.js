
const Enmap = require("enmap");

module.exports = {
	name: 'votedata', 
	description: 'adds a player to the playerlist',
	format: "!votedata",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You don't get to have that **DATA**.");
			return;
		}

		var voteDataArray = client.votes.get("VOTE_DATA"); //[player, votes, [voters]]

		//Iterate though data and post voters
		var voteDataString = "-----VOTE DATA-----\n";
		var hasVoted = [];
		console.log(voteDataArray);
		for (const i in voteDataArray) {
			for (var voter in voteDataArray[i][2]){
				if (voteDataArray[i][2][voter] != (undefined || "")){
					voteDataString += "**" + voteDataArray[i][2][voter] + "** voted for --> **" + voteDataArray[i][0] + "**\n";
					hasVoted.push(voteDataArray[i][2][voter]);
				}
			}
		}

		//Check if player is idle
		voteDataString += "-----IDLE-----\n";
		for (const i in voteDataArray) {
			if (voteDataArray[i][0] != 'No Lynch' && !hasVoted.includes(voteDataArray[i][0])) {
				voteDataString += "*" + voteDataArray[i][0] + "*\n";	
			}
		}

		client.votes.set("VOTE_DATA", voteDataArray); 
		
		message.channel.send(voteDataString);
	}
};