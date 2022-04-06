
const Enmap = require("enmap");

module.exports = {
	name: 'jailcell',
	description: 'Sets the jail cell channel',
	format: "!jailcell <channelid>",
	notGMMessage: "You leave the designated jail cell alone.",
	execute(client, message, args) {

		const jailCellChannelID = args.shift();
		const jailCellChannel = client.channels.cache.get(jailCellChannelID);
		if (!jailCellChannel)
			return message.channel.send("Invalid channel ID");

		client.votes.set("JAIL_CELL", jailCellChannel.id);

		client.channels.cache.get(jailCellChannel.id).send("This is the designated Jail Cell.");
		message.channel.send("Jail Cell set to: " + jailCellChannel.toString());
	}
};