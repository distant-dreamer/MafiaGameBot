
const Enmap = require("enmap");

module.exports = {
	name: 'vault',
	description: 'Sets the secretvault channel',
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You leave the vault channel alone.")
			return;
		}

		const vaultChannelID = args[0];
		client.votes.set("VAULT", vaultChannelID);

		const vaultChannelName = client.channels.cache.get(vaultChannelID).toString();

		client.channels.cache.get(vaultChannelID).send("The vault is locked.");
		message.channel.send("Vault set to: " + vaultChannelName);
	}
};