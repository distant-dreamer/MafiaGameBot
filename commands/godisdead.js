
const Enmap = require("enmap");

module.exports = {
	name: 'godisdead',
	description: 'Releases gm control',
	format: "!godisdead",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("Excuse you? God is not dead! Rude.")
			return;
		}

		client.votes.set("GM", undefined); 
		message.channel.send("All moderators and gamemasters have been erased.");
	}
};