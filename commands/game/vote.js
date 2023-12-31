const Functions = require("../../Functions");
const { PHASE_TYPE } = require("../../Constants");
const { Vote } = require("../../Classes");

module.exports = {
    name: 'vote',
    description: 'Votes for a player',
    format: "!vote <player>",
    public: true,
    async execute(client, message, args, gameState) {
        Functions.PlaceVote(client, message, args, gameState);
    },
};

