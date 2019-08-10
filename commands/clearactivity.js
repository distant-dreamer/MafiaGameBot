
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'clearactivity',
	description: 'Clears all activity records from the bot.',
	format: "!clearactivity",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("Nice try, hacker.")
			return;
		}

		client.votes.set("ACTIVITY_DATA", []);

        message.channel.send("All activity data cleared. Bye Bye, precious data!");

	}
};