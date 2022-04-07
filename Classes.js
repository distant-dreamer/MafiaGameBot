
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
        this.actions = [];
        this.playerListMessageURL;
        this.playerListMessageID;
        this.playerListChannelID;
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

class Action {
    constructor(senderUsername, text) {
        this.senderUsername = senderUsername;
        this.text = text;
    }
}

module.exports = {
    Gamestate: Gamestate,
    Player: Player,
    Vote: Vote,
    Dm: Dm,
    Action: Action
}