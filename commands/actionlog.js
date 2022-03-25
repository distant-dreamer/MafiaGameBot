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

		let actionLog = client.channels.cache.get(actionLogChannelID);
		if (!actionLog)
			return message.channel.send(`Unknown channel with ID: ${actionLogChannelID}`);

		actionLog.send("What will they do? Where will they go? Find out here!");
		message.channel.send("Action Log set to " + actionLog.toString());
	}
};