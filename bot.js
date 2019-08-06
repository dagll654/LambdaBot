const Discord = require('discord.js');
 const client = new Discord.Client();
  const { Client, RichEmbed } = require('discord.js');

 x = 0 
 x1 = 0
 dbg1 = 0

client.on('ready', () => {
	
	// Getting the Lambda's Deltas guild for easy use
	const deltas = client.guilds.get("607318782624399361");
	
	// Debug line: logs all members
	//deltas.members.forEach(member => console.log(member.user.username));
	
	// Gonna use this later
	deltas.roles.get('608255705694076975').members.map(m=>m.user.tag);

	// Bot readiness announcement, both in the log and on the specified channel
	console.log('I am ready!');
	deltas.channels.get("607558082381217851").send('Bot started up succesfully.')
	
	// Setting the bot's current game
    client.user.setPresence({
        game: {
            name: 'you like a fiddle',
            type: "Playing",
            url: "https://discordapp.com/"
        }
    });

});

 

client.on('message', msg => {
	
	// Debug var
	var mesg = msg.content.toLowerCase	
	
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
	var nmbrs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	
	// Evil logger so I can see everything that goes on at the sever >:D
	var log11 = msg.guild.name + " " + msg.createdAt + " " + msg.channel.name + " " + msg.author.username + ": " + msg.content
	console.log(log11);
	
	// If the message's author is a bot, just ignore it
	if(msg.author.bot) return;
	
	// Command check
	if (msg.content.startsWith("!")) {
	
		
		// Make an array with values equal to the command name and arguments
		var cmd = msg.content.split(" ")
		
		// Debug thingy, responds with stuff
		if (dbg1 === 1) {
			var dbg1a = " "
			cmd.forEach(function(element) {
			var dbg1a = dbg1a + element + ", "
			})
			msg.channel.send(dbg1a)
		}
		
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
			msg.channel.send(qte2 + txt)
		}  
		
		// Debug commands
		if (cmd[0] === '!debug') {
			if (msg.author.id === process.env.BOT_AUTHOR) {
			switch (cmd[1]) {
				case "ids":
					console.log(msg.guild.id + " " + msg.channel.id) 
					console.log("Debug command !debug ids noticed.")
					break
				case "return":
					if (cmd[2] === 1 || cmd[2] === 0) {
						dbg1 = cmd[2]
						console.log("dbg1 set to " + dbg1)
					} else {console.log("dbg1 change failed.")}
					console.log("Debug command !debug return noticed.")
					break
			}
			
		} else {msg.reply("Sorry, but only the bot author can use the debug commands.")}
		}	
	if (msg.content.slice(0, 8) === '!newtest') {
	 var temp1 = msg.content.split(" ")
	 msg.member.addRole(temp1[1].id)
	 }
  var par = msg.content.indexOf("!")
  if (par === 0) {
	if (msg.content.slice(1, 9) === "giverole") {
		if (msg.content.slice(10) === '607596327165231114') {
  	msg.member.addRole(msg.content.slice(10))
  	msg.channel.send("Given the role <@&" + msg.content.slice(10) + "> to " + msg.author)
	} else {msg.channel.send("The command cannot be performed because it has been typed in incorrectly or the specified role cannot be given.")}}
	if (msg.content.slice(1, 11) === "removerole") {
		if (msg.content.slice(12) === '607596327165231114') {
  	msg.member.removeRole(msg.content.slice(12))
	msg.channel.send("Removed the role <@&" + msg.content.slice(12) + "> from " + msg.author)
	} else {msg.channel.send("The command cannot be performed because it has been typed in incorrectly or the specified role cannot be removed.")}}
	if (msg.content.slice(1, 5) === "help") {
		var tst1 = msg.content.slice(6)
		switch (tst1) {
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
				msg.reply("Makes the bot do basic math. Works only for addition and substraction of single digit numbers.")
				break
			case "help":
				msg.reply("Why do you need help with the help command? Anyway, usage: !help CommandName.")
				break
			default:
				msg.reply("Avaliable commands: !giverole, !removerole, !quote, !math. Use !help CommandName to get more details.")
				break
		}
	}
	if (msg.content.slice(1, 5) === "math")  {
		var a = msg.content.charAt(6)
		var b = msg.content.charAt(10)
		if (nmbrs.includes(a) && nmbrs.includes(b)) {
			switch (msg.content.charAt(8)) {
			case "+":
			var c = Number(a) + Number(b)
			msg.channel.send(a + " " + msg.content.charAt(8) + " " + b + " = " + c)
			break
			case "-":
			var c = Number(a) - Number(b)
			msg.channel.send(a + " " + msg.content.charAt(8) + " " + b + " = " + c)
			break
			default:
			msg.reply("I can't do that!")
			break
			}
		}
		else { 
			msg.reply("I can't do that!") 
			var d = "0"
		     }
	}
	}	
	
	// Commands end here 
	}	
	
	if (msg.content === "hmm") {
			msg.react("607330826052698114") 
	}
})


 

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
