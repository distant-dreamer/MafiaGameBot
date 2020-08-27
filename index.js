const fs = require('fs');
const Discord = require('discord.js');
const Attachment = require('discord.js');
const { prefix, token } = require('./config.json');
const cooldowns = new Discord.Collection();


const client = new Discord.Client();
client.commands = new Discord.Collection();

//Enmap
const Enmap = require("enmap");

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
	console.log('Ready!');
});

client.on('message', message => {

	


	if (message.author.bot) return; // Ignore bots.

	if (message.channel.type === "dm" && !message.content.startsWith(prefix)) {

		const vaultChannelID = client.votes.get("VAULT");//Get vault channel;
		const guildID = client.votes.get("GUILD_ID");//Get Guild ID

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
			message.author.send("The GM needs to setup the vault channel.");
		}
		return;
	}
	//if (message.author.role !== "God") return;

	// var jailCellChannelID = client.votes.get("JAIL_CELL");
	// var jailIntercomChannelID = client.votes.get("JAIL_INTERCOM");

	// const gm = client.votes.get("GM");
	// if (gm != undefined && message.author.id != gm) { //ignore messeges from gm
	// 	//TO JAILOR
	// 	if (message.channel.id == jailCellChannelID) {
	// 		client.channels.get(jailIntercomChannelID).send("**" + message.author.username + "**: " + message.content);
	// 		client.channels.get(jailCellChannelID).stopTyping();
	// 		message.channel.send('Sent to ???.')
	// 				.then(msg => {
	// 				 msg.delete(3000)
	// 					 })
	// 				.catch();
	// 		return;
	// 	}

	// 	//TO JAILCELL
	// 	if (message.channel.id == jailIntercomChannelID) {
	// 		client.channels.get(jailCellChannelID).send("**???:**  " + message.content);
	// 		client.channels.get(jailIntercomChannelID).stopTyping();
	// 		message.channel.send('Sent to hidden room')
	// 				.then(msg => {
	// 				 msg.delete(3000)
	// 					 })
	// 				.catch();
	// 		return;
	// 	}
	// }

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


	const votechannel = client.votes.get("VOTE_CHANNEL");
	const phase = client.votes.get("PHASE");

	if (phase && message.channel.id == votechannel ) {

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

	//SINGUPS--------------------

	

	// const signupchannel = client.votes.get("SIGNUPS");
	// //client.votes.set("SIGNUPCOUNT", 4);
	// if (message.channel.id == signupchannel) {

		
	// 	const playerMax = 20;

	// 	console.log(message.author.username + " " + message.content);
	// 	if (message.author.username[message.author.username.length-1] == message.content[0] && message.content.length == 4){
	// 		let MafiaRole = message.guild.roles.find(r => r.name === "Mafia Players");
	// 		let AliveRole = message.guild.roles.find(r => r.name === "Alive");
	// 		message.member.addRole(MafiaRole).catch(console.error);
	// 		message.member.addRole(AliveRole).catch(console.error);
	// 		message.channel.overwritePermissions(message.member, {'SEND_MESSAGES': false} );
	// 		message.channel.send('`Success. Welcome to Mafia Game #3, ' + message.author.username + "`");

	// 		//List remaining avalibility
	// 		var signupCount = client.votes.get("SIGNUPCOUNT");
	// 		if (!signupCount) {
	// 			signupCount = 1;
	// 		} else {
	// 			signupCount += 1;
	// 		}
	// 		client.votes.set("SIGNUPCOUNT", signupCount);
	// 		var remainingSlots = playerMax - signupCount;
	// 		message.channel.send("Number of signed up players: " + signupCount + "\nRemaining slots: " + remainingSlots);

	// 		//Close channel if all slots filled
	// 		if (remainingSlots == 0) {
	// 			message.channel.send("All slots have been filled!");
	// 			let perms = message.guild.roles.find(r => r.name === "has sign up perms");
	// 			message.channel.overwritePermissions(perms, {'SEND_MESSAGES': false} );
	// 		}

	// 		return
		
	// 	} else {
	// 		message.channel.send('`Incorrect input`').then(msg => {msg.delete(5000)}).catch();
	// 		message.delete();
	// 		return;
	// 	}
	// }
	
	
	
	
	/*

	
	//RELEASE THE ZOMBIES (MAFIA #3 ONLY)
	if (message.content.includes("ET EXSURGE A MORTUIS") && message.channel.id == votechannel) {
		const Deadrole = message.guild.roles.find(x => x.name == "Dead");
		message.channel.overwritePermissions(Deadrole, {'SEND_MESSAGES': true} );
		console.log("ZOMBIES RELEASED");
	}

	

	
	//SCOOBS JOJO BATTLE (MAFIA #2.5 ONLY)
	if (message.content.includes("BREAK YOUR FACE, THAT IS") && (message.channel.id == votechannel) && (message.author.id == 216291435287150592)) {
		message.channel.send(
			"**TRUE SCOOBY SNACKS HAS CHALLENGED ANOTHER PLAYER!**\nBoth players now must partake in the following duel of wits:"+
			"```THE CHALLENGE:\nEach player has two options:\n--------------------------------------\n-----------ATTACK, or SPARE-----------\n--------------------------------------\n\n"+
			"-If both players ATTACK, both will die.\n\n-If one player SPARES and the other ATTACKS, the sparing player will die.\n\n"+
			"-If both players SPARE, the challenge will end and no one will die.\n\n"+
			"-The two players must submit their choice via DM to the GM before the end of the phase. It can be changed at will until the phase is locked. "+
			"If one player fails to send an action before the end of the phase both players will die.```"
			)
	}

	*/

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

	//Notify if this can only be sent in guild
	if (command.guildonly && message.channel.type === "dm") {
		message.reply('This command cannot be sent as a DM. Send it in the server instead.');
		return;
	}

	//Notify if this can only be sent in dm
	if (command.dmonly && message.channel.type === "text") {
		message.reply('This command cannot be sent in the server. Send it as a DM instead.');
		return;
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
	    command.execute(client, message, args);
	}
	catch (error) {
	    console.error(error);
	    message.reply('there was an error trying to execute that command!');
	}
});

client.login(token);