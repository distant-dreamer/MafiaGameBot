module.exports = {
	name: 'actionlog',
	description: 'Sets the action log channel',
	format: "!actionlog <channelid>",
	notGMMessage: "You know what rhymes with action log? Action pog!",
	execute(client, message, args) {

		const actionLogChannelID = args[0];
		
		client.votes.set("ACTION_LOG", actionLogChannelID);

		let actionLog = client.channels.cache.get(actionLogChannelID);
		if (!actionLog)
			return message.channel.send(`Unknown channel with ID: ${actionLogChannelID}`);

		actionLog.send("What will they do? Where will they go? Find out here!");
		message.channel.send("Action Log set to " + actionLog.toString());
	}
};