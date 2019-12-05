const Discord = require('discord.js');
 const client = new Discord.Client();
  const { Client, RichEmbed } = require('discord.js');
  const lambHook = new Discord.WebhookClient(process.env.LAMBDAHOOK_ID, process.env.LAMBDAHOOK_TOKEN);
  const abn = require("./abnb.json");
  const animojis = [
			"restartsForDays",
			"pepanger",
			"animenacing",
			"Hod"
			]

 x = 0 
 x1 = 0
 dbg1 = 0
 dbvars = [0, 1]
 dbvnames = ['debugduck', 'debugsay']
 quotelog = []

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
			"!say",
			"!debug",
			"!menacing",
			"!em",
			"!department",
			"!dep"
			]
	
	// Handy vars
	var ch = msg.channel
	var mesc = msg.content
		
	// Duck club secretiveness ensurance
	if (mesc.toLowerCase().indexOf("duckclub") != -1 && dbvars[0] === 1) {
		setTimeout(function(){msg.delete()}, 10)
	}
	
	// Roles that can be assigned/unassigned by anyone
	const roles1 = [
			]
	
	// Department roles
	const deproles = [
			"Control Team",
			"Information Team",
			"Security Team",
			"Training Team",
			"Central Team",
			"Welfare Team",
			"Disciplinary Team",
			"Record Team",
			"Extraction Team",
			"Architecture Team",
			"Control Team (C)",
			"Information Team (C)",
			"Security Team (C)",
			"Training Team (C)",
			"Central Team (C)",
			"Welfare Team (C)",
			"Disciplinary Team (C)",
			"Record Team (C)",
			"Extraction Team (C)",
			"Architecture Team (C)"
			]
	const ncdeproles = [
			"Control Team",
			"Information Team",
			"Security Team",
			"Training Team",
			"Central Team",
			"Welfare Team",
			"Disciplinary Team",
			"Record Team",
			"Extraction Team",
			"Architecture Team"
			]
	const cdeproles = [
			"Control Team (C)",
			"Information Team (C)",
			"Security Team (C)",
			"Training Team (C)",
			"Central Team (C)",
			"Welfare Team (C)",
			"Disciplinary Team (C)",
			"Record Team (C)",
			"Extraction Team (C)",
			"Architecture Team (C)"
			]
	deproles.forEach(r => roles1.push(r))
	
	// Messages by the bot that will be deleted indefinitely
	const deletableReplies = [
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
			"Do the crossbow in your face",
			"Please, just the tip, come on...",
			"No! NOT FROM BEHIND!!",
			"Now I destroyed my dick!"
			]
	const qte2 = "Lambdadelta Quote #"
	
	// Help command pool
	const help1 = [
			"Avaliable commands: !giverole, !removerole, !quote, !math, !abn, !say, !em. To get help on a specific command, use !help [CommandName].",
			"Usage: !giverole RoleName. Awaliable roles: (almost?) all of the department roles, for vanity choices.",
			"Usage: !removerole RoleName. Can only remove roles that can be removed with the !giverole command.",
			"Usage: !quote [number]. Gives a quote from the list of avaliable ones. Entering a number will give you a specific one.",
			"Usage: !math (number) +/- (number). Is only capable of addition and substraction. Can do any numbers now!",
			"Why do you need help for the help command? Anyway, usage: !help [CommandName].",
			"Usage: !duckclub [arguments]. Use !duckclub help if you are a member of the DuckHat Club.", 
			"Usage: !abn (Abnormality ID). The ID looks like this: O-01-01. Find IDs if you want to read some stylized stories. Alternatively, you can help with making a new abnormality file, or even get your own, on certain terms - post your ideas in the suggestion-box according to the rules stated in a pinned message.",
			"Usage: !say (anything). Makes the bot say anything. Use at your own risk.",
			"The debug command as of right now is only avaliable to the server's creator.",			"<a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724><a:animenacing:612020398250524724>",
			"Usage: !em (emoji's name) [amount of emojis] Sends an emoji, or several, but not more than 27. Case-sensitive!",
			"Usage: !department/!dep (arguments). Arguments: wip",
			"Usage: !department/!dep (arguments). Arguments: wip"
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
	
	// Function for checking if all the symbols of a given string are the same as compoint
	function checkStringSame(str, compoint) {
		return str.split("").every(i => i === compoint)
	}
	
	// Function for checking if all the elements of arr are are the same as compoint
	function checkSame(arr, compoint) {
		if (arr.length === 0) {return false} else {return arr.every(i => i === compoint)}
	}
	
	// Function for checking if the given amount of arguments is valid
	function argCheck(arr, argcount) {
		return arr.length >= argcount
	}
	
	// Function for finding the dep role among a member's roles
	function drFind(mmbr) {
		var ret = ""
		if (ncdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
		for (i = 0; i < mmbr.roles.map(r => r.name).length; i++) {
			if (ncdeproles.includes(mmbr.roles.map(r => r.name)[i])) {
				ret = mmbr.roles.map(r => r.name)[i]
			}
		}}
		if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
		for (i = 0; i < mmbr.roles.map(r => r.name).length; i++) {
			if (cdeproles.includes(mmbr.roles.map(r => r.name)[i])) {
				ret = ncdeproles[cdeproles.indexOf(mmbr.roles.map(r => r.name)[i])]
			}
		}}
		return ret
	}
	
	// Just a function that times the message out in x seconds
	function yeet(seckslul) {
		setTimeout(function(){msg.delete().catch(console.error)}, seckslul * 1000)
	}
	
	// Function for getting an emoji by name
	function emoji(nme, srv = msg.guild, a = false, id = false) {
		if (id === true) {emvar = srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)]}
		else {if (a === true) {emd = "<a:"} else {emd = "<:"}
			emvar = emd + nme + ":" + srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)] + ">"}
		return emvar
	}
	
	// Function for getting a role by name 
	function getRole(nme) {
		if (msg.guild.roles.map(r => r.name).includes(nme)) {
			return msg.guild.roles.find(role => role.name === nme)
		} else {return void(0)}
	}
	
	// Function for checking whether an emoji (found by name) is animated
	function emanim(name, srv = msg.guild) {
		return srv.emojis.get("650293931791089684").animated
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
	//if ((msg.author.id === client.user.id) && (msg.embeds.length > 0)) {
	//	yeet(600)
	//}
	
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
		var cmd1 = mesc.split(" ")
		
		// Check if the command even exists (if it is in the right guild)
		if (cmds.indexOf(cmd[0]) === -1 && msg.guild === DELTAS) {
			msg.reply("Unrecognized command. Type in !help to get the list of all avaliable commands.")
			
		}
		
		// Quote command
		if (cmd[0] === '!quote') 
		{
			// If the command includes an argument, the standart randomization is overridden
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
				ch.send(qte2 + x1 + ": " + txt)
			}}
			else {
				x = Math.floor((Math.random() * qte.length))
				while (quotelog.indexOf(x) > -1) {
					x = Math.floor((Math.random() * qte.length))
				}
				var txt = qte[x]
				x2 = x + 1
				
				if(quotelog.length > Math.ceil((qte.length * 4) / 5)) {
					quotelog.shift()
				}
				quotelog.push(x)
				
				ch.send(qte2 + x2 + ": " + txt)
				
			}
		}  
		
		// Emoji command
		if (cmd[0] === '!em') {
			if (emoji(cmd1[1], DELTAS, false, true) != undefined) {
			ia = 1
			emtx = ""
			if (cmd[2]) {
			if (checkSymbols(cmd[2], nmbrs)) {ia = cmd[2]}}
			if (ia > 27) {ia = 27}
			if (animojis.includes(cmd1[1])) {
					for (var ia2 = 0; ia2 < ia; ia2++) {
						emtx += emoji(cmd1[1], DELTAS, true)
					}
					ch.send(emtx)
					.catch(console.error)
					yeet(0)
					return
				} else {
					for (var ia2 = 0; ia2 < ia; ia2++) {
						emtx += emoji(cmd1[1], DELTAS, false)
					}
					ch.send(emtx)
					.catch(console.error)
					yeet(0)
					return 
				}
				yeet(0)
			} else {msg.reply("Emoji not found.")}
		}
		
		// Debug commands
		if (cmd[0] === '!debug') {
			if (msg.author.id === process.env.BOT_AUTHOR) {
			ch.send("Debug command run, check logs.")
			switch (cmd[1]) {
				case "quotelog":
					console.log(quotelog)
					break
				case "roles":
					console.log(derolenm)
					console.log(deroleid)
					break
				case "rolesraw":
					console.log(DELTAS.roles)
					break
				case "sendem":
					ch.send(emoji(cmd1[2], DELTAS, true))
					.catch(console.error)
					break
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
				case "roletest":
					cdeproles.forEach(r => {
						rtemp = getRole(r)
						console.log(rtemp.id)
					})
					break
				case "atthem":
					ch.send("@everyone") 
					break
				case "roleraw":
					var rtmp = ""
					for (i = 2; i < cmd1.length; i++) {
						rtmp += cmd1[i]
						if (i < (cmd1.length - 1)) {rtmp += " "}
					}
					console.log(getRole(rtmp))
					break
				case "embed":
					var embed = new Discord.RichEmbed()
					.setTitle(abn.abn[0].number)
					.setThumbnail('https://images2.imgbox.com/cc/7f/DWHKASNe_o.png')
					.addField("The Dapper Duck")
					ch.send({embed})
					break
				case "msg":
					let tempch = DELTAS.channels.get(cmd[2])
					var tempmsg = ""
					var i
					for (i = 3; i < cmd.length; i++) { 
						tempmsg += cmd1[i] + " ";
					} 
					tempch.send(tempmsg)
					.catch(console.error)
					break
				case "nut":
					var embed = new Discord.RichEmbed()
					.setTitle("The (late) No Nut November Alert")
					.setThumbnail('')
					.setDescription("Everyone is welcome to participate in the annual No Nut November event. Yes, it's now annual. Don't ask me why. Everyone willing to participate should react with a <:yeahboy:608361227130896384>, everyone that has already failed - react with <:angelaTits2:608813572662755338><:angelaTits1:608813588228079626>.")
					ch.send({embed})
					.catch(console.error)
					break
				case "emojis":
					var emarr = emojiid
					emojiname.forEach(x => {
						emarr[emojiname.indexOf(x)] = emojiname[emojiname.indexOf(x)] + " " + emarr[emojiname.indexOf(x)]
					})
					console.log(emarr)
					break
				case "emojisraw":
					console.log(DELTAS.emojis)
					break
				case "emtest":
					ch.send(DELTAS.emojis.find("name", "restartsForDays"))
					break
				case "var":
					console.log("Debug command !debug var noticed.")
					switch (cmd[2]) { 
					case "set": 
						dbvars[dbvnames.indexOf(cmd[3])] = cmd[4]
						break
					case "get":
						ch.send(`Debug variable "` + cmd[3] + `" is equal to ` + dbvars[dbvnames.indexOf(cmd[3])])
						break
					default:
						ch.send("Incorrect usage.")
						break
					}
					break
					
					
				default:
					console.log("Unrecognized debug command noticed.")
					break
			} 	
		} else {msg.reply("Sorry, but only the bot's author can use the debug commands.")}
		yeet(2)
		}
	
	// For making the bot say whatever, but only if the debug variable debugsay is 1
	if (cmd[0] === "!say") {
		if (cmd.length < 2) {
			msg.reply("Cannot send empty messages.")
			return }
		if ((dbvars[1] === 1) || (dbvars[1] === '1')) {
			var tempmsg = ""
			var i
			for (i = 1; i < cmd.length; i++) { 
				tempmsg += cmd1[i] + " ";
			} 
			ch.send(tempmsg)
			.catch(console.error)
			yeet(0)
		} else {msg.reply("The command !say is currently disabled.")}
	}
	
	// Role giving and taking
	if (cmd[0] === "!giverole") {
		var rtmp = ""
		for (i = 1; i < cmd1.length; i++) {
			rtmp += cmd1[i]
			if (i < (cmd1.length - 1)) {rtmp += " "}
		}
		// If the role is stated to be operable in the relevant array
		if (ncdeproles.includes(rtmp)) {
			if (msg.member.roles.map(r => r.name).includes(rtmp) === false) {
				if (ncdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false)) {
					// Find the role among the guild's roles and add it
					msg.member.addRole(getRole(rtmp))
					ch.send("Successfully given the specified role to <@" + msg.author.id + ">.")
				} else {msg.reply("Error: only one department assignment role may be given to a user.")}
			} else {ch.send("Error: user <@" + msg.author.id + "> already has the specified role")}
		} else {msg.reply("Error: role was specified incorrectly or cannot be given.")}
	}
	
	if (cmd[0] === "!removerole") {
		var rtmp = ""
		for (i = 1; i < cmd1.length; i++) {
			rtmp += cmd1[i]
			if (i < (cmd1.length - 1)) {rtmp += " "}
		}
		// If the role is stated to be operable in the relevant array
		if (roles1.includes(rtmp)) {
			if (msg.member.roles.map(r => r.name).includes(rtmp) === true) {
				// Find the role among the guild's roles and remove it
				msg.member.removeRole(getRole(rtmp))
				ch.send("Successfully taken the specified role from <@" + msg.author.id + ">.")
			} else {ch.send("Error: user <@" + msg.author.id + "> does not have the specified role")}
		} else {msg.reply("Error: role was specified incorrectly or cannot be removed.")}
		
	}
	
	if ((cmd[0] === "!department") || (cmd[0] === "!dep")) {
		if ((deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) || (cmd[1] === "info") || (cmd[1] === "assign")) {
			switch (cmd[1]) {
				case "info":
					if (msg.member.roles.map(r => r.name).includes("Employees") === false) {
						msg.reply("To get assigned to a team, type in !dep assign (Team name).")
						
					} else {msg.reply("wip")}
					break
				case "assign":
					if (deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false)) {
						var rtmp = ""
						for (i = 2; i < cmd1.length; i++) {
							rtmp += cmd1[i]
							if (i < (cmd1.length - 1)) {rtmp += " "}
						}
						if (ncdeproles.includes(rtmp)) {
							msg.member.addRole(getRole(rtmp))
							msg.reply("you have been successfully assigned to work in the " + rtmp + "!")
						} else {msg.reply("error: incorrect team name.")}
					} else {msg.reply("you can only work in one team at a time. Leave your team (!dep leave) if you want to join another team.")}
					break
				case "leave":
					if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false)) {
					if (deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						msg.reply("do you really want to leave the " + drFind(msg.member) + "? **y**/**n**")
						const collector = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { time: 10000 })
						collector.on('collect', cmsg => {
						if (cmsg.content === "y") {
							msg.reply("you have left the " + drFind(msg.member) + ".") 
							msg.member.removeRole(getRole(drFind(msg.member)))
							collector.stop()
						}
						if (cmsg.content === "n") {msg.reply("team leave cancelled."); collector.stop()}
						})
					} else {msg.reply("you are not currently assigned to any team.")}
					} else {msg.reply("captains cannot simply leave their team! (!dep captain resign)")}
					break
				case "captain": {
					if (ncdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						switch (cmd[2]) {
							case "list": 
								var cpts = ""
								var lolarr = []
								for (i = 0; i < cdeproles.length; i++) {
									if (DELTAS.roles.get(getRole(r).id).members.map(m=>m.user.tag) != [] ) {
										cpts += r.replace(/ (C)/, " - ") + DELTAS.roles.get(getRole(r).id).members.map(m=>m.user.tag)[0]
									} else {cpts += r.replace(/ (C)/, " - ") + "none"}
									if (i < (cmd1.length - 1)) {cpts += ", "; i++} else {cpts += "."}
								}
								//ch.send(cpts)
								console.log(lolarr)
								break
							default:
								msg.reply("incorrect usage. Avaliable arguments: list.")
								break
						}
						break
					} else if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						switch (cmd[2]) {
							case "resign":
								if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
									msg.reply("do you really want to resign your post as the " + drFind(msg.member) + " captain? **y**/**n**")
									const collector = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { time: 10000 })
									collector.on('collect', cmsg => {
									if (cmsg.content === "y") {
										msg.reply("you have resigned as the " + drFind(msg.member) + " captain.") 
										var cptxt = drFind(msg.member)
										msg.member.removeRole(getRole(cptxt + " (C)"))
										msg.member.addRole(getRole(cptxt))
										collector.stop()
									}
									if (cmsg.content === "n") {msg.reply("resign cancelled."); collector.stop()}
									})
								} else {msg.reply("you are not the captain of the " + drFind(msg.member) + "!")}
								break
							case "list": 
								var cpts = ""
								var i = 0
								cdeproles.forEach(r => {
									if (DELTAS.roles.get(getRole(r).id).members.map(m=>m.user.tag) != []) {
										cpts += r.replace(/ (C)/, " - ") + DELTAS.roles.get(getRole(r).id).members.map(m=>m.user.tag)[0]
									} else {cpts += r.replace(/ (C)/, " - ") + "none"}
									if (i < (cmd1.length - 1)) {cpts += ", "; i++} else {cpts += "."}
								})
								ch.send(cpts)
								break
							default:
								msg.reply("incorrect usage. Avaliable arguments: resign, list.")
								break
						}
					} else {msg.reply("ERROR: YOU SHOULD NOT BE SEEING THIS MESSAGE!")}
					break
				}
				default:
					msg.reply("error: unrecognized command. Type in !help dep to get info on the command.")
					break
			}
		} else {msg.reply("You are not currently assigned to a team. Contact a Sephirah to get assigned (!dep info).")}
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
	if (mesc.length > 1) {
	var hm1 = mesc.toLowerCase().split("")
	hm1.shift()
	var hm2 = []
	hm1.forEach(i => {if (i != " ") {hm2.push(i)}})
	if (mesc.toLowerCase().startsWith("h") && checkSame(hm2, "m")) {
			msg.react("607330826052698114") 

	}}
	if ((mesc.toLowerCase().split(" ").indexOf('uwu') > -1 ) || (mesc.toLowerCase().split(" ").indexOf('owo') > -1)) {
		if (mesc.toLowerCase().split(" ").indexOf('uwu') > mesc.toLowerCase().split(" ").indexOf('owo')) {ch.send('OwO')}
		else {ch.send('UwU')}

		// why
	}
})


 

// THIS  MUST  BE  THIS  WAY
// NO TOUCHING
//______________________________\\/
client.login(process.env.BOT_TOKEN)

