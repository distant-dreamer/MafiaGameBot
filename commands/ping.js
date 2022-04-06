module.exports = {
	name: 'ping',
	description: 'Ping!',
	public: true,
	execute(client, message, args) {
		message.channel.send('Pong.');
	},
};