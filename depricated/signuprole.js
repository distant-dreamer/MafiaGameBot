
const Enmap = require("enmap");

module.exports = {
	name: 'signuprole',
	description: 'Adds or removes a role that is automatically added when a player posts in the channel',
	guildonly: true,
	execute(client, message, args) {

		message.channel.send("Unimplemented").then(msg => {msg.delete(1500)});
		return;

		///

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("Are you trying to sign up? That's cute.")
			return;
		}

		const signupChannelID = args[0];
		client.votes.set("SIGNUPS", signupChannelID);

		const signupChannelName = client.channels.cache.get(signupChannelID).toString();

		client.channels.cache.get(signupChannelID).send("Signup here!");
		message.channel.send("Sign up channel set to: " + signupChannelName + ".\nSet automatic role assignment with \"!signuprole\"");
	}
};