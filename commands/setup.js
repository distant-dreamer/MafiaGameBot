
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');
const UtilityFunctions = require("../UtilityFunctions");

module.exports = {
	name: 'setup',
	description: 'Adds a player to the current game',
	format: "!setup <role>",
	guildonly: true,
	async execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("I'll setup your ass.")
			return;
		}
		let roleMembers;

		const mafiaPlayerRole = message.content.replace((prefix + "setup "), "");
		if (mafiaPlayerRole.length == 0) {
			message.channel.send("You need to enter a role.");
		}
		try {
			let role = message.guild.roles.cache.find(x => x.name == mafiaPlayerRole);
			roleMembers = [...role.members.values()];
		}
		catch (error) {
			message.channel.send("Invalid role. " + error );
			return;
		}

		var playerString = "*";
		var voteDataArray = [];
		for (let i in roleMembers) {
			let user = roleMembers[i].user;
			playerString += user.username + "\n";
			await UtilityFunctions.GetStoredUserURL(client, message, user.id);
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
		client.votes.set("DEAD_USERNAMES", []);

		message.channel.send("Game setup for " + playerCount + " players.\n*" + playerString + "*\nDefault majority set to: " + majority);
	}
};