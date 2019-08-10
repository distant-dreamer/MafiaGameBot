
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'takethat',
	aliases: ['tt', 'tthat'],
	description: 'Sets the secretvault channel',
	format: "!takethat",
	guildonly: true,
	execute(client, message, args) {


		//Check that the GM is giving command.
		const aamode = client.votes.get("AAMODE");
		if (!aamode) {
			message.channel.send("Invalid input.")
			return;
		}
		
		message.channel.send({files:["./images/aa_takethat.png"]});
		
	}
};