
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

module.exports = {
	name: 'gm',
	description: 'Makes the message sender the GM of the game',
	format: "!gm",
	guildonly: true,
	execute(client, message, args, votes) {

		if (!votes.get("GM")) {
			votes.set("GM", [message.author.id]); 
			votes.set("GUILD_ID", message.guild.id);
			message.channel.send("Hello " + message.author + "! You are now the Game Master.");
			return;
		}

		if (votes.get("GM").includes(message.author.id)) {
			votes.set("GUILD_ID", message.guild.id);
			message.channel.send("You don't need to do that again, I got u " + message.author);
			return;
		} 
		if (votes.get("GM") != undefined) {
			message.channel.send("Sorry. But you do not get to be God.");
			return;
		}
		
	}
};