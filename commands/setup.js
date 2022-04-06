
const Enmap = require("enmap");
const { Player } = require("../Classes");
const { prefix, token } = require('../config.json');
const { ENMAP_DATABASE } = require("../Constants");
const { GetStoredUserURL, GetPlayerList, SetGameState: SetGamestate } = require("../Functions");

module.exports = {
	name: 'setup',
	description: 'Adds all players under a role to the game.',
	format: "!setup <role>",
	notGMMessage: "I'll setup your ass.",
	async execute(client, message, args, gameState) {

		if (!args.length) 
			return message.channel.send("You need to enter a role.");

		let roleMembers;
		let inputRole = args.shift(); 
		let role = message.guild.roles.cache.find(x => x.name == inputRole);
		if (!role) 
			return message.channel.send(`Invalid role: ${inputRole}`);
		roleMembers = [...role.members.values()];

		let players = [];
		for (let member of roleMembers) {
			let avatarURL = await GetStoredUserURL(client, message, member.id);
			players.push(new Player(member.user.username, member.id, avatarURL));
		}

		let playerList = GetPlayerList(players);

		gameState.players = players;
		SetGamestate(client, message, gameState);

		message.channel.send(`Game setup for **${players.length}**.\n\n${playerList}`);
	}
};