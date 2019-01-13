
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const { prefix } = require('../config.json');


module.exports = {
	name: 'help',
	description: 'Makes the message sender the GM of the game',
	format: "!help, !help <command>",
	guildonly: true,
	execute(client, message, args, votes) {

		const gm = votes.get("GM");

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
			data.push('Here is what should be you main command loop during the game:\n**BEGIN NIGHT PHASE:**\n!votedata\n!kill <player>\n!newphase night <phase#>\n**BEGIN DAY PHASE:**\n!kill <player>\n!newphase day <phase#>');
			data.push('**------ALL COMMANDS------**');
			data.push(commands.map(command => command.name).join(', '));
			return message.channel.send(data, { split: true });
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

		message.channel.send(data, { split: true });
		
	}
};