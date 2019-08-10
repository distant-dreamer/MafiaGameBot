
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'aamode',
	description: 'Sets the secretvault channel',
	guildonly: true,
	execute(client, message, args, votes) {


		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (message.author.id != gm) {
			message.channel.send("Nope.")
			return;
		}
		
		var aamode = client.votes.get("AAMODE");

		switch (args[0]) {
			case "on":
				aamode = true;
				message.channel.send("Ace Attorney Mode has been **activated!**");
				break;
			case "off":
				aamode = false;
				message.channel.send("Ace Attorney Mode is now **deactivated!**");
				break;
			default:
				if (aamode) {
					message.channel.send("Ace Attorney Mode is currently **activated**. Type \"!aamode off\" to deactivate.");
				}
				else {
					message.channel.send("Ace Attorney Mode is currently **deactivated**. Type \"!aamode on\" to activate.");
				}
				break;
		}

		client.votes.set("AAMODE", aamode);
		
	}
};