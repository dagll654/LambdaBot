const Discord = require('discord.js');
 const client = new Discord.Client();
  const { Client, RichEmbed } = require('discord.js');
  const lambHook = new Discord.WebhookClient(process.env.LAMBDAHOOK_ID, process.env.LAMBDAHOOK_TOKEN);
  const abn = require("./abnb.json");

 x = 0 
 x1 = 0
 dbg1 = 0
 dbvars = [0]
 dbvnames = ['debugduck']

client.on('ready', () => {
	
	// Getting the Lambda's Deltas guild for easy use
	const DELTAS = client.guilds.get("607318782624399361");
	const BCH = DELTAS.channels.get("607558082381217851");
	
	// Debug line: logs all members
	//DELTAS.members.forEach(member => console.log(member.user.username));
	
	// This is secret. Don't look!
	console.log(DELTAS.roles.get('608255705694076975').members.map(m=>m.user.tag));

	// Bot readiness announcement, both in the log and in my DMs
	console.log('I am ready!');
	client.users.get('143261987575562240').send('Bot started up succesfully.')
	
	// Setting the bot's current game to 'try !help'
    client.user.setPresence({
        game: {
            name: 'try !help',
            type: "Playing",
            url: "https://tinyurl.com/rollntroll"
        }
    });

});

client.on('error', () => {
	BCH.send("The bot has encountered an error. Check logs.")
});

client.on('disconnect', () => {
	client.users.get('143261987575562240').send("Bot disconnected.")
});

// Message event
//====================================================================
client.on('message', msg => {
	
	const ESERV = client.guilds.get('513660754633949208')
	const DELTAS = client.guilds.get('607318782624399361')
	var emojiid = DELTAS.emojis.map(e => e.id)
	var emojiname = DELTAS.emojis.map(e => e.name)
	const altemojiid = ESERV.emojis.map(e => e.id)
	const altemojiname = ESERV.emojis.map(e => e.name)

	// Command pool
	const cmds = [
			"!giverole",
			"!removerole",
			"!quote",
			"!math",
			"!help",
			"!duckclub",
			"!abn",
			"!debug",
			"!menacing"
			]
	
	// Handy vars
	var ch = msg.channel
	var mesc = msg.content
	
	if (msg.author.id === '556890472141029376' & ch.id != '607318782624399363') {
		console.log("Weird flex check [aieouieou]: content: " + mesc + " type: " + ch.type)
	}
		
	// Duck club secretiveness ensurance
	if (mesc.toLowerCase().indexOf("duckclub") != -1 && dbvars[0] === 1) {
		setTimeout(function(){msg.delete()}, 10)
	}
	
	// Roles that can be assigned/unassigned by anyone
	const roles1 = [
			
			]
	
	// Messages by the bot that will be deleted indefinitely
	const deletableReplies = [
			"Bot started up succesfully.",
			"Debug command run, check logs."
			]
	
	// The quote pool
	const qte = [
			"It's not cheating if you make the rules!", 
			"Clerk? What clerk? Oh, that one? His head just exploded accidentally. I didn't do it, why are you asking?",
			"No I will NOT lower the difficulty!",
			"No I didn't jinx myself!.. well maybe I did...",
			"Hello, this is LambdadeltaYT back with your daily portion of smallbrain plays.",
			"Ahh, fuck my life, break it into a million pieces, make an onahole out of it and fuck that as well!",
			"AAAAAAAAAAAAAAAAAAAAAARGH!!!",
			"He rubbed me the wrong way at first, but at least he rubbed me.",
			"I don't want to pull out early!",
			"Ahh, fuck me, Cloie...",
			"'Here I come'... I love when he says that.",
			"Emus are like babies.",
			"Babies are crazy!",
			"Do the crossbow in your face"
			] //ass
	const qte2 = "Lambdadelta Quote #"
	
	// Help command pool
	const help1 = [
			"Avaliable commands: !giverole, !removerole, !quote, !math, !abn. To get help on a specific command, use !help [CommandName].",
			"Usage: !giverole RoleName. Awaliable roles: none, for now.",
			"Usage: !removerole RoleName. Can only remove roles that can be removed with the !giverole command.",
			"Usage: !quote [number]. Gives a quote from the list of avaliable ones. Entering a number will give you a specific one.",
			"Usage: !math (number) +/- (number). Is only capable of addition and substraction. Can do any numbers now!",
			"Why do you need help for the help command? Anyway, usage: !help [CommandName].",
			"Usage: !duckclub [arguments]. Use !duckclub help if you are a member of the DuckHat Club.", 
			"Usage: !abn (Abnormality ID). The ID looks like this: E-01-01. Find IDs if you want to read some stylized stories. Alternatively, you can help with making a new abnormality file, or even get your own, on certain terms - post your ideas in the suggestion-box according to the rules stated in a pinned message.",
			"The debug command as of right now is only avaliable to the server's creator.",			"<a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724>"
			]	
	
	// An array containing all digits, for convenience of comparing
	const nmbrs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	
	// Function for checking if all the elements of arr are included in arr2
	function checkArray(arr, arr2) {
		return arr.every(i => arr2.includes(i));
	}
	
	// Function for checking if all the symbols of a given string are included in an array
	function checkSymbols(str, arr) {
		return str.split("").every(i => arr.includes(i))
	}
	
	// Function for checking if all the elements of arr are are the same as compoint
	function checkSame(arr, compoint) {
		return arr.every(i => arr[arr.indexOf(i)] === compoint)
	}
	
	// Function for checking if the given amount of arguments is valid
	function argCheck(arr, argcount) {
		return arr.length >= argcount
	}
	
	// Just a function that times the message out in x seconds
	function yeet(secs) {
		setTimeout(function(){msg.delete().catch(console.error)}, secs * 1000)
	}
	
	// Function for getting an emoji by name
	function emoji(nme, srv = msg.guild, a = false, id = false) {
		if (id === true) {emvar = srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)]}
		else {if (a === true) {emd = "<a:"} else {emd = "<:"}
			emvar = emd + nme + ":" + srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)] + ">"}
		return emvar
	}
	
	// Evil logger so I can see everything that goes on at the sever >:Dc
	if (ch.type != 'dm') {
	var log11 = msg.guild.name + " " + msg.createdAt + " " + ch.type + " " + msg.channel.name + " " + msg.author.username + ": " + msg.content
	console.log(log11);
	}
	// And something to notify me whenever a message is sent on any channel. I don't want to disturb people, but I do want to be notified.
	if (!msg.author.bot && msg.author.id != '143261987575562240' && ch.id != '607318782624399363' && ch.id != '609506201591480341') {
	client.users.get('143261987575562240').send("New message on " + ch.name + " by " + msg.author.username);
	}
	if ((msg.author.id === client.user.id) && (msg.embeds.length > 0)) {
		yeet(600)
	}
	
	// If it's the bot's message about starting up fine then delete it in 6 seconds
	if (msg.author.id === '607520778178527246' && deletableReplies.includes(mesc)) {
		yeet(8)
	}
	
	// If the message's author is a bot, just ignore it
	if(msg.author.bot) return;
	
	// Command check
	if (mesc.startsWith("!")) {
	
		// Make an array with values equal to the command name and arguments
		var cmd = mesc.toLowerCase().split(" ")
		
		// Check if the command even exists (if it is in the right guild)
		if (cmds.indexOf(cmd[0]) === -1 && msg.guild === DELTAS) {
			msg.reply("Unrecognized command. Type in !help to see the list of the avaliable commands.")
			
		}
		
		// Quote command
		if (cmd[0] === '!quote') 
		{
			// If the command includes an argument, the standart cycling is overridden
			if (cmd[1]) {
			if (checkSymbols(cmd[1], nmbrs)) {
				x1 = cmd[1]
				// If the argument is beyond the amount of quotes currently avaliable, apologise and stop.
				if (x1 > qte.length) {
					msg.reply("Sorry, only " + qte.length + " quotes are currently avaliable.")
					return
				} 
				var txt = qte[x1-1]
				x = x1
			}}
			else {
				x = Math.floor((Math.random() * qte.length) + 1)
				var txt = qte[x]
			}
			ch.send(qte2 + x + ": " + txt)
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
				case "hook":
					lambHook.send("test")
					console.log("Debug command !debug hook noticed.")
					break
				case "embed":
					var embed = new Discord.RichEmbed()
					.setTitle(abn.abn[0].number)
					.setThumbnail('https://images2.imgbox.com/cc/7f/DWHKASNe_o.png')
					.addField("The Dapper Duck")
					ch.send({embed})
					break
				case "emojis":
					var emarr = emojiid
					emojiname.forEach(x => {
						emarr[emojiname.indexOf(x)] = emojiname[emojiname.indexOf(x)] + " " + emarr[emojiname.indexOf(x)]
					})
					console.log(emarr)
					break
				case "emtest":
					ch.send(DELTAS.emojis.find("name", "restartsForDays"))
					break
				case "var":
					console.log("Debug command !debug var noticed.")
					if(cmd[21] === "set") {
						if (cmd[3] && cmd[4] && checkSymbols(cmd[4], nmbrs)) {
						
						}
					}
					break
					
					
				default:
					console.log("Unrecognized debug command noticed.")
					break
			} 	
		} else {msg.reply("Sorry, but only the bot author can use the debug commands.")}
		yeet(2)
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
		if (cmd.length > 1) {
		msg.reply(help1[cmds.indexOf("!" + cmd[1].toLowerCase())+1])
		} else {msg.reply(help1[0])}
	}
	
	// Math command. Adds two numbers or substracts the second one from the first one based on the input.
	if (cmd[0] === "!math")  {
		if (cmd.length < 4) {ch.send("Incorrect usage. Use !help math.")
				    return}
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
	
	if (cmd[0] === "!abn") {
		if (!argCheck(cmd, 2)) {
			msg.reply("Invalid command usage. Try !help abn.")
			return
		}
		if (abn.lista.indexOf(cmd[1]) != -1) {
			let n = abn.lista.indexOf(cmd[1])
			let embed = new Discord.RichEmbed()
				.setColor(abn.abn[n].color)
				.setTitle(abn.abn[n].name + "\n<:" + abn.abn[n].risk.toLowerCase() + ":" + emoji(abn.abn[n].risk.toLowerCase(), ESERV, false, true) + "> " + abn.abn[n].risk)
				.setThumbnail(abn.abn[n].thumbnail)
				.setDescription(abn.abn[n].description)
				.setFooter("EGO Gift: " + abn.abn[n].gift)
			ch.send({embed})
		.catch(console.error)
		} else {msg.reply("Sorry, info on the specified abnormality is unavaliable. Perhaps you should help us add it? If so, post your suggestion in the suggestion-box according to the rules stated in a pinned message.")}
		yeet(5)
	}
	
	if (cmd[0] === "!menacing") {
		men = emoji("animenacing", DELTAS, true)
		ch.send(men + men + men + men + men + men + men)
		yeet(0.01)
	}
		
		
	// Commands end here 
	}	
	
	// Reactions
	// Reacts with :thonk: to any message starting with "hm" with any number of m's after that.
	var hm1 = mesc.toLowerCase().split("")
	hm1.shift()
	if (mesc.toLowerCase().startsWith("hm") && checkSame(hm1, "m")) {
			msg.react("607330826052698114") 

	}
	if ((mesc.toLowerCase().split(" ").indexOf('uwu') > -1 ) || (mesc.toLowerCase().split(" ").indexOf('owo') > -1)) {
		if (mesc.toLowerCase().split(" ").indexOf('uwu') > mesc.toLowerCase().split(" ").indexOf('owo')) {ch.send('OwO')}
		else {ch.send('UwU')}

		
	}
})


 

// THIS  MUST  BE  THIS  WAY
// NO TOUCHING
//______________________________\\/
client.login(process.env.BOT_TOKEN)

