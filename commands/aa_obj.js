
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'objection',
	aliases: ['obj'],
	description: 'Sets the secretvault channel',
	format: "!objection",
	guildonly: true,
	execute(client, message, args, votes) {


		//Check that the GM is giving command.
		const aamode = votes.get("AAMODE");
		if (!aamode) {
			message.channel.send("Invalid input.")
			return;
		}
		
		message.channel.send({files:["./images/aa_objection.png"]});
		
	}
};