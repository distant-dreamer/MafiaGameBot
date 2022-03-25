
const Enmap = require("enmap");

module.exports = {
	name: 'fetchmsg',
	description: 'Downloads messeges of a specified channel in a txt file',
	format: '!fetchmsg <channelid>',
	guildonly: true,
	execute(client, message, args) {

		//Check that the GM is giving command.
		const gm = client.votes.get("GM");
		if (!gm.includes(message.author.id)) {
			message.channel.send("Hey there sunshine. What you want all that for?")
			return;
		}
		

		const downloadChannel = client.channels.cache.get(args[0]);
		var channelMessages = "";
		var posts;
		var lastMessage;

		//Recursive Function
		function downloadAllMessages(before=null, limit=100) {
			downloadChannel.fetchMessages({ limit: limit, before: before })
			    .then(messages => {

			    	//If no more messeges to download
			    	if (messages.size == 0) {
			    		console.log("Forming final hastebin");
			    		hastebin(channelMessages, ".txt").then(
							function(r){return message.channel.send(r)}
							).catch(console.log("Error"));
			    		return
			    	}

			    	//If there were more messeges

			    	if (channelMessages.length >= 200000)
			    	{
			    		message.channel.send("Channel has a lot of messages. Splitting into multiple hastebins.")
			    		hastebin(channelMessages, ".txt").then(
							function(r){return message.channel.send(r)}
							).catch(console.log("Error"));
			    		channelMessages = "";
			    	}



			  		posts = messages.map(m => m.content).join("*\n*");
			  		channelMessages += "*" + posts + "*";

			  		var timestamps = messages.map(m => m.createdTimestamp);
			  		var lastTimestamp = Math.min.apply(Math, timestamps);
			  		var lastMessage = messages.find(m => m.createdTimestamp == lastTimestamp)
			  
			  		console.log(channelMessages.length);

			  		//RecursesetTimeout() the function
			  		setTimeout(downloadAllMessages, 100, lastMessage.id);

			 }).catch(console.error);
		}

		message.channel.send("Downloading...");

	
		setTimeout(downloadAllMessages, 100);



		
			
	

		//message.channel.send("Log channel set to: " + logChannelName);
	}
};