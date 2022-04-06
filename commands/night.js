const prefix = process.env.prefix;

module.exports = {
	name: 'night',
	description: 'Sends an night action to the GM',
	format: "!Night X, your action",
	notGMMessage: "You don't get to start the phase, buddy.",
	public: true,
	execute(client, message, args) {
		
		actionLogChannelID = client.votes.get("ACTION_LOG");

		if (actionLogChannelID == undefined) 
			return message.channel.send("The GM needs to set the action log!");

		const action = message.content.slice(1);

		if (args.length === 0) {
			return message.channel.send("Do what now? You need to say what you're doing. Format as: !Night X, [action]");
		}

		client.channels.cache.get(actionLogChannelID).send(
			"----------------------------------------\n" + message.author.username + ":\n```" + action + "```"
			);
		message.reply("Action sent.");
	}
};