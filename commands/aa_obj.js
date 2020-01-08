
const Enmap = require("enmap");

module.exports = {
	name: 'objection',
	aliases: ['obj'],
	description: 'Sets the secretvault channel',
	format: "!objection",
	guildonly: true,
	execute(client, message, args) {


		//Check that the GM is giving command.
		const aamode = client.votes.get("AAMODE");
		if (!aamode) {
			message.channel.send("Invalid input.")
			return;
		}
		
		message.channel.send({files:["./images/aa_objection.png"]});
		
	}
};