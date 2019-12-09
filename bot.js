const Discord = require('discord.js');
 const db = require('mysql');
 const client = new Discord.Client();
  const { Client, RichEmbed } = require('discord.js');
  const lambHook = new Discord.WebhookClient(process.env.LAMBDAHOOK_ID, process.env.LAMBDAHOOK_TOKEN);
  const abn = require("./abnb.json");
  const jn = require("./junk.json");
  const gear = require("./gear.json")
  const animojis = [
			"restartsForDays",
			"pepanger",
			"animenacing",
			"Hod"
			]
	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const qte2 = "Lambdadelta Quote #"
	const cmds = jn.cmds
	
	var pool        = db.createPool({
	connectionLimit : 3, // default = 10
	host: "sql7.freesqldatabase.com",
	user: "sql7314688",
	password: process.env.DB_PASS,
	database: "sql7314688"
	});
	
 var employees = []
 var dbployees = []
 var dbids = []
 x = 0 
 x1 = 0
 dbg1 = 0
 dbvars = [0, 1, 0]
 dbvnames = ['debugduck', 'debugsay', 'debugvote']
 quotelog = []
 votingteam = ""
 voting = 0
 
	// Function that updates the god damn information on employee stats/equipment/whatever
	function upd() {
		pool.getConnection(function (err, connection) {
			connection.query(`SELECT * FROM employees`, function (err, result) { 
				dbployees = []
				result.forEach(e => fdbPush(e))
				dbids = []
				dbployees.forEach(e => dbids.push(e.id))
				if (err) throw err
				connection.release()
			})
		})
	}
 
 	// Function for pushing results into dbployees, so I don't have to change the damn thing everywhere
	function fdbPush(e) {
		dbployees.push({"id": e.userid, "tag": e.usertag, "fortitude": e.fortitude, "prudence": e.prudence, "temperance": e.temperance, "justice": e.justice, "suit": e.suit, "weapon": e.weapon, "inventorys": e.inventorys, "inventoryw": e.inventoryw, get stats {return [this.fortitude, this.prudence, this.temperance, this.justice]}})
	}
 
 	// Function for finding the dep role among a member's roles
	function drFind(mmbr) {
		ret = ""
		if (ncdeproles.every(t => mmbr.roles.map(r => r.name).includes(t) === false) === false) {
		for (i = 0; i <= mmbr.roles.map(r => r.name).length; i++) {
			if (ncdeproles.includes(mmbr.roles.map(r => r.name)[i])) {
				ret = mmbr.roles.map(r => r.name)[i]
			}
		}}
		if (cdeproles.every(t => mmbr.roles.map(r => r.name).includes(t) === false) === false) {
		for (i = 0; i <= mmbr.roles.map(r => r.name).length; i++) {
			if (cdeproles.includes(mmbr.roles.map(r => r.name)[i])) {
				ret = ncdeproles[cdeproles.indexOf(mmbr.roles.map(r => r.name)[i])]
			}
		}}
		return ret
	}
 
client.on('ready', () => {


	// Getting the Lambda's Deltas guild for easy use
	const DELTAS = client.guilds.get("607318782624399361");
	const BCH = DELTAS.channels.get("607558082381217851");
	
	// Debug line: logs all members
	//DELTAS.members.forEach(member => console.log(member.user.username));
	
	// Getting all of the 'employees' - members with a department role
	DELTAS.members.forEach(m => {
		if(drFind(m)) {
			employees.push({"id": m.id, "tag": m.user.tag, "team": drFind(m)})
		}
	})
	
	pool.getConnection(function (err, connection) {
		connection.query(`SELECT * FROM employees`, function (err, result) {
			dbpush = []
			result.forEach(e => fdbPush(e))
			result.forEach(e => dbids.push(e.userid).toString())
			employees.forEach(e => {
				if (dbids.includes(e.id)) {console.log(`Employee ${employees[employees.indexOf(e)].tag} is included!`)}
				else {dbpush.push({"id": e.id, "tag": e.tag})}
			})
			console.log("To push:")
			console.log(dbpush)
			dbpush.forEach(e => {
			var sql = "INSERT INTO employees (userid, usertag) VALUES ('" + e.id + "', '" + e.tag + "')";
			connection.query(sql, function (err, result) {
			if (err) throw err;
			console.log(`${e.tag} inserted!`)
			})
			})
			if (err) throw err
			connection.release()

		})
	})

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
	// nothing lol cause it's in the beginning now
	deproles.forEach(r => roles1.push(r))
	
	// Messages by the bot that will be deleted indefinitely
	const deletableReplies = [
			"Debug command run, check logs."
			]
	
	// The quote pool
	
	// Help command pool
	
	
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
	
	// Vote stuff
	if ((mesc.startsWith("Initiating vote for ")) && (dbvars[2] === 1) && (msg.author.id === '607520778178527246')) {
		voting = 1
		voteeid = ""
		mesc.split(" ")[3].split("").forEach(c => {
			if (nmbrs.includes(c)) {voteeid += c}
		})
		voteeuser = DELTAS.members.find("id", voteeid)
		console.log("THIS SHIT " + voteeid)
		cptxt = drFind(voteeuser)
		dbvars[2] = 0
		timeout = 1
		vtd = [] 
		yee = 0
		boo = 0
		if ((DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length) > (5 + Math.floor(DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length / 2))) {
			reqv = 5 + Math.floor(DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length / 2)
		} else {reqv = DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length}
		msg.react('✅')
		msg.react('🚫')
		const filter = (reaction, user, voted) => (reaction.emoji.name === ('✅') || reaction.emoji.name === ('🚫')) && DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).includes(user.id) && vtd.includes(user.id) === false
		const collector = msg.createReactionCollector(filter, { time: 15000 })
		collector.on('collect', rct => {//${rct.emoji.name}
			lru = rct.users.map(u => u.id).pop()
			lrn = client.users.find("id", lru)
			if (rct.emoji.name === '✅') {yee++; console.log(`${lrn.tag} voted yee!`); console.log(rct.users.map(u => u.id))}
			if (rct.emoji.name === '🚫') {boo++; console.log(`${lrn.tag} voted boo!`); console.log(rct.users.map(u => u.id))}
			vtd.push(lru)
			if ((vtd.length >= DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length) || (vtd.length >= (5 + Math.floor(DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length / 2)))) {
			timeout = 0
			collector.stop()
			} 
		})
		collector.on('end', collected => {
			voting = 0
			if (timeout === 1) {
				ch.send(`Cancelling the vote (timeout). ${vtd.length}/${reqv} people participated.`)
		} else {
			if (yee > boo) {
				voteres = "**" + voteeuser.user.tag + "** is now the captain of the " + votingteam + "!"
				voteeuser.removeRole(getRole(votingteam))
				voteeuser.addRole(getRole(votingteam + " (C)"))
			}
			
			if (boo >= yee) {voteres = "**" + voteeuser.user.tag + "** will not become the captain of the " + votingteam + "."}
				ch.send(`Voting over. ${vtd.length}/${reqv} people participated: ${yee} voted ✅ and ${boo} voted 🚫. \n ` + voteres)
		
				console.log(`Voting over. ${vtd.length}/${reqv} people voted: ${yee} yee and ${boo} boo`)
		}
		})
	}
	
	// If the message's author is a bot, just ignore it
	if (msg.author.bot && ((msg.content.startsWith("Initiating vote for ") === false))) return;
	
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
				case "dbase1":
					pool.getConnection(function (err, connection) {
						connection.query("SELECT * FROM users", function (err, result) {
						connection.release();
							console.log(result)
							if (err) throw err;
						})
					})
					
					break
				case "dbase2":
					pool.getConnection(function (err, connection) {
						connection.query(`SELECT ${cmd[2]} FROM users`, function (err, result) {
						connection.release()
							console.log(result)
							if (err) throw err
						})
					})
					
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
				case "profile":
				pool.getConnection(function (err, connection) {
					connection.query("UPDATE `employees` SET `" + cmd[2] + "` = '" + cmd[3] + "' WHERE `employees`.`userid` = '" + cmd[4] + "';", function (err, result) {
						if (err) throw err
						connection.release()
					})
				})
				pool.getConnection(function (err, connection) {
							connection.query(`SELECT * FROM employees`, function (err, result) { 
								dbployees = []
								result.forEach(e => fdbPush(e))
								dbids = []
								dbployees.forEach(e => dbids.push(e.id))
								curruser = dbployees[dbids.indexOf(cmd[4])]
								stats = [curruser.fortitude, curruser.prudence, curruser.temperance, curruser.justice]
								console.log(`F${stats[0]} P${stats[1]} T${stats[2]} J${stats[3]} for ${curruser.tag}`)
								if (err) throw err
								connection.release()
							})
						})
					
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
	
	if ((cmd[0] === "!lc") || (cmd[0] === "!lobcorp")) {
		if ((deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) || (cmd[1] === "info") || (cmd[1] === "assign")) {
			switch (cmd[1]) {
				case "list":
					if (cmd[2]) {
					if (ncdeproles.includes(cmd1[2] + " " + cmd1[3])) {
					currdep = getRole(cmd1[2] + " " + cmd1[3])
					currdepm = DELTAS.roles.get(getRole(cmd1[2] + " " + cmd1[3]).id).members.map(m=>m.user.tag)
					depm = ""
					cpt = "none."
					if ((currdepm[0] === undefined) === false) {
					currdepm.forEach(m => {
						depm += m
						if (currdepm.indexOf(m) < (currdepm.length - 1)) {depm += ", "} else {depm += "."}
					})
					} else {depm = "The department is empty... *crickets*"}
					if (getRole(cmd1[2] + " " + cmd1[3] + " (C)").members.map(m=>m.user.tag)[0] != undefined) {
						cpt = getRole(cmd1[2] + " " + cmd1[3] + " (C)").members.map(m=>m.user.tag)[0]
					}
					ch.send("\n```md\n" + `[${cmd1[2] + " " + cmd1[3]}]\n>	Captain: ${cpt}\n#	Employees: ${depm}` + "\n```")
					
					break
					} else {msg.reply("incorrect department name."); break}
					} else {
						
					var cpts = ""
					cdeproles.forEach(r => {
						empcount = 0
						empcounts = ""
						emps = "s"
						empcount = empcount + DELTAS.roles.get(getRole(r).id).members.map(m=>m.user.tag).length + DELTAS.roles.get(getRole(ncdeproles[cdeproles.indexOf(r)]).id).members.map(m=>m.user.tag).length
						if (empcount.toString().split("")[empcount.toString().split("").length - 1] === "1") {emps = ""}
						if (empcount === 0) {empcounts = "no"} else {empcounts = empcount.toString()}
						if ((DELTAS.roles.get(getRole(r).id).members.map(m=>m.user.tag)[0] === undefined) === false) {	
							cpts += "[" + ncdeproles[cdeproles.indexOf(r)] + `] (${empcounts} employee${emps}) \n#		` + DELTAS.roles.get(getRole(r).id).members.map(m=>m.user.tag)[0]
						} else {cpts += "[" + ncdeproles[cdeproles.indexOf(r)] + `] (${empcounts} employee${emps}) \n#		none`}
						if (cdeproles.indexOf(r) < (cdeproles.length - 1)) {cpts += ", \n"} else {cpts += ".```"}
					})
					ch.send("List of departments and the respective captains: \n```md\n" + cpts)
					
					break
					}
					break
				case "w":
				case "work":
					if (abn.lista.includes(cmd[2])) {
					if (jn.abnWorkable.includes(cmd[2])) {
					if (jn.workOrders.includes(cmd[3])) {
						respectiveStat = jn.stats[jn.workOrders.indexOf(cmd[3])]
						curruser = dbployees[dbids.indexOf(msg.author.id)]
						console.log("stats - " + curruser.stats)
						console.log(respectiveStat + " - " + curruser.stats[jn.stats.indexOf(respectiveStat)])
						} else msg.reply("error: incorrect work order.")
					} else msg.reply("error: work on the specified abnormality unavaliable.")
					} else msg.reply("error: incorrect abnormality code specified or specified abnormality unavaliable.")
					break
				case "p":
				case "profile":
				var curruser = {"id": 101}
					if (cmd[2] && (cmd[2].startsWith("<@") || cmd[2].startsWith("<!@") || cmd[2].startsWith("<@!"))) {
						cuid = ""
						cmd[2].split("").forEach(c => {
							if (nmbrs.includes(c)) {cuid += c}
						})
						curruser = dbployees[dbids.indexOf(cuid)]
					} else {curruser = dbployees[dbids.indexOf(msg.author.id)]}
						dbployees = []
						dbids = []
						stats = []
						pool.getConnection(function (err, connection) {
							connection.query(`SELECT * FROM employees`, function (err, result) {
								dbployees = []
								result.forEach(e => fdbPush(e))
								dbids = []
								dbployees.forEach(e => dbids.push(e.id))
								eqct = [curruser.suit, curruser.weapon]
								// [Suit, Weapon]
								gearc = [gear.suits[eqct[0]], gear.weapons[eqct[1]]]
								stats = [curruser.fortitude, curruser.prudence, curruser.temperance, curruser.justice]
								console.log(`F${stats[0]} P${stats[1]} T${stats[2]} J${stats[3]}`)
								wepd = `${gearc[1].damage[0]}-${gearc[1].damage[1]} `
								for (i = 0; i < 4; i++) {
									if (gearc[1].dtype[i] > 0) {wepd += jn.dtype[i]}
								}
								ch.send("\n```mb\n 📋 | Showing stats for user " + curruser.tag + "\n```" + `		LV${Math.ceil(stats[0]/25)} ${jn.fortitude} ${stats[0]}		LV${Math.ceil(stats[1]/25)} ${jn.prudence} ${stats[1]}		LV${Math.ceil(stats[2]/25)} ${jn.temperance} ${stats[2]}		LV${Math.ceil(stats[3]/25)} ${jn.justice} ${stats[3]}\n\n		Suit: ${gearc[0].name}   -   ${gearc[0].resistance[0]} ${jn.dtype[0]}	${gearc[0].resistance[1]} ${jn.dtype[1]}	${gearc[0].resistance[2]} ${jn.dtype[2]}	${gearc[0].resistance[3]} ${jn.dtype[3]}\n		Weapon: ${gearc[1].name}   -   ${wepd}`)
								if (err) throw err
								connection.release()
							})	
						})
					break
				case "i":
				case "inv":
				case "inventory":
					msg.delete(1)
					pool.getConnection(function (err, connection) {
						connection.query(`SELECT * FROM employees`, function (err, result) {
							dbployees = []
							result.forEach(e => fdbPush(e))
							dbids = []
							dbployees.forEach(e => dbids.push(e.id))
							curruser = dbployees[dbids.indexOf(msg.author.id)]
							curruser.inventorys.split(" ")
							invs = ""
							invw = ""
							ainvs = []
							ainvw = []
							ainvsd = []
							ainvwd = []
							curruser.inventorys.split(" ").forEach(id => {
								invs += gear.suits[id].name
								ainvs.push({"name": gear.suits[id].name, "id": id})
								ainvsd.push(Number(id))
								if (curruser.inventorys.split(" ").indexOf(id) < (curruser.inventorys.split(" ").length - 1)) {invs += ", "} else {invs += "."}
							}) 
							curruser.inventoryw.split(" ").forEach(id => {
								invw += gear.weapons[id].name
								ainvw.push({"name": gear.weapons[id].name, "id": id})
								ainvwd.push(Number(id))
								if (curruser.inventoryw.split(" ").indexOf(id) < (curruser.inventoryw.split(" ").length - 1)) {invw += ", "} else {invw += "."}
							})
						ch.send("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```" + `		${jn.pebox} PE Boxes: wip\n\n        Suits:	${invs}\n        Weapons:	${invw}\n\nType in "equip" to open the equip menu, "exit" to leave.`)
						invmenu = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { max: 1, time: 20000 })
						invmenu.on('collect', cmsg => {
							cmsg.delete(1)
							menumsg = DELTAS.members.get(client.user.id).lastMessage
							console.log(DELTAS.members.get(client.user.id).lastMessageID)
							c1msg = cmsg.content.toLowerCase()
							if (c1msg === "equip") {
								menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Equip suit or weapon?")
								ch.awaitMessages(m => m.author.id === curruser.id, { max: 1, time: 10000 })
								.then(m => {
								m.delete(100)
								console.log("Response: " + m.array()[0].content)
								if (m.array()[0].content === "suit") {
									invs2 = ""
									suitchoice = []
									console.log("AINVS: ")
									console.log(ainvs)
									ainvs.forEach(s => {
										invs2 += s.name + ` (${Number(s.id) + 1})`
										if (ainvs.indexOf(s) < (ainvs.length - 1)) {invs2 += ", "} else {invs2 += "."}
									})
									menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Choose the suit to equip: " + invs2)
									//checkSymbols(str, arr)
								ch.awaitMessages(m => m.author.id === curruser.id, { max: 1, time: 10000 })
									.then(m => {
										if (checkSymbols(m.array()[0].content, nmbrs)) {
											if (ainvwd.includes(Number(m.array()[0].content) - 1)) {
												equpd = (Number(m.array()[0].content) - 1).toString()
												console.log("EQUPD: " + equpd)
												m.delete(1)
												connection.query("UPDATE `employees` SET `suit` = '" + (Number(m.array()[0].content - 1)).toString() + "' WHERE `employees`.`userid` = '" + curruser.id + "';", function (err, result) {
													if (err) throw err
												})
												msg.delete(200) 
												menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Equipped " + `${gear.suits[equpd].name}   -   ${gear.suits[Number(m.array()[0].content) - 1].resistance[0]} ${jn.dtype[0]}	${gear.suits[Number(m.array()[0].content) - 1].resistance[1]} ${jn.dtype[1]}	${gear.suits[Number(m.array()[0].content) - 1].resistance[2]} ${jn.dtype[2]}	${gear.suits[Number(m.array()[0].content) - 1].resistance[3]} ${jn.dtype[3]}`) 
												menumsg.delete(8000)
												upd()
												
											} else {msg.delete(1); menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: specified suit unavaliable."); menumsg.delete(2000)}
										} else {msg.delete(1); menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: incorrect response."); menumsg.delete(2000)}
									})
									.catch(console.error)
								} else
								if (m.array()[0].content === "weapon") {
									invw2 = ""
									weaponchoice = []
									console.log("AINVW: ")
									console.log(ainvw)
									ainvw.forEach(w => {
										invw2 += w.name + ` (${Number(w.id) + 1})`
										if (ainvw.indexOf(w) < (ainvw.length - 1)) {invw2 += ", "} else {invw2 += "."}
									})
									menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Choose the weapon to equip: " + invw2)
									//checkSymbols(str, arr)
								ch.awaitMessages(m => m.author.id === curruser.id, { max: 1, time: 10000 })
									.then(m => {
										if (checkSymbols(m.array()[0].content, nmbrs)) {
											if (ainvwd.includes(Number(m.array()[0].content) - 1)) {
												equpd = Number(m.array()[0].content) - 1
												console.log("EQUPD: " + equpd)
												m.delete(200)
												wepd = `${gear.weapons[Number(m.array()[0])-1].damage[0]} - ${gear.weapons[Number(m.array()[0])-1].damage[1]} `
												for (i = 0; i < 4; i++) {
													if (gear.weapons[Number(m.array()[0].content) - 1].dtype[i] > 0) {wepd += jn.dtype[i]}
												}
												connection.query("UPDATE `employees` SET `weapon` = '" + (Number(m.array()[0].content - 1)).toString() + "' WHERE `employees`.`userid` = '" + curruser.id + "';", function (err, result) {
													if (err) throw err
												})
												msg.delete(1) 
												menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Equipped " + `${gear.weapons[equpd].name}   -   ${wepd}`) 
												menumsg.delete(8000)
												upd()
												
											} else {msg.delete(1); menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: specified suit unavaliable."); menumsg.delete(2000)}
										} else {msg.delete(1); menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: incorrect response."); menumsg.delete(2000)}
									})
									.catch(console.error)
								} else
								msg.reply("error: incorrect response.")
								})
								.catch(console.error)
							} else if (c1msg === "exit") {DELTAS.members.get(client.user.id).lastMessage.delete()}
							else msg.reply("error: incorrect response.")
						})
						})
					connection.release()
					})						
					break
				case "info":
					if (msg.member.roles.map(r => r.name).includes("Employees") === false) {
						msg.reply("To get assigned to a team, type in !dep assign (Team name).")
						
					} else {msg.reply("Awaliable arguments: list, captain, assign, leave, profile.")}
					
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
						} else {msg.reply("error: incorrect team name. Example: !dep assign Extraction Team")}
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
					
					// Non-captain commands
					if (ncdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						switch (cmd[2]) {
							case "list": 
								// At the end (non-restricted)
								break
							case "vote":
							console.log(cmd[3].slice((cmd[3].length - 19), (cmd[3].length - 1)))
							if (voting != 1) {
								voteeid = ""
								cmd[3].split("").forEach(c => {
									if (nmbrs.includes(c)) {voteeid += c}
								})
								if (cmd[3].startsWith("<@") || cmd[3].startsWith("<!@>") || cmd[3].startsWith("<@!>")) {
								if (drFind(DELTAS.members.find("id", voteeid)) === drFind(msg.member)) {
								if (DELTAS.roles.get(getRole(drFind(msg.member) + " (C)").id).members.map(m=>m.user.tag)[0] === undefined) {
										dbvars[2] = 1
										votingteam = drFind(msg.member)
										console.log(cmd[3].slice((cmd[3].length - 19), (cmd[3].length - 2)))							
										setTimeout(function(){ch.send("Initiating vote for **" + cmd[3] + "** to become the " + drFind(msg.member) + " captain. Cast your vote by reacting with ✅ or 🚫 to this message.")}, 100)

								} else {msg.reply("Your department already has a captain, **" + DELTAS.roles.get(getRole(drFind(msg.member) + " (C)").id).members.map(m=>m.user.tag)[0] + "**!"); break}
								} else if (deproles.every(t => DELTAS.members.find("id", voteeid).roles.map(r => r.name).includes(t) === false) === false) {msg.reply("the specified user is not in your department."); break} else {msg.reply("the specified user is not an employee."); break}
								break
								} else {msg.reply("error: invalid or missing argument. Usage: !dep captain vote @person"); break}
						} else {msg.reply("an election is in process currently!"); break}
						} 

					// Captain commands
					} else if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						switch (cmd[2]) {
							case "vote":
								msg.reply("you are your department's captain. If you want someone else to become the captain, type !dep resign first.")
								break
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
								// At the end (non-restricted)
								break
							default:
								msg.reply("incorrect usage. Avaliable arguments: resign, list.")
								break
						}
					} else {msg.reply("ERROR: YOU SHOULD NOT BE SEEING THIS MESSAGE!")}
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
				.setFooter("EGO: " + abn.abn[n].ego)
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

