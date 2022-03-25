
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');

module.exports = {
	name: 'setup',
	description: 'Adds a player to the current game',
	format: "!setup <role>",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("I'll setup your ass.")
			return;
		}

		const mafiaPlayerRole = message.content.replace((prefix + "setup "), "");
		if (mafiaPlayerRole.length == 0) {
			message.channel.send("You need to enter a role.");
		}
		try {
			const roleMembers = message.guild.roles.find(x => x.name == mafiaPlayerRole).members.array();
		}
		catch (error) {
			message.channel.send("Invalid role.");
			return;
		}

		const roleMembers = message.guild.roles.find(x => x.name == mafiaPlayerRole).members.array();
		var playerString = "*";
		var voteDataArray = [];
		for (var i in roleMembers) {
			playerString += roleMembers[i].user.username + "\n";
			voteDataArray[i] = [roleMembers[i].user.username, 0, [""]] //playerstring, voteCount, [voters]
		}

		playerString += "*";
		voteDataArray.sort();
		voteDataArray.push(["No Lynch", 0, [""]]);

		//Majority
		const playerCount = voteDataArray.length-1;
		const majority = Math.ceil(playerCount/2.0) + (1 >> (playerCount%2));

		client.votes.set("VOTE_DATA", voteDataArray); 
		client.votes.set("VOTE_ORDER", []);
		client.votes.set("MAJORITY", majority);

		message.channel.send("Game setup for " + playerCount + " players.\n*" + playerString + "*\nDefault majority set to: " + majority);
	}
};