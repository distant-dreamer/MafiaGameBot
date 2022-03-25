
const Enmap = require("enmap");

module.exports = {
	name: 'gm',
	description: 'Makes the message sender the GM of the game',
	format: "!gm",
	guildonly: true,
	execute(client, message, args) {

		if (!client.votes.get("GM")) {
			client.votes.set("GM", [message.author.id]); 
			client.votes.set("GUILD_ID", message.guild.id);
			message.channel.send("Hello " + message.author.username + "! You are now the Game Master.");
			return;
		}

		if (client.votes.get("GM").includes(message.author.id)) {
			client.votes.set("GUILD_ID", message.guild.id);
			message.channel.send("You don't need to do that again, I got u " + message.author.username );
			return;
		} 
		if (client.votes.get("GM") != undefined) {
			message.channel.send("Sorry. But you do not get to be God.");
			return;
		}
		
	}
};