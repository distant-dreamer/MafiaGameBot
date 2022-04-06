
const Enmap = require("enmap");
const { prefix, token } = require('../config.json');

module.exports = {
	name: 'dm',
	description: 'allows players to DM each other',
	format: "!dm",
	public: true,
	execute(client, message, args) {

		if (!client.votes.get("DMLIST")) {
			var dm_list = []
		} else {
			var dm_list = client.votes.get("DMLIST");
		}
		
		var voteDataArray = client.votes.get("VOTE_DATA");
		var votedPlayer = message.content.replace(prefix+"dm ", "");

		if (!args.length) {
            message.channel.send(`Ok. You're DMing nobody. Got it.`);
            return;
        }

        var inputMatch = false;
		for (const i in voteDataArray) {
    		if (voteDataArray[i][0].toLowerCase().includes(votedPlayer.toLowerCase())) {
    			//match input to name in array
    			votedPlayer = voteDataArray[i][0];

				//Check to see if they've already voted for them
				for (const name in dm_list) {
					if (name.includes(votedPlayer)) {
						message.channel.send("You're already DMing " + votedPlayer + ".")
						return;
					}
				}

				dm_list.push([message.author.username, votedPlayer]);
				inputMatch = true;
				break;
    		}
    	}
    	if (!inputMatch){
        	message.channel.send("Invalid player.")
			return;
    	}

		message.channel.send(message.author.username + " may now DM " + votedPlayer)

		client.votes.set("DMLIST", dm_list); 
		return;
		
	}
};