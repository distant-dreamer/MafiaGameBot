const { Action } = require("../Classes");
const Functions = require("../Functions");

module.exports = {
	name: 'night',
	description: 'Sends an night action to the GM',
	format: "!Night X, your action",
	notGMMessage: "You don't get to start the phase, buddy.",
	public: true,
	execute(client, message, args, gameState) {

		if (!gameState.actionLogChannelID)
			return message.channel.send("The GM needs to set the action log!");

		if (!args.length)
			return message.channel.send("Do what now? You need to say what you're doing. " +
				"Format as: !Night X, [action]");

		let actionLogChannel = client.channels.cache.get(gameState.actionLogChannelID);
		if (!actionLogChannel)
			return message.channel.send("...uh oh! I can't find the action log channel! The GM needs to reset it.");

		let action = new Action(message.author.username, message.content.substr(1)); 
		try {
			actionLogChannel.send( `----------------------------------------\n` +
				`${message.author.username}:\n\`\`\`${action.text}\`\`\``
			);
		}
		catch (error) {
			return message.channel.send(`:anger: Failed to send your action to the actionLog. \`\`\`${error}\`\`\``);
		}

		gameState.actions = gameState.actions.filter(a => a.senderUsername != action.senderUsername);
		gameState.actions.push(action);
		Functions.SetGameState(client, message, gameState);

		message.channel.send("Action sent.");
	}
};