const Enmap = require("enmap");
const Discord = require('discord.js');
const UtilityFunctions = require("../UtilityFunctions");

module.exports = {
    name: 'unvote',
    description: 'Removes vote from player',
    format: "!unvote <player>",
    guildonly: true,
    async execute(client, message, args) {
         
        var phaseType = client.votes.get("PHASE"); //[phaseType, phaseNum]
        var voteDataArray = client.votes.get("VOTE_DATA"); //array of: [player, votes, voted]
        var voteOrderArray = client.votes.get("VOTE_ORDER");//array of ordered voted players
        const logChannelID = client.votes.get("LOG"); //Log channel
        const gm = client.votes.get("GM"); //game master id

        if (gm == undefined) {
            //CHANGE THIS IF THERE'S A DIFFERENT GM
            message.channel.send("<@233786007093248000>, help! I need to be reset!"); //Pings Ahmayk. 
            return;
        }

        const voteChannelID = client.votes.get("VOTE_CHANNEL");
        if (voteChannelID == undefined) {
            message.channel.send("<@" + gm + "> needs to set the voting channel!");
            return;
        }

        if (message.channel.id != voteChannelID) {
            message.channel.send("This aint the designated voting channel.");
            return;
        }

        if (phaseType == undefined) {
            message.channel.send("<@" + gm + "> needs to set the phase before you can vote!");
            return;
        }

        if (voteDataArray == undefined) {
            message.channel.send("<@" + gm + "> needs to get their shit together and setup the game.");
            return;
        }

        if (phaseType[0] == "NIGHT") {
            message.channel.send("It's night time. Stop trying to vote and go to bed.");
            return;
        }

        //var votedPlayer = "";
        var unvotedPlayer = "";
        phaseType = phaseType[0];

        //Remove vote & voter
        for (const i in voteDataArray) {
            if (voteDataArray[i][2].includes(message.author.username)) {
                unvotedPlayer = voteDataArray[i][0];
                //Undo player as voter
                voteDataArray[i][2].splice(voteDataArray[i][2].indexOf(message.author.username), 1);
                //Take away vote
                voteDataArray[i][1] -= 1;
                break;
            }
        }

        if (unvotedPlayer == "") {
            message.channel.send("You haven't voted yet.")
            return;
        }

        var descriptionText = "";
        var sumVotes = 0;
        var highestVote = 0;
        var zeroPlayer_i;

        for (const player in voteOrderArray) {

            //Look up Vote
            for (const i in voteDataArray) {
                if (voteDataArray[i][0] == voteOrderArray[player]) {
                    var numVotes = voteDataArray[i][1];
                    sumVotes += numVotes;
                }
                if (numVotes == 0) {
                    zeroPlayer_i = player;
                }
            }

            if (voteOrderArray[player] == unvotedPlayer) {
                descriptionText += "__*" + voteOrderArray[player] + ":  " + numVotes + "*__\n";
                if (numVotes == 0) {
                    zeroPlayer_i = player;
                }
            }
            else {
                descriptionText += voteOrderArray[player] + ":  " + numVotes + "\n";
            }
        }

        //Remove unvoted if 0
        if (zeroPlayer_i) {
            voteOrderArray.splice(zeroPlayer_i, 1);
        }

        //Output in an embed
        const votedPlayerMember = message.guild.members.cache.find(x => x.user.username === unvotedPlayer)
        var color = 0xFFFFFF;
        var votedAvatar = "http://www.clker.com/cliparts/e/0/f/4/12428125621652493290X_mark_18x18_02.svg.med.png";

        votedAvatar = await UtilityFunctions.GetStoredUserURL(client, message, votedPlayerMember.user.id);
        let voterAvatar = await UtilityFunctions.GetStoredUserURL(client, message, message.author.id);
        color = votedPlayerMember.displayHexColor;
        votedAvatar = votedPlayerMember.user.avatarURL();

        const voteEmbed = new Discord.MessageEmbed()
            .setAuthor({ name: "❌ " + message.author.username + " took away their vote on " + unvotedPlayer, iconURL: voterAvatar })
            .setColor(color)
            .setThumbnail(votedAvatar)
            .setTitle("-----VOTES (" + sumVotes + ")-----\n" + descriptionText);

        //send to channel
        message.channel.send({ embeds: [voteEmbed] });
        //Place in log bot
        if (logChannelID) {
            client.channels.cache.get(logChannelID).send({ embeds: [voteEmbed] });
        }
        else {
            message.channel.send("<@" + gm + ">, you need to set the log channel!");
        }

        //set data
        client.votes.set("VOTE_DATA", voteDataArray);
        client.votes.set("VOTE_ORDER", voteOrderArray);
    },
};