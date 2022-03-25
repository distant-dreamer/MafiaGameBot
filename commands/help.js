
const Enmap = require("enmap");

const { prefix } = require('../config.json');


module.exports = {
	name: 'help',
	description: 'Makes the message sender the GM of the game',
	format: "!help, !help <command>",
	guildonly: true,
	execute(client, message, args) {

		const gm = client.votes.get("GM");

		if (!gm.includes(message.author.id)) {
			message.channel.send(
				"**!vote <player>** - votes for a player\
				\n**!unvote** - unvotes for a player\
				\n**DM the BOT** - sends a message to the secret vault. Both text and images accepted."
				);
			return;
		}

		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('*Here is what you need to setup the bot:*\n**!gm** - makes you the GM\n**!setup <Mafia Role>** - sets up the game with all players with a "mafia player" role\n\**!votechannel <votechannelID>** - sets the main voting channel\n**!log <logchannelID>** - sets the voting log channel (required)\n**!vault <vaultchannelID>** - sets the secret vault channel\n\n');
			data.push('*Here is what should be you main command loop during the game:*\n\n__**BEGIN NIGHT PHASE:**__\n**!votedata** - gives data on who and who hasn\'t voted\n**printdm** - shows who has send !dm (if you are a public DM game)\n**!kill <player>** - removes a player from the playerlist\n**!newphase night <phase#>** - closes voting funtionality for the night\n\n__**BEGIN DAY PHASE:**__\n**!kill <player>** - removes a player from the playerlist\n**!newphase day <phase#>** - activates voting and clears the votes\n');
			data.push('**------ALL COMMANDS------**');
			data.push(commands.map(command => command.name).join(', '));
			return message.channel.send(data.join("\n"));
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('I can\'t help you with that chief, that\'s not a valid command.');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.format) data.push(`**Format:** *${command.format}*`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.cooldown) data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data.join("\n"));
		
	}
};