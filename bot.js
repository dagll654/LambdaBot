const Discord = require('discord.js');
 const db = require('mysql');
 	var pool        = db.createPool({
	connectionLimit : 10, // default = 10
	host: "sql7.freesqldatabase.com",
	user: "sql7314688",
	password: process.env.DB_PASS,
	database: "sql7314688"
	});
	pool.getConnection(function (err, connection) {
 const client = new Discord.Client();
  const { Client, RichEmbed } = require('discord.js');
  const lambHook = new Discord.WebhookClient(process.env.LAMBDAHOOK_ID, process.env.LAMBDAHOOK_TOKEN);
  const abn = require("./abnb.json");
  const jn = require("./junk.json");
  const gear = require("./gear.json")
  const fn = require("./functions.js")
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
	var today = new Date()
	var employees = []
	var dbployees = []
	var dbids = []
	 var today = new Date()
	 var employees = []
	 var dbployees = []
	 var dbids = []
	 x = 0 
	 x1 = 0
	 dbg1 = 0
	 dbvars = [0, 0, 0, 0]
	 dbvnames = ['debugduck', 'debugsay', 'debugvote', 'dbheal']
	 quotelog = []
	 votingteam = ""
	 voting = 0	



	// Return the level of a stat
	function statLVL(stat) {
		if (stat < 30) {return "I"}
		else if (stat < 45) {return "II"}
		else if (stat < 65) {return "III"}
		else if (stat < 85) {return "IV"}
		else if (stat < 100) {return "V"}
		else {return "EX"}
	}
	
	var wait = ms => new Promise((r, j)=>setTimeout(r, ms))
	
	// Get employee by id
	function employee(id) {
		//console.log("Getting by id " + Number(id).toString())
		//console.log(dbployees[dbids.indexOf(id)])
		return dbployees[dbids.indexOf(id)]
	}

	// Change an employee's subpoint (and award a stat-up if needed)
	function bumpSubpoint(id, stat = "fortitude", val = 0) {
		curruser = dbployees[dbids.indexOf(id)]
		//console.log("Curruser ID (bumpStat): " + id)
		let statIndex = jn.stats.indexOf(stat.toLowerCase())
		let subStatArr = curruser.subpoints.split("|")
		let mult = 1
		subStatArr[statIndex] = Number(subStatArr[statIndex]) + val
		if (statIndex === 3) {mult = 3}

		if (subStatArr[statIndex] >= ((jn.statLevels.indexOf(statLVL(curruser.stats[statIndex])) + 1) * 16 * mult)) {
			subStatArr[statIndex] = subStatArr[statIndex] - (jn.statLevels.indexOf(statLVL(curruser.stats[statIndex])) + 1) * 16 * mult
			if (curruser.stats[statIndex] < curruser.statlimit) {
				switch (statIndex) {
					case 0:
						dbployees[dbids.indexOf(id)].fortitude = dbployees[dbids.indexOf(id)].fortitude + 1
						break
					case 1:
						dbployees[dbids.indexOf(id)].prudence = dbployees[dbids.indexOf(id)].prudence + 1
						break
					case 2:
						dbployees[dbids.indexOf(id)].temperance = dbployees[dbids.indexOf(id)].temperance + 1
						break
					case 3:
						dbployees[dbids.indexOf(id)].justice = dbployees[dbids.indexOf(id)].justice + 1
						break
				}
			}
		}
		dbployees[dbids.indexOf(id)].subpoints = subStatArr.join("|")
		return subStatArr
	}

	// Function for pushing results into dbployees, so I don't have to change the damn thing everywhere
	function fdbPush(e, arr = dbployees) {
		arr.push({"id": e.userid, "tag": e.usertag, "hp": e.hp/1000, "sp": e.sp/1000, "fortitude": e.fortitude, "prudence": e.prudence, "temperance": e.temperance, "justice": e.justice, "suit": e.suit, "weapon": e.weapon, "inventorys": e.inventorys, "inventoryw": e.inventoryw, "working": Number(e.working), "dead": Number(e.dead), "balance": Number(e.balance), "balancespecific": e.balancespecific, "subpoints": e.subpoints, "effects": e.effects, "statlimit": 100, get stats() {return [Number(this.fortitude), Number(this.prudence), Number(this.temperance), Number(this.justice)]}})
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

	// Heal 1/60 of max HP and SP every 1 minute ( = full heal in an hour)
	client.setInterval(function(){
			if (dbvars[3] === 0) {
					dbployees.forEach(e => {
						if (e.working === 0) {
						if (e.hp < e.fortitude) {e.hp = Number(e.hp) + Math.ceil(e.fortitude/60)}
						if (e.hp > e.fortitude) {e.hp = Number(e.fortitude)}
						let sp = e.sp
						if (e.sp < e.prudence) {e.sp = Number(e.sp) + Math.ceil(e.prudence/60)}
						if (e.sp > e.prudence) {e.sp = Number(e.prudence)}
						if ((e.hp === Number(e.fortitude)) && (e.sp === Number(e.prudence)) && (Number(e.dead) === 1)) {
							e.dead = 0
						}
						} else {e.working = 0}
						
					})
					//console.log("Healed all.")
			}
	}, 60000)
	
	async function queryAndWait(q, connection) {
		await wait(100).then(p => {
		connection.query(q, function (err, result) {if (err) throw err})
		})
	}
	
	// Tick down any acting effects
	client.setInterval(function(){
		dbployees.forEach(e => {
			if (e.effects != "null"){
			console.log(e.tag + " " + e.effects)
			}
			let effectsNew = []
			if ((e.effects != "null") && (e.effects != undefined)){
			let effects = e.effects.split("|")
			effects.forEach(eff => {
				let effArr = eff.split("/")
				if (Number(effArr[1]) > 0) {
				effArr[1] = Number(effArr[1]) - 1
				effectsNew.push(effArr.join("/"))
				} else {eff = "null"}
				if ((eff === undefined) || (eff === "")) {eff = "null"}
			})
			e.effects = effectsNew.join("|")
			}
			let effectsSplit = e.effects.split("|")
			if ((effectsSplit.length > 1) && ((effectsSplit[0] === undefined)||(effectsSplit[0] === 'undefined')||(effectsSplit[0] === 'null')||(effectsSplit[0] === null))) {
			effectsSplit.shift()
			e.effects = effectsSplit.join("|")
			}
			if (e.effects != "null"){
			console.log(e.tag + " " + e.effects)
			console.log(e.tag + " " + effectsNew)
			}
			if (e.effects === undefined || e.effects === "") {e.effects = "null"}
			if (fn.effects['deathOnWork'](e, "o-03-03") === true) {e.hp = e.hp + 0.3}
		})
	}, 5000)
	
	// Update the data in the database
	function updData () {
		let dbployees2 = []
		let pushBig = []
		connection.query("SELECT * FROM `employees`", function (err, result) {
		result.forEach((r, i) => {
			fdbPush(r, dbployees2)
		})
		if (err) throw err
		
		dbployees.forEach((e, i) => {//
			let pushSmall = []
			//let keys = Object.keys(e)
			//let vals = Object.values(e)
			//vals[2] = val[2]*1000
			//vals[3] = val[3]*1000
			for (const prop in e) {
				let tempval = e[prop]
				if ((prop === "hp") || (prop === "sp")) {tempval = (Number(tempval)*1000).toFixed(1); dbployees2[i][prop] = (dbployees2[i][prop]*1000).toFixed(1)}
				if (dbployees2[i][prop] != tempval) {
					if (prop != "stats") {					
					if (Number(dbployees2[i][prop]) != tempval) {
					pushSmall.push("`" + prop + "` = '" + tempval /*e[prop]*/ + "'")
					//console.log(prop + " " + dbployees2[i][prop] + " " + tempval)
					}
					}
				}
			}
			let pushSmallStr = "UPDATE `employees` SET " + pushSmall.join(", ") + " WHERE `employees`.`userid` = '" + e.id + "';"
			pushBig.push(pushSmallStr)
			if (pushSmallStr === ("UPDATE `employees` SET  WHERE `employees`.`userid` = '" + e.id + "';")) {pushBig.pop()}
		})
		pushBig.forEach(q => {
			queryAndWait(q, connection)
		})
		console.log("Updated the database.")
		console.log(pushBig)
		})
	}
	
	// Update the data in the database
	client.setInterval(updData, 30000) 

	
	function databaseThing() {
		connection.query("SELECT * FROM `employees`", function (err, result) {
			//console.log(result)
			dbpush = []
			result.forEach(e => fdbPush(e))
			result.forEach(e => dbids.push(e.userid))
			employees.forEach(e => {
				if (dbids.includes(e.id)) {console.log(`Employee ${employees[employees.indexOf(e)].tag} is included!`)}
				else {dbpush.push({"id": e.id, "tag": e.tag})}
			})
			console.log("To push:")
			console.log(dbpush)
			dbpush.forEach(e => {
			var sql = "INSERT INTO employees (userid, usertag, balancespecific, hp, sp) VALUES ('" + e.id + "', '" + e.tag + "', '0|0|0|0', '17000', '17000')";
			connection.query(sql, function (err, result) {
			if (err) throw err;
			console.log(`${e.tag} inserted!`)
			})
			})
			
			dbployees.forEach(e => {
				let bAbnos = []
				let bBals = []
				if (e.balancespecific != "") { 
				let bGotten = e.balancespecific.split(" ")
				bGotten.forEach(bg => {
					bAbnos.push(bg.split("|")[0])
					bBals.push(bg.split("|")[1])
				})
				jn.abnWorkable.forEach(a => {
					if (bAbnos.includes(a) === false) {
						bAbnos.push(a)
						bBals.push("0")
					}
				})
				}
				else {
				jn.abnWorkable.forEach(a => {
					bAbnos.push(a)
					bBals.push("0")
				})
				}
				let bToSend = []
				bAbnos.forEach(a => {
					bToSend.push(a + "|" + bBals[bAbnos.indexOf(a)])
				})
				//console.log("LOOK AT MY BALLS " + bToSend.join(" "))
				
				connection.query("UPDATE `employees` SET `balancespecific` = '" + bToSend.join(" ") + "' WHERE `employees`.`userid` = '" + e.id + "';", function (err, result) {if (err) throw err})	
			})
			if (err) throw err


	
	})
}
	databaseThing()

	client.on('ready', () => {
		
	const DELTAS = client.guilds.get("607318782624399361");
	const BCH = DELTAS.channels.get("607558082381217851");
	BCH.send("Bot started.")
	
		// Getting all of the 'employees' - members with a department role
		DELTAS.members.forEach(m => {
			if(drFind(m)) {
				employees.push({"id": m.id, "tag": m.user.tag, "team": drFind(m)})
			}
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
    })
		
	})

	client.on('message', tempbigmessagevaluesoIneveruseitagain => {
	
	const msg = tempbigmessagevaluesoIneveruseitagain
	
	const ESERV = client.guilds.get('513660754633949208')
	const DELTAS = client.guilds.get('607318782624399361')
	const bsch = ESERV.channels.get('653572131262693379')
	const bch = DELTAS.channels.get('607558082381217851')
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
	
	// was (frick puriora)
	function wait(msc) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('resolved')
			}, msc)
		})
	}	
	
	// Function for increasing the amount of Specific PE Boxes by val on abnormality with code abn for user with id id
	function bumpBoxes(val = 0, abn = "O-03-03", id) {
		let emp = dbployees[dbids.indexOf(id)]
		let bAbnos = []
		let bBals = []
		let bGotten = emp.balancespecific.split(" ")
		bGotten.forEach(bg => {
			bAbnos.push(bg.split("|")[0])
			bBals.push(bg.split("|")[1])
		})
		bBals[bAbnos.indexOf(abn)] = Number(bBals[bAbnos.indexOf(abn)]) + val
		let bToSend = []
		let bReturn = []
		bAbnos.forEach(a => {
			bToSend.push(a + "|" + bBals[bAbnos.indexOf(a)])
			bReturn.push([a, bBals[bAbnos.indexOf(a)]])
		})
		dbployees[dbids.indexOf(id)].balancespecific = bToSend.join(" ")
		return bReturn
	}
	
	// Function for checking if all the elements of arr are included in arr2
	function checkArray(arr, arr2) {
		return arr.every(i => arr2.includes(i));
	}
	
	// Function for getting the damage modifier of risk level 1 (receiving end) against risk level 2 (dealing end), with the receiving end having res resistance
	function rDamage(rec, dea, res) {
		let levelDifference = jn.risk.indexOf(rec.toUpperCase()) - jn.risk.indexOf(dea.toUpperCase())
		let dMult = 1
		//console.log(levelDifference)
		//4 = 40%; 3 = 60%; 2 = 70%; 1 = 80%; 0 = 100%; -1 = 100%; -2 = 120%; -3 = 150%; -4 = 200%
		switch (levelDifference) {
			case 4: dMult = 0.4; break;
			case 3: dMult = 0.6; break;
			case 2: dMult = 0.7; break;
			case 1: dMult = 0.8; break;
			case 0:
			case -1: dMult = 1; break;
			case -2: dMult = 1.2; break;
			case -3: dMult = 1.5; break;
			case -4: dMult = 2; break;
		}
		return (dMult * res)
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
	function yeet(sec) {
		setTimeout(function(){msg.delete().catch(console.error)}, sec * 1000)
	}
	
	// Function for getting an emoji by name
	function emoji(nme, srv = msg.guild, a = false, id = false) {
		if (id === true) {emvar = srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)]}
		else {if (a === true) {emd = "<a:"} else {emd = "<:"}
			emvar = emd + nme + ":" + srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)] + ">"}
		return emvar
	}
	
	// Function for getting a box by array explaining its contents
	function box(arr) {// 1 = 1, -1 = 3, 0 = 7
		let a = 0
		if (arr[0] === 1) {a = a + 1}
		else if (arr[0] === -1) {a = a + 3}
		else {a = a + 7}
		//console.log("A1 " + a) 
		if (arr[1] === 1) {a = a + 1}
		else if (arr[0] === -1) {a = a + 3}
		else {a = a + 7}
		//console.log("A2 " + a) 
		return jn.boxes[jn.boxcodes.indexOf(a)]
	}
	
	// Roll an x-sided die, even if that makes absolutely no sence in practice
	function roll(sides) {
		return Math.ceil(Math.random() * sides)
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
	
	// Work stuff
	if ((msg.author.id === client.user.id) && (mesc.startsWith("abnworkrequest"))) {
		cmd = msg.content.toLowerCase().split(" ")
		currentAbno = abn.abn[abn.lista.indexOf(cmd[2])]
		respectiveStat = jn.stats[jn.workOrders.indexOf(cmd[3])]
		const curruser = dbployees[dbids.indexOf(cmd[1])]
		fn.effectApplication['workCD'](dbployees[dbids.indexOf(cmd[1])], currentAbno.peoutput)
		dbployees[dbids.indexOf(cmd[1])].working = 1
		statIndex = jn.workOrders.indexOf(cmd[3])
		userStat = curruser.stats[jn.stats.indexOf(respectiveStat)]
		userTemp = curruser.temperance
		userStatLevelText = statLVL(userStat)
		userStatLevel = jn.statLevels.indexOf(userStatLevelText)
		if (userStatLevel > 4) {userStatLevel = 4} 
		successChance = 0
		successChancet = (userTemp * 0.002 + currentAbno.workPreferences[statIndex][userStatLevel])*100
		if (successChancet > 95) {successChance = 95} else {successChance = successChancet}
		//succtext = ("Success chance: " + `${Math.floor(successChance)}%`)
		//msg.edit("\n```mb\n ⚙️ | User " + curruser.tag + " is working " + cmd[3] + " on " + currentAbno.name + "\n```" + `\n	${succtext}`)
		progressBar = ""
		progressBarOld = ""
		progressArray = []
		progressArrayComplex = []
		progressBarStorage = []
		damageArray = []
		for (i = 0; i < (currentAbno.peoutput/2); i++) {
			progressBar += box([0, 0])
			progressArrayComplex.push([0, 0])
		}
			neboxes = 0
			peboxes = 0
			ppeboxes = 0
			i = 0
			for (i = 0; i < currentAbno.peoutput; i++) {
				if ((curruser.hp > 0) && (curruser.sp > 0)) {
				if (roll(100) > successChance) {neboxes++; 
					let dmg = (roll(currentAbno.damage[1] - currentAbno.damage[0] + 1) - 1) + currentAbno.damage[0]
					if (currentAbno.dtype[0] === 1) {
						dmg = dmg * rDamage(gear.suits[Number(curruser.suit)].level, currentAbno.risk, gear.suits[Number(curruser.suit)].resistance[0])
						curruser.hp = curruser.hp - dmg
						damageArray.push(dmg.toFixed(1) + " " + jn.dtype[0])
						//console.log("DAMAGE:" + dmg)
					}
					if (currentAbno.dtype[1] === 1) {
						dmg = dmg * rDamage(gear.suits[Number(curruser.suit)].level, currentAbno.risk, gear.suits[Number(curruser.suit)].resistance[1])
						damageArray.push(dmg.toFixed(1) + " " + jn.dtype[1])
						curruser.sp = curruser.sp - dmg
						//console.log("DAMAGE:" + dmg)
					}
					if (currentAbno.dtype[2] === 1) {
						dmg = dmg * rDamage(gear.suits[Number(curruser.suit)].level, currentAbno.risk, gear.suits[Number(curruser.suit)].resistance[2])
						damageArray.push(dmg.toFixed(1) + " " + jn.dtype[2])
						curruser.hp = curruser.hp - dmg
						curruser.sp = curruser.sp - dmg
						//console.log("DAMAGE:" + dmg)
					}
					
				}
				else {
					if (roll(15) === 15) {ppeboxes++; console.log("Rolled a PPE box!")}
					else {peboxes++}
				}
				progressBarOld = progressBar
				progressBar = ""
				progressArray = []
				for (j = 0; j < (currentAbno.peoutput - (i+1)); j++) {
					progressArray.push(0)
				}
				for (j = 0; j < peboxes; j++) {
					progressArray.unshift(1)
				}
				for (j = 0; j < neboxes; j++) {
					progressArray.push(-1)
				}
				//console.log("Progress array normal: " + progressArray)
				//j = 0
				//start_position: while(true) {
				//	progressBar += box([progressArray[j*2], progressArray[j*2+1]])
				//	progressArrayComplex[j] = [progressArray[j*2], progressArray[j*2+1]]
				//	//console.log("Progress array " + j + " " + progressArrayComplex)
				//	if (j < (currentAbno.peoutput/2 - 1)) {j++; continue start_position}
				//			break
				//	}
				//progressBarStorage.push(progressBar)
				} else {dbployees[dbids.indexOf(cmd[1])].dead = 1}
				}
				
				async function asyncEdit(mssage) {
					let mood = ""
					let moodResult = 0
					if ((peboxes + ppeboxes) >= currentAbno.mood[2]) {mood = jn.goodresult; moodResult = 2}
					else if ((peboxes + ppeboxes) >= currentAbno.mood[1]) {mood = jn.normalresult; moodResult = 1}
					else {mood = jn.badresult; moodResult = 0}
					if (currentAbno.effect[0] === true) {
						fn.effectApplication[currentAbno.ego](dbployees[dbids.indexOf(cmd[1])], moodResult)
					}
					if (damageArray.length === 0) {damageArray.push("none")}
						let wtime = Math.floor((currentAbno.peoutput/2)*10)/10
						mssage.edit("\n```mb\n ⚙️ | User " + curruser.tag + " is working " + cmd[3] + " on " + currentAbno.name + "\n```" + `	Currently working, this will take approximately ${wtime} seconds.`)
						await wait(wtime*500)
						//console.log("ARR length: " + arr.length)
						if ((Number(curruser.hp) <= 0) || (Number(curruser.sp) <= 0))
						{curruser.dead = 1; dbployees[dbids.indexOf(cmd[1])].dead = 1}
						if (curruser.dead === 0) {
						ppe = ""
						if (ppeboxes > 0) {ppe = `\n	Pure (wild card) PE boxes: ${ppeboxes}`}
						mssage.edit("\n```mb\n ⚙️ | User " + curruser.tag + " is working " + cmd[3] + " on " + currentAbno.name + "\n```" + `	Work complete!\n	PE boxes: ${peboxes}	\n	Result: ${mood}\n	NE boxes: ${neboxes}  ${ppe}\n	Remaining HP:	${dbployees[dbids.indexOf(curruser.id)].hp.toFixed(1)} ${jn.health}\n	Remaining SP:	${dbployees[dbids.indexOf(curruser.id)].sp.toFixed(1)} ${jn.sanity}\n	Damage taken: ${damageArray.join(", ")}.`)
						connection.query("UPDATE `employees` SET `balance` = '" + (Number(curruser.balance) + ppeboxes) + "' WHERE `employees`.`userid` = '" + curruser.id + "';", function (err, result) {if (err) throw err})
						bumpBoxes(peboxes, cmd[2], curruser.id)
						bumpSubpoint(curruser.id, respectiveStat, (Math.ceil(peboxes/10)*Math.pow(2, jn.risk.indexOf(currentAbno.risk))))
						dbployees[dbids.indexOf(cmd[1])].balance = dbployees[dbids.indexOf(cmd[1])].balance + ppeboxes
						}
						else {mssage.edit("\n```mb\n ⚙️ | User " + curruser.tag + " is working " + cmd[3] + " on " + currentAbno.name + "\n```" + `	Work incomplete... You have died. Lost (WIP)\n	Remaining HP:	${Math.floor(dbployees[dbids.indexOf(curruser.id)].hp*1000)/1000} ${jn.health}\n	Remaining SP:	${Math.floor(dbployees[dbids.indexOf(curruser.id)].sp*1000)/1000} ${jn.sanity}\n	Damage taken: ${damageArray.join(", ")}.`)}	
						dbployees[dbids.indexOf(cmd[1])].working = 0
				}
				
				asyncEdit(msg, progressBarStorage)
		
						
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
			msg.reply("Unrecognized command. Type in !help to get the list of all available commands.")
			
		}
		
		// Quote command
		if (cmd[0] === '!quote') 
		{
			// If the command includes an argument, the standart randomization is overridden
			if (cmd[1]) { 
			if (checkSymbols(cmd[1], nmbrs)) {
				x1 = cmd[1]
				// If the argument is beyond the amount of quotes currently available, apologise and stop.
				if (x1 > qte.length) {
					msg.reply("Sorry, only " + qte.length + " quotes are currently available.")
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
				case "upd":
					updData()
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
				case "boxes":
					dbployees.forEach(e => {
						console.log(e.tag + " " + e.balancespecific)
					})
					break
				case "clearbase":
					dbployees.forEach((e, i) => {
						let suits = e.inventorys.split("|")
						let weapons = e.inventoryw.split("|")
						console.log(e.tag + " " + e.inventorys + " " + e.inventoryw)
						console.log(e.tag + " " + suits + " " + suits[0] + " " + weapons)
						if (suits[0] === "0") {suits.shift()}
						if (weapons[0] === "0") {weapons.shift()}
						dbployees[i].inventorys = suits.join("|")
						dbployees[i].inventoryw = weapons.join("|")
					})
					break
				case "emojisraw":
					console.log(DELTAS.emojis)
					break
				case "dbase1":

						connection.query("SELECT * FROM users", function (err, result) {

							console.log(result)
							if (err) throw err;

					})
					
					break
				case "dbase2":

						connection.query(`SELECT ${cmd[2]} FROM users`, function (err, result) {

							console.log(result)
							if (err) throw err
					})
				case "boxbroke":
					dbployees[dbids.indexOf('312299633474928642')].balancespecific = dbployees[0].balancespecific
					break
				case "boxbump":
					bumpBoxes(Number(cmd[2]), cmd[3], cmd[4])
					break
				case "crash":
					updData()
					client.destroy(process.env.BOT_TOKEN)
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
				let uid = "" //
				if (cmd[4] != undefined) {uid = cmd[4]} else {uid = "143261987575562240"}
					let tempval = cmd[3]
					if ((cmd[2] === "hp") || (cmd[2] === "sp")) {tempval = Number(cmd[3]).toFixed(1)}
					if ((cmd[2] === "dead") || (cmd[2] === "working")) {tempval = Number(cmd[3])}
					let keys = Object.keys(dbployees[dbids.indexOf(uid)])
					let val = Object.values(dbployees[dbids.indexOf(uid)])
					dbployees[dbids.indexOf(uid)][cmd[2]] = tempval
					updData()
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
	if ((ch = DELTAS.channels.get('653538398681825300')) || (ch = DELTAS.channels.get('654361755857846303'))) {
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
				if (cmd[2] != "list") {
				console.log(dbployees[dbids.indexOf(msg.author.id)].tag)
					if (abn.lista.includes(cmd[2])) {
					if (jn.abnWorkable.includes(cmd[2])) {
					if (jn.workOrders.includes(cmd[3])) {
					if (dbployees[dbids.indexOf(msg.author.id)].working === 0) {
					if (dbployees[dbids.indexOf(msg.author.id)].dead === 0) {
						let effects = dbployees[dbids.indexOf(msg.author.id)].effects.split("|")
						let effectDead = false
						let effectDeathCause = ""
						let onCooldown = false
						let cdVal = 0
						effects.forEach(e => {
							if (fn.effects.deathOnWork(dbployees[dbids.indexOf(msg.author.id)], cmd[2].toLowerCase())[0] === true) {
								effectDead = true
								effectDeathCause = fn.effects.deathOnWork(dbployees[dbids.indexOf(msg.author.id)], cmd[2].toLowerCase())[2]
							}
							if (fn.effects.workCD(dbployees[dbids.indexOf(msg.author.id)]) === true) {
								onCooldown = true
								if (e.startsWith("2/")) {
								cdVal = Number(e.split("/")[1])
								}
							}
						})
					if (onCooldown === false) {
					if (effectDead === false) {
						ch.send("abnworkrequest " + msg.author.id + " " + cmd[2] + " " + cmd[3])
					} else {
						dbployees[dbids.indexOf(msg.author.id)].dead = 1
						dbployees[dbids.indexOf(msg.author.id)].hp = 0
						dbployees[dbids.indexOf(msg.author.id)].sp = 0
						dbployees[dbids.indexOf(msg.author.id)].effects = "null"
						msg.reply("you have died. Cause of death: " + effectDeathCause)
					}
					} else msg.reply("you are still on a cooldown. " + `(~${cdVal*5 + 5} seconds)`)
					} else msg.reply("error: you are dead.")
					} else msg.reply("error: you are already currently working on an abnormality.")
					} else msg.reply("error: incorrect work order. Orders: instinct, insight, attachment, repression.")
					} else msg.reply("error: work on the specified abnormality unavailable. (!lc w list)")
					} else msg.reply("error: incorrect abnormality code specified or specified abnormality unavailable. (!lc w list)")
					} else msg.reply("currently available abnormalities: " + jn.abnWorkableUpperCase.join(", ") + ".")
					break
				case "p":
				case "profile":
					if (cmd[2] && (cmd[2].startsWith("<@") || cmd[2].startsWith("<!@") || cmd[2].startsWith("<@!"))) {
						cuid = ""
						cmd[2].split("").forEach(c => {
							if (nmbrs.includes(c)) {cuid += c}
						})
						curruser = dbployees[dbids.indexOf(cuid)]//
					} else {curruser = dbployees[dbids.indexOf(msg.author.id)]}
								let effectArr = ["none"]
								if ((curruser.effects != "null") && (curruser.effects != "") && (curruser.effects != undefined)) {
									effectArr = []
								curruser.effects.split("|").forEach(eff => {
									let waittime = ""
									if (Number(eff.split("/")[1])*5 > 60) {
										waittime = ((Number(eff.split("/")[1])*5)/60).toFixed(1) + " minutes"
									} else {waittime = "~" + (Number(eff.split("/")[1])*5 + 5) + " seconds"}
									effectArr.push(eff.split("/")[2] + ` (${waittime})`)
								})
								}
								//console.log("Curruser ID (profile): " + curruser.id)
								let deathArr = ["alive", "dead"] 
								let ssp = bumpSubpoint(curruser.id)
								eqct = [curruser.suit, curruser.weapon]
								// [Suit, Weapon]
								gearc = [gear.suits[eqct[0]], gear.weapons[eqct[1]]]
								stats = [curruser.fortitude, curruser.prudence, curruser.temperance, curruser.justice]
								console.log(`F${stats[0]} P${stats[1]} T${stats[2]} J${stats[3]}`)
								wepd = `${gearc[1].damage[0]}-${gearc[1].damage[1]} `
								for (i = 0; i < 4; i++) {
									if (gearc[1].dtype[i] > 0) {wepd += jn.dtype[i]}
								}
								ch.send("\n```mb\n 📋 | Showing stats for user " + curruser.tag + "\n```" + `		LV ${statLVL(stats[0])} ${jn.fortitude} ${stats[0]}			LV ${statLVL(stats[1])} ${jn.prudence} ${stats[1]}\n		LV ${statLVL(stats[2])} ${jn.temperance} ${stats[2]}			LV ${statLVL(stats[3])} ${jn.justice} ${stats[3]}\nProgress towards the next stat points:\n		${jn.fortitude} ${ssp[0]} / ${(jn.statLevels.indexOf(statLVL(stats[0]))+1)*16}		${jn.prudence} ${ssp[1]} / ${(jn.statLevels.indexOf(statLVL(stats[1]))+1)*16}\n		${jn.temperance} ${ssp[2]} / ${(jn.statLevels.indexOf(statLVL(stats[2]))+1)*16}		${jn.justice} ${ssp[3]} / ${(jn.statLevels.indexOf(statLVL(stats[3]))+1)*48}\n\n	Current effects: ${effectArr.join(", ")}.\n		Currently:	${deathArr[Number(curruser.dead)]}.\n		HP: ${Number(curruser.hp).toFixed(1)}${jn.health}		SP: ${Number(curruser.sp).toFixed(1)}${jn.sanity}\n\n		Suit: ${emoji(gearc[0].level.toLowerCase(), ESERV)} ${gearc[0].name}   -   ${gearc[0].resistance[0]} ${jn.dtype[0]}	${gearc[0].resistance[1]} ${jn.dtype[1]}	${gearc[0].resistance[2]} ${jn.dtype[2]}	${gearc[0].resistance[3]} ${jn.dtype[3]}\n		Weapon: ${emoji(gearc[1].level.toLowerCase(), ESERV)} ${gearc[1].name}   -   ${wepd}`)
								if (err) throw err
				break 
				case "i":
				case "inv":
				case "inventory":
					msg.delete(1)
							curruser = dbployees[dbids.indexOf(msg.author.id)]
							invs = "Suit"
							invw = "Riot Stick"
							invsarr = []
							invwarr = []
							ainvs = [{"name": gear.suits[0].name, "id": 0}]
							ainvw = [{"name": gear.weapons[0].name, "id": 0}]
							ainvsd = [0]
							ainvwd = [0]
							console.log(`inventorys ${curruser.inventorys}`)
							if (curruser.inventorys.split("|")[0] != "") {
							invs += ", "
							curruser.inventorys.split("|").forEach(id => {
								if (gear.suits[id] != undefined) {
								ainvs.push({"name": gear.suits[Number(id)].name, "id": Number(id)})
								ainvsd.push(Number(id))
								invsarr.push(gear.suits[id].name)
								}
							}) 
							invs += invsarr.join(", ") + "."
							} else invs += "."
							if (curruser.inventoryw.split("|")[0] != "") {
							invw += ", " 
							console.log(curruser.inventoryw)
							curruser.inventoryw.split("|").forEach(id => {
								if (gear.suits[id] != undefined) {
								ainvw.push({"name": gear.weapons[Number(id)].name, "id": Number(id)})
								ainvwd.push(Number(id))
								invwarr.push(gear.suits[id].name)
								}
							})
							invw += invwarr.join(", ") + "."
							} else invw += "."
						ch.send("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```" + `		${jn.pebox} PPE Boxes: ${curruser.balance}\n\n        Suits:	${invs}\n        Weapons:	${invw}\n\nType in 'equip' to open the equip menu, 'discard' to open the equipment removal menu, 'exit' to leave.`).then(menu2 => {
						invmenu = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { max: 1, time: 20000 })
						invmenu.on('collect', cmsg => {
							menumsg = menu2
							c1msg = cmsg.content.toLowerCase()
							let effects = curruser.effects.split("|")
							if (c1msg === "equip") {
								function checkEffect(eff) {
									if (eff.startsWith("1/")) {return true}
									else {return false}
								}
								if (effects.every(eff => {
									return (eff.startsWith("1/") === false)
								})) {
								menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Equip suit or weapon?")
								ch.awaitMessages(m => m.author.id === curruser.id, { max: 1, time: 15000 })
								.then(m => {
								if (m.array()[0].content === "suit") {
									if (ainvs.length > 1) {
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
								ch.awaitMessages(m => m.author.id === msg.author.id, { max: 1, time: 15000 })
									.then(m => {
										if (checkSymbols(m.array()[0].content, nmbrs)) {
											if (ainvsd.includes(Number(m.array()[0].content) - 1)) {
												equpd = (Number(m.array()[0].content) - 1).toString()
												fn.effectApplication['egoChange'](dbployees[dbids.indexOf(curruser.id)], jn.risk.indexOf(gear.suits[equpd].level))
												console.log("EQUPD: " + equpd)
												m.delete(1)
												dbployees[dbids.indexOf(curruser.id)].suit = equpd
												menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Equipped " + `${emoji(gear.suits[equpd].level.toLowerCase(), ESERV)} ${gear.suits[equpd].name}   -   ${gear.suits[Number(m.array()[0].content) - 1].resistance[0]} ${jn.dtype[0]}	${gear.suits[Number(m.array()[0].content) - 1].resistance[1]} ${jn.dtype[1]}	${gear.suits[Number(m.array()[0].content) - 1].resistance[2]} ${jn.dtype[2]}	${gear.suits[Number(m.array()[0].content) - 1].resistance[3]} ${jn.dtype[3]}`) 
												menumsg.delete(8000)
												
											} else {menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: specified suit unavailable."); menumsg.delete(2000)}
										} else {menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: invalid choice."); menumsg.delete(2000)}
									})
									.catch(console.error)
								} else msg.reply("you only have the default suit.")
								} else
								if (m.array()[0].content === "weapon") {
									if (ainvw.length > 1) { 
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
												fn.effectApplication['egoChange'](dbployees[dbids.indexOf(curruser.id)], jn.risk.indexOf(gear.weapons[equpd].level))
												console.log("EQUPD: " + equpd)
												wepd = `${gear.weapons[Number(m.array()[0])-1].damage[0]} - ${gear.weapons[Number(m.array()[0])-1].damage[1]} `
												for (i = 0; i < 4; i++) {
													if (gear.weapons[Number(m.array()[0].content) - 1].dtype[i] > 0) {wepd += jn.dtype[i]}
												}
												dbployees[dbids.indexOf(curruser.id)].weapon = equpd
												msg.delete(1) 
												menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Equipped " + `${emoji(gear.weapons[equpd].level.toLowerCase(), ESERV)} ${gear.weapons[equpd].name}   -   ${wepd}`) 
												menumsg.delete(8000)
												
											} else {msg.delete(1); menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: specified weapon unavailable."); menumsg.delete(2000)}
										} else {msg.delete(1); menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Error: invalid choice."); menumsg.delete(2000)}
									})
									.catch(console.error)
								} else msg.reply("you only have the default weapon.")
								} else
								msg.reply("error: incorrect response.")
								})
								.catch(console.error)
							} else msg.reply("error: cannot change EGO equipment again yet. Try again later.")
							} else if (c1msg === "discard") {
								menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Discard suit or weapon?")
								ch.awaitMessages(m => m.author.id === curruser.id, { max: 1, time: 15000 })
								.then(m => {
								if (m.array()[0].content === "suit" || m.array()[0].content === "weapon") {

									switch (m.array()[0].content) {
										case "suit":
										if (ainvs.length > 1) {
										inv2 = ""
										ainvs.shift()
										ainvsd.shift()
										ainvs.forEach(s => {
											inv2 += s.name + ` (${Number(s.id) + 1})`
											if (ainvs.indexOf(s) < (ainvs.length - 1)) {inv2 += ", "} else {inv2 += "."}
										})
										menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "	Choose the suit to discard: " + inv2)
										ch.awaitMessages(m => m.author.id === curruser.id, { max: 1, time: 15000 })
										.then(m => {
											if (checkSymbols(m.array()[0].content, nmbrs)) {
											if (ainvsd.includes(Number(m.array()[0].content) - 1)) {
												equpd = (Number(m.array()[0].content) - 1)
												if (Number(curruser.suit) === equpd) {dbployees[dbids.indexOf(curruser.id)].suit = 0}
												let newinv = ainvsd.map(function(i){if (Number(i) != equpd) return i})
												console.log(equpd + " " + typeof(equpd) + " " + ainvsd.join("|") + " " + newinv.join("|"))
												let newinvtext = ""
												if (newinv.length > 1) {newinvtext = newinv.join("|")} else newinvtext = newinv[0]
												dbployees[dbids.indexOf(curruser.id)].inventorys = newinvtext
												menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Discarded " + `${emoji(gear.suits[equpd].level.toLowerCase(), ESERV)} ${gear.suits[equpd].name}.`) 
											} else msg.reply("error: you do not have that suit.")
											} else msg.reply("error: invalid choice.")
										})
										} else msg.reply("you only have the default suit.")
										break
										case "weapon":
										if (ainvw.length > 1) {
										inv2 = ""
										ainvw.shift()
										ainvwd.shift()
										ainvw.forEach(s => {
											inv2 += s.name + ` (${Number(s.id) + 1})`
											if (ainvw.indexOf(s) < (ainvw.length - 1)) {inv2 += ", "} else {inv2 += "."}
										})
										menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "	Choose the weapon to discard: " + inv2)
										ch.awaitMessages(m => m.author.id === curruser.id, { max: 1, time: 15000 })
										.then(m => {
											if (checkSymbols(m.array()[0].content, nmbrs)) {
											if (ainvwd.includes(Number(m.array()[0].content) - 1)) {
												equpd = (Number(m.array()[0].content) - 1).toString()
												if (Number(curruser.weapon) === equpd) {dbployees[dbids.indexOf(curruser.id)].weapon = 0}
												let newinv = ainvwd.map(function(i){if (Number(i) != equpd) return i})
												console.log(equpd + " " + typeof(equpd) + " " + ainvwd.join("|") + " " + newinv.join("|"))
												if (newinv.length > 1) {newinvtext = newinv.join("|")} else newinvtext = newinv[0]
												dbployees[dbids.indexOf(curruser.id)].inventoryw = newinvtext
												menumsg.edit("\n```mb\n 📦 | Showing inventory of " + curruser.tag + "\n```\n" + "		Discarded " + `${emoji(gear.weapons[equpd].level.toLowerCase(), ESERV)} ${gear.weapons[equpd].name}.`)
											} else msg.reply("error: you do not have that suit.")
											} else msg.reply("error: invalid choice.")
										})
										} else msg.reply("you only have the default weapon.")
										break
									}
									
								}
								})//
							} else if (c1msg === "exit") {menumsg.edit("Exited the menu.")}
							else msg.reply("error: incorrect response.")
			})})
					
					break
				case "info":
					if (msg.member.roles.map(r => r.name).includes("Employees") === false) {
						msg.reply("To get assigned to a team, type in !lc assign (Team name).")
						
					} else {msg.reply(`Type in "!lc p/!lc profile" to see your profile. It displays your stats, progress towards the next stat increase, current HP and SP and your equipped gear.\n!lc i/!lc inventory" to see your inventory. It displays your amount of pe and ppe boxes and all of your gear`)}
					
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
							databaseThing()
							//updData()
						} else {msg.reply("error: incorrect team name. Example: !lc assign Extraction Team")}
					} else {msg.reply("you can only work in one team at a time. Leave your team (!lc leave) if you want to join another team.")}
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
					} else {msg.reply("captains cannot simply leave their team! (!lc captain resign)")}
					break
				case "ex":
				case "extraction":
				curruser = dbployees[dbids.indexOf(msg.author.id)]
				ch.send("\n```mb\n 📤 | Welcome to the extraction hub, employee " + curruser.tag + ".\n```\n" + `	Please input the code of the abnormality, EGO equipment of which you wish to extract.`)
				.then(menumsg => {
					const exmenu = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { max: 1, time: 30000 })
					exmenu.on('collect', m => {
					//ch.awaitMessages(m => m.author.id === curruser.id, { max: 3, time: 10000 })
					//.then(m => {
						if (jn.abnWorkable.includes(m.content.toLowerCase())) {
							let currShopAbno = m.content.toLowerCase()
							let abnoCodes = []
							let abnoBoxes = []
							dbployees[dbids.indexOf(msg.author.id)].balancespecific.split(" ").forEach(m => {
								abnoCodes.push(m.split("|")[0])
								abnoBoxes.push(m.split("|")[1])
							})
							//console.log(abn.abn[abn.lista.indexOf(m.content.toLowerCase())].name)
							var curentAbno2 = abn.abn[abn.lista.indexOf(m.content.toLowerCase())]
							//console.log(curentAbno2)
							let currentShop = {"boxes": abnoBoxes[abnoCodes.indexOf(m.content.toLowerCase())], "name": curentAbno2.name, "gear": [gear.suits[Number(abn.abn[abn.lista.indexOf(m.content.toLowerCase())].ego)], gear.weapons[Number(abn.abn[abn.lista.indexOf(m.content.toLowerCase())].ego)]]}
							console.log(currentShop)
							wepd = `${currentShop.gear[1].damage[0]} - ${currentShop.gear[1].damage[1]} `
							for (i = 0; i < 4; i++) {
								if (currentShop.gear[1].dtype[i] > 0) {wepd += jn.dtype[i]}
							}
							menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + curruser.tag + ".\n	Extraction of EGO: " + `${currentShop.name}` + "```\n" + `	Suit:	${emoji(currentShop.gear[0].level.toLowerCase(), ESERV)} ${currentShop.gear[0].name}  -  ${currentShop.gear[0].resistance[0]} ${jn.dtype[0]} ${currentShop.gear[0].resistance[1]} ${jn.dtype[1]} ${currentShop.gear[0].resistance[2]} ${jn.dtype[2]} ${currentShop.gear[0].resistance[3]} ${jn.dtype[3]}   -   ${currentShop.gear[0].cost} ${jn.pebox}\n	Weapon:	${emoji(currentShop.gear[0].level.toLowerCase(), ESERV)} ${currentShop.gear[1].name}  -  ${wepd}   -   ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${curruser.balance} PPE boxes.\n	Type in 'suit' or 'weapon' to purchase.`)
							ch.awaitMessages(msg2 => msg2.author.id === msg.author.id, { max: 1, time: 30000 })
							.then(msg2 => {
								//console.log(msg2)
								let price = 0
								let priceFin = 0
								let choice = msg2.array()[0].content.toLowerCase()
								let respinv
								if((choice === "suit") || (choice === "weapon")) {
								if ((curruser.inventorys.split("|").length + curruser.inventoryw.split("|").length) < 3) {
								console.log(choice)
								switch (choice) {
									case "suit":
										price = currentShop.gear[0].cost
										respinv = curruser.inventorys
										break
									case "weapon":
										price = currentShop.gear[1].cost
										respinv = curruser.inventoryw
										break
								}
								let bAbnos = []
								let bBals = []
								bumpBoxes(0, "O-03-03", curruser.id).forEach(a => {
									bAbnos.push(a[0])
									bBals.push(a[1])
								})
								//console.log(typeof(Number(currentShop.boxes)) + " " + Number(currentShop.boxes) + " " + typeof(curruser.balance))
								let totalBalance = Number(currentShop.boxes) + curruser.balance
								console.log(price + " " + typeof(price))
								//console.log(typeof(totalBalance) + " " + totalBalance)
								if (totalBalance >= Number(price)) {
								let prices = []
								if (Number(currentShop.boxes) >= price) {prices = [price, 0]}
								else {prices = [Number(currentShop.boxes), price - Number(currentShop.boxes)]}
								console.log(prices)
								if (prices[1] <= price/4) { 
								let tmptxt = ""
									if (prices[1] > 0) {tmptxt = ` and ${prices[1]} PPE boxes`}
								menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + curruser.tag + ".\n	Extraction of EGO:"  + `${currentShop.name}` + "```\n" + `	Are you sure? This will cost you ${prices[0]} PE boxes${tmptxt}. (*y*/*n*)`)
								ch.awaitMessages(msg2 => msg2.author.id === msg.author.id, { max: 1, time: 30000 })
								.then(msg3 => {
									if (msg3.array()[0].content.toLowerCase() === "y")
										if (respinv.split("|").includes(currentShop.gear[0].id) === false) {
										let tmptxt2 = ""
										dbployees[dbids.indexOf(curruser.id)].balance = dbployees[dbids.indexOf(curruser.id)].balance - prices[1]
										bumpBoxes(-(prices[0]), currShopAbno, curruser.id)
										if (choice === "suit") {
											let spl = dbployees[dbids.indexOf(curruser.id)].inventorys.split("|")
											spl.push(currentShop.gear[0].id)
											dbployees[dbids.indexOf(curruser.id)].inventorys = spl.join("|"); 
											tmptxt2 = `${emoji(currentShop.gear[0].level.toLowerCase(), ESERV)} ${currentShop.gear[0].name}  -  ${currentShop.gear[0].resistance[0]} ${jn.dtype[0]} ${currentShop.gear[0].resistance[1]} ${jn.dtype[1]} ${currentShop.gear[0].resistance[2]} ${jn.dtype[2]} ${currentShop.gear[0].resistance[3]} ${jn.dtype[3]}`}
										else {
											let spl = dbployees[dbids.indexOf(curruser.id)].inventoryw.split("|")
											spl.push(currentShop.gear[0].id)
											dbployees[dbids.indexOf(curruser.id)].inventoryw = spl.join("|"); 
											tmptxt2 = `${emoji(currentShop.gear[1].level.toLowerCase(), ESERV)} ${currentShop.gear[1].name}  -  ${wepd}`}
										menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + curruser.tag + ".\n	Extraction of EGO:"  + `${currentShop.name}` + "```\n" + `	You have purchased ${tmptxt2}.`)
										} else {msg.reply("error: you already have that item.")}
									
								})
								} else {msg.reply("error: can only use PPE to pay a quarter of the price.")}
								} else {msg.reply("error: not enough boxes.")}
								} else msg.reply("error: your inventory is full. You can only have three items (suits and weapons) in your inventory. Discard one in the inventory menu.")
								} else if (choice === "exit") {menumsg.edit("Exited the menu.")}
							})
						} else msg.reply("error: incorrect abnormality code or abnormality unavailable.").then(reply => reply.delete(2000))
					})
					})
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
								} else {msg.reply("error: invalid or missing argument. Usage: !lc captain vote @person"); break}
						} else {msg.reply("an election is in process currently!"); break}
						} 

					// Captain commands
					} else if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						switch (cmd[2]) {
							case "vote":
								msg.reply("you are your department's captain. If you want someone else to become the captain, type !lc captain resign first.")
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
				break
				}

				default:
					msg.reply("error: unrecognized command. Type in !help lc to get info on the command.")
					break
			}
		} else {msg.reply("You are not currently assigned to a team. Contact a Sephirah to get assigned (!lc info).")}
	} else msg.reply("the appropriate channels for the use of !lc commands are <#653538398681825300> and <#654361755857846303>.")
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
				.setFooter("EGO: " + "this doesn't work currently")
			ch.send({embed})
		.catch(console.error)
		} else {msg.reply("Sorry, info on the specified abnormality is unavailable. Perhaps you should help us add it? If so, post your suggestion in the suggestion-box according to the rules stated in a pinned message.")}
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
	}
})
	
// THIS  MUST  BE  THIS  WAY
// NO TOUCHING
//______________________________\\/
	client.login(process.env.BOT_TOKEN)})