
const Enmap = require("enmap");

module.exports = {
	name: 'jailcell',
	description: 'Sets the jail cell channel',
	format: "!jailcell <channelid>",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You leave the designated jail cell alone.")
			return;
		}

		const jailCellChannelID = args.shift();
		const jailCellChannel = client.channels.cache.get(jailCellChannelID);
		if (!jailCellChannel)
			return message.channel.send("Invalid channel ID");

		client.votes.set("JAIL_CELL", jailCellChannel.id);

		client.channels.cache.get(jailCellChannel.id).send("This is the designated Jail Cell.");
		message.channel.send("Jail Cell set to: " + jailCellChannel.toString());
	}
};