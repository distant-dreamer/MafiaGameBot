const fs = require('node:fs');
const path = require('node:path');
const Discord = require('discord.js');
const { Client, Collection, Events, Intents } = require('discord.js');
const Attachment = require('discord.js');
const { token } = require('./config.json');

const myIntents = new Intents();
myIntents.add(
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGES);

const client = new Client({ intents: myIntents, partials: ['MESSAGE', 'CHANNEL'] });

client.commands = new Collection();

//Enmap
const Enmap = require("enmap");
const UtiltiyFunctions = require('./Functions');
const { ENMAP_DATABASE } = require('./Constants');
const { Gamestate } = require('./Classes');
const Functions = require('./Functions');

client.votes = new Enmap({
	name: "votes",
	autoFetch: true,
	fetchAll: false,
	cloneLevel: 'deep'
});
//const votes = new Enmap({provider: provider});


//Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {

	if (message.author.bot) return; // Ignore bots.

	if (message.content == "test") {
	}

	let guildID;
	if (message.guild)
		guildID = message.guild.id;
	if (!guildID) {
		let guildMap = client.votes.get(ENMAP_DATABASE.GUILD_MAP);
		if (guildMap)
			guildID = guildMap.get(message.author.id);
		if (!guildID)
			return message.channel.send(`I can't find you in any games! If this is a mistake, contact your GM.`);
	}

	let gameState = client.votes.get(guildID);
	if (!gameState)
		gameState = new Gamestate(guildID);

	let isInGmList = gameState.gms.includes(message.author.id);
	let isGM = isInGmList || (message.member && message.member.permissions.has('ADMINISTRATOR'));
	if (isGM && !isInGmList) {
		gameState.gms.push(message.author.id);
		Functions.SetGameState(client, message, gameState);
	}

	if (message.channel.type === "DM" && !message.content.startsWith(prefix)) {

		if (!gameState.vaultChannelID)
			return message.author.send("The GM needs to setup the vault channel.");

		let guild = client.guilds.cache.find(g => g.id == guildID);
		if (!guild)
			return message.author.send("Error: Failed to find guild (Try again?)");

		let member = guild.members.cache.find(m => m.id == message.author.id);
		if (!member)
			return message.author.send("Error: Failed to find member (Try again?)");

		let color = member.displayHexColor;
		let avatar = await UtiltiyFunctions.GetStoredUserURL(client, message, guild, member.user.id);
		let embed = new Discord.MessageEmbed()
			.setDescription(message.content)
			.setColor(color)
			.setAuthor({ name: message.author.username, iconURL: avatar })

		if (message.attachments.size)
			embed.setImage(message.attachments.first().url)

		let vaultChannel = client.channels.cache.get(gameState.vaultChannelID);
		if (!vaultChannel)
			return message.author.send("Error: Failed to find the vault channel. Tell the GM that they need to reset it.");

		vaultChannel.send({ embeds: [embed] });
		let vaultMessage = await message.author.send("Sent to vault.");
		await UtiltiyFunctions.sleep(5000);
		vaultMessage.delete();
		return;
	}

	if (!isGM && message.channel.id == gameState.jailCellChannelID) {
		if (!gameState.jailIntercomChannelID)
			return message.channel.send("The GM needs to set the Jail Intercom.");
		let jailIntercomChannel = client.channels.cache.get(gameState.jailIntercomChannelID);
		if (!jailIntercomChannel)
			return message.channel.send("Error: Failed to find the jail intercom channel.");
		return jailIntercomChannel.send(`**${message.author.username}**: ${message.content}`);
	}
	if (!isGM && message.channel.id == gameState.jailIntercomChannelID) {
		if (!gameState.jailCellChannelID)
			return message.channel.send("The GM needs to set the Jail Cell.");
		let jailCellChannel = client.channels.cache.get(gameState.jailCellChannelID);
		if (!jailCellChannel)
			return message.channel.send("Error: Failed to find the jail cell channel.");
		return jailCellChannel.send(`**???**: ${message.content}`);
	}

	//CHARACTER COUNT

	const votechannel = client.votes.get("VOTE_CHANNEL");
	const phase = client.votes.get("PHASE");

	if (phase && message.channel.id == votechannel) {

		var activity_array = client.votes.get("ACTIVITY_DATA");
		if (!activity_array) {
			client.votes.set("ACTIVITY_DATA", []);
		}


		var updateflag = false;
		//Look up phase and player and add to it.
		for (let i in activity_array) {
			//Find phase
			if (phase[0] == activity_array[i][0][0] && phase[1] == activity_array[i][0][1]) {

				//Find player
				if (activity_array[i][1].length > 0) {
					for (let j in activity_array[i][1]) {
						if (message.author.username == activity_array[i][1][j][0]) {
							//Update Value
							activity_array[i][1][j][1] += message.content.length;
							activity_array[i][1][j][2] += message.content.split(" ").length;
							activity_array[i][1][j][3] += 1;
							updateflag = true;
						}
					}
				}
				if (!updateflag) {
					//Add player to Dataset
					activity_array[i][1].push([message.author.username, message.content.length, message.content.split(" ").length, 1]);
					updateflag = true;
				}
			}
		}
		if (!updateflag) {
			//Add phase AND player to Dataset
			activity_array.push([phase, [[message.author.username, message.content.length, message.content.split(" ").length, 1]]]);
			updateflag = true;
		}

		client.votes.set("ACTIVITY_DATA", activity_array);
	}


	if (isGM) {
		if (message.content == "LOCK") {
			message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: false });
			message.react("🔒");
			return;
		}
		if (message.content == "UNLOCK") {
			message.channel.permissionOverwrites.edit(message.guild.roles.everyone, { SEND_MESSAGES: true });
			message.react("🔓");
			return;
		}
	}

	if (!message.content.startsWith(prefix) || message.author.bot) return;

	let args = message.content.slice(prefix.length).split(/ +/);
	let commandName = args.shift().toLowerCase();

	let command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (!command.dm && message.channel.type === "dm")
		return message.channel.send('This command cannot be sent as a DM. Send it in the server instead.');

	// if (command.dmonly && message.channel.type === "text")
	// 	return message.channel.send('This command cannot be sent in the server. Send it as a DM instead.');

	if (!isGM && !command.public) {
		let notGMMessage = (command.notGMMessage) ? command.notGMMessage : "No. Only the GM can do that.";
		return message.channel.send(notGMMessage);
	}


	try {
		command.execute(client, message, args, gameState);
	}
	catch (error) {
		console.error(error);
		message.channel.send(`There was an error trying to execute that command!\`\`\`${error}\`\`\``);
	}
});

client.login(token);