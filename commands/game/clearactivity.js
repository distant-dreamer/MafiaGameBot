
const Enmap = require("enmap");

module.exports = {
	name: 'clearactivity',
	description: 'Clears all activity records from the bot.',
	format: "!clearactivity",
	notGMMessage: "Nice try, hacker.",
	execute(client, message, args) {

		client.votes.set("ACTIVITY_DATA", []);

        message.channel.send("All activity data cleared. Bye Bye, precious data!");

	}
};