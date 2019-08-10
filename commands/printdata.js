
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const hastebin = require('hastebin-gen');

module.exports = {
	name: 'printdata',
	description: 'Shows internal data',
	format: "!printdata",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("The DATA is not for you.")
			return;
		}

		keyArray = client.votes.indexes
        const dataMap = client.votes.fetch(keyArray);
        var printString = "-----ALL DATA-----\n" + dataMap.map((v, k) => ("**" + k + "** => " + v)).join("\n");


      	if(printString.length > 2000) {
      		message.channel.send("Message longer than 2000. Placing into hastebin.");
      		hastebin(printString, "js").then(function(r){
      			return message.channel.send(r)
      		})
      	}
      	else {
      		message.channel.send(printString);
      	}

	}
};