
const Enmap = require("enmap");

module.exports = {
	name: 'printdata',
	description: 'Shows internal data. Mostly depricated, but might still be of use.',
	format: "!printdata",
	notGMMessage: "That DATA is not for you.",
	execute(client, message, args) {

		keyArray = client.votes.indexes
		const dataMap = client.votes.fetch(keyArray);
		var printString = "-----ALL DATA-----\n" + dataMap.map((v, k) => ("**" + k + "** => " + v)).join("\n");

		if (printString.length > 2000) {
			return "It's too big for me to post! Sorry. Go eat some garlic bread.";
			// message.channel.send("Message longer than 2000. Placing into hastebin.");
			// hastebin(printString, "js").then(function (r) {
			// 	return message.channel.send(r)
			// })
		}

		message.channel.send(printString);

	}
};