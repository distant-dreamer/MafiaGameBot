
const Enmap = require("enmap");

module.exports = {
	name: 'printdata',
	description: 'Shows internal data',
	format: "!printdata",
	notGMMessage: "That DATA is not for you.",
	execute(client, message, args) {

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