

class Gamestate {
    constructor(guildID) {
        this.players = [];
        this.guildID = guildID;
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