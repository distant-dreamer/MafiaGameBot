const Functions = require("../Functions");
module.exports = {
	name: 'votes', 
	description: 'Displays all votes for this phase.',
	format: "!votes",
	notGMMessage: "You don't get to have that **DATA**.",
	aliases: ["votedata"],
	execute(client, message, args, gameState) {
		message.channel.send(Functions.GetVotes(message, gameState));
	}
};