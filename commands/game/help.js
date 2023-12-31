
module.exports = {
	name: 'help',
	description: 'Makes the message sender the GM of the game',
	format: "!help, !help <command>",
	public: true,
	execute(client, message, args, gameState) {

		let isGM = (message.member && message.member.permissions.has('ADMINISTRATOR'));
		if (!isGM) {
			message.channel.send(
				"**!vote <player>** - votes for a player\
				\n**!unvote** - unvotes for a player\
				\n**!night X <your action>** - sends your action to the GM\
				\n**DM the BOT** - sends a message to the secret vault. Both text and images accepted."
			);
			return;
		}

		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			let returnString = '*Here is what you need to setup the bot:*' +
				'\n:small_blue_diamond:**!setup <Mafia Role>** - sets up the game with all players with a "mafia player" role' +
				'\n:small_blue_diamond:**!sendplayerlist <channelID>** - sends a playerlist that the bot will keep updated.' +
				'\n:small_blue_diamond:**!votechannel <channelID>** - sets the main voting channel' +
				'\n:small_blue_diamond:**!log <channelID>** - sets the log channel' +
				'\n:small_blue_diamond:**!vault <channelID>** - sets the secret vault channel' +
				'\n:small_blue_diamond:**!actionlog <channelID>** - sets where you get actions' +
				'\n\n*Here is the minimum that you need to do to run a game:*' +
				'\n:last_quarter_moon_with_face:__**BEGIN NIGHT PHASE:**__:first_quarter_moon_with_face:' +
				'\n**!actions** - looks at the actions sent in for that night' +
				'\n**!kill <player>** - removes a player from the playerlist' +
				'\n**!newphase** - closes voting funtionality for the night' +
				'\n\n☀__**BEGIN DAY PHASE:**__☀' +
				'\n**!kill <player>** - removes a player from the playerlist' +
				'\n**!newphase** - activates voting and clears the votes.' +
				'\n\n**------ALL COMMANDS------**\n' +
				commands.map(command => command.name).join(', ') +
				'\n\n*To learn more about a command, send `!help <command>`*';
			return message.channel.send(returnString);
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command)
			return message.reply('I can\'t help you with that chief, that\'s not a valid command.');

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.format) data.push(`**Format:** *${command.format}*`);
		if (command.description) data.push(`**Description:** ${command.description}`);

		message.channel.send(data.join("\n"));

	}
};