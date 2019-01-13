
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'vault',
	description: 'Sets the secretvault channel',
	guildonly: true,
	execute(client, message, args, votes) {

		//Check that the GM is giving command.
		const gm = votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You leave the vault channel alone.")
			return;
		}

		const vaultChannelID = args[0];
		votes.set("VAULT", vaultChannelID);

		const vaultChannelName = client.channels.get(vaultChannelID).toString();

		client.channels.get(vaultChannelID).send("The vault is locked.");
		message.channel.send("Vault set to: " + vaultChannelName);
	}
};