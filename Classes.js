
class Gamestate {
    constructor(guildID) {
        this.players = [];
        this.guildID = guildID;
        this.phase = undefined 
        this.phaseType = undefined;
        this.majority;
        this.hammered = false;
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


module.exports = {
    Gamestate: Gamestate,
    Player: Player
}