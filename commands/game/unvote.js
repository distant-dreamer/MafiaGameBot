const Functions = require("../../Functions");
module.exports = {
    name: 'unvote',
    description: 'Removes your vote from player',
    format: "!unvote <player>",
    public: true,
    async execute(client, message, args, gameState) {
        Functions.PlaceVote(client, message, args, gameState, {isUnvote: true});
    },
};