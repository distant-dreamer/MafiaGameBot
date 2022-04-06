
class Gamestate {
    constructor(guildID) {
        this.players = [];
        this.gms = [];
        this.guildID = guildID;
        this.phase = undefined 
        this.phaseType = undefined;
        this.majority;
        this.hammered = false;
        this.votes = [];
        this.dms = [];
        this.playerListMessageID;
        this.voteChannelID;
        this.actionLogChannelID;
        this.logChannelID;
        this.vaultChannelID;
        this.jailIntercomChannelID;
        this.jailCellChannelID;
    }
}

class Player {
    constructor(username, discordID, avatarURL) {
        this.username = username;
        this.discordID = discordID;
        this.avatarURL = avatarURL;
        this.votedUsername = null;
        this.alive = true;
    }
}

class Vote {
    constructor(voterID, votedID) {
        this.voterID = voterID;
        this.votedID = votedID;
    }
}

class Dm {
    constructor(senderUsername, receiverUsername) {
        this.senderUsername = senderUsername;
        this.receiverUsername = receiverUsername;
    }
}

module.exports = {
    Gamestate: Gamestate,
    Player: Player,
    Vote: Vote,
    Dm: Dm
}