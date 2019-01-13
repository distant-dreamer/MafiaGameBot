const fs = require('fs');
const Discord = require('discord.js');
const Attachment = require('discord.js');
const { prefix, token } = require('./config.json');
const cooldowns = new Discord.Collection();


const client = new Discord.Client();
client.commands = new Discord.Collection();

//Enmap
const Database = require('better-sqlite3');
const Enmap = require("enmap");
//const EnmapLevel = require("enmap-level");
//const EnmapRethink = require('enmap-rethink');

const votes = new Enmap({
	name: "votes",
	autoFetch: true,
	fetchAll: false
});
//const votes = new Enmap({provider: provider});


//Commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}





client.on('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {

	const vaultChannelID = votes.get("VAULT");//Get vault channel;
	const guildID = votes.get("GUILD_ID");//Get Guild ID

	if (message.author.bot) return; // Ignore bots.

	if (message.channel.type === "dm") {

		if (vaultChannelID != undefined && guildID != undefined) {
			//Color and send message
			const user = client.guilds.get(guildID).fetchMember(message.author).then((user) => {
				var color = user.displayHexColor;

				//Put the message in a cute little embed
				const embed = new Discord.RichEmbed()
					.setDescription(message.content)
					.setColor(color)
					.setAuthor(message.author.username, message.author.avatarURL )

				//Add Image if it exists
				if (message.attachments.array().length != 0) {
					embed.setImage(message.attachments.array()[0].url)
				}

				client.channels.get(vaultChannelID).send(embed);
			})		

			message.author.send("Sent to vault.").then(msg => {
				 msg.delete(5000);
 				 });
		}
		else {
			message.author.send("The GM needs to set the vault channel.");
		}
		return;
	}
	//if (message.author.role !== "God") return;

	var jailCellChannelID = votes.get("JAIL_CELL");
	var jailIntercomChannelID = votes.get("JAIL_INTERCOM");

	const gm = votes.get("GM");
	if (gm != undefined && message.author.id != gm) { //ignore messeges from gm
		//TO JAILOR
		if (message.channel.id == jailCellChannelID) {
			client.channels.get(jailIntercomChannelID).send("**" + message.author.username + "**: " + message.content);
			client.channels.get(jailCellChannelID).stopTyping();
			message.channel.send('Sent to ???.')
					.then(msg => {
					 msg.delete(3000)
						 })
					.catch();
			return;
		}

		//TO JAILCELL
		if (message.channel.id == jailIntercomChannelID) {
			client.channels.get(jailCellChannelID).send("**???:**  " + message.content);
			client.channels.get(jailIntercomChannelID).stopTyping();
			message.channel.send('Sent to hidden room')
					.then(msg => {
					 msg.delete(3000)
						 })
					.catch();
			return;
		}
	}

	/*
	MONOKUMA

	if (message.content.includes("monokuma") || message.content.includes("Monokuma")) {
		message.channel.send("That guy is the best!");
	}
	if (message.content.includes("bear") || message.content.includes("Bear")) {
		message.channel.send("Bears are awesome!");
	}
	if (message.content.includes("despair") || message.content.includes("Despair")) {
		message.channel.send("Phuhuhuhuhuhuhuhu!");
	}
	

	if (message.content.includes("god") && message.content.includes("bomb")) {
		message.channel.send("A bomb!");
	}
	*/



	//CHARACTER COUNT

	var activity_array = votes.get("ACTIVITY_DATA");
	if (!activity_array) {
		votes.set("ACTIVITY_DATA", []);
	}

	const phase = votes.get("PHASE");
	const votechannel = votes.get("VOTE_CHANNEL");
	var updateflag = false;

	if (phase && message.channel.id == votechannel ) {
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
	}

	votes.set("ACTIVITY_DATA", activity_array);


	//commands
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.args && !args.length) {
		let reply = 'Where are the arguments???';

		if (command.usage) {
			reply += '\nProper usage: \'${prefix}${command.name} ${command.usage}\'';

		}
	}

	//COOLDOWN
	/*
	if (!cooldowns.has(command.name)) {
    	cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (!timestamps.has(message.author.id)) {
	    timestamps.set(message.author.id, now);
    	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	else {
	    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

	    if (now < expirationTime) {
	        const timeLeft = (expirationTime - now) / 1000;
	        return message.reply(`slow down! You need to wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command!`);
	    }

	    timestamps.set(message.author.id, now);
	    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
	}
	*/

	try {
	    command.execute(client, message, args, votes);
	}
	catch (error) {
	    console.error(error);
	    message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);