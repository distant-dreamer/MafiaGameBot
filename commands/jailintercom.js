
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'jailintercom',
	description: 'Sets the jail intercom channel',
	format: "!jailintercom <channelid>",
	guildonly: true,
	execute(client, message, args, votes) {

		//Check that the GM is giving command.
		const gm = votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You leave the designated jail intercom alone.")
			return;
		}

		const jailIntercomChannelID = args[0];
		votes.set("JAIL_INTERCOM", jailIntercomChannelID);

		const jailIntercomChannel = client.channels.get(jailIntercomChannelID).toString();

		client.channels.get(jailIntercomChannelID).send("This is the designated Jail Intercom.");
		message.channel.send("Jail Intercom set to: " + jailIntercomChannelID);
	}
};