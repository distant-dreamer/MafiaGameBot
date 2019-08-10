module.exports = {
	name: 'monokuma',
	description: 'Adds not to every message',
	guildonly: true,
	execute(message) {
		if (message.content.includes("monokuma")) {
			message.channel.send("That bear is the best!");
		}
	},
};