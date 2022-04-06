const fetch = require("node-fetch");
const Discord = require('discord.js');
const { PHASE_TYPE } = require("./Constants");
const { Vote } = require("./Classes");

module.exports = {

    SetGameState(client, message, gameState) {
        try {
            client.votes.set(gameState.guildID, gameState);
        } catch (error) {
            message.channel.send(`:anger: Command failed. Failed to set gamestate. \`\`\`${error}\`\`\``);
        }
    },

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    GetPlayerFromInput(message, inputUsername, players) {
        if (!inputUsername) {
            message.channel.send("Please enter a player");
            return null;
        }
        inputUsername = inputUsername.toLowerCase();
        let player = players.find(p => p.username.toLowerCase().includes(inputUsername));
        if (!player) {
            message.channel.send(`Invalid player: ${inputUsername}`);
            return null;
        }
        return player;
    },

    GetMemberInGuildFromInput(message, guild, inputUsername) {
        if (!inputUsername) {
            message.channel.send("Please enter a user");
            return null;
        }
        let member = guild.members.cache.find(m => m.user.username.toLowerCase().includes(inputUsername));
        if (!member) {
            message.channel.send(`No player found mathching input: **${inputUsername}**`);
            return null;
        }
        return member;
    },

    ConvertDiscordIDToUsername(message, players, inputDiscordID) {
        let player = players.find(p => p.discordID == inputDiscordID);
        if (player) return player.username;
        if (message.guild && message.guild.members) {
            let member = message.guild.members.cache.find(m => m.id == inputDiscordID);
            if (member) return member.user.username;
        }
        return "`[Unknown player]`";
    },

    async Pin(message) {
        if (!message || message.guild.id == 859208746127589396) return;
        try {
            message.pin();
        } catch (error) {
            message.channel.send(`Failed to pin. \`\`\`${error}\`\`\``);
        }
    },

    //Gets a stored URL of a player's avatar
    async GetStoredUserURL(client, message, discordID) {

        let isDM = message.channel.type == "DM";
        let avatars = client.votes.get("AVATARS");
        if (!avatars)
            avatars = [];
        let avatarInfo = avatars.find(a => a.userDiscordID == discordID);
        let user = client.users.cache.get(discordID);
        if (!user)
            return message.author.defaultAvatarURL;

        if (isDM) {
            //Don't check for an updated avatar if we're in DM.
            //The stored avatar might be a guild avatar, which won't match
            if (avatarInfo) return avatarInfo.reuploadedAvatarURL;

            //If nothing is stored, then store the global avatar
            return await this.UpdateStoredAvatarURL(client, message, user, user.username, avatars);
        }

        let guildUser = message.guild.members.cache.get(discordID);

        if (!avatarInfo) {
            if (guildUser && guildUser.avatar)
                return await this.UpdateStoredAvatarURL(client, message, guildUser, user.username, avatars);
            else
                return await this.UpdateStoredAvatarURL(client, message, user, user.username, avatars);
        }

        if (guildUser && guildUser.avatar && avatarInfo.avatarID != guildUser.avatar)
            return await this.UpdateStoredAvatarURL(client, message, guildUser, user.username, avatars);
        else if (guildUser && !guildUser.avatar && avatarInfo.avatarID != user.avatar)
            return await this.UpdateStoredAvatarURL(client, message, user, user.username, avatars);
        else
            return avatarInfo.reuploadedAvatarURL;
    },

    //Reuploads an image of a player's avatar as a message so that discord is forced to keep it :)
    async UpdateStoredAvatarURL(client, message, user, username, avatars) {

        const discordAvatarURL = await user.displayAvatarURL({ format: `webp`, size: 512 });
        const response = await fetch(discordAvatarURL);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const attachment = new Discord.MessageAttachment(buffer);
        const avatarMessage = await message.channel.send({ content: `:desktop: NEW AVATAR FOR: ${username}`, files: [attachment] });
        const newURL = [...avatarMessage.attachments.values()][0].proxyURL;

        avatars.push({
            userDiscordID: user.id,
            avatarID: user.avatar,
            reuploadedAvatarURL: newURL
        });
        client.votes.set("AVATARS", avatars);

        return newURL;
    },

    async GetVoteEmbed(client, message, gameState, votedPlayer, descriptionText, { isVoted = true, isLogChannel = false } = {}) {
        let votedPlayerMember = message.guild.members.cache.find(m => m.id === votedPlayer.discordID);
        let color = 0xFFFFFF;
        let votedAvatar = "http://www.clker.com/cliparts/e/0/f/4/12428125621652493290X_mark_18x18_02.svg.med.png";

        votedAvatar = await this.GetStoredUserURL(client, message, votedPlayerMember.user.id);
        let voterAvatar = await this.GetStoredUserURL(client, message, message.author.id);
        color = votedPlayerMember.displayHexColor;
        votedAvatar = votedPlayerMember.user.avatarURL();
        let label = (isVoted) ?
            `${message.author.username} voted for ${votedPlayer.username}` :
            `❌ ${message.author.username} took away their vote on ${votedPlayer.username}`;

        let url = (isLogChannel) ? message.url : gameState.playerListMessageURL;

        return new Discord.MessageEmbed()
            .setAuthor({ name: label, iconURL: voterAvatar, url: url })
            .setColor(color)
            .setThumbnail(votedAvatar)
            .setTitle("-----VOTES (" + gameState.votes.length + ")-----\n" + descriptionText)
    },

    GetPlayerList(gameState) {
        let aliveUsernames = gameState.players.filter(p => p.alive).map(p => p.username);
        let deadUsernames = gameState.players.filter(p => !p.alive).map(p => p.username);
        aliveUsernames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        deadUsernames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        let majority = gameState.majority;
        return `-------- **ALIVE: ${aliveUsernames.length}** --------\n${aliveUsernames.join("\n")}\n\n` +
            `-------- **DEAD: ${deadUsernames.length}** --------\n${deadUsernames.join("\n")}\n\n` +
            `**MAJORITY: ${majority}**`;
    },

    GetDms(gameState) {
        return `------DMs ${gameState.phaseType} ${gameState.phase}------\n` +
            `${gameState.dms.map(d => `${d.senderUsername} --> ${d.receiverUsername}`).join("\n")}`;
    },

    GetVotes(message, gameState) {
        let voteDataString = `-----VOTE DATA ${gameState.phaseType} ${gameState.phase}-----\n`;
        for (let vote of gameState.votes) {
            let voterUsername = this.ConvertDiscordIDToUsername(message, gameState.players, vote.voterID);
            let votedUsername = this.ConvertDiscordIDToUsername(message, gameState.players, vote.votedID);
            if (vote.votedID == -1)
                voteDataString += `**${voterUsername}** voted --> NO LYNCH\n`;
            if (voterUsername && votedUsername)
                voteDataString += `**${voterUsername}** voted for --> **${votedUsername}**\n`;
        }

        voteDataString += "-----IDLE-----\n";
        for (let player of gameState.players) {
            if (player.alive && !gameState.votes.some(v => v.voterID == player.discordID))
                voteDataString += `**${player.username}**\n`;
        }

        return voteDataString;
    },

    CalculateMajority(players) {
        let alive = players.filter(p => p.alive);
        return Math.ceil(alive.length / 2.0) + (1 >> (alive.length % 2));
    },

    async UpdatePlayerList(message, gameState) {
        message.channel.sendTyping();
        let listChannel = message.guild.channels.cache.get(gameState.playerListChannelID);
        let playerListString = "";
        if (listChannel) {
            let listMessage = await listChannel.messages.fetch(gameState.playerListMessageID);
            if (listMessage) {
                playerListString = this.GetPlayerList(gameState);
                listMessage.edit(playerListString);
                message.channel.send(`:clipboard: Player list in ${listChannel.toString()} updated.`);
            } else {
                message.channel.send("I couldn't find the player list Message!");
            }
        } else {
            message.channel.send("I couldn't find the player list channel!");
        }
        return playerListString;
    },

    SetGameChannel(client, message, args, gameState, commandName) {
        let channelID = (args.length) ? args.shift() : message.channel.id;
        let channel = client.channels.cache.get(channelID);
        if (!channel)
            return message.channel.send(`Unknown channel with ID: ${channelID}`);

        let notificationMessage;
        let returnMessage;
        switch (commandName) {
            case "votechannel":
                gameState.voteChannelID = channelID;
                notificationMessage = "Voting happens here!";
                returnMessage = `Voting channel set to: ${channel.toString()}`;
                break;
            case "actionlog":
                gameState.actionLogChannelID = channelID;
                notificationMessage = "What will they do? Where will they go? Find out here!";
                returnMessage = `Action Log set to: ${channel.toString()}`;
                break;
            case "log":
                gameState.logChannelID = channelID;
                notificationMessage = "This log channel is so designated.";
                returnMessage = `Log Channel set to: ${channel.toString()}`;
                break;
            case "vault":
                gameState.vaultChannelID = channelID;
                notificationMessage = "The vault is locked and ready for secrets.";
                returnMessage = `Vault set to: ${channel.toString()}`;
                break;
            case "jailcell":
                gameState.jailCellChannelID = channelID;
                notificationMessage = "This is the jail cell. The jailor can hear you...";
                returnMessage = `Jail Cell set to: ${channel.toString()}`;
                break;
            case "jailintercom":
                gameState.jailIntercomChannelID = channelID;
                notificationMessage = "This is the jail intercom. You can talk to whomever is in the jail cell here.";
                returnMessage = `Jail Intercom set to: ${channel.toString()}`;
                break;
            default:
                return message.channel.send(`Internal Error: Unimplemented commandName: ${commandName}`);
        }
        try {
            channel.send(notificationMessage);
        }
        catch (error) {
            return message.channel.send("The bot doesn't have access to post in that channel!");
        }

        this.SetGameState(client, message, gameState);
        message.channel.send(returnMessage);
    },

    GetVoteListString(gameState, newVote, isUnvote) {
        let previousVote = gameState.votes.find(v => v.voterID == newVote.voterID);
        let listedIDs = [];
        let voteListString = "";
        for (let vote of gameState.votes) {
            if (!listedIDs.includes(vote.votedID)) {
                voteListString += this.GetVoteTalleyOfPlayer(gameState, vote.votedID, newVote, previousVote, isUnvote);
                listedIDs.push(vote.votedID);
            }
        }
        if (!gameState.votes.some(v => v.votedID == newVote.votedID))
            voteListString += this.GetVoteTalleyOfPlayer(gameState, newVote.votedID, newVote, previousVote, isUnvote);
        return voteListString;
    },

    GetVoteTalleyOfPlayer(gameState, votedIDToTally, newVote, previousVote, isUnvote) {
        let votedPlayer = gameState.players.find(p => p.discordID == votedIDToTally);
        if (!votedPlayer) return "";

        let sum = gameState.votes.filter(v => v.votedID == votedIDToTally).length;
        let accentTag = "";
        let underscore = "";
        let isNewVote = votedIDToTally == newVote.votedID;
        let isOldVote = previousVote && votedIDToTally == previousVote.votedID;
        if (!isUnvote && isNewVote) {
            sum += 1;
            accentTag = "**";
        }
        if ((!isUnvote && isOldVote) || (isUnvote && isNewVote)) {
            sum -= 1;
            accentTag = "*";
        }
        if (isNewVote)
            underscore = "__";
        return `${accentTag}${underscore}${votedPlayer.username}${underscore}: ${sum}${accentTag}\n`;
    },

    async PlaceVote(client, message, args, gameState, { isUnvote = false } = {}) {
        if (!gameState.players.length)
            return message.channel.send("The GM needs to get their shit together and setup the game.");

        if (!gameState.voteChannelID)
            return message.channel.send("The GM needs to set the voting channel!");

        if (message.channel.id != gameState.voteChannelID)
            return message.channel.send("This ain't the designated voting channel.");

        if (!gameState.phaseType)
            return message.channel.send("The GM needs to set the phase before you can vote!");

        if (gameState.phaseType == PHASE_TYPE.NIGHT)
            return message.channel.send("It's night time, go the fuck to sleep.");

        let vote;
        let votedPlayer;
        if (isUnvote) {
            vote = gameState.votes.find(v => v.voterID == message.author.id);
            if (!vote)
                return message.channel.send(`You haven't voted yet.`);
            votedPlayer = gameState.players.find(p => p.discordID == vote.votedID);
            if (!votedPlayer) {
                gameState.votes = gameState.votes.filter(v => v.voterID != message.author.id);
                Functions.SetGameState(client, message, gameState);
                return message.channel.send(`...uh, I couldn't find whoever you voted for? Whatever, I'm removed your vote.`);
            }
        } else {
            if (!args.length)
                return message.channel.send(`You gotta vote for somebody ${message.author}`);

            votedPlayer = this.GetPlayerFromInput(message, args.shift(), gameState.players);
            if (!votedPlayer) return;

            if (!votedPlayer.alive)
                return message.channel.send(`**${votedPlayer.username}** is already dead.`);

            let previousVote = gameState.votes.find(v => v.voterID == message.author.id);
            if (previousVote && previousVote.votedID == votedPlayer.discordID) {
                let player = gameState.players.find(p => p.discordID == previousVote.votedID);
                return message.channel.send(`You can't vote for **${player.username}** again!`);
            }

            if (votedPlayer.discordID == message.author.id && !gameState.votes.some(v => v.votedID == message.author.id))
                return message.channel.send("You need to have at least one vote on you before you can vote for yourself!");

            vote = new Vote(message.author.id, votedPlayer.discordID);
        }

        let voteListString = this.GetVoteListString(gameState, vote, isUnvote);

        gameState.votes = gameState.votes.filter(v => v.voterID != message.author.id);
        if (!isUnvote)
            gameState.votes.push(vote);

        let voteEmbedVoteChannel = await this.GetVoteEmbed(client, message, gameState, votedPlayer, voteListString,
            { isUnvote: isUnvote });
        let voteEmbedLogChannel = await this.GetVoteEmbed(client, message, gameState, votedPlayer, voteListString,
            { isUnvote: isUnvote, isLogChannel: true });

        let logChannel = client.channels.cache.get(gameState.logChannelID);
        if (logChannel)
            logChannel.send({ embeds: [voteEmbedLogChannel] });

        message.channel.send({ embeds: [voteEmbedVoteChannel] });

        if (!isUnvote) {
            let voteCountForVoted = gameState.votes.filter(v => v.votedID == vote.votedID).length;
            if (voteCountForVoted == gameState.majority && !gameState.hammered) {
                gameState.hammered = true;
                let returnMessage = `:hammer: **${message.author.username} has placed the hammer on ${votedPlayer.username}!**`;
                if (logChannel)
                    logChannel.send("🔨🔨🔨🔨🔨🔨🔨");
                try {
                    await message.channel.permissionOverwrites.create(vote.votedID, { SEND_MESSAGES: false });
                    let gmsPing = gameState.gms.map(g => `<@${g}>`).join("");
                    returnMessage += `\n${gmsPing} *${votedPlayer.username} has been locked out of ${message.channel.name} and can no loger post in this channel.*`;
                }
                catch (error) {
                    returnMessage += `\nAttempt to lock hammered player out of chat falied. Just don't talk here anymore, ok ${votedPlayer.username}?`;
                    console.log(error);
                }
                message.channel.send(returnMessage);
            }
        }
        this.SetGameState(client, message, gameState);
    }

}