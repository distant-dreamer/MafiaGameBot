
const Enmap = require("enmap");

module.exports = {
	name: 'log',
	description: 'Sets the log channel',
	format: '!log <channelid>',
	notGMMessage: "You leave the designated log channel alone.",
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("")
			return;
		}

		const logChannelID = args[0];
		client.votes.set("LOG", logChannelID);

		const logChannelName = client.channels.cache.get(logChannelID).toString();

		client.channels.cache.get(logChannelID).send("This log channel is so designated.");
		message.channel.send("Log channel set to: " + logChannelName);
	}
};