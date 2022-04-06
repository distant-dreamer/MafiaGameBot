const fetch = require("node-fetch");
const Discord = require('discord.js');
const { ENMAP_DATABASE } = require("./Constants");

module.exports = {

    SetGamestate(client, message, gameState) {
        try {
            client.votes.set(gameState.guildID, gameState);
        } catch(error) {
            message.channel.send(`:anger: Command failed. Failed to set gamestate. \`\`\`${error}\`\`\``);
        }
    },

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    //Gets a stored URL of a player's avatar
    async GetStoredUserURL(client, message, discordID) {

        let isDM = message.channel.type == "DM";
        let avatars = client.votes.get("AVATARS");
        if (!avatars)
            avatars = [];
        let avatarInfo = avatars.find(a => a.userDiscordID == discordID);
        let user = client.users.cache.get(discordID);

        if (true)
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

    async GetVoteEmbed(client, message, votedUsername, sumVotes, descriptionText, { isVoted = true } = {}) {
        let votedPlayerMember = message.guild.members.cache.find(x => x.user.username === votedUsername);
        let color = 0xFFFFFF;
        let votedAvatar = "http://www.clker.com/cliparts/e/0/f/4/12428125621652493290X_mark_18x18_02.svg.med.png";

        votedAvatar = await this.GetStoredUserURL(client, message, votedPlayerMember.user.id);
        let voterAvatar = await this.GetStoredUserURL(client, message, message.author.id);
        color = votedPlayerMember.displayHexColor;
        votedAvatar = votedPlayerMember.user.avatarURL();
        let label = (isVoted) ?
            `${message.author.username} voted for ${votedUsername}` :
            `❌ ${message.author.username} took away their vote on ${votedUsername}`;

        return new Discord.MessageEmbed()
            .setAuthor({ name: label, iconURL: voterAvatar, url: message.url })
            .setColor(color)
            .setThumbnail(votedAvatar)
            .setTitle("-----VOTES (" + sumVotes + ")-----\n" + descriptionText);

    },

    GetPlayerList(players) {
        let aliveUsernames = players.filter(p => p.alive).map(p => p.username);
        let deadUsernames = players.filter(p => !p.alive).map(p => p.username);
        aliveUsernames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        deadUsernames.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        let majority = Math.ceil(aliveUsernames.length / 2.0) + (1 >> (aliveUsernames.length % 2));
        return `-------- **ALIVE: ${aliveUsernames.length}** --------\n${aliveUsernames.join("\n")}\n\n` +
            `-------- **DEAD: ${deadUsernames.length}** --------\n${deadUsernames.join("\n")}\n\n` + 
            `**MAJORITY: ${majority}**`;
    },

    async UpdatePlayerList(client, message, voteDataArray, deadUsernames) {
        let playerListMessageID = client.votes.get("PLAYER_LIST_MESSAGE_ID");
        let playerListChannelID = client.votes.get("PLAYER_LIST_CHANNEL_ID");

        let listChannel = message.guild.channels.cache.get(playerListChannelID);
        if (listChannel) {
            let listMessage = await listChannel.messages.fetch(playerListMessageID);
            if (listMessage) {
                let playerListString = this.GetPlayerList(voteDataArray, deadUsernames);
                listMessage.edit(playerListString);
                message.channel.send(":clipboard: Player list updated.");
            } else {
                message.channel.send("I couldn't find the player list Message!");
            }
        } else {
            message.channel.send("I couldn't find the player list channel!");
        }
    }

}