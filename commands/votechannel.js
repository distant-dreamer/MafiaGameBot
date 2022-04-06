
const Enmap = require("enmap");

module.exports = {
	name: 'votechannel',
	description: 'Sets the voting channel',
	format: "!votechannel <channelid>",
	notGMMessage: "You leave the designated voting channel alone.",
	execute(client, message, args) {

		const voteChannelID = args.shift();
		let voteChannel = client.channels.cache.get(voteChannelID);
		if (!voteChannel)
			return message.channel.send(`Unknown channel with ID: ${voteChannelID}`);

		try {
			client.channels.cache.get(voteChannelID).send("Voting happens here!");

		}
		catch (error) {
			//Bot couldn't post to the channel.
			message.channel.send("The bot doesn't have access to that channel!");
			return;	
		}

		client.votes.set("VOTE_CHANNEL", voteChannelID);
		client.votes.set("ACTIVITY_DATA", []);

		message.channel.send("Voting channel set to: " + voteChannel.toString());
	}
};