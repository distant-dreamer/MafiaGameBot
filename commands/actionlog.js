module.exports = {
	name: 'actionlog',
	description: 'Sets the action log channel',
	format: "!actionlog <channelid>",
	guildonly: true,
	adminonly: true,
	execute(client, message, args) {

		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("You know what rhymes with action log? Action pog!")
			return;
		}

		const actionLogChannelID = args[0];
		
		client.votes.set("ACTION_LOG", actionLogChannelID);

		const actionLogString = client.channels.get(actionLogChannelID).toString();

		client.channels.get(actionLogChannelID).send("What will they do? Where will they go? Find out here!");
		message.channel.send("Action Log set to: " + actionLogString);
	}
};