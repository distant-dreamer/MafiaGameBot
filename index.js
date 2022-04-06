const fs = require('fs');
const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const Attachment = require('discord.js');
const { prefix, token } = require('./config.json');

const myIntents = new Discord.Intents();
myIntents.add(
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_PRESENCES,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.DIRECT_MESSAGES
);

let client = new Client({ intents: myIntents, partials: ['MESSAGE', 'CHANNEL'] });

client.commands = new Discord.Collection();

//Enmap
const Enmap = require("enmap");
const UtiltiyFunctions = require('./Functions');
const { ENMAP_DATABASE } = require('./Constants');
const { Gamestate } = require('./Classes');

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
	console.log('It\'s time to get sus!');
});

client.on('messageCreate', async message => {

	if (message.author.bot) return; // Ignore bots.

	if (message.channel.type === "DM" && !message.content.startsWith(prefix)) {

		const vaultChannelID = client.votes.get("VAULT");//Get vault channel;
		const guildID = client.votes.get("GUILD_ID");//Get Guild ID

		if (vaultChannelID && guildID) {
			//Color and send message
			let guild = client.guilds.cache.find(g => g.id == guildID);
			let member = guild.members.cache.find(m => m.id == message.author.id);
			let color;
			if (member)
				color = member.displayHexColor;

			let avatar = await UtiltiyFunctions.GetStoredUserURL(client, message, member.user.id); 
			//Put the message in a cute little embed
			let embed = new Discord.MessageEmbed()
				.setDescription(message.content)
				.setColor(color)
				.setAuthor({ name: message.author.username, iconURL: avatar })

			//Add Image if it exists
			if (message.attachments.size)
				embed.setImage(message.attachments.first().url)

			await client.channels.cache.get(vaultChannelID).send({ embeds: [embed] });

			let vaultMessage = await message.author.send("Sent to vault.");
			await UtiltiyFunctions.sleep(5000);
			vaultMessage.delete();
		}
		else {
			message.author.send("The GM needs to setup the vault channel.");
		}
		return;
	}
	//if (message.author.role !== "God") return;

	var jailCellChannelID = client.votes.get("JAIL_CELL");
	var jailIntercomChannelID = client.votes.get("JAIL_INTERCOM");

	const gm = client.votes.get("GM");
	if (gm && message.author.id != gm) { //ignore messeges from gm
		//TO JAILOR
		if (message.channel.id == jailCellChannelID) {
			client.channels.cache.get(jailIntercomChannelID).send("**" + message.author.username + "**: " + message.content);
			// let vaultMessage = await message.channel.send('Sent to ???.')
			// await UtiltiyFunctions.sleep(1000);
			// vaultMessage.delete();
			return;
		}

		//TO JAILCELL
		if (message.channel.id == jailIntercomChannelID) {
			client.channels.cache.get(jailCellChannelID).send("**???:**  " + message.content);
			// let vaultMessage = await message.channel.send('Sent to hidden room')
			// await UtiltiyFunctions.sleep(1000);
			// vaultMessage.delete();
			return;
		}
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
		for (i in activity_array) {
			//Find phase
			if (phase[0] == activity_array[i][0][0] && phase[1] == activity_array[i][0][1]) {

				//Find player
				if (activity_array[i][1].length > 0) {
					for (j in activity_array[i][1]) {
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

	let isGM = (message.member && message.member.permissions.has('ADMINISTRATOR'));

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

	try {
		command.execute(client, message, args, gameState);
	}
	catch (error) {
		console.error(error);
		message.channel.send(`There was an error trying to execute that command!\`\`\`${error}\`\`\``);
	}
});

client.login(token);