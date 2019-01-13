
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'newphase', 
	description: 'clears vote count. Argument sets majority',
	format: "!newphase <day/night> <phase#>",
	guildonly: true,
	execute(client, message, args, votes) {

		//Check that the GM is giving command.
		const gm = votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You don't get to start the phase, buddy.")
			return;
		}
		if (gm == undefined) {
			message.channel.send("Are you the gm? Run !gm first.");
			return;
		}
		var voteDataArray = votes.get("VOTE_DATA"); //[player, votes, voter]
		var voteOrderArray = votes.get("VOTE_ORDER");
		const logChannelID = votes.get("LOG"); //Log
		var phaseType = args[0].toUpperCase();; //Day or night
		var phaseNum = Number(args[1]); //Phase count

		if (phaseType == undefined) {
			message.channel.send("Please provide info for what phase to begin.");
			return;
		}
		if (phaseNum == undefined) {
			message.channel.send("Please provide a phase number.");
			return;
		}
		if (voteDataArray == undefined) {
			message.channel.send("You need to run \"!setup\" before you can start the phase.");
			return;
		}
		if (logChannelID == undefined) {
			message.channel.send("<@" + gm[0] + ">, you need to set the log channel!");
			return;
		}

		//Majority
		const playerCount = voteDataArray.length-1;
		const majority = Math.ceil(playerCount/2.0) + (1 >> (playerCount%2));

		switch(phaseType) {
			case "DAY":
				for (const i in voteDataArray) {
					voteDataArray[i][1] = 0; //clear vote
					voteDataArray[i][2] = []; //clear voters
				}

				var numSuns = "";
				while (numSuns.length < phaseNum) {
					numSuns += "☀";
				}

			    client.channels.get(logChannelID).send("**" + numSuns + phaseType + " " + phaseNum + numSuns + "**");

				message.channel.send("Votes cleared for " + playerCount + " players.\nDefault majority set to: " + majority + "\nPrepared for " + phaseType + " " + phaseNum);

				voteOrderArray = new Array;

				break;
			case "NIGHT":
				message.channel.send("It's sleepy time.\nPrepared for " + phaseType + " " + args[1]);
				break;

			default:
				message.channel.send("What the heck is a " + phaseType + " phase?");
				return;
				break;
		}

		//Majority
	    votes.set("VOTE_DATA", voteDataArray); 
	    votes.set("VOTE_ORDER", voteOrderArray);
		votes.set("MAJORITY", majority);
		votes.set("PHASE", [phaseType, phaseNum]);
		votes.set("HAMMER", false);
	}
};