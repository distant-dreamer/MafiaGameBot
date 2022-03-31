const Enmap = require("enmap");
const Discord = require('discord.js');
const { prefix, token } = require('../config.json');
const Permissions = require("discord.js/src/util/Permissions");
const UtilityFunctions = require("../UtilityFunctions");

module.exports = {
    name: 'vote',
    description: 'Votes for a player',
    format: "!vote <player>",
    guildonly: true,
    async execute(client, message, args) {
        //Check if it's day

        let gm = client.votes.get("GM");
        let phaseType = client.votes.get("PHASE"); //[phaseType, phaseNum]
        let voteDataArray = client.votes.get("VOTE_DATA"); //array of: [player, votes, voted]
        let voteChannelID = client.votes.get("VOTE_CHANNEL");

        if (!gm)
            //CHANGE THIS IF THERE'S A DIFFERENT GM
            return message.channel.send("<@233786007093248000>, help! I need to be reset!"); //Pings Ahmayk. 

        if (!voteDataArray)
            return message.channel.send("<@" + gm[0] + "> needs to get their shit together and setup the game.");

        if (!voteChannelID)
            return message.channel.send("<@" + gm[0] + "> needs to set the voting channel!");

        if (message.channel.id != voteChannelID)
            return message.channel.send("This ain't the designated voting channel.");

        if (!phaseType)
            return message.channel.send("<@" + gm[0] + "> needs to set the phase before you can vote!");

        if (phaseType[0] == "NIGHT")
            return message.channel.send("It's night time, go the fuck to sleep.");

        if (!args.length)
            return message.channel.send(`You gotta vote for somebody ${message.author}`);

        //Put arguments into string

        let votedUsername = message.content.replace(prefix + "vote ", ""); //remove "!vote"
        let voteOrderArray = client.votes.get("VOTE_ORDER");//array of ordered voted players 
        let majority = client.votes.get("MAJORITY"); //Majority
        let logChannelID = client.votes.get("LOG"); //Log
        let hammerReached = client.votes.get("HAMMER"); //Vote Hammer/majority
        let inputMatch = false;
        phaseType = phaseType[0];

        let unvotedPlayer = "";
        //Place vote in table
        for (const i in voteDataArray) {
            if (voteDataArray[i][0].toLowerCase().includes(votedUsername.toLowerCase())) {
                //match input to name in array
                votedUsername = voteDataArray[i][0];

                //Check to see if they've already voted for them
                if (voteDataArray[i][2].includes(message.author.username)) {
                    message.channel.send("You can't vote for " + votedUsername + " again!")
                    return;
                }

                //Check if they're placeholding and ban that shit cause no.
                if (voteDataArray[i][0] == message.author.username && voteDataArray[i][1] == 0) {
                    message.channel.send("You need to have at least one vote on you before you can vote for yourself!");
                    return;
                }

                //Add voted to Vote order
                try {
                    if (!voteOrderArray.includes(votedUsername))
                        voteOrderArray.push(votedUsername);
                }
                catch (error) {
                    voteOrderArray = new Array[votedUsername];
                }

                //Check if another player needs to be unvoted
                for (const p in voteDataArray) {
                    if (voteDataArray[p][2].includes(message.author.username)) {
                        //Define unvoted player
                        let unvotedPlayer = voteDataArray[p][0];
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

        if (!inputMatch)
            return message.channel.send(`Invalid player: ${votedUsername}.`);

        let descriptionText = "";
        let sumVotes = 0;
        let highestVote = 0;
        let zeroPlayer_i;
        for (let player in voteOrderArray) {

            //Look up Vote
            let numVotes = 0;
            for (const i in voteDataArray) {
                if (voteDataArray[i][0] == voteOrderArray[player]) {
                    numVotes = voteDataArray[i][1];
                    sumVotes += numVotes;
                    if (numVotes > highestVote) {
                        highestVote = numVotes;
                    }
                    if (numVotes == 0) {
                        zeroPlayer_i = player;
                    }
                }
            }

            if (voteOrderArray[player] == votedUsername) {
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
        
        let voteEmbed = await UtilityFunctions.GetVoteEmbed(client, message, votedUsername, sumVotes, descriptionText);

        //send to channel
        message.channel.send({ embeds: [voteEmbed] });

        //Place in log bot
        if (!logChannelID)
            message.channel.send("<@" + gm[0] + ">, you need to set the log channel!");
        else {
            let logChannel = client.channels.cache.get(logChannelID);
            if (logChannel)
                logChannel.send({ embeds: [voteEmbed] });
        }

        //Check for majority
        if (highestVote == majority) {
            if (!hammerReached) {
                message.channel.send("<@" + gm[0] + ">, " + message.author.username + " has placed the hammer on " + votedUsername + "!");
                client.channels.cache.get(logChannelID).send("🔨🔨🔨🔨🔨🔨🔨"); //Posts hammers
                hammerReached = true;

                //Lock Hammered out of chat
                try {
                    message.channel.permissionOverwrites.create(votedPlayerMember, { SEND_MESSAGES: false });
                    message.channel.send("*" + votedUsername + " has been locked out of " + message.channel.name + " and can no loger post in this channel.*");
                }
                catch (error) {
                    message.channel.send("Attempt to lock hammered player out of chat falied. Just don't talk here anymore, ok " + votedUsername + "?");
                }
            }
        }

        //set data
        client.votes.set("VOTE_DATA", voteDataArray);
        client.votes.set("VOTE_ORDER", voteOrderArray);
        client.votes.set("HAMMER", hammerReached);
    },
};

