const Enmap = require("enmap");
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');

module.exports = {
	name: 'vote',
	description: 'Votes for a player',
    format: "!vote <player>",
	guildonly: true,
	execute(client, message, args) {
        //Check if it's day
        
        const gm = client.votes.get("GM");
        var phaseType = client.votes.get("PHASE"); //[phaseType, phaseNum]
        

        if (gm == undefined) {
            //CHANGE THIS IF THERE'S A DIFFERENT GM
            message.channel.send("<@233786007093248000>, help! I need to be reset!"); //Pings Ahmayk. 
            return;
        }

        var voteDataArray = client.votes.get("VOTE_DATA"); //array of: [player, votes, voted]
        if (voteDataArray == undefined) {
            message.channel.send("<@" + gm[0] + "> needs to get their shit together and setup the game.");
            return;
        }

        const voteChannelID = client.votes.get("VOTE_CHANNEL");
        if (voteChannelID == undefined) {
            message.channel.send("<@" + gm[0] + "> needs to set the voting channel!");
            return;
        }

        if (message.channel.id != voteChannelID) {
            message.channel.send("This ain't the designated voting channel.");
            return;
        }

        
        if (phaseType == undefined) {
            message.channel.send("<@" + gm[0] + "> needs to set the phase before you can vote!");
            return;
        }

        if (phaseType[0] == "NIGHT") {
            message.channel.send("JESUS LOVES YOU.");
            return;
        }

		if (!args.length) {
            message.channel.send(`You gotta vote for somebody ${message.author}`);
            return;
        }

    	//Put arguments into string

    	var votedPlayer = message.content.replace(prefix+"vote ", ""); //remove "!vote"
    	var voteOrderArray = client.votes.get("VOTE_ORDER");//array of ordered voted players 
        const majority = client.votes.get("MAJORITY"); //Majority
        const logChannelID = client.votes.get("LOG"); //Log
        var hammerReached = client.votes.get("HAMMER"); //Vote Hammer/majority
    	var inputMatch = false;
        phaseType = phaseType[0];

    	//Place vote in table
    	for (const i in voteDataArray) {
    		if (voteDataArray[i][0].toLowerCase().includes(votedPlayer.toLowerCase())) {
    			//match input to name in array
    			votedPlayer = voteDataArray[i][0];


    			//Check to see if they've already voted for them
    			if (voteDataArray[i][2].includes(message.author.username)) {
    				message.channel.send("You can't vote for " + votedPlayer + " again!")
        				.then(msg => {
    						msg.delete(1500)
    			 		})
    					return;
    			}

                //Check if they're placeholding and ban that shit cause no.
                if (voteDataArray[i][0] == message.author.username && voteDataArray[i][1] == 0) {
                    message.channel.send("You need to have at least one vote on you before you can vote for yourself!");
                    return;
                }

    			//Add voted to Vote order
    			try {
    				if (!voteOrderArray.includes(votedPlayer))
    				voteOrderArray.push(votedPlayer);
    			}
    			catch (error) {
    				voteOrderArray = new Array [votedPlayer];
    			}

    			//Check if another player needs to be unvoted
    			var unvotedPlayer = "";
    			for (const p in voteDataArray) {
    				if (voteDataArray[p][2].includes(message.author.username)) {
        				//Define unvoted player
      					var unvotedPlayer = voteDataArray[p][0];
                        //Undo player as voter
      					voteDataArray[p][2].splice(voteDataArray[p][2].indexOf(message.author.username), 1);
      					//Take away vote
      					voteDataArray[p][1] -= 1;
    				}
    			}

    			//Add Vote
    			voteDataArray[i][1] += 1;

    			//Add player as voter
    			voteDataArray[i][2].push(message.author.username);

    			inputMatch = true;
    			break;
    		}
    	}

    	if (!inputMatch){
        	message.channel.send("Invalid player.")
			.then(msg => {
				msg.delete(1500)
			 })
			return;
    	}

        var descriptionText = "";
        var sumVotes = 0;
        var highestVote = 0;
        var zeroPlayer_i;
        //console.log(voteOrderArray);
		for (const player in voteOrderArray) {

				//Look up Vote
				for (const i in voteDataArray) {
					if (voteDataArray[i][0] == voteOrderArray[player]) {
						var numVotes = voteDataArray[i][1];
                        sumVotes += numVotes;
                        if (numVotes > highestVote) {
                            highestVote = numVotes;
                        }
                        if (numVotes == 0) {
                            zeroPlayer_i = player;
                        }
					}
				}

			if (voteOrderArray[player] == votedPlayer) {
				descriptionText += "__**" + voteOrderArray[player] + ":  " + numVotes + "**__\n";
			} 
			else if (voteOrderArray[player] == unvotedPlayer) {
				descriptionText += "*" + voteOrderArray[player] + ":  " + numVotes + "*\n";
			}
			else {
				descriptionText += voteOrderArray[player] + ":  " + numVotes + "\n";
			}
		}

        //remove zeros
        if (zeroPlayer_i) {
            voteOrderArray.splice(zeroPlayer_i, 1);
        }
        
		

        //Output in an embed
        const votedPlayerObject = message.guild.members.find(x => x.user.username === votedPlayer)

        var color = 0xFFFFFF;
        var avatar = "http://www.clker.com/cliparts/e/0/f/4/12428125621652493290X_mark_18x18_02.svg.med.png";

        try {
            color  = votedPlayerObject.displayHexColor;
            avatar = votedPlayerObject.user.avatarURL;
        }
        catch(error) {
            var color = 0xFFFFFF;
            var avatar = "http://www.clker.com/cliparts/e/0/f/4/12428125621652493290X_mark_18x18_02.svg.med.png";
        }

        const voteEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.username + " voted for " + votedPlayer, message.author.avatarURL)
            .setColor(color)
            .setThumbnail(avatar)
            .setTitle("-----VOTES ("+ sumVotes +")-----\n" + descriptionText);
            //.addField("-----VOTES ("+ sumVotes +")-----", descriptionText, true)

        //send to channel
        message.channel.send(voteEmbed);
        //Place in log bot
        if (logChannelID) {
            client.channels.get(logChannelID).send(voteEmbed);
        }
        else {
            message.channel.send("<@" + gm[0] + ">, you need to set the log channel!");
        }
        
        //Check for majority
        if (highestVote == majority) {
            if (!hammerReached) {
                message.channel.send("<@" + gm[0] + ">, " + message.author.username + " has placed the hammer on " + votedPlayer + "!");
                //const hammer = client.emojis.find("name", "hammer");
                client.channels.get(logChannelID).send("🔨🔨🔨🔨🔨🔨🔨"); //Posts hammers
                hammerReached = true;

                //Lock Hammered out of chat
                try{
                	message.channel.overwritePermissions(votedPlayerObject, {'SEND_MESSAGES': false} );
                	message.channel.send("*" + votedPlayer + " has been locked out of " + message.channel.name + " and can no loger post in this channel.*");
                }
                catch(error) {
                	message.channel.send("Attempt to lock hammered player out of chat falied. Just don't talk here anymore, ok " + votedPlayer + "?");
                }



            }
        }
  
		//set data
		client.votes.set("VOTE_DATA", voteDataArray);
		client.votes.set("VOTE_ORDER", voteOrderArray);
        client.votes.set("HAMMER", hammerReached);



	},
};

