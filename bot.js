const Discord = require('discord.js');
 const client = new Discord.Client();
  const { Client, RichEmbed } = require('discord.js');

 x = 0 
 x1 = 0
 dbg1 = 0

client.on('ready', () => {
	
	// Getting the Lambda's Deltas guild for easy use
	const deltas = client.guilds.get("607318782624399361");
	const bch = deltas.channels.get("607558082381217851");
	// Debug line: logs all members
	//deltas.members.forEach(member => console.log(member.user.username));
	
	// Gonna use this later
	// console.log(deltas.roles.get('607596327165231114').members.map(m=>m.user.tag));
	console.log(deltas.roles.get('607596327165231114').members)
	
	// Bot readiness announcement, both in the log and on the specified channel
	console.log('I am ready!');
	bch.send('Bot started up succesfully.')
	
	// Setting the bot's current game
    client.user.setPresence({
        game: {
            name: 'you like a fiddle',
            type: "Playing",
            url: "https://discordapp.com/"
        }
    });

});

client.on('error', () => {
	bch.send("The bot has encountered an error. Check logs.")
});

 

client.on('message', msg => {
	
	// Handy vars
	var ch = msg.channel
	var mesc = msg.content
	
	// Roles that can be assigned/unassigned by anyone
	const roles1 = [
			"test",
			"Bot Tinkerer"
			]
	
	// The quote pool
	const qte = [
			"It's not cheating if you make the rules!", 
			"Clerk? What clerk? Oh, that one? His head just exploded accidentally. I didn't do it, why are you asking?",
			"No I will NOT lower the difficulty!",
			"No I didn't jinx myself!.. well maybe I did...",
			"Hello, this is LambdadeltaYT back with your daily portion of smallbrain plays."
			]
	const qte2 = "Lambdadelta Quote of the day: "
	
	
	// An array containing all digits, for convenience of comparing
	const nmbrs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	
	// Function for checking if all the elements of arr are included in arr2
	function checkArray(arr, arr2){
		return arr.every(i => arr2.includes(i));
	}
	
	// Function for checking if all the elements of arr are are the same as compoint
	function checkSymbol(arr, compoint){
		return arr.every(i => i === compoint);
	}
	
	// Evil logger so I can see everything that goes on at the sever >:D
	var log11 = msg.guild.name + " " + msg.createdAt + " " + msg.channel.name + " " + msg.author.username + ": " + msg.content
	console.log(log11);
	
	// If it's the bot's message about starting up fine then delete it in 6 seconds
	if (msg.author.id === '607520778178527246' && mesc === 'Bot started up succesfully.') {
		setTimeout(function(){msg.delete()}, 6000)
	}
	
	// If the message's author is a bot, just ignore it
	if(msg.author.bot) return;
	
	// Command check
	if (mesc.startsWith("!")) {
	
		
		// Make an array with values equal to the command name and arguments
		var cmd = mesc.toLowerCase().split(" ")
		

		
		// Quote command
		if (cmd[0] === '!quote') 
		{
			// If the command includes an argument, the standart cycling is overridden
			if (cmd.length > 1 && nmbrs.includes(cmd[1])) {
				x1 = cmd[1]
				// If the argument is beyond the amount of quotes currently avaliable, apologise and stop.
				if (x1 > qte.length) {
					msg.reply("Sorry, only " + qte.length + " quotes are currently avaliable.")
					return
				} 
				var txt = qte[x1-1]
				x1 = 0
			}
			else {
				var txt = qte[x]
				x = x + 1
			}
			ch.send(qte2 + txt)
		}  
		
		// Debug commands
		if (cmd[0] === '!debug') {
			if (msg.author.id === process.env.BOT_AUTHOR) {
			ch.send("Debug command run, check logs.")
			switch (cmd[1]) {
				case "ids":
					console.log(msg.guild.id + " " + msg.channel.id) 
					console.log("Debug command !debug ids noticed.")
					break
				//case "return":
				//	if (cmd[2] > -1 && cmd[2] < 2) {
				//		dbg1 = cmd[2]
				//		console.log("dbg1 set to " + dbg1)
				//	} else {console.log("dbg1 change failed. cmd[2] value:" + cmd[2])}
				//	console.log("Debug command !debug return noticed.")
				//	break
			}	
		} else {msg.reply("Sorry, but only the bot author can use the debug commands.")}
		}
	
	// Role giving and taking
	if (cmd[0] === "!giverole") {
		// If the role is stated to be operable in the relevant array
		if (roles1.includes(cmd[1])) {
			// Find the role among the guild's roles and add it via its ID
			msg.member.addRole(msg.guild.roles.find('name', cmd[1]).id)
			msg.reply("Given the role " + cmd[1] + " to " + msg.author.tag)
		} else {msg.reply("Error: role was specified incorrectly or cannot be given.")}
	}
	
	if (cmd[0] === "!removerole") {
		// If the role is stated to be operable in the relevant array
		if (roles1.includes(cmd[1])) {
			// Find the role among the guild's roles and remove it via its ID
			msg.member.removeRole(msg.guild.roles.find('name', cmd[1]).id)
			msg.reply("Taken the role  " + cmd[1] + " from " + msg.author.tag)
		} else {msg.reply("Error: role was specified incorrectly or cannot be removed.")}
	}

	
	
	if (cmd[0] === "!help") {
		switch (cmd[1]) {
			case "giverole":
				msg.reply("Usage: !giverole RoleId. You can get the role's ID by putting \ before @Role. Awaliable roles: Bot Tinkerer.")
				break
			case "removerole":
				msg.reply("Usage: !removerole RoleId. Works just like giverole and for the same roles.")
				break
			case "quote":
				msg.reply("Gives a quote of Lambdadalta. Quote accuracy not guaranteed.")
				break
			case "math":
				msg.reply("Makes the bot do basic math. Now works for any numbers! Still doesn't support anything but addition and substaction though.")
				break
			case "help":
				msg.reply("Why do you need help with the help command? Anyway, usage: !help CommandName.")
				break
			default:
				msg.reply("Avaliable commands: !giverole, !removerole, !quote, !math. Use !help CommandName to get more details.")
				break
		}
	}
	
	// Math command. Adds two numbers or substracts first one from the second one based on the input.
	if (cmd[0] === "!math")  {
		if (checkArray(cmd[1].split(""), nmbrs) && checkArray(cmd[3].split(""), nmbrs)) {
			switch (cmd[2]) {
			case "+":
			var c = Number(cmd[1]) + Number(cmd[3])
			msg.channel.send(cmd[1] + " " + cmd[2] + " " + cmd[3] + " = " + c)
			break
			case "-":
			var c = Number(cmd[1]) - Number(cmd[3])
			msg.channel.send(cmd[1] + " " + cmd[2] + " " + cmd[3] + " = " + c)
			break
			default:
			msg.reply("I can't do that!")
			break
			}
		} else {msg.reply("I can't do that!")}
	}
	
	
	// Commands end here 
	}	
	
	// Reactions
	// Reacts with :thonk: to any message starting with "hm" with any number of m's or h's after that.
	if (mesc.toLowerCase().startsWith("hm") && checkArray(mesc.toLowerCase().split(""), ["m", "h"])) {
			msg.react("607330826052698114") 
	}
})


 

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
