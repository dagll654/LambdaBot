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
	const b3ck = "```"
	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const nccideproles = jn.nccideproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const qte2 = "Lambdadelta Quote #"
	const cmds = jn.cmds
	var today = new Date()
	var employees = []
	var dbployees = []
	var dbids = []
	var abnos = []
	var dbnos = []
	 var today = new Date()
	 var employees = []
	 var dbployees = []
	 var dbids = []
	 x = 0 
	 x1 = 0
	 dbg1 = 0
	 dbvars = [0, 0, 0, 0, 0, 4]
	 dbvnames = ['debugduck', 'debugsay', 'debugvote', 'dbheal', 'stop', 'efflog']
	 quotelog = []
	 votingteam = ""
	 voting = 0	
	 efflog = 0

	function wait(msc) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('resolved')
			}, msc)
		})
	}
	
	// Return the level of a stat
	function statLVL(stat) {
		if (stat < 30) {return "I"}
		else if (stat < 45) {return "II"}
		else if (stat < 65) {return "III"}
		else if (stat < 85) {return "IV"}
		else if (stat < 100) {return "V"}
		else {return "EX"}
	}
	
	function abno(code) {
		return abn.abn[abn.lista.indexOf(code.toLowerCase())]
	}
	
	function getBox(emp, abn) {
		let balances = emp.balancespecific.split(" ")
		let bal = balances.find(b => {return b.startsWith(abn)})
		let bal2 = bal.split("|")
		return bal2[1]
	}
	
	function invFullness(emp) {
		let iN = 0
		if ((emp.inventorys != undefined) && (emp.inventorys != 'undefined') && (emp.inventorys != '')) {
			emp.inventorys.split("|").forEach(bleh => {if ((bleh != undefined) && (bleh != 'undefined')) {iN++}})
		}
		if ((emp.inventoryw != undefined) && (emp.inventoryw != 'undefined') && (emp.inventoryw != '')) {
			emp.inventoryw.split("|").forEach(bleh => {if ((bleh != undefined) && (bleh != 'undefined')) {iN++}})
		}
		return iN	
	}
	
	function statLVN(stat) {
		if (stat < 30) {return 1}
		else if (stat < 45) {return 2}
		else if (stat < 65) {return 3}
		else if (stat < 85) {return 4}
		else {return 5}
	}
	
	var wait = ms => new Promise((r, j)=>setTimeout(r, ms))
	
	function employee(empID) {
		return dbployees[dbids.indexOf(empID)]
	}

	// Change an employee's subpoint (and award a stat-up if needed)
	function bumpSubpoint(id, stat = "fortitude", val = 0) {
		curruser = dbployees[dbids.indexOf(id)]
		let expmod = 0
		//console.log("Curruser ID (bumpStat): " + id)
		if (curruser.bufflist != undefined) {
		if (curruser.bufflist.length != undefined && curruser.bufflist.length > 0) {
		if (curruser.bufflist.split("|").some(b => b.startsWith("teamtr"))) {
			let trainBuff = curruser.bufflist.split("|").find(b => b.startsWith("teamtr")).split("/")
			if (trainBuff[1] === '0') {expmod = 2}
			else {expmod = 4}
		}}}
		let statIndex = jn.stats.indexOf(stat.toLowerCase())
		let subStatArr = curruser.subpoints.split("|")
		let mult = 1
		subStatArr[statIndex] = Number(subStatArr[statIndex]) + val
		if (statIndex === 3) {mult = 3}

		if (subStatArr[statIndex] >= ((jn.statLevels.indexOf(statLVL(curruser[stat.toLowerCase()])) + 1) * (16 - expmod) * mult)) {
			subStatArr[statIndex] = subStatArr[statIndex] - (jn.statLevels.indexOf(statLVL(curruser[stat.toLowerCase()])) + 1) * (16-expmod) * mult
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
	
	function empLVL(statcount) {
		if (statcount < 6) {return "I"}
		else if (statcount < 9) {return "II"}
		else if (statcount < 12) {return "III"}
		else if (statcount < 16) {return "IV"}
		else {return "V"}
	}
	
	// Gifts:
	// 0/brooch1 | 1/brooch2 | 3/head1 | 4/head2 | 5/mouth1 | 6/mouth2 | 7/hand1 | 8/hand2 | 9/eye | 10/face | 11/cheek | 12/back1 | 13/back2
	
	//class classAbno {}
	
	// Function for pushing results into dbployees, so I don't have to change the damn thing everywhere
	class emp {
		constructor(id, tag, hp = 1700, sp = 1700, fortitude = 17, prudence = 17, temperance = 17, justice = 17, suit = "0", weapon = "0", inventorys, inventoryw, working = 0, dead = 0, balance = 0, balancespecific = "", subpoints = "0|0|0|0", effects = 'null', buffs = "0|0|0|0", defensebuffs = "1|1|1|1", bufflist, tjtime = Date.now(), statlimit = 100, gifts = 0) {
			this.id = id
			this.tag = tag
			this.hp = hp/100
			this.sp = sp/100
			this.fortitude = fortitude
			this.prudence = prudence
			this.temperance = temperance
			this.justice = justice
			this.suit = suit
			this.weapon = weapon
			this.inventorys = inventorys
			this.inventoryw = inventoryw
			this.working = Number(working)
			this.dead = Number(dead)
			this.balance = Number(balance)
			this.balancespecific = balancespecific
			this.subpoints = subpoints
			this.effects = effects
			this.buffs = buffs
			this.defensebuffs = defensebuffs
			this.bufflist = bufflist
			this.tjtime = tjtime
			this.statlimit = statlimit
			this.gifts = gifts
		}
		get fortL() {return Number(this.fortitude) + Number(this.buffs.split("|")[0])}
		get prudL() {return Number(this.prudence) + Number(this.buffs.split("|")[1])}
		get tempL() {return Number(this.temperance) + Number(this.buffs.split("|")[2])}
		get justL() {return Number(this.justice) + Number(this.buffs.split("|")[3])}
		get stats() {return [this.fortL, this.prudL, this.tempL, this.justL, statLVN(this.fortL)+statLVN(this.prudL)+statLVN(this.tempL)+statLVN(this.justL)]}
	}
	function fdbPush(e, arr = dbployees) {
		arr.push(new emp(e.userid, e.usertag, e.hp, e.sp, e.fortitude, e.prudence, e.temperance, e.justice, e.suit, e.weapon, e.inventorys, e.inventoryw, e.working, e.dead, e.balance, e.balancespecific, e.subpoints, e.effects, e.buffs, e.defensebuffs, e.bufflist, e.tjtime, 100, e.gifts))
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
	
	async function queryAndWait(q, connection) {
		await wait(100).then(p => {
		connection.query(q, function (err, result) {if (err) throw err})
		})
	}
	
	// Tick down any acting effects
	client.setInterval(function(){
		efflog = efflog + 1
		dbployees.forEach(e => {
			if (e === undefined) return 0
			let effectsNew = []
			if ((e.effects != "null") && (e.effects != undefined)){
			let effects = e.effects.split("undefined").join("").split("|")
			//if (e.id === '143261987575562240') {console.log("Quack's effects before shenanigans: "); console.log(e.effects)}
			
			effects.forEach(eff => {
				let effArr = eff.split("/")
				if ((e.dead === 1 || e.dead === '1') && effArr[0] != "1") eff = 'null'
				if (effArr[1] != "inf") {
				if (Number(effArr[1]) > 0) {
				
				if (e.dead === 1 || e.dead === '1') {
					if (effArr[0] === "1") effArr[1] = Number(effArr[1]) - 1
					else effArr[1] = 0
				} else effArr[1] = Number(effArr[1]) - 1

				effectsNew.push(effArr.join("/"))
				} else {eff = "null"}
				} else effectsNew.push(eff)
				if ((eff === undefined) || (eff === "")) {eff = "null"}
			})
			e.effects = effectsNew.join("|")
			}
			
			//if (e.id === '143261987575562240') {console.log("Quack's effects after shenanigans: "); console.log(e.effects)}
			if (e.effects === null) e.effects = 'null'
			
			if (e.effects != null) {
			let effectsSplit = e.effects.split("|")
			if ((effectsSplit.length > 1) && ((effectsSplit[0] === undefined)||(effectsSplit[0] === 'undefined')||(effectsSplit[0] === 'null')||(effectsSplit[0] === null))) {
			effectsSplit.shift()
			e.effects = effectsSplit.join("|")
			}
			}
			if (efflog >= dbvars[5]) {
			if (e.effects != "null"){
			console.log(e.tag + " " + e.effects)
			console.log(e.tag + " " + effectsNew)
			}
			}
			if (e.effects === undefined || e.effects === "") {e.effects = "null"}
			if (e.effects.split("|").some(fef => fef.startsWith("0/"))) {e.hp = e.hp + 0.1}
		})
		if (efflog >= dbvars[5]) {efflog = 0}
	}, 1000)
	
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
				if ((prop != "fortL") && (prop != "prudL") && (prop != "tempL") && (prop != "justL") && (prop != "id") && (prop != "stats") && (prop != "statlimit") && (prop != "tag")) {
				let tempval = e[prop]
				if ((prop === "hp") || (prop === "sp")) {tempval = (Number(tempval)*100).toFixed(1); dbployees2[i][prop] = (dbployees2[i][prop]*100).toFixed(1)}
				if (dbployees[i] != undefined) {
				if (dbployees2[i][prop] != tempval) {
					if (prop != "stats") {					
					if (Number(dbployees2[i][prop]) != tempval) {
					pushSmall.push("`" + prop + "` = '" + tempval /*e[prop]*/ + "'")
					//console.log(prop + " " + dbployees2[i][prop] + " " + tempval)
					}
					}
				}
				} else pushSmall.push("`" + prop + "` = '" + tempval /*e[prop]*/ + "'")
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
	
	function databaseAbnos() {
		abnos = []
		jn.abnWorkable.forEach(a => {
		abnos.push({"tag": a, "id": abno(a).ego})
		})
		connection.query("SELECT * FROM `abnormalities`", function (err, result) {
			console.log(result)
			if (err) throw err
		})
	}
	
	function databaseThing() {
		employees = []
		client.guilds.get("607318782624399361").members.forEach(m => {
		if (drFind(m)) employees.push({"id": m.id, "tag": m.user.tag, "team": drFind(m)})
		})
		connection.query("SELECT * FROM `employees`", function (err, result) {
			//console.log(result)
			dbpush = []
			dbployees = []
			dbids = []
			result.forEach(e => fdbPush(e))
			result.forEach(e => dbids.push(e.userid))
			employees.forEach(e => {
				if (dbids.includes(e.id)) {console.log(`Employee ${employees[employees.indexOf(e)].tag} is included!`)}
				else {dbpush.push({"id": e.id, "tag": e.tag})}
			})
			console.log("To push:")
			console.log(dbpush)
			dbpush.forEach(e => {
			var sql = "INSERT INTO employees (userid, usertag, balancespecific, hp, sp) VALUES ('" + e.id + "', '" + e.tag + "', '', '1700', '1700')";
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
				console.log("LOOK AT MY BALLS " + e.tag + " " + bToSend.join(" "))
				e.balancespecific = bToSend.join(" ")
			})
			if (err) throw err


	
	})
}

	
	function healPulse() {
		const DELTAS = client.guilds.get("607318782624399361");
		if (dbvars[3] === 0) {
			dbployees.forEach(e => {
				if (e.working === 0) {
				if (e.hp < e.fortL) {e.hp = Number(e.hp) + Math.ceil(e.fortL/60) + e.fortL/60}
				if (e.hp > e.fortL) {e.hp = Number(e.fortL)}
				let sp = e.sp
				if (e.sp < e.prudL) {e.sp = Number(e.sp) + Math.ceil(e.prudL/60) + e.prudL/60}
				if (e.sp > e.prudL) {e.sp = Number(e.prudL)}
				if ((e.hp === Number(e.fortL)) && (e.sp === Number(e.prudL)) && (Number(e.dead) === 1)) {
					e.dead = 0
				}
				} else {e.working = 0}
				if (drFind(DELTAS.members.get(e.id))) {
					bufflist = []
					if (e.bufflist != undefined) {
					bufflist = e.bufflist.split("|")
					}
					if (bufflist.every(eff => {return (eff.startsWith("team") === false)})) {
						if (e.tjtime != undefined) {
						if ((Date.now() - (e.tjtime - 0))/(1000*60*60*24) > 3) {
							fn.effectApplication['department'](e, drFind(DELTAS.members.get(e.id)), "give")
						} 
						}
					}
					if ((e.tjtime === null) || (e.tjtime === undefined) || (e.tjtime === 'undefined') || (e.tjtime === 'null')) e.tjtime = Date.now()
				}
			})
			console.log("Healed all.")
		}
	}
	
	client.on('guildMemberUpdate', () => {
		const DELTAS = client.guilds.get("607318782624399361");
		async function dipOut(member) {
			await wait(1000)
			await member.removeRole(DELTAS.roles.find(r => r.name === "TO THE RANCH")).catch(console.error)
			return true
		}
		async function dipIn(member) {
			await wait(1000)
			await member.addRole(DELTAS.roles.find(r => r.name === "TO THE RANCH")).catch(console.error)
			return true
		}
		DELTAS.members.forEach(m => {
			let cMember = m
			let LVLRole
			let ChRoles = []
			cMember.roles.forEach(r => {
				if (r.name.startsWith("Level")) LVLRole = {"name": r.name, "id": r.id}
				if (jn.risk.includes(r.name)) ChRoles.push({"name": r.name, "id": r.id})
			})
			ChRoles.push({"name": "none", "id": "none"})
			if (LVLRole === undefined) return
			if (jn.levels.indexOf(LVLRole['name']) != jn.risk.indexOf(ChRoles[0]['name'])) {
				if (ChRoles.length > 0) {
				ChRoles.forEach(r => {
					if (r['id'] != "none") cMember.removeRole(r['id'])
												  .catch(console.error)
				})
				}
				if (cMember.roles.some(r => r.name === "TO THE RANCH") === false) {
				cMember.addRole(DELTAS.roles.find(r => r.name === jn.risk[jn.levels.indexOf(LVLRole['name'])]).id)
					   .catch(console.error)
				}
			}
			if (cMember.roles.some(r => r.name === "TO THE RANCH")) {
			if (cMember.roles.some(r => jn.risk.includes(r.name))) {
			cMember.removeRole(cMember.roles.find(r => jn.risk.includes(r.name)).id)
				   .catch(console.error)
			}
			}
			if (cMember.roles.some(r => r.name === "RANCHDIP")) {
				if (cMember.roles.some(r => r.name === "TO THE RANCH")) dipOut(cMember)
				else dipIn(cMember)
			}
		})
	})

	client.on('ready', () => {
		
	const DELTAS = client.guilds.get("607318782624399361");
	const bch = DELTAS.channels.get("607558082381217851");
	bch.send("Bot started.")
		
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
	
	databaseThing()
		
		// Heal 1/60 of max HP and SP every 1 minute ( = full heal in an hour)
	
	async function healPulser() {
		while(true) {
		healPulse()
		await wait(60000)
		}
	}
	healPulser()
		
	})

	client.on('message', tempbigmessagevaluesoIneveruseitagain => {
	
	const DELTAS = client.guilds.get("607318782624399361")
	const bch = DELTAS.channels.get("607558082381217851")
	const ESERV = client.guilds.get('513660754633949208')
	const bsch = ESERV.channels.get('653572131262693379')
	
	function getUser(getter) {
		let id = ""
		getter.split("").forEach(c => {
			if (nmbrs.includes(c)) {id += c}
		})
		if (id.length === 18) return client.users.get(id)
		else if (client.guilds.get("607318782624399361").members.find(m => {
			if (m.nickname != null) return m.nickname.toLowerCase().startsWith(getter)
					else return false
				}) != undefined)
			return client.guilds.get("607318782624399361").members.find(m => {
			if (m.nickname != null) return m.nickname.toLowerCase().startsWith(getter)
					else return false
				}).user
		else if (client.users.find(u => {return u.tag.toLowerCase().startsWith(getter)}) != undefined)
			return client.users.find(u => {return u.tag.toLowerCase().startsWith(getter)})
		else return undefined
	}
	
	let chPass = 0
	let botPass = 0		
	
	// An array containing all digits, for convenience of comparing
	const nmbrs = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	
	let msg
	const initmsg = tempbigmessagevaluesoIneveruseitagain
	{
		
	tmpmsg = tempbigmessagevaluesoIneveruseitagain // tmpmsg.content.split(" ")[0].slice(2)

	function sudoCheck() {
	if (tmpmsg.content.split(" ")[0] === "sudo") {
		if (tmpmsg.author.id === '143261987575562240') {
		let tcontent = tmpmsg.content.split(" ")
		tcontent.shift()
		tmpmsg.content = tcontent.join(" ")
		chPass = 1
		console.log(`Content: '${tcontent.join(" ")}'`)
		} else (tmpmsg.channel.send(`**${tmpmsg.author.tag}**, ` + "error: you do not have permission to use `sudo`."))
	}
	}
	
	sudoCheck()
	
	let content = tmpmsg.content
	
	while (content.split(" ")[0].slice(0,2) === ">!") {
		content = content.slice(2)
		let cArr = content.split(" ")
		if (getUser(cArr[0]) === client.user || tmpmsg.author.id === '143261987575562240') {
		if (getUser(cArr[0]) != undefined) {
			tmpmsg.author = client.users.get(getUser(cArr[0]).id)
			tmpmsg.member = DELTAS.members.get(getUser(cArr[0]).id)
			botPass = 1
		}} else {initmsg.channel.send(`**${initmsg.author.tag}**, ` + "you do not have permission to use `>!` on that user."); return}
		cArr.shift()
		content = cArr.join(" ")
		tmpmsg.content = content
		msg = tmpmsg
		sudoCheck()
		console.log(content)
	}
	msg = tmpmsg
	
	}

	if ((dbvars[4] === 1) && (msg.author.id != '143261987575562240')) return

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
		
	// was (frick puriora)
	function wait(msc) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('resolved')
			}, msc)
		})
	}	
	
	// Function for increasing the amount of Specific PE Boxes by val on abnormality with code abn for user with id id
	function bumpBoxes(val = 0, abn = "O-03-03", empid) {
		let emp = dbployees[dbids.indexOf(empid)]
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
		dbployees[dbids.indexOf(empid)].balancespecific = bToSend.join(" ")
		return bReturn
	}
	
	// Function for checking if all the elements of arr are included in arr2
	function checkArray(arr, arr2) {
		return arr.every(i => arr2.includes(i));
	}
	
		 // Function for getting an emoji by name
	function emoji(nme, srv = DELTAS, a = false, id = false) {
		if (nme === "none") {return ""}
		if (id === true) {emvar = srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)]}
		else {if (a === true) {emd = "<a:"} else {emd = "<:"}
			emvar = emd + nme + ":" + srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)] + ">"}
		return emvar
	}
	
	function suit(id) {
		let suit = gear.suits[id]
		return (`${emoji(suit.level.toLowerCase(), ESERV)} ${suit.name}  -  ${suit.resistance[0]} ${jn.dtype[0]} ${suit.resistance[1]} ${jn.dtype[1]} ${suit.resistance[2]} ${jn.dtype[2]} ${suit.resistance[3]} ${jn.dtype[3]}`)
	}
	
	function weapon(id) {
		let weapon = gear.weapons[id]
		let wepd = `${weapon.damage[0]} - ${weapon.damage[1]} `
		for (i = 0; i < 4; i++) {
			if (weapon.dtype[i] > 0) {wepd += jn.dtype[i]}
		}
		return (`${emoji(weapon.level.toLowerCase(), ESERV)} ${weapon.name}  -  ${wepd}`)
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
	
	// Roll an x-sided die, even if that makes absolutely no sense in practice
	function roll(sides) {
		return Math.ceil(Math.random() * sides)
	}
	
	// Stand-in function for cleaning inventories
	function invClean() {
		dbployees.forEach(e => {
			let bxd = e.inventorys.split("|")
			let bxdNew = []
			for (i = 0; i < bxd.length; i++) {
				if (bxd[i] != "undefined" && bxd[i] != "") {
					bxdNew.push(bxd[i])
				}
			}
			e.inventorys = bxdNew.join("|")
			let bxdw = e.inventoryw.split("|")
			let bxdwNew = []
			for (i = 0; i < bxdw.length; i++) {
				if (bxdw[i] != "undefined" && bxdw[i] != "") {
					bxdwNew.push(bxdw[i])
				}
			}
			e.inventoryw = bxdwNew.join("|")
		})
	}
	
	// Add an item id to suit/weapon inventory
	function addItemID(emp, inv, id) {
		if ((emp[inv] === undefined) || (emp[inv] === 'undefined') || (emp[inv] === '')) emp[inv] = id
		else if (emp[inv].length === 1) emp[inv] += "|" + id 
		else {
			let splitInv = emp[inv].split("|")
			splitInv.push(id)
			emp[inv] = splitInv.join("|")
		}
	}
	
	// Remove an item id from suit/weapon inventory
	function removeItemID(emp, inv, id) {
		if ((emp[inv] === undefined) || (emp[inv] === 'undefined')) return
		else {
		let bxd = emp[inv].split("|")
		let bxdNew = []
		for (i = 0; i < bxd.length; i++) {
			if (bxd[i] != id) {
				bxdNew.push(bxd[i])
			}
		}
		emp[inv] = bxdNew.join("|")
		}
		invClean()
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

	//if ((msg.author.id === client.user.id) && (msg.embeds.length > 0)) {
	//	yeet(600)
	//}
	
	// If it's the bot's message about starting up fine then delete it in 6 seconds
	if (msg.author.id === '607520778178527246' && deletableReplies.includes(mesc)) {
		yeet(8)
	}
	
	// Work stuff
	function work(arrg, channel) {
		
		let respectiveStat = jn.stats[jn.workOrders.indexOf(arrg[2])]
		fn.effectApplication['fatigue'](dbployees[dbids.indexOf(arrg[0])], (jn.risk.indexOf(abn.abn[abn.lista.indexOf(arrg[1])].risk) + 1))
		fn.effectApplication['workCD'](dbployees[dbids.indexOf(arrg[0])], abn.abn[abn.lista.indexOf(arrg[1])].peoutput)
		dbployees[dbids.indexOf(arrg[0])].working = 1
		let statIndex = jn.workOrders.indexOf(arrg[2])
		let userStat = dbployees[dbids.indexOf(arrg[0])].stats[jn.stats.indexOf(respectiveStat)]
		let userTemp = dbployees[dbids.indexOf(arrg[0])].temperance
		let userStatLevelText = statLVL(userStat)
		let userStatLevel = jn.statLevels.indexOf(userStatLevelText)
		if (userStatLevel > 4) {userStatLevel = 4} 
		let successChance = 0
		let successChancet = (userTemp * 0.002 + abn.abn[abn.lista.indexOf(arrg[1])].workPreferences[statIndex][userStatLevel])*100
		if (successChancet > 95) {successChance = 95} else {successChance = successChancet}
		console.log(`Success chance for ${dbployees[dbids.indexOf(arrg[0])].tag} on ${arrg[1]}: ${successChance}%`)
		if (abn.abn[abn.lista.indexOf(arrg[1])].affstat[0] === true) {
			console.log("Pre-affstat success chance: " + successChance + "%")
			successChance = successChance - fn.affstat(arrg[1], respectiveStat, dbployees[dbids.indexOf(arrg[0])])
			console.log("Post-affstat success chance: " + successChance + "%")
		}
		/*succtext = ("Success chance: " + `${Math.floor(successChance)}%`)
		//msg.edit("\n```mb\n ⚙️ | User " + dbployees[dbids.indexOf(arrg[0])].tag + " is working " + arrg[2] + " on " + abn.abn[abn.lista.indexOf(arrg[1])].name + "\n```" + `\n	${succtext}`)
		let progressBar = ""
		let progressBarOld = ""
		let progressArray = []
		let progressArrayComplex = []
		let progressBarStorage = []*/
		let damageArray = []
		/*for (i = 0; i < (abn.abn[abn.lista.indexOf(arrg[1])].peoutput/2); i++) {
			progressBar += box([0, 0])
			progressArrayComplex.push([0, 0])
		}*/
			let neboxes = 0
			let peboxes = 0
			let ppeboxes = 0
			let rollArr = []
			i = 0
			for (i = 0; i < abn.abn[abn.lista.indexOf(arrg[1])].peoutput; i++) {
				if ((dbployees[dbids.indexOf(arrg[0])].hp > 0) && (dbployees[dbids.indexOf(arrg[0])].sp > 0)) {
				let cRoll = roll(100)
				rollArr.push([cRoll, cRoll > successChance])
				if (cRoll > successChance) {neboxes++; 
					let dmg = (roll(abn.abn[abn.lista.indexOf(arrg[1])].damage[1] - abn.abn[abn.lista.indexOf(arrg[1])].damage[0] + 1) - 1) + abn.abn[abn.lista.indexOf(arrg[1])].damage[0]
					if (abn.abn[abn.lista.indexOf(arrg[1])].dtype[0] === 1) {
						dmg = dmg * rDamage(gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].level, abn.abn[abn.lista.indexOf(arrg[1])].risk, gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].resistance[0]*dbployees[dbids.indexOf(arrg[0])].defensebuffs.split("|")[0])
						dbployees[dbids.indexOf(arrg[0])].hp = dbployees[dbids.indexOf(arrg[0])].hp - dmg
						damageArray.push(dmg.toFixed(2) + " " + jn.dtype[0])
						//console.log("DAMAGE:" + dmg)
					}
					if (abn.abn[abn.lista.indexOf(arrg[1])].dtype[1] === 1) {
						dmg = dmg * rDamage(gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].level, abn.abn[abn.lista.indexOf(arrg[1])].risk, gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].resistance[1]*dbployees[dbids.indexOf(arrg[0])].defensebuffs.split("|")[1])
						damageArray.push(dmg.toFixed(2) + " " + jn.dtype[1])
						dbployees[dbids.indexOf(arrg[0])].sp = dbployees[dbids.indexOf(arrg[0])].sp - dmg
						//console.log("DAMAGE:" + dmg)
					}
					if (abn.abn[abn.lista.indexOf(arrg[1])].dtype[2] === 1) {
						dmg = dmg * rDamage(gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].level, abn.abn[abn.lista.indexOf(arrg[1])].risk, gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].resistance[2]*dbployees[dbids.indexOf(arrg[0])].defensebuffs.split("|")[2])
						damageArray.push(dmg.toFixed(2) + " " + jn.dtype[2])
						dbployees[dbids.indexOf(arrg[0])].hp = dbployees[dbids.indexOf(arrg[0])].hp - dmg
						dbployees[dbids.indexOf(arrg[0])].sp = dbployees[dbids.indexOf(arrg[0])].sp - dmg
						//console.log("DAMAGE:" + dmg)
					}
					if (abn.abn[abn.lista.indexOf(arrg[1])].dtype[3] === 1) {
						dmg = dmg * rDamage(gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].level, abn.abn[abn.lista.indexOf(arrg[1])].risk, gear.suits[Number(dbployees[dbids.indexOf(arrg[0])].suit)].resistance[3]*dbployees[dbids.indexOf(arrg[0])].defensebuffs.split("|")[3])
						damageArray.push(dmg.toFixed(1) + "% " + `(${((dbployees[dbids.indexOf(arrg[0])].fortL/100)*dmg).toFixed(1)}) ` + jn.dtype[3])
						dbployees[dbids.indexOf(arrg[0])].hp -= (dbployees[dbids.indexOf(arrg[0])].fortL/100)*dmg
						//console.log("DAMAGE:" + dmg)
					}
					
				}
				else {
					if (roll(15) === 15) {ppeboxes++; console.log("Rolled a PPE box!")}
					else {peboxes++}
				}

				/*progressArray = []
				for (j = 0; j < (abn.abn[abn.lista.indexOf(arrg[1])].peoutput - (i+1)); j++) {
					progressArray.push(0)
				}
				for (j = 0; j < peboxes; j++) {
					progressArray.unshift(1)
				}
				for (j = 0; j < neboxes; j++) {
					progressArray.push(-1)
				}
				console.log("Progress array normal: " + progressArray)
				j = 0
				start_position: while(true) {
					progressBar += box([progressArray[j*2], progressArray[j*2+1]])
					progressArrayComplex[j] = [progressArray[j*2], progressArray[j*2+1]]
					//console.log("Progress array " + j + " " + progressArrayComplex)
					if (j < (abn.abn[abn.lista.indexOf(arrg[1])].peoutput/2 - 1)) {j++; continue start_position}
							break
					}
				progressBarStorage.push(progressBar)*/
				} else {dbployees[dbids.indexOf(arrg[0])].dead = 1}
				}
				
				async function asyncEdit(mssage) {
					let mood = ""
					let moodResult = 0
					let moodEffectResult = ""
					if ((peboxes + ppeboxes) >= abn.abn[abn.lista.indexOf(arrg[1])].mood[2]) {mood = jn.goodresult; moodResult = 2}
					else if ((peboxes + ppeboxes) >= abn.abn[abn.lista.indexOf(arrg[1])].mood[1]) {mood = jn.normalresult; moodResult = 1}
					else {mood = jn.badresult; moodResult = 0}
					if (abn.abn[abn.lista.indexOf(arrg[1])].effect[0] === true) {
						let effe = fn.effectApplication[abn.abn[abn.lista.indexOf(arrg[1])].ego](dbployees[dbids.indexOf(arrg[0])], moodResult, arrg[2])
						if (effe[0] === true) {
							moodEffectResult = effe[1]
						}
					}
					if (damageArray.length === 0) {damageArray.push("none")}
						let wtime = Math.floor((abn.abn[abn.lista.indexOf(arrg[1])].peoutput/2)*10)/10
						mssage.edit("\n```mb\n ⚙️ | Employee " + dbployees[dbids.indexOf(arrg[0])].tag + " is working " + arrg[2] + " on " + abn.abn[abn.lista.indexOf(arrg[1])].name + "\n```" + `	Currently working, this will take approximately ${wtime} seconds.`)
						await wait(wtime*500)
						//console.log("ARR length: " + arr.length)
						if ((Number(dbployees[dbids.indexOf(arrg[0])].hp) <= 0) || (Number(dbployees[dbids.indexOf(arrg[0])].sp) <= 0))
						{dbployees[dbids.indexOf(arrg[0])].dead = 1; dbployees[dbids.indexOf(arrg[0])].dead = 1}
						if (dbployees[dbids.indexOf(arrg[0])].dead === 0) {
						ppe = ""
						if (ppeboxes > 0) {ppe = `\n	Pure (wild card) PE boxes: ${ppeboxes}`}
						mssage.edit("\n```mb\n ⚙️ | Employee " + dbployees[dbids.indexOf(arrg[0])].tag + " is working " + arrg[2] + " on " + abn.abn[abn.lista.indexOf(arrg[1])].name + "\n```" + `	Work complete!\n	PE boxes: ${peboxes}	\n	Result: ${mood}\n	NE boxes: ${neboxes}  ${ppe}\n	Remaining HP:	${Number(dbployees[dbids.indexOf(dbployees[dbids.indexOf(arrg[0])].id)].hp).toFixed(1)} / ${dbployees[dbids.indexOf(arrg[0])].fortL} ${jn.health}\n	Remaining SP:	${Number(dbployees[dbids.indexOf(dbployees[dbids.indexOf(arrg[0])].id)].sp).toFixed(1)} / ${dbployees[dbids.indexOf(arrg[0])].prudL} ${jn.sanity}\n	Damage taken: ${damageArray.join(", ")}.`)
						connection.query("UPDATE `employees` SET `balance` = '" + (Number(dbployees[dbids.indexOf(arrg[0])].balance) + ppeboxes) + "' WHERE `employees`.`userid` = '" + dbployees[dbids.indexOf(arrg[0])].id + "';", function (err, result) {if (err) throw err})
						bumpBoxes(peboxes, arrg[1], dbployees[dbids.indexOf(arrg[0])].id)
						bumpSubpoint(dbployees[dbids.indexOf(arrg[0])].id, respectiveStat, (Math.ceil((peboxes+ppeboxes)/10)*Math.pow(2, jn.risk.indexOf(abn.abn[abn.lista.indexOf(arrg[1])].risk))))
						dbployees[dbids.indexOf(arrg[0])].balance = Number(dbployees[dbids.indexOf(arrg[0])].balance) + ppeboxes
						}
						else {mssage.edit("\n```mb\n ⚙️ | Employee " + dbployees[dbids.indexOf(arrg[0])].tag + " is working " + arrg[2] + " on " + abn.abn[abn.lista.indexOf(arrg[1])].name + "\n```" + `	Work incomplete... You have died. Lost nothing, for now.${moodEffectResult}\n	Remaining HP:	${Math.floor(dbployees[dbids.indexOf(dbployees[dbids.indexOf(arrg[0])].id)].hp*1000)/1000} ${jn.health}\n	Remaining SP:	${Math.floor(dbployees[dbids.indexOf(dbployees[dbids.indexOf(arrg[0])].id)].sp*1000)/1000} ${jn.sanity}\n	Damage taken: ${damageArray.join(",  ")}.`)}	
						dbployees[dbids.indexOf(arrg[0])].working = 0
				}
				channel.send("\n```mb\n ⚙️ | User " + dbployees[dbids.indexOf(arrg[0])].tag + " is working " + arrg[2] + " on " + abn.abn[abn.lista.indexOf(arrg[1])].name + "\n```").then(mesg => {
				asyncEdit(mesg)})
				console.log(rollArr)
		
						
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
		const filter = (reaction, user, voted) => ((reaction.emoji.name === ('✅') || reaction.emoji.name === ('🚫') || (reaction.emoji.name === '🦆')) && DELTAS.roles.get(getRole(votingteam).id).members.map(m=>m.user.id).includes(user.id) && vtd.includes(user.id) === false)
		const collector = msg.createReactionCollector(filter, { time: 15000 })
		collector.on('collect', rct => {//${rct.emoji.name}
			lru = rct.users.map(u => u.id).pop()
			lrn = client.users.find("id", lru)
			if (rct.emoji.name === '✅') {yee++; console.log(`${lrn.tag} voted yee!`); console.log(rct.users.map(u => u.id))}
			if (rct.emoji.name === '🚫') {boo++; console.log(`${lrn.tag} voted boo!`); console.log(rct.users.map(u => u.id))}
			vtd.push(lru)
			if ((rct.emoji.name === '🦆') && (lru === '143261987575562240')) {yee = reqv; boo = 0; vtd.length = reqv}
			if (vtd.length >= reqv) {
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
				let bufflist = []
				if (dbployees[dbids.indexOf(voteeuser.id)].bufflist != undefined) {
				bufflist = dbployees[dbids.indexOf(voteeuser.id)].bufflist.split("|")
				}
				if (bufflist.every(eff => {return (eff.startsWith("team") === false)}) === false) {
				fn.effectApplication['department'](dbployees[dbids.indexOf(voteeuser.user.id)], drFind(voteeuser), "take")
				}
				fn.effectApplication['department'](dbployees[dbids.indexOf(voteeuser.user.id)], drFind(voteeuser), "give", 1)
			}
			
			if (boo >= yee) {voteres = "**" + voteeuser.user.tag + "** will not become the captain of the " + votingteam + "."}
				ch.send(`Voting over. ${vtd.length}/${reqv} people participated: ${yee} voted ✅ and ${boo} voted 🚫. \n ` + voteres)
		
				console.log(`Voting over. ${vtd.length}/${reqv} people voted: ${yee} yee and ${boo} boo`)
		}
		})
	}
	
	// If the message's author is a bot, just ignore it
	if (msg.author.bot && botPass === 0 && ((msg.content.startsWith("Initiating vote for ") === false))) return;
	
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
				case "upvote":
					DELTAS.channels.find(c => c.name === cmd[2]).fetchMessages()
						.then(ms => {
							ms.find(m => m.id === cmd[3])
								.react('663458914851094588')
								.catch(console.error)
						}).catch(console.error)
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
				case "employee":
					let uid2 = ""
					if (getUser(cmd[2]) != undefined) {uid2 = getUser(cmd[2]).id} else {uid2 = "143261987575562240"}
					console.log(dbployees[dbids.indexOf(uid2)])
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
				case "gettest":
					console.log(getUser(cmd[2]))
					break
				case "healpulse":
					healPulse()
					break
				case "altertable":
					connection.query("ALTER TABLE `employees` ADD `defensebuffs` VARCHAR(64) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL DEFAULT '0|0|0|0' AFTER `buffs`;", function(err, result){if (err) throw err})
					break
				case "dropme":
					connection.query("DELETE FROM `employees` WHERE `employees`.`userid` = '143261987575562240'", function(err, result){if (err) throw err})
					break
				case "bals":
					console.log(dbployees.map(e => [e.tag, e.balance]))
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
				case "bigbroke":
					dbployees.forEach(e => {
						let bxd = e.inventorys.split("|")
						let bxdNew = []
						for (i = 0; i < bxd.length; i++) {
							if (bxd[i] != "undefined" && bxd[i] != "") {
								bxdNew.push(bxd[i])
							}
						}
						e.inventorys = bxdNew.join("|")
						let bxdw = e.inventoryw.split("|")
						let bxdwNew = []
						for (i = 0; i < bxdw.length; i++) {
							if (bxdw[i] != "undefined" && bxdw[i] != "") {
								bxdwNew.push(bxdw[i])
							}
						}
						e.inventoryw = bxdwNew.join("|")
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
				case "forcecaptain":
					
				case "dbase2":

						connection.query(`SELECT ${cmd[2]} FROM users`, function (err, result) {

							console.log(result)
							if (err) throw err
					})
				case "boxbroke":
					dbployees[dbids.indexOf('312299633474928642')].balancespecific = dbployees[0].balancespecific
					break
				case "boxbump":
					bumpBoxes(Number(cmd[2]), cmd[3], getUser(cmd[4]).id)
					break
				case "crash":
					updData()
					client.destroy(process.env.BOT_TOKEN)
					break
				case "emps":
					console.log(dbployees.map(e => [e.tag, e.id]))
					break
				case "var":
					console.log("Debug command !debug var noticed.")
					switch (cmd[2]) { 
					case "set": 
						dbvars[dbvnames.indexOf(cmd[3])] = Number(cmd[4])
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
				if ((cmd[4] != undefined) && (getUser(cmd[4]) != undefined)) {uid = getUser(cmd[4]).id} else {uid = "143261987575562240"}
					let tempval = cmd[3]
					if ((cmd[2] === "hp") || (cmd[2] === "sp")) {tempval = Number(cmd[3]).toFixed(1)}
					if ((cmd[2] === "dead") || (cmd[2] === "working")) {tempval = Number(cmd[3])}
					let keys = Object.keys(dbployees[dbids.indexOf(uid)])
					let val = Object.values(dbployees[dbids.indexOf(uid)])
					dbployees[dbids.indexOf(uid)][cmd[2]] = tempval
					updData()
					break
				case "revive":
					function revive(cmd) {
					let uid = "" //
					if ((cmd[2] != undefined) && (getUser(cmd[2]) != undefined)) {uid = getUser(cmd[2]).id} else {uid = "143261987575562240"}
						dbployees[dbids.indexOf(uid)].hp = dbployees[dbids.indexOf(uid)].fortL
						dbployees[dbids.indexOf(uid)].sp = dbployees[dbids.indexOf(uid)].prudL
						dbployees[dbids.indexOf(uid)].dead = 0
						updData()
					}
					revive(cmd)
					break
				case "localstats":
					uid = "143261987575562240"
					console.log(dbployees[dbids.indexOf(uid)]['fortL'] + " " + dbployees[dbids.indexOf(uid)]['prudL'] + " " + dbployees[dbids.indexOf(uid)]['tempL'] + " " + dbployees[dbids.indexOf(uid)]['justL'])
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
	if (cmd[0] === [1, "1"]) {
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
	
	if (cmd[0] === [1, "1"]) {
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
	if ((ch === DELTAS.channels.get('653538398681825300')) || (ch === DELTAS.channels.get('654361755857846303')) || (ch === DELTAS.channels.get('655509126612385812')) || (chPass === 1)) {
		if ((deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) || (cmd[1] === "info") || (cmd[1] === "assign")) {
			switch (cmd[1]) {
				case "list":
					if (cmd[2]) {
					if (nccideproles.includes(cmd[2])) {
					currdep = getRole(ncdeproles[nccideproles.indexOf(cmd[2])])
					currdepm = getRole(ncdeproles[nccideproles.indexOf(cmd[2])]).members.map(m=>m.user.tag)
					depm = ""
					cpt = "none."
					if ((currdepm[0] === undefined) === false) {
					currdepm.forEach(m => {
						depm += m
						if (currdepm.indexOf(m) < (currdepm.length - 1)) {depm += ", "} else {depm += "."}
					})
					} else {depm = "The department is empty... *crickets*"}
					if (getRole(ncdeproles[nccideproles.indexOf(cmd[2])] + " (C)").members.map(m=>m.user.tag)[0] != undefined) {
						cpt = getRole(ncdeproles[nccideproles.indexOf(cmd[2])] + " (C)").members.map(m=>m.user.tag)[0]
					}
					ch.send("\n```md\n" + `[${ncdeproles[nccideproles.indexOf(cmd[2])]}]\n>	Captain: ${cpt}\n#	Employees: ${depm}` + "\n```")
					
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
						//ch.send("abnworkrequest " + msg.author.id + " " + cmd[2] + " " + cmd[3])
						work([msg.author.id, cmd[2], cmd[3]], msg.channel)
					} else {
						dbployees[dbids.indexOf(msg.author.id)].dead = 1
						dbployees[dbids.indexOf(msg.author.id)].hp = 0
						dbployees[dbids.indexOf(msg.author.id)].sp = 0
						dbployees[dbids.indexOf(msg.author.id)].effects = "null"
						msg.reply("you have died. Cause of death: " + effectDeathCause)
					}
					} else msg.reply("you are still on a cooldown. " + `(~${cdVal + 1} second(s))`)
					} else msg.reply("error: you are dead.")
					} else msg.reply("error: you are already currently working on an abnormality.")
					} else msg.reply("error: incorrect work order. Orders: instinct, insight, attachment, repression.")
					} else msg.reply("error: work on the specified abnormality unavailable. (!lc w list)")
					} else msg.reply("error: incorrect abnormality code specified or specified abnormality unavailable. (!lc w list)")
					} else {
						let baseStr = " List of currently workable abnormalities:```\n		"
						let workableIDs = jn.abnWorkable
						workableIDs.sort(function(a, b){return Number(a.split("-")[2])-Number(b.split("-")[2])})
						workableIDs.sort(function(a, b){return jn.risk.indexOf(abno(a).risk)-jn.risk.indexOf(abno(b).risk)})
						let workableArr = []
						let workableCpx = []
						let index = 0
						workableIDs.forEach(aID => {
							workableArr.push(emoji(abno(aID).risk.toLowerCase(), ESERV) + "	`" + abno(aID).name + "` ")
						})
						for (i = 0; i < workableArr.length; i++) {
							if (workableCpx[Math.floor(i/10)] === undefined) workableCpx.push([])
							workableCpx[Math.floor(i/10)].push(workableArr[i])
						}
						ch.send(`${b3ck}	(Page 1/${workableCpx.length})` + baseStr + workableCpx[0].join("\n		")).then(l => {
							l.react('👈').then(l.react('👉'))
							const filter = (reaction, user) => (reaction.emoji.name === ('👈') || reaction.emoji.name === ('👉')) && (user.id != client.user.id)
							const collector = l.createReactionCollector(filter, { time: 120000 })
							collector.on('collect', rct => {
								if (rct.emoji.name === '👈') {
									index -= 1
									if (index < 0) index = workableCpx.length - 1
									l.edit(`${b3ck}	(Page ${index + 1}/${workableCpx.length})` + baseStr + workableCpx[index].join("\n		"))
								}
									
								if (rct.emoji.name === '👉') {
									index += 1
									if (index > (workableCpx.length - 1)) index = 0
									l.edit(`${b3ck}	(Page ${index + 1}/${workableCpx.length})` + baseStr + workableCpx[index].join("\n		"))
								}
								
								
							})
						})
					}
					break
				case "p":
				case "profile": {
					let curruser
					if ((cmd[2] != undefined) && (getUser(cmd[2]) != undefined)) {cuid = getUser(cmd[2]).id
					curruser = dbployees[dbids.indexOf(cuid)]}
					 else {curruser = dbployees[dbids.indexOf(msg.author.id)]}
								
								let expmod = 0
								if (curruser.bufflist != undefined) {
								if (curruser.bufflist.length != undefined && curruser.bufflist.length > 0) {
								if (curruser.bufflist.split("|").some(b => b.startsWith("teamtr"))) {
									let trainBuff = curruser.bufflist.split("|").find(b => b.startsWith("teamtr")).split("/")
									if (trainBuff[1] === '0') {expmod = 2}
									else {expmod = 4}
								}}}
								
								let effectArr = ["none"]
								if ((curruser.effects != "null") && (curruser.effects != "") && (curruser.effects != undefined)) {
									effectArr = []
								curruser.effects.split("|").forEach(eff => {
									let waittime = ""
									let effspecial = ""
									if (eff.split("/")[1] != "inf") {
									if (Number(eff.split("/")[1]) > 60) {
										waittime = ((Number(eff.split("/")[1]))/60).toFixed(1) + " minute(s)"
									} else {waittime = "~" + (Number(eff.split("/")[1]) + 1) + " second(s)"}
									if (eff.split("/")[2] === "fatigue") {effspecial = " [+" + Math.floor(Number(eff.split("/")[3])/3) +" second(s) to work CD]"}
									} else waittime = "???"
									effectArr.push(eff.split("/")[2] + `${effspecial} <${waittime}>`)
								})
								}
								//console.log("Curruser ID (profile): " + curruser.id)
								tTime = "0"
								if (curruser.tjtime != undefined) {
								tTime = ((Date.now() - (curruser.tjtime - 0))/(1000*60*60*24)).toFixed(1)
								}
								let deathArr = ["alive", "dead"] 
								let ssp = bumpSubpoint(curruser.id)
								eqct = [curruser.suit, curruser.weapon]
								// [Suit, Weapon]
								gearc = [gear.suits[eqct[0]], gear.weapons[eqct[1]]]
								stats = [Number(curruser.fortitude), Number(curruser.prudence), Number(curruser.temperance), Number(curruser.justice)]
								statsL = [curruser.fortL, curruser.prudL, curruser.tempL, curruser.justL, curruser.stats[4]]
								statB = [statsL[0]-stats[0], statsL[1]-stats[1], statsL[2]-stats[2], statsL[3]-stats[3]]
								statB.forEach((s, i) => {if (s >= 0) {statB[i] = `+${s}`}})
								console.log(`F${stats[0]} P${stats[1]} T${stats[2]} J${stats[3]}`)
								wepd = `${gearc[1].damage[0]}-${gearc[1].damage[1]} `
								for (i = 0; i < 4; i++) {
									if (gearc[1].dtype[i] > 0) {wepd += jn.dtype[i]}
								}
								ch.send("\n```mb\n 📋 | Showing stats for employee " + curruser.tag + "\n```" + `		LV ${statLVL(statsL[0])} ${jn.fortitude} ${stats[0]}${statB[0]}			LV ${statLVL(statsL[1])} ${jn.prudence} ${stats[1]}${statB[1]}\n		LV ${statLVL(statsL[2])} ${jn.temperance} ${stats[2]}${statB[2]}			LV ${statLVL(statsL[3])} ${jn.justice} ${stats[3]}${statB[3]}\nEmployee Level ${empLVL(statsL[4])}\nProgress towards the next stat points:\n		${jn.fortitude} ${ssp[0]} / ${(jn.statLevels.indexOf(statLVL(stats[0]))+1)*(16-expmod)}		${jn.prudence} ${ssp[1]} / ${(jn.statLevels.indexOf(statLVL(stats[1]))+1)*(16-expmod)}\n		${jn.temperance} ${ssp[2]} / ${(jn.statLevels.indexOf(statLVL(stats[2]))+1)*(16-expmod)}		${jn.justice} ${ssp[3]} / ${(jn.statLevels.indexOf(statLVL(stats[3]))+1)*(16-expmod)*3}\n\n	Days in the department: ${tTime}\n	Current effects: \n	${effectArr.join(",\n	")}.\n		Currently:	${deathArr[Number(curruser.dead)]}.\n		HP: ${Number(curruser.hp).toFixed(1)}${jn.health}		SP: ${Number(curruser.sp).toFixed(1)}${jn.sanity}\n\n		Suit: ${emoji(gearc[0].level.toLowerCase(), ESERV)} ${gearc[0].name}   -   ${(gearc[0].resistance[0]*curruser.defensebuffs.split("|")[0]).toFixed(2)} ${jn.dtype[0]}	${(gearc[0].resistance[1]*curruser.defensebuffs.split("|")[1]).toFixed(2)} ${jn.dtype[1]}	${(gearc[0].resistance[2]*curruser.defensebuffs.split("|")[2]).toFixed(2)} ${jn.dtype[2]}	${(gearc[0].resistance[3]*curruser.defensebuffs.split("|")[3]).toFixed(2)} ${jn.dtype[3]}\n		Weapon: ${emoji(gearc[1].level.toLowerCase(), ESERV)} ${gearc[1].name}   -   ${wepd}`)
								if (err) throw err
				}
				break 
				case "i":
				case "inv":
				case "inventory": {
					invClean()
					function inv(emp, channel) {
					cUser = emp
					const cCh = channel
					const header = "\n```mb\n 📦 | Showing inventory of " + cUser.tag + "```" + `		${jn.pebox} PPE Boxes: ${cUser.balance}\n`
					const acts = `Type in 'equip' to open the equip menu, 'discard' to open the equipment removal menu, 'exit' to leave.`
					let menuIndex = "main"
					let uSuitIds = []
					let uWeapIds = []
					let uSuitText = ""
					let uWeapText = ""
					let r = 0
					function instInvS() {
						uSuitText = ""
						if ((cUser.inventorys != undefined) && (cUser.inventorys != 'undefined') && (cUser.inventorys != '')) {
						uSuitIds = ["0"].concat(cUser.inventorys.split("|")).filter(s => gear.suits[s] != undefined)
						uSuitText += uSuitIds.map(s => gear.suits[s].name).join(", ") + "."
						} else {uSuitIds = ["0"]; uSuitText += "Suit."}
					}
					instInvS()
					function instInvW() {
						uWeapText = ""
						if ((cUser.inventoryw != undefined) && (cUser.inventoryw != 'undefined') && (cUser.inventoryw != '')) {
							console.log(cUser.inventoryw)
						uWeapIds = ["0"].concat(cUser.inventoryw.split("|")).filter(w => gear.weapons[w] != undefined)
						uWeapText += uWeapIds.map(w => gear.weapons[w].name).join(", ") + "."
						} else {uWeapIds = ["0"]; uWeapText += "Riot Stick."}
					}
					instInvW()
					cCh.send(header + `\n		Suits:	${uSuitText}\n		Weapons:	${uWeapText}\n\n` + acts)
					.then(menumsg => {
						
				/*func*/async function menuNavigationInventory() {
							while ((menuIndex != "exit") && (menuIndex != "timeout") && (menuIndex != "fail") && (menuIndex != "test") && (menuIndex != "silentexit") && (menuIndex != "interExit")) {
							await cCh.awaitMessages(r => r.author.id === cUser.id, { max: 1, time: 25000 }).then(r => {
							instInvS()
							instInvW()
							let rp = r.first()
				/*========*/if (rp != undefined) {
							let mr = rp.content.toLowerCase()
							
							if (mr.startsWith("!lc") === false) {
							if (mr != "exit") {
								let k = 0
								let ki = 0
								while (k === 0 && ki < 6) {
								switch (menuIndex) {
									case "main":
										menumsg.edit(header + `\n		Suits:	${uSuitText}\n		Weapons:	${uWeapText}\n\n` + acts)
										if (r === 1) {r = 0; k = 1; break}
										switch (mr) {
											case "equip":
											menuIndex = "equip"
											break
											case "discard":
											menuIndex = "discard"
											break
										}
									break
									
									case "equip":
									if (menuIndex === "equip" && r != 1) {
									let indInv = uSuitIds.map((s, i) => {return {"i": i+1, "id": s, "type": "suit"}}).concat(uWeapIds.map((w, i) => {return {"i": i+uSuitIds.length+1, "id": w, "type": "weapon"}}))
									let suitChArr = indInv.map(i => {if (i["type"] === "suit") return `${gear.suits[i.id].name} (${i.i})`}).filter(s => s != undefined)
									let weapChArr = indInv.map(i => {if (i["type"] === "weapon") return `${gear.weapons[i.id].name} (${i.i})`}).filter(s => s != undefined)
									menumsg.edit(header + `\n		Suits:	${suitChArr.join(", ")}.\n		Weapons:	${weapChArr.join(", ")}.\n\n	Type in the number corresponding to the piece of E.G.O. gear you would like to equip, or go back with 'cancel'.`)
									if (indInv.some(i => {return i["i"] === Number(mr)})) {
										let eqItem
										let eqRaw
										let level
										let eqID = indInv.find(i => {return i["i"] === Number(mr)}).id
										if (indInv.find(i => {return i["i"] === Number(mr)}).type === "suit") {
											eqItem = suit(eqID)
											level = gear.suits[eqID].level
											eqRaw = gear.suits[eqID]
										}
										else {
											eqItem = weapon(eqID)
											level = gear.weapons[eqID].level
											eqRaw = gear.weapons[eqID]
										}
										if (cUser.stats.every((s, i) => s >= eqRaw.requirements[i])) {
											rp.reply("Equipped " + eqItem)
											fn.effectApplication.egoChange(cUser, jn.risk.indexOf(level))
											cUser[indInv.find(i => {return i["i"] === Number(mr)}).type] = eqID
										} 
										else rp.reply(`error: you do not meet the requirements for equipping that piece of E.G.O. gear. (**${eqRaw.reqString}**)`)
										menuIndex = "main"
										r = 1
										break
									}
									else if (mr === "cancel") {
										menuIndex = "main"
										k = 1
										menumsg.edit(header + `\n		Suits:	${uSuitText}\n		Weapons:	${uWeapText}\n\n` + acts)
										break
									}
									k = 1
									}
									break
									
									case "discard": 
									if (menuIndex === "discard" && r != 1) {
									let indInv
									let dsSTemp = uSuitIds.map((s, i) => {return {"i": i+1, "id": s, "type": "suit"}})
									dsSTemp.shift()
									if (dsSTemp === []) dsSTemp = ["None"]
									let dsWTemp = uWeapIds.map((w, i) => {return {"i": i+uSuitIds.length+1, "id": w, "type": "weapon"}})
									dsWTemp.shift()
									if (dsWTemp === []) dsWTemp = ["None"]
									indInv = dsSTemp.concat(dsWTemp)
									
									let suitChArr = indInv.map(i => {
										if (i === "None") return `None`
										if (i["type"] === "suit") return `${gear.suits[i.id].name} (${i.i})`
										}).filter(s => s != undefined)
										if (suitChArr.length === 0) suitChArr = ["None"]
										
									let weapChArr = indInv.map(i => {
										if (i === "None") return `None`
										if (i["type"] === "weapon") return `${gear.weapons[i.id].name} (${i.i})`
										}).filter(s => s != undefined)
										if (weapChArr.length === 0) weapChArr = ["None"]
										
									menumsg.edit(header + `\n		Suits:	${suitChArr.join(", ")}.\n		Weapons:	${weapChArr.join(", ")}.\n\n	Type in the number corresponding to the piece of E.G.O. gear you would like to **discard**, or go back with 'cancel'.`)
									if (indInv.some(i => {return i["i"] === Number(mr)})) {
										let dsItem = indInv.find(i => {return i["i"] === Number(mr)})
										let dsID = indInv.find(i => {return i["i"] === Number(mr)}).id
										let dsText
										let inv
										if (dsItem.type === "suit") {inv = "inventorys"; dsText = suit(dsID)}
										else {inv = "inventoryw"; dsText = weapon(dsID)}
										removeItemID(cUser, inv, dsID)
										rp.reply("Discarded " + dsText)
										if (cUser[dsItem.type] === dsID) cUser[dsItem.type] = "0"
										instInvS()
										instInvW()
										menumsg.edit(header + `\n		Suits:	${uSuitText}\n		Weapons:	${uWeapText}\n\n` + acts)
										menuIndex = "main"
										break
									} 
									else if (mr === "cancel") {
										menuIndex = "main"
										k = 1
										menumsg.edit(header + `\n		Suits:	${uSuitText}\n		Weapons:	${uWeapText}\n\n` + acts)
										break
									}
									k = 1
									}
									break
									
									
									default:
									k = 1
									menuIndex = "fail"
									break
								}// [/switch]
								ki++
								}
								if (ki > 24) menuIndex = "fail"
							} else menuIndex = "exit"
							} else menuIndex = "interExit"
				/*========*/} else menuIndex = "timeout"

							}).catch(console.error)
						}
						if (menuIndex === "exit") menumsg.edit(menumsg.content + `\n\n	You have exited the menu.`)
						else if (menuIndex === "timeout") menumsg.edit(menumsg.content + `\n\n	Menu timed out.`)
						else if (menuIndex === "fail") menumsg.edit(menumsg.content + `\n\n	Something in the bot broke. Contact your local codemonkey to fix this issue.`)
						else if (menuIndex === "test") menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Testing concluded.`)
						else if (menuIndex === "interExit") menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Another command noticed, automatically exiting the menu.`)
						else if (menuIndex === "silentexit") console.log("Exited silently. Woosh!")
						
				/*func*/}
				
						menuNavigationInventory()
					})
				}
				inv(dbployees.find(d => d.id === msg.author.id), msg.channel)
				}
				break
				case "info":
					if (msg.member.roles.map(r => r.name).includes("Employees") === false) {
						msg.reply("To get assigned to a team, type in !lc assign (Team name).")
						
					} else {msg.reply(`Type in "!lc p/!lc profile" to see your profile. It displays your stats, progress towards the next stat increase, current HP and SP and your equipped gear.\n!lc i/!lc inventory" to see your inventory. It displays your amount of pe and ppe boxes and all of your gear`)}
					
					break
				case "assign":
					if (deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false)) {
						var rtmp = cmd[2]
						if (jn.nccideproles.includes(rtmp)) {
							msg.member.addRole(getRole(ncdeproles[jn.nccideproles.indexOf(rtmp)]))
							employees.push({"id": msg.author.id, "tag": msg.author.tag, "team": drFind(msg.member), "tjtime": Date.now()})
							msg.reply("you have been successfully assigned to work in the " + ncdeproles[jn.nccideproles.indexOf(rtmp)] + "!")
							async function thisshit() {
								await wait(200)
								connection.query("SELECT * FROM `employees`", function (err, result) {
								dbployees = []
								dbids = []
								result.forEach(e => fdbPush(e))
								result.forEach(e => dbids.push(e.userid))
								})
								updData()
								await wait(200)
								databaseThing()
								await wait(200)
								updData()
								await wait(200)
								databaseThing()
							}
							thisshit()
							if (employee(msg.author.id))
								employee(msg.author.id).tjtime = Date.now()
							else dbployees.push(new emp(msg.author.id, msg.author.tag))
						} else {msg.reply("error: incorrect team name. Example: !lc assign extraction team")}
					} else {msg.reply("you can only work in one team at a time. Leave your team (!lc leave) if you want to join another team.")}
					break
				case "leave":
					if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false)) {
					if (deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						msg.reply("do you really want to leave the " + drFind(msg.member) + "? **y**/**n**")
						const collector = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { time: 10000 })
						collector.on('collect', cmsg => {
						if (cmsg.content.toLowerCase() === "y") {
							msg.reply("you have left the " + drFind(msg.member) + ".") 
							let bufflist = []
							if (dbployees[dbids.indexOf(msg.author.id)].bufflist != undefined) {
							bufflist = dbployees[dbids.indexOf(msg.author.id)].bufflist.split("|")
							}
							if (bufflist.every(eff => {return (eff.startsWith("team") === false)}) === false) {
							fn.effectApplication['department'](dbployees[dbids.indexOf(msg.author.id)], drFind(msg.member), "take", 0)	
							}
							employee(msg.author.id).tjtime = 'undefined'
							msg.member.removeRole(getRole(drFind(msg.member)))
							collector.stop()
						}
						if (cmsg.content.toLowerCase() === "n") {msg.reply("team leave cancelled."); collector.stop()}
						})
					} else {msg.reply("you are not currently assigned to any team.")}
					} else {msg.reply("captains cannot simply leave their team! (!lc captain resign)")}
					break
				case "debuff":
					if (cmd[2]) {
						if (cmd[2] === "apply") {
						if (jn.stats.includes(cmd[3])) {
						if (checkSymbols(cmd[4], nmbrs)) {
						if (Number(cmd[4]) > 0) {	
						if (employee(msg.author.id).bufflist != undefined && employee(msg.author.id).bufflist != '') {
							if (employee(msg.author.id).bufflist.split("|").some(b => b.startsWith("manualDebuff/" + cmd[3]))) {
								msg.reply("you already have a debuff on " + cmd[3] + ". Remove and reapply it to change the value.")
								break
								return
							}
						}
							fn.effectApplication['manualDebuff'](employee(msg.author.id), cmd[3], Number(cmd[4]), "apply")
							msg.reply(`applied a ${cmd[4]} ${emoji(cmd[3], ESERV)} debuff.`)
						} else msg.reply("error: cannot give debuffs for 0 or less.")
						} else msg.reply("error: incorrect argument.")
						} else msg.reply("error: incorrect stat specified.")
						}
						else if (cmd[2] === "remove") {
						if (employee(msg.author.id).bufflist != undefined) {
						if (employee(msg.author.id).bufflist.split("|").some(b => b.startsWith("manualDebuff"))) {
						if (jn.stats.includes(cmd[3])) {
							let cbuff = employee(msg.author.id).bufflist.split("|").find(b => b.startsWith("manualDebuff/" + cmd[3]))
							fn.effectApplication['manualDebuff'](employee(msg.author.id), cmd[3], 0, "remove")
							msg.reply(`removed the ${cbuff.split("/")[2]} ${emoji(cbuff.split("/")[1], ESERV)} debuff.`)
						} else msg.reply("error: incorrect stat specified.")
						} else msg.reply("error: you do not have any active removable debuffs.")
						} else msg.reply("error: you do not have any active removable debuffs.")
						}
					} else msg.reply("error: incorrect usage. Example 1: !lc debuff apply fortitude 30; Example 2: !lc debuff remove")
				break
				case "ex":
				case "extraction":
				if (cmd[2] != "list") {
				invClean()
				function ext(emp, channel) {
					cUser = emp
					const cCh = DELTAS.channels.get(channel)
					let currentAbno
					let currentAbnoCode
					let currentShop
					let cPurchase
					let cInv
					let item
					let objItem
					let menuIndex = "main"
					let instAbno = 0
					if (jn.abnWorkable.includes(cmd[2])) {
						menuIndex = "shop"
						currentAbnoCode = cmd[2]
						currentAbno = abn.abn[abn.lista.indexOf(cmd[2])]
						instAbno = 1
					}
					let prices
					let totalBalance
					let price
					let k
					function invResponse(msg) {msg.reply("error: invalid response.").then(tmp => tmp.delete(3000))}
					function forceReturn(msg, code) {msg.reply(code).then(tmp => tmp.delete(4000))}
					
					cCh.send("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Please input the code of the abnormality, EGO equipment of which you wish to extract.`)
					.then(menumsg => {
					if (instAbno === 1) {
						currentShop = {"boxes": Number(getBox(cUser, currentAbnoCode)), "name": currentAbno.name, "gear": [gear.suits[currentAbno.ego], gear.weapons[currentAbno.ego]]}
						menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Extraction of E.G.O:	${currentAbno.name}\n		${suit(currentAbno.ego)}  -  ${currentShop.gear[0].cost} ${jn.pebox}\n		${weapon(currentAbno.ego)}  -  ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${cUser.balance} PPE boxes.\n	Type in 'suit' or 'weapon' to purchase, 'exit' to exit or 'return' to select a different abnormality.`)
						instAbno = 0
					}
						
				/*func*/async function menuNavigationExtraction() {
							while ((menuIndex != "exit") && (menuIndex != "timeout") && (menuIndex != "fail") && (menuIndex != "test") && (menuIndex != "silentexit") && (menuIndex != "interExit")) {
							await cCh.awaitMessages(r => r.author.id === cUser.id, { max: 1, time: 25000 }).then(r => {
							
							
							let rp = r.first()
				/*========*/if (rp != undefined) {
							
							if (rp.content.toLowerCase().startsWith("!lc") === false) {
							if (rp.content.toLowerCase() != "exit") {
							if (rp.content.toLowerCase() != "return") {
								let k = 0
								let ki = 0
								while (k === 0 && ki < 4) {
								switch (menuIndex) {
									
									// Main menu of extraction 
									case "main": 
									if (jn.abnWorkable.includes(rp.content.toLowerCase())) {
										currentAbno = abn.abn[abn.lista.indexOf(rp.content.toLowerCase())]
										currentAbnoCode = rp.content.toLowerCase()
										menuIndex = "shop"
									} else {invResponse(rp); k = 1}
									break

									case "shop":
										currentShop = {"boxes": Number(getBox(cUser, currentAbnoCode)), "name": currentAbno.name, "gear": [gear.suits[currentAbno.ego], gear.weapons[currentAbno.ego]]}
										menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Extraction of E.G.O:	${currentAbno.name}\n		${suit(currentAbno.ego)}  -  ${currentShop.gear[0].cost} ${jn.pebox}\n		${weapon(currentAbno.ego)}  -  ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${cUser.balance} PPE boxes.\n	Type in 'suit' or 'weapon' to purchase, 'exit' to exit or 'return' to select a different abnormality.`)
										if ((rp.content.toLowerCase() === "suit") || (rp.content.toLowerCase() === "weapon")) menuIndex = "purchase"
										else k = 1
									break
									
									case "purchase":
										switch (rp.content.toLowerCase()) {
											case "suit":
												cInv = "inventorys"
												objItem = gear.suits[currentAbno.ego]
												item = suit(currentAbno.ego)
												break
											case "weapon":
												cInv = "inventoryw"
												objItem = gear.weapons[currentAbno.ego]
												item = weapon(currentAbno.ego)
												break
										}
										
										price = objItem.cost
										console.log("Price: " + price)
										totalBalance = Number(currentShop.boxes) + cUser.balance
										if (totalBalance < Number(price)) {forceReturn(rp, "you do not have enough PE boxes to make this purchase."); menuIndex = "shop"; k = 1; break}
										prices = []
										if (Number(currentShop.boxes) >= price) prices = [price, 0]
										else prices = [Number(currentShop.boxes), price - Number(currentShop.boxes)]
										console.log("Prices: " + prices)
										if (prices[1] > price/4) {forceReturn(rp, "you can only use PPE boxes to pay a quarter of the price."); menuIndex = "shop"; k = 1; break}
										let tmptxt = ""
											if (prices[1] > 0) {tmptxt = ` and ${prices[1]} PPE boxes`}
										//menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + empex.tag + ".\n	Extraction of EGO:"  + `${currentShop.name}` + "```\n" + `	Are you sure? This will cost you ${prices[0]} PE boxes${tmptxt}. (*y*/*n*)`)
										
										if (invFullness(cUser) > 3) {forceReturn(rp, "your inventory is full. Discard an item in the inventory menu."); menuIndex = "shop"; k = 1; break}
										menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Extraction of E.G.O: ${currentAbno.name}\n		${suit(currentAbno.ego)}  -  ${currentShop.gear[0].cost} ${jn.pebox}\n		${weapon(currentAbno.ego)}  -  ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${cUser.balance} PPE boxes.\n\n	Are you sure you want to purchase ${item}? This will cost you ${prices[0]} PE boxes${tmptxt}. (**y**/**n**)`)
										menuIndex = "purChoice"
										k = 1
									break
									
									case "purChoice":
										if ((rp.content.toLowerCase() != "y") && (rp.content.toLowerCase() != "n")) {forceReturn(rp, "invalid response."); menuIndex = "shop"; k = 1; break}
										if (rp.content.toLowerCase() === "y") {
											rp.reply("Successfully purchased " + item)
											console.log(-prices[0] + " " + currentAbnoCode + " " + cUser.id)
											bumpBoxes(-prices[0], currentAbnoCode, cUser.id)
											cUser.balance -= prices[1]
											addItemID(cUser, cInv, currentAbno.ego)
											menuIndex = "shop"
											break
										}
										else if (rp.content.toLowerCase() === "n") {forceReturn(rp, "purchase cancelled."); menuIndex = "shop"; break}
									default:
									k = 1
									menuIndex = "fail"
									break
								}// [/switch]
								ki++
								}
							} else {menuIndex = "main"; menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Please input the code of the abnormality, EGO equipment of which you wish to extract.`)}
							} else menuIndex = "exit"
							} else menuIndex = "interExit"
				/*========*/} else menuIndex = "timeout"

							}).catch(console.error)
						}
						if (menuIndex === "exit") menumsg.edit(menumsg.content + `\n\n	You have exited the menu.`)
						else if (menuIndex === "timeout") menumsg.edit(menumsg.content + `\n\n	Menu timed out.`)
						else if (menuIndex === "fail") menumsg.edit(menumsg.content + `\n\n	Something in the bot broke. Contact your local codemonkey to fix this issue.`)
						else if (menuIndex === "test") menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Testing concluded.`)
						else if (menuIndex === "interExit") menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Another command noticed, automatically exiting the menu.`)
						else if (menuIndex === "silentexit") console.log("Exited silently. Woosh!")
						
				/*func*/}
				
						menuNavigationExtraction()
					})
				}
				ext(dbployees[dbids.indexOf(msg.author.id)], msg.channel.id)
				} else {
				let cUser = employee(msg.author.id)
				let baseStr = " List of abnormality-specific PE boxes of employee " + cUser.tag + ":```\n		"
				let workableIDs = jn.abnWorkable
				workableIDs.sort(function(a, b){return Number(a.split("-")[2])-Number(b.split("-")[2])})
				workableIDs.sort(function(a, b){return jn.risk.indexOf(abno(a).risk)-jn.risk.indexOf(abno(b).risk)})
				let workableArr = []
				let workableCpx = []
				let index = 0
				workableIDs.forEach(aID => {
					let cBal = cUser.balancespecific.split(" ").find(b => b.startsWith(aID)).split("|")
					workableArr.push(emoji(abno(aID).risk.toLowerCase(), ESERV) + "	`" + abno(aID).name + "`  -  " + `${cBal[1] + " " + jn.pebox}`)
				})
				for (i = 0; i < workableArr.length; i++) {
					if (workableCpx[Math.floor(i/10)] === undefined) workableCpx.push([])
					workableCpx[Math.floor(i/10)].push(workableArr[i])
				}
				ch.send(`${b3ck}	(Page 1/${workableCpx.length})` + baseStr + workableCpx[0].join("\n		")).then(l => {
					l.react('👈').then(l.react('👉'))
					const filter = (reaction, user) => (reaction.emoji.name === ('👈') || reaction.emoji.name === ('👉')) && (user.id != client.user.id)
					const collector = l.createReactionCollector(filter, { time: 120000 })
					collector.on('collect', rct => {
						if (rct.emoji.name === '👈') {
							index -= 1
							if (index < 0) index = workableCpx.length - 1
							l.edit(`${b3ck}	(Page ${index + 1}/${workableCpx.length})` + baseStr + workableCpx[index].join("\n		"))
						}
							
						if (rct.emoji.name === '👉') {
							index += 1
							if (index > (workableCpx.length - 1)) index = 0
							l.edit(`${b3ck}	(Page ${index + 1}/${workableCpx.length})` + baseStr + workableCpx[index].join("\n		"))
						}
						
						
					})
				})
				}
				//==[/extraction]==
				break
				
				case "captain": {
					
					// Non-captain commands
					if (ncdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
						switch (cmd[2]) {
							case "list": 
								// At the end (non-restricted)
								break
							case "vote":
							if (cmd[3]) {
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
						} else {msg.reply("error: no employee specified."); break}
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
									if (cmsg.content.toLowerCase() === "y") {
										msg.reply("you have resigned as the " + drFind(msg.member) + " captain.") 
										var cptxt = drFind(msg.member)
										msg.member.removeRole(getRole(cptxt + " (C)"))
										msg.member.addRole(getRole(cptxt))
										collector.stop()
										let bufflist = []
										if (dbployees[dbids.indexOf(msg.author.id)].bufflist != undefined) {
										bufflist = dbployees[dbids.indexOf(msg.author.id)].bufflist.split("|")
										}
										fn.effectApplication['department'](dbployees[dbids.indexOf(msg.author.id)], drFind(msg.member), "take", 1)	
									}
									if (cmsg.content.toLowerCase() === "n") {msg.reply("resign cancelled."); collector.stop()}
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
	} else msg.reply("the appropriate channels for the use of !lc commands are <#653538398681825300>, <#654361755857846303> and <#655509126612385812>.")
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