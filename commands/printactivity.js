
const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const hastebin = require('hastebin-gen');

module.exports = {
	name: 'printactivity',
	description: 'Shows activity analysis',
	format: "!printactivity",
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		// const gm = client.votes.get("GM");
		// if (!gm.includes(message.author.id)) {
		// 	message.channel.send("That DATA is not for you.")
		// 	return;
		// }

		keyArray = client.votes.indexes
        const activity_array = client.votes.get("ACTIVITY_DATA");
        var total_array = [];
		var newflag = true;
        var printString  = "__**ACTIVITY_DATA**__\nplayername\tNumber of characters\tNumber of words\tNumber of posts\n";

        for (i in activity_array) {
        	printString += "**------------------------" + activity_array[i][0].join(' ') + "------------------------**\n"; //Phase
        	for (j in activity_array[i][1]) {

        		printString += activity_array[i][1][j].join('\t') + "\n"; //values

        		//Add to total
				if (total_array.length > 0) {
					newflag = true;
					for (k in total_array) {
						if (total_array[k][0] == activity_array[i][1][j][0]) {
							//Update Value
							total_array[k][1] += activity_array[i][1][j][1]; 
							total_array[k][2] += activity_array[i][1][j][2]; 
							total_array[k][3] += activity_array[i][1][j][3];
							newflag = false;
						}
					}
					if (newflag) {
						//Add if name not found
						total_array.push(activity_array[i][1][j]);
					}
				} else {
					//Add if list is empty
					total_array.push(activity_array[i][1][j]);
				}

        	}
        	//printString += "\n"; //end of phase
        }

        printString += "**------------------------TOTAL------------------------**\n";
        for (i in total_array) {
        	printString += total_array[i].join('\t') + "\n";
        }


  		message.channel.send("Placing into hastebin.");
  		hastebin(printString, "js").then(function(r){
  			return message.channel.send(r).catch(console.log("Uh.....hastebin pooped."))
  		});


	}
};