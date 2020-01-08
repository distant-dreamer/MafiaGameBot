
const Enmap = require("enmap");

module.exports = {
	name: 'votechannel',
	description: 'Sets the voting channel',
	format: "!votechannel <channelid>",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You leave the designated voting channel alone.")
			return;
		}

		const voteChannelID = args[0];
		client.channels.get(voteChannelID);
		const voteChannelName = client.channels.get(voteChannelID).toString();


		try {
			client.channels.get(voteChannelID).send("Voting happens here!");

		}
		catch (error) {
			//Bot couldn't post to the channel.
			message.channel.send("The bot doesn't have access to that channel!");
			return;	
		}

		client.votes.set("VOTE_CHANNEL", voteChannelID);
		client.votes.set("ACTIVITY_DATA", []);

		message.channel.send("Voting channel set to: " + voteChannelName);
	}
};