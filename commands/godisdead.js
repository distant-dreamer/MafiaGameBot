
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'godisdead',
	description: 'Releases gm control',
	format: "!godisdead",
	guildonly: true,
	execute(client, message, args, votes) {

		//Check that the GM is giving command.
		const gm = votes.get("GM");
		if (gm.includes(message.author.id)) {
			message.channel.send("Excuse you? God is not dead! Rude.")
			return;
		}

		votes.set("GM", undefined); 
		message.channel.send("All moderators and gamemasters have been erased.");
	}
};