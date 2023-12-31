const { Player } = require("../../Classes");
const { ENMAP_DATABASE } = require("../../Constants");
const Functions = require("../../Functions");

module.exports = {
	name: 'setup',
	description: 'Adds all players under a role to the game.',
	format: "!setup <role>",
	notGMMessage: "I'll setup your ass.",
	async execute(client, message, args, gameState) {

		if (!args.length) 
			return message.channel.send("You need to enter a role.");

		let roleMembers;
		let inputRole = args.join(" ").toLowerCase(); 
		let role = message.guild.roles.cache.find(x => x.name.toLowerCase().includes(inputRole));
		if (!role) 
			return message.channel.send(`Invalid role: ${inputRole}`);
		roleMembers = [...role.members.values()];

		let players = [];
		for (let member of roleMembers) {
			let avatarURL = await Functions.GetStoredUserURL(client, message, message.guild, member.id);
			players.push(new Player(member.user.username, member.id, avatarURL));
		}

		gameState.players = players;
		gameState.majority = Functions.CalculateMajority(gameState.players);
		Functions.SetGameState(client, message, gameState);

		let guildMap = client.votes.get(ENMAP_DATABASE.GUILD_MAP);
		if (!guildMap)
			guildMap = new Map();
		for (let player of players) 
			guildMap.set(player.discordID, gameState.guildID);
		client.votes.set(ENMAP_DATABASE.GUILD_MAP, guildMap);

		let playerList = Functions.GetPlayerList(gameState);
		message.channel.send(`Game setup for **${players.length}** players.\n\n${playerList}`);
	}
};