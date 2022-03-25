
const Enmap = require("enmap");

module.exports = {
	name: 'jailintercom',
	description: 'Sets the jail intercom channel',
	format: "!jailintercom <channelid>",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You leave the designated jail intercom alone.")
			return;
		}

		const jailCellChannelID = args.shift();
		const jailIntercomChannel = client.channels.cache.get(jailCellChannelID);
		if (!jailIntercomChannel)
			return message.channel.send("Invalid channel ID");
		client.votes.set("JAIL_INTERCOM", jailIntercomChannel.id);

		client.channels.cache.get(jailIntercomChannel.id).send("This is the designated Jail Intercom.");
		message.channel.send("Jail Intercom set to: " + jailIntercomChannel.toString());
	}
};