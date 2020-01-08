
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

		const jailCellChannelID = args[0];
		client.votes.set("JAIL_CELL", jailCellChannelID);

		const jailCellChannel = client.channels.get(jailCellChannelID).toString();

		client.channels.get(jailCellChannelID).send("This is the designated Jail Cell.");
		message.channel.send("Jail Cell set to: " + jailCellChannelID);
	}
};