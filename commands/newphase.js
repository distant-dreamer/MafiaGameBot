const { PHASE_TYPE } = require("../Constants");
const Functions = require("../Functions");

module.exports = {
	name: 'newphase',
	description: 'Prepares the next DAY or NIGHT phase. Insert no arguments to process to the next phase automatically.',
	format: "!newphase [day/night] [phase#]",
	aliases: ["nextphase"],
	notGMMessage: "You don't get to start the phase, buddy.",
	async execute(client, message, args, gameState) {

		if (!gameState.players.length)
			return message.channel.send("You have no players! You need to run `!setup` first before you can start the phase.");
		if (!gameState.logChannelID)
			return message.channel.send("You need to set the log channel first with `!log`");
		if (!gameState.voteChannelID)
			return message.channel.send("You need to set the vote channel first with `!votechannel`");
		if (!gameState.actionLogChannelID)
			return message.channel.send("You need to set the action log channel first with `!actionlog`");

		let inputPhaseType = args.shift();
		if (inputPhaseType)
			inputPhaseType = inputPhaseType.toUpperCase();
		let inputPhase = Number(args.shift());

		if (inputPhaseType == undefined) {
			switch (gameState.phaseType) {
				case undefined:
				case PHASE_TYPE.DAY:
					inputPhaseType = PHASE_TYPE.NIGHT;
					break;
				case PHASE_TYPE.NIGHT:
					inputPhaseType = PHASE_TYPE.DAY;
					break;
			}
		}
		if (isNaN(inputPhase) || inputPhase == undefined)
			inputPhase = (inputPhaseType == PHASE_TYPE.DAY) ? gameState.phase + 1 : gameState.phase;
		if (inputPhase == undefined)
			inputPhase = 0;

		let returnMessage = "";

		if (gameState.dms.length)
			returnMessage += Functions.GetDms(gameState) + "\n\n";

		gameState.phase = inputPhase;
		gameState.phaseType = inputPhaseType;
		gameState.hammered = false;
		gameState.votes = [];
		gameState.dms = [];

		let phaseLabel;

		switch (gameState.phaseType) {
			case PHASE_TYPE.DAY:

				//TODO: clear votes

				let phaseSymbol = "";
				while (phaseSymbol.length < inputPhase)
					phaseSymbol += "☀";
				phaseLabel = `**${phaseSymbol} ${inputPhaseType} ${inputPhase} ${phaseSymbol}**`;

				let alivePlayers = gameState.players.filter(p => p.alive);
				let majority = Functions.CalculateMajority(gameState.players);

				returnMessage += 
					`Votes cleared for **${alivePlayers.length}** players.\n` +
					`Majority set to: **${majority}**\n` +
					`Prepared for **${inputPhaseType} ${inputPhase}**`

				break;
			case PHASE_TYPE.NIGHT:
				let phaseSymbolLeft = "";
				let phaseSymbolRight = "";
				while (phaseSymbolLeft.length < inputPhase) {
					phaseSymbolLeft += "🌜";
					phaseSymbolRight += "🌛";
				}
				phaseLabel = `**${phaseSymbolLeft} ${inputPhaseType} ${inputPhase} ${phaseSymbolRight}**`;
				returnMessage += `It's sleepy time.\nPrepared for ${inputPhaseType} ${inputPhase}`;
				break;
			default:
				return message.channel.send(`What the heck is a ${inputPhaseType} phase?`);
		}

		let logChannel = client.channels.cache.get(gameState.logChannelID);
		let actionLogChannel = client.channels.cache.get(gameState.actionLogChannelID);
		if (logChannel) {
			let logChannelMessage = await logChannel.send(phaseLabel);
			Functions.Pin(logChannelMessage);
		}
		if (actionLogChannel) {
			let actionLogChannelMessage = await actionLogChannel.send(phaseLabel);
			Functions.Pin(actionLogChannelMessage);
		}
		Functions.Pin(message)

		Functions.SetGameState(client, message, gameState);
		message.channel.send(returnMessage);
	}
};