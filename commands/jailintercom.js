
const Enmap = require("enmap");

module.exports = {
	name: 'jailintercom',
	description: 'Sets the jail intercom channel',
	format: "!jailintercom <channelid>",
	notGMMessage: "You leave the designated jail intercom alone.",
	execute(client, message, args) {

		const jailCellChannelID = args.shift();
		const jailIntercomChannel = client.channels.cache.get(jailCellChannelID);
		if (!jailIntercomChannel)
			return message.channel.send("Invalid channel ID");
		client.votes.set("JAIL_INTERCOM", jailIntercomChannel.id);

		client.channels.cache.get(jailIntercomChannel.id).send("This is the designated Jail Intercom.");
		message.channel.send("Jail Intercom set to: " + jailIntercomChannel.toString());
	}
};