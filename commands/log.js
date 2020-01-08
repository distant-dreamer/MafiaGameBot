
const Enmap = require("enmap");

module.exports = {
	name: 'log',
	description: 'Sets the log channel',
	format: '!log <channelid>',
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You leave the designated log channel alone.")
			return;
		}

		const logChannelID = args[0];
		client.votes.set("LOG", logChannelID);

		const logChannelName = client.channels.get(logChannelID).toString();

		client.channels.get(logChannelID).send("This log channel is so designated.");
		message.channel.send("Log channel set to: " + logChannelName);
	}
};