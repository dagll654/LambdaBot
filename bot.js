// Required stuff
const Discord = require('discord.js') // Self-explanatory
const db = require('mysql') // Mysql dependency for accessing the database
// Additional files
const abn = require("./abnb.json") // Abnormalities
const jn = require("./junk.json") // Miscellaneous stuff
const gear = require("./gear.json") // Gear and items
const fn = require("./functions.js") // Functions, like all effects - on-consume of consumables, on-work of abnos etc.
const simpleCombat = require("./simpleCombat.js") // The simple version of combat
// Setting up the connection pool. Not sure if this is better than just a db.createConnection (or something like that), but I doubt it really matters
var pool        = db.createPool({
	connectionLimit : 10, // default = 10
	host: "sql7.freesqldatabase.com",
	user: "sql7314688",
	password: process.env.DB_PASS,
	database: "sql7314688"
})
// Getting a connection
pool.getConnection(function (err, connection) {
const client = new Discord.Client()
function DELTAS() {return client.guilds.get('607318782624399361')} // Lambda's Deltas server
var bch
function ESERV() {return client.guilds.get('513660754633949208')} // Emote server for the minigame stuff
const admins = ['556890472141029376', '143261987575562240', '389226857679159336'] // People with a Second-in-command role
const minigameChannels = ['653538398681825300', '654361755857846303', '655509126612385812'] // Self-explanatory
const deproles = jn.deproles // All department role names
const ncdeproles = jn.ncdeproles // Non-captain role names
const nccideproles = jn.nccideproles // Case-insensitive role names
const cdeproles = jn.cdeproles // Captain role names
const help1 = jn.help1 // Help for all commands
const qte = jn.qte // All quotes
const qte2 = "Lambdadelta Quote #"
const cmds = jn.cmds // All commands
const b3ck = '```'
const bck = '`'
Array.prototype.ids = function() {return this.map(e => e.id)}
Array.prototype.e = function(id) {return this.find(e => e.id === id)}
var employees = [] // Later filled with all employees with a department role
var dbployees = [] // Later filled with all employee data from the database and used everywhere
var abnos = [] // Later filled with all workable abnormalities
var dbnos = [] // Later filled with all abno data from the database
// Debug variables
debugVariables = {
	'debug_duck': 0, // /shrug
	'debug_say': 0, // If 0, !say is off
	'voting': 0, // Used in voting I guess
	'heal_pulser': 1, // If 1, the heal pulser is on
	'stop_all': 0, // If 1, bot accepts no commands except from bot author
	'effect_log': 999 // Rules how often the effect on employees are logged
}
quotelog = []
votingteam = ""
voting = 0	
efflog = 0

let statLevelArray = []// Yes, this is an ass-backwards way of doing this. I don't really care.
for (i = 30; i < 100; i++) {
	if (i < 45) statLevelArray.push([2, "II"])
	else if (i < 65) statLevelArray.push([3, "III"])
	else if (i < 85) statLevelArray.push([4, "IV"])
	else if (i < 100) statLevelArray.push([5, "V"])
}

// Wait
function wait(msc) {
	return new Promise(resolve => {
setTimeout(() => {resolve('resolved')}, msc)
	})
}

// Check if something is not assigned a meaningful value
function exists(v) {
	return (v != undefined) && (v != 'undefined') && (v != '') && (v != null) && (v != 'null') && (v != [])
}

// Function for finding the dep role among a member's roles
function drFind(member) {
	let reg = new RegExp(`\\s{1}Team`)
	if (member.roles.some(r => reg.test(r.name)))
	return member.roles.find(r => reg.test(r.name)).name
	else return undefined
}

// Employee class
class cEmp {
	constructor(id, tag, hp = 1700, sp = 1700, fortitude = 17, prudence = 17, temperance = 17, justice = 17, suit = "0", weapon = "0", inventorys, inventoryw, working = 0, dead = 0, balance = 0, balancespecific = "", subpoints = "0|0|0|0", effects = 'null', buffs = "0|0|0|0", defensebuffs = "1|1|1|1", bufflist, tjtime = Date.now(), statlimit = 100, gifts = "", inventory = "", luck = 0) {
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
		this.inventory = inventory
		this.luck = 0
	}
	get effectArray() {
		if (exists(this.effects))
		return this.effects.split("|").map(e => e.split("/"))
		else return []
	}
	get subPointsArray() {return this.subpoints.split("|")}
	get statBuffArray() {return this.buffs.split("|")}
	get buffListArray() {
		if (exists(this.bufflist)) return this.bufflist.split("|").map(i => i.split("/"))
		else return []
	}
	get defenseBuffArray() {return this.defensebuffs.split("|").map(b => Number(b))}
	get defenseArray() {
		let arr = []
		for (i = 0; i < 4; i++) {
		arr.push(Number(this.defenseBuffArray[i]) * suitObj(Number(this.suit)).resistance[i])
		}
		return arr
	}
	get fortL() {return Number(this.fortitude) + Number(this.statBuffArray[0])} // L stands for "local" by the way
	get prudL() {return Number(this.prudence) + Number(this.statBuffArray[1])}
	get tempL() {return Number(this.temperance) + Number(this.statBuffArray[2])}
	get justL() {return Number(this.justice) + Number(this.statBuffArray[3])}
	get employeeLevel() {
		let statcount = this.statLevels()[0] + this.statLevels()[1] + this.statLevels()[2] + this.statLevels()[3]
		if (statcount < 6) return 1
		else if (statcount < 9) return 2
		else if (statcount < 12) return 3
		else if (statcount < 16) return 4
		else return 5
	}
	get drFind() { // Returns the department role's name
		let reg = new RegExp(`\\s{1}Team`)
		if (DELTAS().members.get(this.id).roles.some(r => reg.test(r.name)))
		return DELTAS().members.get(this.id).roles.find(r => reg.test(r.name)).name
		else return undefined
	}
	get balanceSpecificArray() {return this.balancespecific.split(" ").map(b => b.split("|"))}
	get stats() {return [this.fortL, this.prudL, this.tempL, this.justL, this.employeeLevel]}
	get statsReal() {return [Number(this.fortitude), Number(this.prudence), Number(this.temperance), Number(this.justice)]}
	get inventoryFullness() {
		let iN = 0
		if (exists(this.inventorys)) {
			this.inventorys.split("|").forEach(s => {if (exists(s)) iN++})
		}
		if (exists(this.inventoryw)) {
			this.inventoryw.split("|").forEach(w => {if (exists(w)) iN++})
		}
		return iN	
	}
	get giftArray() {
		if (exists(this.gifts)) return this.gifts.split("/").map(g => g.split("|"))
		else return []
	}
	getBox(abno) {
		return this.balanceSpecificArray.find(b => b[0] === abno.toLowerCase())[1]
	}
	statLevels(textForm = 0) { // Stat level
		let statArray = [this.fortL, this.prudL, this.tempL, this.justL]
		let statLevelsArray = []
		for (i = 0; i < 4; i++) {
			statLevelsArray.push([statLVN(statArray[i]), statLVL(statArray[i])][textForm])
		}
		return statLevelsArray
	}
	heal(points, amount) { // Heal the points of employee by amount, calculated to include buffs and return the real amount of points healed
		if (["hp", "sp"].includes(points.toLowerCase()) === false) {console.log(points + " " + amount); return undefined} // If the points aren't HP or SP, or if the amount has any characters besides digits in it, abandon ship
		let buffs = this.buffListArray
		let amt = Number(amount)
		if (exists(buffs)) {
		let regBuff = new RegExp(`misc/healbuff/${points.toLowerCase()}`)
		buffs.forEach(b => {
			if (regBuff.test(b.join("/"))) amt += Number(b[3])*amount
		})
		}
		this[points.toLowerCase()] += Number(amt)
		return Number(amt)
	}
	damage(risk, typeL, amount) { // Deal amount of type damage to employee, calculated to include defense and return the real amount of damage dealt (in non-technical form because reasons)
		let amt = amount
		let type = typeL
		if (Array.isArray(type)) type = type[roll(type.length)] 
		switch (type.toLowerCase()) {
			case "red":
			amt = Number(amt)*Number(this.defenseArray[0])*rDamage(suitObj(Number(this.suit)).level, risk)
			this.hp -= amt
			break
			case "white":
			amt = Number(amt)*Number(this.defenseArray[1])*rDamage(suitObj(Number(this.suit)).level, risk)
			this.sp -= amt
			break
			case "black":
			amt = Number(amt)*Number(this.defenseArray[3])*rDamage(suitObj(Number(this.suit)).level, risk)
			this.hp -= amt
			this.sp -= amt
			break
			case "pale":
			amt = Number(this.defenseArray[3])*(this.hp/100*amt)*rDamage(suitObj(Number(this.suit)).level, risk)
			this.hp -= amt
			break
		}
		return Number(amt)
	}
	bumpSubpoint(stat = "fortitude", amount = 0) {
		let expMod = 0
		let subStatArr = this.subPointsArray
		let statIndex = jn.stats.indexOf(stat.toLowerCase())
		let justiceMultiplier = 1
		if (statIndex === 3) justiceMultiplier = 3
		if (this.buffListArray.some(b => b[0] === "teamtr")) {
		if (this.buffListArray.find(b => b[0] === "teamtr")[1] === 0) expMod = 2
		else expMod = 4
		}
		subStatArr[statIndex] = Number(subStatArr[statIndex]) + amount
		
		let subStatIncrement = 14 - expMod
		let k = 0
		while (k === 0) {
		k = 1
		if (subStatArr[statIndex] >= statLVN(this.statsReal[statIndex])*subStatIncrement*justiceMultiplier) {
			subStatArr[statIndex] -= statLVN(this.statsReal[statIndex])*subStatIncrement*justiceMultiplier
			if (this.stats[statIndex] < this.statlimit) {
			this[stat]++
			}
		k = 0
		}
		}
		this.subpoints = subStatArr.join("|")
	}
	bumpBox(abno, amount) {
		if (this.balanceSpecificArray.some(b => b[0].toLowerCase() === abno.toLowerCase()) === false) return undefined
		else {
			let newBSA = this.balanceSpecificArray
			let newAmount
			newBSA.find(b => b[0].toLowerCase() === abno.toLowerCase())[1] -= -amount
			newAmount = newBSA.find(b => b[0].toLowerCase() === abno.toLowerCase())[1]
			this.balancespecific = newBSA.map(b => b.join("|")).join(" ")
			return newAmount
		}
	}
}

// [/emp]
// Switch between technical and normal names of gift slots
function sSlotText(text) {
	let technical = ['brooch1', 'brooch2', 'head1', 'head2', 'mouth1', 'mouth2', 'hand1', 'hand2', 'eye', 'face', 'cheek', 'back1', 'back2']
	let normal = ['Brooch 1', 'Brooch 2', 'Head 1', 'Head 2', 'Mouth 1', 'Mouth 2', 'Hand 1', 'Hand 2', 'Eye', 'Face', 'Cheek', 'Back 1', 'Back 2']
	if (technical.includes(text)) return normal[technical.indexOf(text)]
	else if (normal.includes(text)) return technical[normal.indexOf(text)]
	else return undefined
}

function healCalc(employee, pts, amt) {
		let buffs = employee.buffListArray
		if (exists(buffs) === false) return amt
		if (buffs.some(b => (b[0] === "misc" && b[1] === "healbuff" && b[2] === pts))) {
			let b = buffs.find(b => (b[0] === "misc" && b[1] === "healbuff" && b[2] === pts))
			return amt * (1 + Number(b[3]))
		} else return amt
	}

// Returns the abnormality by code
function abno(code) {
	if (abn.abn.some(a => a.code === code.toLowerCase()))
	return abn.abn.find(a => a.code === code.toLowerCase())
	else return undefined
}

// Returns an item by name (I don't like that it's not by id or something but that's not as essential as it is for E.G.O. equipment)
function getItem(name) {
	return gear.items.find(i => i.name === name)
}

// Wait 100 ms and query q on connection
async function queryAndWait(q, connection) {
	await wait(100).then(p => {
	connection.query(q, function (err, result) {if (err) throw err})
	})
}

// Abnormality class (unfinished)
class clAbn {
	constructor (id, state = 0, qcounter = 'und') {
		this.id = id
		this.state = state
		this.qcounter = qcounter
	}
}



// I'm kind of proud of this one, it searches for the getter to the best of its ability and tries to return a user
function getUser(getter) {
	if (exists(getter) === false) return undefined
	if ((/\D/.test(getter) === false && /\d{18}/.test(getter)) || (/\b<@!/.test(getter) && /\d{18}/.test(getter)))
		return client.users.get(getter)
	else {
		let regAmazingText = ``
		let getterArray = getter.split("").map((c, i) => {
			if (i < 3) regAmazingText += `${c.toLowerCase()}`
			else regAmazingText += `${c.toLowerCase()}*`
		})
		let regAmazing = new RegExp(regAmazingText, "i")
		if (DELTAS().members.some(m => {
			if (exists(m.nickname) === false) return false
			return regAmazing.test(" " + m.nickname.toLowerCase())
			}))
			return DELTAS().members.find(m => {
			if (exists(m.nickname) === false) return false
			return regAmazing.test(" " + m.nickname.toLowerCase())
			}).user
		else if (DELTAS().members.some(m => regAmazing.test(m.user.tag.toLowerCase())))
			return DELTAS().members.find(m => regAmazing.test(m.user.tag.toLowerCase())).user
	}
	return undefined
}

// Returns an emoji by name
function emoji(nme, srv = DELTAS(), a = false, id = false) {
	let e
	let emd
	if (nme === "none") {return ""}
	if (id === true) e = srv.emojis.find(em => em.name.toLowerCase() === nme.toLowerCase()).id
	else {if (a === true) emd = "<a:"; else emd = "<:"}
	let eObj = srv.emojis.find(em => em.name.toLowerCase() === nme.toLowerCase())
		emvar = emd + eObj.name + ":" + eObj.id + ">"
	return emvar
}

// A text resentation of a suit (non-technical)
function suit(idS, d = [1, 1, 1, 1]) {
	let suit = gear.suits.find(s => s.id === Number(idS).toString())
	return (`${emoji(suit.level.toLowerCase(), ESERV())} ${suit.name}  -  ${(suit.resistance[0]*d[0]).toFixed(2)} ${jn.dtype[0]} ${(suit.resistance[1]*d[1]).toFixed(2)} ${jn.dtype[1]} ${(suit.resistance[2]*d[2]).toFixed(2)} ${jn.dtype[2]} ${(suit.resistance[3]*d[3]).toFixed(2)} ${jn.dtype[3]}`)
}

// A text resentation of a weapon (non-technical)
function weapon(idW) {
	let weapon = gear.weapons.find(w => w.id === idW.toString())
	let wepd = `${weapon.damage[0]} - ${weapon.damage[1]} `
	for (i = 0; i < 4; i++) {
		if (weapon.dtype[i] > 0) {wepd += jn.dtype[i]}
	}
	return (`${emoji(weapon.level.toLowerCase(), ESERV())} ${weapon.name}  -  ${wepd}`)
}

// Function for getting the damage modifier of risk level 1 (receiving end) against risk level 2 (dealing end), with the receiving end having res resistance
exports.rDamage = function rDamageEX(rec, dea, res = 1) {
	let levelDifference = jn.risk.indexOf(rec.toUpperCase()) - jn.risk.indexOf(dea.toUpperCase())
	if (rec.toUpperCase() === "LUL") levelDifference = 5
	if (dea.toUpperCase() === "LUL") levelDifference = -5
	let dMult = 1
	//console.log(levelDifference)
	//4 = 40%; 3 = 60%; 2 = 70%; 1 = 80%; 0 = 100%; -1 = 100%; -2 = 120%; -3 = 150%; -4 = 200%
	switch (levelDifference) {
		case 5: dMult = 0; break;
		case 4: dMult = 0.4; break;
		case 3: dMult = 0.6; break;
		case 2: dMult = 0.7; break;
		case 1: dMult = 0.8; break;
		case 0:
		case -1: dMult = 1; break;
		case -2: dMult = 1.2; break;
		case -3: dMult = 1.5; break;
		case -4: dMult = 2; break;
		case -5: dMult = 69; break;
		default: dMult = 1; break;
	}
	return (dMult * res)
}
function rDamage(rec, dea, res) {return exports.rDamage(rec, dea, res)}

// Just a function that times the message out in x seconds
function yeet(sec) {
	setTimeout(function(){msg.delete().catch(console.error)}, sec * 1000)
}

// Roll an x-sided die, even if that makes absolutely no sense in practice
function roll(sides) {
	return Math.floor(Math.random() * sides) + 1
}

// Add an item id to suit/weapon inventory
function addItemID(emp, inv, id) {
	if (exists(emp[inv]) === false) emp[inv] = id
	else emp[inv] += "|" + id
}

// Remove an item id from suit/weapon inventory
function removeItemID(emp, inv, id) {
	if (exists(emp[inv]) === false) return
	newInv = emp[inv].split("|").filter(i => Number(i) != Number(id)).join("|")
	if (exists(newInv)) emp[inv] = newInv
	else emp[inv] = ""
	let ws
	if (inv === "inventorys") ws = "weapon"
	else ws = "suit"
	console.log("WS: " + ws)
	console.log("IDs: " + emp[ws] + " " + id)
	if (Number(emp[ws]) === Number(id)) emp[ws] = ""
}

// Function for getting a role by name 
function getRole(nme) {
	if (msg.guild.roles.some(role => role.name.toLowerCase() === nme.toLowerCase()))
		return msg.guild.roles.find(role => role.name.toLowerCase() === nme.toLowerCase())
	else return undefined
}

// Returns a suit object found by id
function suitObj(id) {
	if (gear.suits.some(s => Number(s.id) === Number(id)))
		return gear.suits.find(s => Number(s.id) === Number(id))
	else return undefined
}

// Returns a weapon object found by id
function weapObj(id) {
	if (gear.weapons.some(s => Number(s.id) === Number(id)))
		return gear.weapons.find(s => Number(s.id) === Number(id))
	else return undefined
}

// Returns the number value of a stat level
function statLVN(stat) {
	if (stat < 30) return 1
	else if (stat < 45) return 2
	else if (stat < 65) return 3
	else if (stat < 85) return 4
	else return 5
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

// The new and (hopefully) improved work function
function work(employee1, abno1, order1, channel) {
	
	const e = employee1
	const cAbno = abno(abno1)
	const order = order1
	let statIndex = jn.workOrders.indexOf(order)
	let respectiveStat = jn.stats[statIndex]
	let userStat = e.stats[statIndex]
	let userTemp = e.tempL
	let luck = Math.ceil(jn.risk.indexOf(cAbno.risk)/2) + e.luck
	let userStatLevel = e.statLevels()[statIndex]
	
	let successChance = 0
	let successChancet = (userTemp * 0.002 + cAbno.workPreferences[statIndex][userStatLevel - 1])*100
	//console.log(successChance + " " + successChancet)
	if (e.buffListArray.some(b => b[0] === cAbno.code)) {
		let b = e.buffListArray.find(b => b[0] === cAbno.code)
		if (b[1] === "schance" && Number.isNaN(Number(b[2])) === false) successChancet += Number(b[2])
		if (b[1] === "schance") console.log(b)
	}
	if (cAbno.affstat[0] === true) {
		successChancet -= fn.affstat(cAbno.code, respectiveStat, e)
	}
	if (successChancet > 95) successChance = 95; else successChance = successChancet
	console.log(`Success chance for ${e.tag} on ${cAbno.code}: ${successChance}%`)
	let damageArray = []
	let neboxes = 0
	let peboxes = 0
	let ppeboxes = 0
	let rollArr = []
	let asdf = 0
	for (asdf = 0; asdf < cAbno.peoutput; asdf++) {
	if (e.hp > 0 && e.sp > 0) {
		let cRoll = roll(100)
		let luckRoll = roll(1000)
		if (cRoll > luck) {}
		if (cRoll > successChance) {
		if (luckRoll <= luck) rollArr.push([luckRoll, "WIN"])
		else rollArr.push([cRoll, cRoll > successChance])
		} 
		else rollArr.push([cRoll, cRoll > successChance])
		if (cRoll > successChance && luckRoll > luck) {
			neboxes++
			let dmg = (roll(cAbno.damage[1] - cAbno.damage[0] + 1) - 1) + cAbno.damage[0]
			let dIndex = cAbno.dtype.indexOf(1)
			let aDmg = e.damage(cAbno.risk, jn.damageTypes[dIndex], dmg)
			let aDmgStr
			if (dIndex === 3) aDmgStr = `${aDmg.toFixed(1)} (${(aDmg/e.fortL*100).toFixed(1)}%) ${jn.dtype[3]}`
			else aDmgStr = `${aDmg.toFixed(1)} ${jn.dtype[dIndex]}`
			damageArray.push(aDmgStr)
		}
		else if (roll(15) === 15) ppeboxes++
		else peboxes++
	} else e.dead = 1
	}
	async function asyncEdit(rMsg) {
		let mood = ""
		let moodResult = 0
		let moodEffectResult = ""
		let boxTotal = peboxes + ppeboxes
		if (boxTotal >= cAbno.mood[2]) {mood = jn.goodresult; moodResult = 2}
		else if (boxTotal >= cAbno.mood[1]) {mood = jn.normalresult; moodResult = 1}
		else {mood = jn.badresult; moodResult = 0}
		if (cAbno.effect[0] === true) {
			let moodEffect = fn.effectApplication[cAbno.id](e, moodResult, order)
			if (moodEffect[0] === true) moodEffectResult = moodEffect[1]
		}
		if (damageArray.length === 0) damageArray.push("none")
		let wTime = Math.floor((cAbno.peoutput/2)*10)/10
		if (cAbno.code === "o-01-01") wTime = 20
		rMsg.edit("\n```mb\n ⚙️ | Employee " + e.tag + " is working " + order + " on " + cAbno.name + "\n```" + `	Currently working, this will take approximately ${wTime} seconds.`)
		await wait(wTime*500)
		if (Number(e.hp) <= 0 || Number(e.sp) <= 0)
			e.dead = 1
		if (e.dead === 0) {
		ppe = ""
		if (ppeboxes > 0) ppe = `\n	PPE boxes: ${ppeboxes}`
		rMsg.edit("\n```mb\n ⚙️ | Employee " + e.tag + " is working " + order + " on " + cAbno.name + "\n```" + `	Work complete!\n	PE boxes: ${peboxes}	\n	Result: ${mood}\n	NE boxes: ${neboxes}  ${ppe}\n	Remaining HP:	${Number(e.hp).toFixed(1)} / ${e.fortL} ${jn.health}\n	Remaining SP:	${Number(e.sp).toFixed(1)} / ${e.prudL} ${jn.sanity}\n	Damage taken: ${damageArray.join(", ")}.`)
		e.bumpBox(cAbno.code, peboxes)
		let subPtToBump = 0
		let aRisk = jn.risk.indexOf(cAbno.risk)
		if (boxTotal >= aRisk + 2) {
			if (boxTotal <= 8) subPtToBump = Math.pow(2, aRisk)
			else if (boxTotal <= 15) subPtToBump = 2*Math.pow(2, aRisk)
			else if (boxTotal <= 24) subPtToBump = 3*Math.pow(2, aRisk)
			else subPtToBump = 4*Math.pow(2, aRisk)
		}
		e.bumpSubpoint(respectiveStat.toLowerCase(), subPtToBump)
		e.balance = Number(e.balance) + ppeboxes
		if (cAbno.gift === "true") {
			let gifttxt = ""
			let gift = gear.gifts.find(g => g.id === cAbno.id)
			let giftRoll = fn.gift(e, cAbno.id, {"mood": moodResult})
			if (giftRoll[0] === true) {
				gifttxt = "Rolled the gift: " + `${gift.name} [${sSlotText(gift.slot)}] - ${gift.text}.`
				if (giftRoll[1] === 1) gifttxt += " It replaced the previous one." 
			}
			else if (giftRoll[0] === false && giftRoll[1] === 1) gifttxt = "Rolled the gift, but the slot was locked."
			console.log("Gift Roll: " + giftRoll.join(", "))
			if (gifttxt != "") channel.send(gifttxt)
		}
		fn.effectApplication['fatigue'](e, cAbno.risk)
		fn.effectApplication['workCD'](e, cAbno.peoutput)
		} else rMsg.edit("\n```mb\n ⚙️ | Employee " + e.tag + " is working " + order + " on " + cAbno.name + "\n```" + `	Work incomplete... You have died. Lost nothing, for now.${moodEffectResult}\n	Remaining HP:	${Math.floor(e.hp*1000)/1000} ${jn.health}\n	Remaining SP:	${Math.floor(e.sp*1000)/1000} ${jn.sanity}\n	Damage taken: ${damageArray.join(",  ")}.`)	
		e.working = 0
	}
	channel.send("\n```mb\n ⚙️ | User " + e.tag + " is working " + order + " on " + cAbno.name + "\n```").then(m => {
	asyncEdit(m)})
	console.log(rollArr)
}

// Push an employee into an array
function eArrPush(e, arr = dbployees) {
	arr.push(new cEmp(e.userid, e.usertag, e.hp, e.sp, e.fortitude, e.prudence, e.temperance, e.justice, e.suit, e.weapon, e.inventorys, e.inventoryw, e.working, e.dead, e.balance, e.balancespecific, e.subpoints, e.effects, e.buffs, e.defensebuffs, e.bufflist, e.tjtime, 100, e.gifts, e.inventory))
}

// Ticks all employees' effects
function globalEffectTick() {
	efflog = efflog + 1 // efflog is responsible for effect logging
	dbployees.forEach(e => {
	if (exists(e) === false) return // If the employee doesn't exist, don't bother
	let effects = []
	let effectsNew = []
	let persistentEffects = ["1"] // Effects that don't get removed on death
	if (exists(e.effectArray)) { // If the effect array has anything in it
		effects = e.effectArray.filter(e => exists(e[0])) // Filter out any effects that are null or otherwise nonexistent
		effects.forEach(eff => {
		if (eff[0] === "0") e.heal("hp", 0.1) // Fairies' effect heals 0.1 hp per tick (second)
		if (Number(e.dead) === 1 && persistentEffects.includes(eff[0]) === false) eff = 'null' // If the effect is EGO change cooldown then it doesn't get removed on death
		if (eff[1] != "inf") { // We don't touch inf effects
		if (Number(e.dead) === 1) {
			if (eff[0] === "1") {eff[1] -= 1; if (eff[1] > 0) effectsNew.push(eff)}
			else eff[1] = 0
		} else {eff[1] -= 1; if (eff[1] > 0) effectsNew.push(eff)}
		} else effectsNew.push(eff)
		}) //.map(e => e.join("/")).join("|")
		effectsNew.filter(eff => exists(eff) && exists(eff[0]))
		if (exists(effectsNew)) {
		e.effects = effectsNew.map(eff => eff.join("/")).join("|") // Wraps the effects array up neatly and puts them on the employee
		} else e.effects = 'null'
		if (exists(e.effects) === false && e.effects != "null") e.effects = "null"
	}
	})
	if (efflog >= debugVariables["effect_log"]) efflog = 0
}

// Updates the data to the database
function updateData() {
	let dbployeesActual = []
	let pushBig = []
	connection.query("SELECT * FROM `employees`", function (err, result) {
	result.forEach(r => {
	eArrPush(r, dbployeesActual)
	})
	if (err) throw err
	dbployees.forEach((e, i) => {
		let eActual = dbployeesActual.find(d => d.id === e.id)
		if (exists(e) === false) return
		let pushSmall = []
		for (const prop in e) {
		if (eActual[prop] != undefined && prop != "luck") {
			let lValue = e[prop]
			if (prop === "hp" || prop === "sp") lValue = Number(lValue)*100
			if (eActual[prop] != lValue && Number(eActual[prop]) != lValue) {					
			pushSmall.push("`" + prop + "` = '" + lValue + "'")
			}
		}
		}
		let pushSmallStr = "UPDATE `employees` SET " + pushSmall.join(", ") + " WHERE `employees`.`userid` = '" + e.id + "';"
		if (exists(pushSmall)) pushBig.push(pushSmallStr)
	})
	pushBig.forEach(q => {
	queryAndWait(q, connection)
	})
	//console.log("Updated the database.")
	//console.log(pushBig)
	})
}

// Functions like databaseEmployees()
function databaseAbnos() {
	abnos = []
	dbnos = []
	jn.abnWorkable.forEach(a => {
	abnos.push({"id": abno(a).id, "tag": a})
	})
	connection.query("SELECT * FROM `abnormalities`", function (err, result) {
	result.forEach(r => dbnos.push(r))
	console.log(dbnos)
	let abnodbpush = []
	abnos.forEach(a => {
	if (dbnos.some(dbAbno => dbAbno.id === a.id) === false) abnodbpush.push(a.id)
	else console.log(`${abn.abn.find(a1 => a1.id === a.id).name} included!`)
	})
	abnodbpush.forEach(e => {
		let sql = "INSERT INTO abnormalities (id, state, qcounter) VALUES ('" + e + "', '0', 'und')";
		connection.query(sql, function (err, result) {
		if (err) throw err;
		console.log(`${abn.abn.find(a => a.id === e).name} inserted!`)
		})
	})
	})
}

// Gets the employee data from the database
function databaseEmployees() {
	employees = []
	dbployees = []
	let dbpush = []
	DELTAS().members.forEach(m => {
	if (drFind(m)) employees.push({"id": m.id, "tag": m.user.tag, "team": drFind(m)})
	})
	connection.query("SELECT * FROM `employees`", function (err, result) {
		if (err) throw err
		let zeroBalanceArray = abn.abn.map(a => [a.code, "0"])
		result.forEach(e => eArrPush(e))
		employees.forEach(e => {
			if (dbployees.ids().includes(e.id)) {console.log(`Employee ${e.tag} is included!`)}
			else {dbpush.push({"id": e.id, "tag": e.tag})}
		})
		console.log("To push:")
		console.log(dbpush)
		dbpush.forEach(e => {
		var sql = "INSERT INTO employees (userid, usertag, balancespecific, hp, sp) VALUES ('" + e.id + "', '" + e.tag + `', '${zeroBalanceArray.map(b => b.join("|")).join(" ")}', '1700', '1700')`;
		queryAndWait(sql, connection)
		console.log(`${e.tag} inserted!`)
		eArrPush(new cEmp(e.id, e.tag))
		})
		
		dbployees.forEach(e => {
			zeroBalanceArray.forEach(b => {
			if (e.balanceSpecificArray.some(bs => bs[0].toLowerCase() === b[0].toLowerCase()) === false)
				e.balancespecific += ` ${b.join("|")}`
			})
		})
	})
}

// The heal pulse in regenerator rooms
function healPulse() {
	if (debugVariables.heal_pulser === 1) {
		dbployees.forEach(em => {
		async function healTick(e) {
			/* if (e.id === '143261987575562240') console.log("Heal SP: " + dbployees.e(e.id).heal("sp", Math.ceil(e.prudL/60) + e.prudL/60))
				else */ dbployees.e(e.id).heal("sp", Math.ceil(e.prudL/60) + e.prudL/60)
			await wait(1)
			/* if (e.id === '143261987575562240') console.log("Heal HP: " + dbployees.e(e.id).heal("hp", Math.ceil(e.fortL/60) + e.fortL/60))
				else */ dbployees.e(e.id).heal("hp", Math.ceil(e.fortL/60) + e.fortL/60)
			await wait(1)
			if (e.hp < -0.5*e.fortL) e.hp = -0.5*e.fortL
			if (e.sp < -0.5*e.prudL) e.hp = -0.5*e.prudL
			if (e.hp > e.fortL) e.hp = e.fortL
			if (e.sp > e.prudL) e.sp = e.prudL
			if ((e.hp === Number(e.fortL)) && (e.sp === Number(e.prudL)) && (Number(e.dead) === 1)) 
			e.dead = 0
			else e.working = 0
		if (e.drFind) {
		if (exists(e.tjtime) === false) e.tjtime = Date.now()
		if (e.buffListArray.some(eff => eff[0].startsWith("team")) === false) {
		if (e.tjtime != undefined && (Date.now() - (e.tjtime - 0))/(1000*60*60*24) > 3) {
		fn.effectApplication['department'](e, drFind(DELTAS().members.get(e.id)), "give")
		}
		}
		}
		}
		healTick(em)
		})
	}
}

// Responsible for all regular time-based things
async function globalTicker() {
	let tick = 0
	while (true) {
		tick++
		await wait(1000)
		globalEffectTick()
		if (tick === 30)
			updateData()
		if (tick === 60) {
			healPulse()
			updateData()
			tick = 1
		}
			
	}
}

client.on('ready', () => {

bch = DELTAS().channels.get("607558082381217851");
// Bot readiness announcement, both in the log, #botspam and in my DMs
console.log('I am ready!')
bch.send("Bot started.")
client.users.get('143261987575562240').send('Bot started up succesfully.')
// Setting the bot's current game to 'try !help'
client.user.setPresence({
	game: {
		name: 'try !help',
		type: "Playing",
		url: "https://tinyurl.com/rollntroll"
	}
})	



// Get employee data from the database
databaseEmployees()
// Global ticker function, responsible for the heal pulser, data updating and effect ticking
globalTicker()
	
})

client.on('guildMemberUpdate', () => {
	
async function dip(member, action = 0) {
	await wait(1000)
	if (action === 1)
	await member.removeRole(DELTAS().roles.find(r => r.name === "TO THE RANCH"))
		.catch(console.error)
	else await member.addRole(DELTAS().roles.find(r => r.name === "TO THE RANCH"))
		.catch(console.error)
	return true
}
let regLevel = new RegExp(`\\bLevel`)
DELTAS().members.forEach(m => {
	if (m.roles.some(r => regLevel.test(" " + r.name))) {
	let levelRole = m.roles.find(r => regLevel.test(" " + r.name))
		if (m.roles.some(r => jn.risk.includes(r.name))) {
			if (m.roles.some(r => r.name === "TO THE RANCH"))
				m.removeRole(m.roles.find(r => jn.risk.includes(r.name)))
				.catch(console.error)
		} else if (m.roles.some(r => r.name === "TO THE RANCH") === false) 
			m.addRole(DELTAS().roles.find(r => r.name === jn.risk[jn.levels.indexOf(levelRole.name)]).id)
			.catch(console.error)
	}
	if (m.roles.some(r => r.name === "RANCHDIP")) {
		if (m.roles.some(r => r.name === "TO THE RANCH")) dip(m, 1)
		else dip(m)
	}
})
	
})

client.on('message', initialMessage => {
	


let chPass = 0 // Normally, minigame commands can only be used in the #minigame channels
let botPass = 0 // Normally, the bot ignores messages from bots

let msg
{
let tempMessage = initialMessage
function sudoCheck() {
if (tempMessage.content.split(" ")[0] === "sudo") {
	if (tempMessage.author.id === '143261987575562240') {
	let tcontent = tempMessage.content.split(" ")
	tcontent.shift()
	tempMessage.content = tcontent.join(" ")
	chPass = 1
	} else (tempMessage.channel.send(`**${tempMessage.author.tag}**, ` + "error: you do not have permission to use `sudo`."))
}}
sudoCheck()
let content = tempMessage.content
while (content.split(" ")[0].slice(0,2) === ">!") {
	content = content.slice(2)
	let cArr = content.split(" ")
	if (getUser(cArr[0]) === client.user || tempMessage.author.id === '143261987575562240') {
	if (getUser(cArr[0]) != undefined) {
		tempMessage.author = client.users.get(getUser(cArr[0]).id)
		tempMessage.member = DELTAS().members.get(getUser(cArr[0]).id)
		botPass = 1
	}} else {initialMessage.channel.send(`**${initialMessage.author.tag}**, ` + "you do not have permission to use `>!` on that user."); return}
	cArr.shift()
	content = cArr.join(" ")
	tempMessage.content = content
	msg = tempMessage
	sudoCheck()
}
msg = tempMessage
}

if ((debugVariables.stop_all === 1) && (msg.author.id != '143261987575562240')) return // If the 'stop" debug variable is 1, the bot only parses my commands

// If the message's author is a bot, just ignore it
if (msg.author.bot && botPass === 0 && ((msg.content.startsWith("Initiating vote for ") === false))) return;

// Handy vars
ch = msg.channel
mesc = msg.content

// Evil logger so I can see everything that goes on at the sever >:Dc
if (ch.type != 'dm') {
let log = msg.createdAt + msg.channel.name + " " + msg.author.username + ": " + msg.content
console.log(log);
}

// Vote stuff - I positively cannot be arsed to rewrite this shite
if ((mesc.startsWith("Initiating vote for ")) && (debugVariables.voting === 1) && (msg.author.id === '607520778178527246')) {
	voting = 1
	voteeid = ""
	mesc.split(" ")[3].split("").forEach(c => {
		if (nmbrs.includes(c)) {voteeid += c}
	})
	voteeuser = DELTAS().members.find("id", voteeid)
	cptxt = drFind(voteeuser)
	debugVariables.voting = 0
	timeout = 1
	vtd = [] 
	yee = 0
	boo = 0
	if ((DELTAS().roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length) > (5 + Math.floor(DELTAS().roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length / 2))) {
		reqv = 5 + Math.floor(DELTAS().roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length / 2)
	} else {reqv = DELTAS().roles.get(getRole(votingteam).id).members.map(m=>m.user.id).length}
	msg.react('✅')
	msg.react('🚫')
	override = 0
	const filter = (reaction, user, voted) => ((reaction.emoji.name === ('✅') || reaction.emoji.name === ('🚫') || (reaction.emoji.name === '🦆')) && DELTAS().roles.get(getRole(votingteam).id).members.map(m=>m.user.id).includes(user.id) && vtd.includes(user.id) === false)
	const collector = msg.createReactionCollector(filter, { time: 15000 })
	collector.on('collect', rct => {//${rct.emoji.name}
		lru = rct.users.map(u => u.id).pop()
		lrn = client.users.find("id", lru)
		if (rct.emoji.name === '✅') {yee++; console.log(`${lrn.tag} voted yee!`); console.log(rct.users.map(u => u.id))}
		if (rct.emoji.name === '🚫') {boo++; console.log(`${lrn.tag} voted boo!`); console.log(rct.users.map(u => u.id))}
		vtd.push(lru)
		if ((rct.emoji.name === '🦆') && (lru === '143261987575562240')) {yee = reqv; console.log("Ducktest"); boo = 0; override = 1}
		if (vtd.length >= reqv || override === 1) {
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

// Command check
if (mesc[0] === "!") {
	
// Make an array with values equal to the command name and arguments
var ciCmd = mesc.slice(1).toLowerCase().split(" ")
var csCmd = mesc.slice(1).split(" ")

// Check if the command even exists (if it is in the right guild)
if (cmds.includes(ciCmd[0]) === false && msg.guild === DELTAS()) {
	ch.send("**" + msg.author.tag + "**, " + "Unrecognized command. Type in !help to get the list of all available commands.")
	return
	}

switch (ciCmd[0]) {
	
	case "quote": {
	if (/\D/.test(ciCmd[1]) === false) {
		let qIndex = Number(ciCmd[1])
		if (qIndex > qte.length) {
			ch.send("**" + msg.author.tag + "**, " + "Sorry, only " + qte.length + " quotes are currently available.")
			return
		}
		ch.send(qte2 + qIndex + ": " + qte[qIndex-1])
	}
	else {
		let qRoll = roll(qte.length) - 1
		while (quotelog.includes(qRoll)) {qRoll = roll(qte.length) - 1}
		quotelog.push(qRoll)
		if (quotelog.length > Math.ceil((qte.length * 4) / 5)) quotelog.shift()
		ch.send(qte2 + (qIndex + 1) + ": " + qte[qIndex])
	}
	} break
	
	case "em": {
	yeet(0)
	if (DELTAS().emojis.some(e => e.name.toLowerCase() === ciCmd[1])) {
		if (/\D/.test(ciCmd[2]) === false) {
			let eCount = Number(ciCmd[2])
			if (eCount > 27) eCount = 27
			ch.send(new Array(eCount).fill(emoji(ciCmd[1])).join(""))
		}
	}
	} break
	
	case "ban": {
	
	if (admins.includes(msg.author.id) === false) {
		ch.send("**" + msg.author.tag + "**, " + "you do not have permission to use `!ban`.")
		return
	}
	
	let amount
	if (/\D/.test(ciCmd[2])) amount = 60
	else amount = Number(ciCmd[2])
	if (amount < 0 || amount > 120) {
		ch.send("**" + msg.author.tag + "**, " + "error: cannot ban for less than 0 or more than 120 seconds.")
		return
	}
	let member = DELTAS().members.get(getUser(ciCmd[1]).id)
	let roles = member.roles.filter(r => r.managed === false).array().map(r => r.id)
	if (member.user.bot === true) {
		ch.send("**" + msg.author.tag + "**, " + "error: cannot ban bots.")
		return
	}
	member.removeRoles(roles)
		.then(() => {
		ch.send(`Banned **${getUser(ciCmd[1]).tag}** for ${amount} seconds.`); 
		member.addRole('673218574101512214')
		})
		.catch(console.error)
	wait(amount*1000).then(() => {
		let backRoles = roles.filter(r => member.roles.array().some(mr => mr.id === r) === false)
		if (backRoles != []) member.addRoles(backRoles).then(() => 
		member.removeRole('673218574101512214')
		.catch(console.error)
		)
		.catch(console.error)
	})
	} break
	
	case "debug": {
		
	if (msg.author.id != '143261987575562240') {
		ch.send("**" + msg.author.tag + "**, " + "you do not have permission to use debug commands.")
		return
	}
	
	switch (csCmd[1]) {
		case "upd":
			updateData()
		break
		case "e":
		case "employee":
			let uid2 = ""
			if (exists(getUser(ciCmd[2]))) uid2 = getUser(ciCmd[2]).id; else uid2 = '143261987575562240'
			console.log(dbployees.e(uid2))
		break
		case "msg":
			let tempch = DELTAS().channels.get(ciCmd[2])
			let tempmsg = ""
			let i
			for (i = 3; i < cmd.length; i++) { 
				tempmsg += cmd1[i] + " ";
			} 
			tempch.send(tempmsg)
			.catch(console.error)
		break
		case "healpulse":
			healPulse()
		break
		case "var":
			if (exists(ciCmd[2]) && exists(ciCmd[3]) && exists(debugVariables[ciCmd[2]])) debugVariables[ciCmd[2]] = Number(ciCmd[3])
			else ch.send("Error: incorrect usage.")
		break
		case "p":
		case "profile": // !debug[0] profile[1] hp[2] 100[3] quack[4]
			{
			let uid
			let lValue
			if (exists(getUser(ciCmd[4]))) uid = getUser(ciCmd[4]).id; else uid = '143261987575562240'
			if (/\D/.test(ciCmd[3]) === false) lValue = Number(ciCmd[3])
			else lValue = ciCmd[3]
			dbployees.e(uid)[ciCmd[2]] = lValue
			updateData() 
			}
		break
		case "healtest":
			console.log("heal test: " + dbployees.e('143261987575562240').heal("sp", 100))
			
			break
		case "revive":
			{
			let uid
			if (exists(getUser(ciCmd[4]))) uid = getUser(ciCmd[4]).id; else uid = '143261987575562240'
			dbployees.e(uid).hp = dbployees.e(uid).fortL
			dbployees.e(uid).sp = dbployees.e(uid).prudL
			dbployees.e(uid).dead = 0
			dbployees.e(uid).working = 0
			}
		break
		default:
		ch.send("Unknown debug command.")
		return
		break
	}
	ch.send("Debug command executed.")
	} break
	
	case "lobcorp":
	case "lc": {
	if ((minigameChannels.includes(ch.id))||(chPass === 1)) {
		if (dbployees.e(msg.author.id) || (ciCmd[1] === "help") || (ciCmd[1] === "assign")) {
		switch (ciCmd[1]) {
				
			case "list": {
				if (exists(ciCmd[2]) && ncdeproles.some(r => r.toLowerCase().startsWith(ciCmd[2]))) {
					let cDepartment = getRole(ncdeproles.find(r => r.toLowerCase().startsWith(ciCmd[2])))
					let cDepMembers = cDepartment.members.map(m => m.user.tag)
					let cDMText = cDepartment.members.map(m => m.user.tag).join(", ")
					if (cDMText = "") cDMText = "The department is empty... *crickets*"
					let cDepCaptain = "none."
					let cDCRole = getRole(cDepartment.name + " (C)")
					if (cDCRole.members.array != []) cDepCaptain = cDCRole.members.first().user.tag
					ch.send("\n```md\n" + `[${cDepartment.name}]\n>	Captain: ${cDepCaptain}\n#	Employees: ${cDMText}` + "\n```")
				} else {
					let depArray = []
					ncdeproles.forEach(r => {
						let cDepECount = 0
						let cDECS
						let ifNone // If no emplyees
						let ifEIO = "s" // If ends in one
						cDepECount += getRole(r).members.array().length + getRole(r + " (C)").members.array().length
						if (cDepECount.toString().split("")[cDepECount.toString().length - 1] === "1") ifEIO = ""
						if (cDepECount === 0) cDECS = "no"; else cDECS = cDepECount.toString()
						let cDepCaptain = getRole(r + " (C)").members.first()
						if (cDepCaptain) cDepCaptain = cDepCaptain.user.tag; else cDepCaptain = "none"
						depArray.push(`[${r}] (${empcounts} employee${ifEIO}) \n		Captain:\n#		${cDepCaptain}`)
					})
					ch.send("List of departments and the respective captains: \n```md\n" + depArray.join(", \n") + ".```")
				}
				
			} break
			
			case "w":
			case "work": {
			if (ciCmd[2] != "list") {
				if (abno(ciCmd[2])) {
				if (jn.abnWorkable.includes(ciCmd[2])) {
				if (jn.workOrders.includes(ciCmd[3])) {
				if (dbployees.e(msg.author.id).working === 0) {
				if (dbployees.e(msg.author.id).dead === 0) {
				let effectDead = false
				let effectDeathCause = ""
				let onCooldown = false
				let cdVal = 0
				if (fn.effects.deathOnWork(dbployees.e(msg.author.id), ciCmd[2])[0] === true) {
					effectDead = true
					effectDeathCause = fn.effects.deathOnWork(dbployees.e(msg.author.id), ciCmd[2])[2]
				}
				if (dbployees.e(msg.author.id).effectArray.some(e => Number(e[0]) === 2)) {
					onCooldown = true
					cdVal = dbployees.e(msg.author.id).effectArray.find(e => Number(e[0]) === 2)[1]
				}
				if (onCooldown === false) {
				if (effectDead === false) {
					work(dbployees.e(msg.author.id), ciCmd[2], ciCmd[3], msg.channel)
				} else {
					dbployees.e(msg.author.id).dead = 1
					dbployees.e(msg.author.id).hp = 0
					dbployees.e(msg.author.id).sp = 0
					dbployees.e(msg.author.id).effects = "null"
					ch.send("**" + msg.author.tag + "**, " + "you have died. Cause of death: " + effectDeathCause)
				}
				} else ch.send("**" + msg.author.tag + "**, " + "you are still on a cooldown. " + `(~${Number(cdVal) + 1} second(s))`)
				} else ch.send("**" + msg.author.tag + "**, " + "error: you are dead.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: you are already currently working on an abnormality.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect work order. Orders: instinct, insight, attachment, repression.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: work on the specified abnormality unavailable. (!lc w list)")
				} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect abnormality code specified or specified abnormality unavailable. (!lc w list)")
				} else { // Else it is the list
					let baseStr = " List of currently workable abnormalities:```\n		"
					let workableIDs = jn.abnWorkable
					workableIDs.sort(function(a, b){return Number(a.split("-")[2])-Number(b.split("-")[2])})
					workableIDs.sort(function(a, b){return jn.risk.indexOf(abno(a).risk)-jn.risk.indexOf(abno(b).risk)})
					let workableArr = []
					let workableCpx = []
					let index = 0
					workableIDs.forEach(aID => {
						if (aID != "o-01-01")
						workableArr.push(emoji(abno(aID).risk.toLowerCase(), ESERV()) + "	`" + abno(aID).name + "` ")
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
			} break
			
			case "p":
			case "profile": {
			let cUser
			if (exists(getUser(ciCmd[2]))) {
			if (dbployees.ids().includes(getUser(ciCmd[2]).id)) {
				cUser = dbployees.e(getUser(ciCmd[2]).id)
			} else cUser = dbployees.e(msg.author.id)
			} else cUser = dbployees.e(msg.author.id)
			if (exists(cUser.tjtime) === false) cUser.tjtime === Date.now()
			let expMod = 0
			if (cUser.buffListArray.some(b => b[0] === "teamtr")) 
				expMod = Math.pow(2, Number(cUser.buffListArray.find(b => b[0] === "teamtr")[1]))
			let effectArray = []
			if (exists(cUser.effectArray)) {
				cUser.effectArray.forEach(e => {
					let effectTime = ""
					let effectSpecialString = ""
					if (e[1] === "inf") 
						effectTime = `???`
					else {
						if (Number(e[1]) > 60) effectTime = (Number(e[1])/60).toFixed(1) + " minute(s)"
						else effectTime = e[1] + " second(s)"
					}
					if (e[2] === "fatigue")
						effectSpecialString = ` [+${Math.floor(Number(e[3])/3)} second(s) to work CD]`
					effectArray.push(`${"\n" + e[2]} ${effectSpecialString} <${effectTime}>`)
				})
			} else effectArray = ["none"]
			let dead = ["alive", "dead"][Number(cUser.dead)]
			let statsString = []
			for (m = 0; m < 4; m++) {
				let statLV = "LV " + statLVL(cUser.stats[m])
				let pn
				if (cUser.statBuffArray[m] < 0) pn = "-"
				else pn = "+"
				let statCount = `${cUser.statsReal[m]}${pn}${cUser.statBuffArray[m]}`
				if (statLV.length < 6)
					for (k = 0; k < (7 - statLV.length); k++) {statLV = " " + statLV}
				if (statCount.length < 6)
					for (k = 0; k < (7 - statCount.length); k++) {statCount += " "}
				statsString.push("	`" + statLV + "` " + jn[jn.stats[m]] + " `" + statCount + "`")
			}
			statsString[1] += "\n"
			let subPointString = []
			let n = 0
			while (n < 4) {
				let mult = 1
				let subStatIncrement = 14 - expMod
				if (n === 3) mult = 3
				let requiredSubpoints = statLVN(cUser.statsReal[n])*subStatIncrement*mult
				let subPointCount = cUser.subPointsArray[n] + "/" + requiredSubpoints
				if (subPointCount.length < 9)
					for (k = 0; k < (9 - subPointCount.length); k++) {subPointCount += " "}
				let stat = jn[jn.stats[n]]
				subPointString.push("	" + stat + " `" + subPointCount + "`")
				n++
			}
			subPointString[0] = "	" + subPointString[0]
			subPointString[1] += "\n	"
			let messageArray = [
"\n```mb\n 📋 | Showing stats for employee " + cUser.tag + "\n```",
statsString.join(""),
`\n	${bck}Employee Level ${jn.statLevels[cUser.stats[4]-1]}${bck}\n`,
`\nProgress towards the next stat points:\n${subPointString.join("")}`,
`\n\nDays in the department: ${((Date.now() - Number(cUser.tjtime))/(3600000*24)).toFixed(1)}`,
`\nCurrent effects: ${effectArray.join("")}.`,
`\nCurrently:	${dead}.`,
`\n	HP: ${Number(cUser.hp).toFixed(1)} ${jn.health}		SP: ${Number(cUser.sp).toFixed(1)} ${jn.sanity}`,
`\n\n	Suit: ${suit(Number(cUser.suit), cUser.defenseBuffArray)}`,
`\n	Weapon: ${weapon(Number(cUser.weapon))}`
			]
			ch.send(messageArray.join(""))
			} break 
			
			
			case "inv":
			case "i": {
			
			function inv(emp, channel) {
				
			class localItem { // Because it fucking refuses to work without a class.
				constructor(id, index, type) {
					this.id = id
					this.index = index
					this.type = type
				}
			}
			
			cUser = emp
			const cCh = channel
			const header = "\n```mb\n 📦 | Showing inventory of " + cUser.tag + "```" + `		${jn.pebox} PPE Boxes: ${cUser.balance}\n`
			const acts = `Type in 'equip' to open the equip menu, 'discard' to open the equipment removal menu, 'bullet' to open the bullet menu, 'exit' to leave.`
			
			let inventoryS // Local suit object inventory
			let inventoryW // Local weapon object inventory
			let inventorySW // Concatted previous two
			let suits // Suit text objects
			let weapons // Weapon text objects
	
			function updateInventories(d = 0) {
				inventoryS = []
				inventoryW = []
				if (exists(cUser.inventorys)) inventoryS = cUser.inventorys.split("|")
				if (exists(cUser.inventoryw)) inventoryW = cUser.inventoryw.split("|")
				if (d === 0) {
				inventoryS.unshift("0")
				inventoryW.unshift("0")
				}
				inventoryS = inventoryS.map((s, i) => new localItem(Number(s), i+1, "suit"))
				inventoryW = inventoryW.map((w, i) => new localItem(Number(w), i+inventoryS.length+1, "weapon"))
				inventorySW = /*A franchise fucked in the ass by Mickey*/ inventoryS.concat(inventoryW)
			}
			updateInventories()
			suits = inventoryS.map(s => suit(s.id))
			weapons = inventoryW.map(w => weapon(w.id))
			cCh.send(header + `\n		Suits:	\n	${suits.join("\n	")}\n		Weapons:	\n	${weapons.join("\n	")}\n\n` + acts).then(menumsg => {
			
			let menuIndex = "main"
				
				async function menuNavigationInventory() {
					while ((menuIndex != "exit") && (menuIndex != "timeout") && (menuIndex != "fail") && (menuIndex != "test") && (menuIndex != "interExit")) {
					await cCh.awaitMessages(r => r.author.id === cUser.id, { max: 1, time: 25000 }).then(r => {
					let rp = r.first()
					if (rp != undefined) {
					let mr = rp.content.toLowerCase().split(" ")
					
					if (mr[0] != "!lc") {
					if (mr[0] != "exit") {
					if (mr[0] === "cancel") {
						menuIndex = "main"
					}	
						let ret = 0
						let k = 0
						let ki = 0
						while (k === 0 && ki < 6) {
						switch (menuIndex) {
							case "main":
								updateInventories()
								suits = inventoryS.map(s => `${suit(s.id)}`)
								weapons = inventoryW.map(w => `${weapon(w.id)}`)
								menumsg.edit(header + `\n		Suits:	\n	${suits.join("\n	")}\n		Weapons:	\n	${weapons.join("\n	")}\n\n` + acts)
								if (ret === 1) {ret = 0; k = 1; break}
								if (["bullet", "equip", "discard"].includes(mr[0])) menuIndex = mr[0]
								else k = 1
							break
							
							case "bullet":
							if (menuIndex === "bullet" && ret != 1 && k != 1) {
							let inv = cUser.inventory.split("/").map(i => [i.split("|")[0], i.split("|")[1]]).filter(i => exists(i[0]))
							let hpbullet = 0
							let spbullet = 0
							if (inv.some(i => i[0] === "hpbullet")) hpbullet = inv.find(i => i[0] === "hpbullet")[1]
							if (inv.some(i => i[0] === "spbullet")) spbullet = inv.find(i => i[0] === "spbullet")[1]
							if ((mr[0] === "sp") || (mr[0] === "hp")) {
							if ({"hp": hpbullet, "sp": spbullet}[mr[0]] > 0) {
								if (cUser.dead === 1 || cUser.dead === "1") {
									cCh.send(`**${cUser.tag}**, you are currently dead and cannot use buff bullets.`)
									return
									}
								if (Number.isInteger(Number(mr[1]))) {
									if (Number(mr[1]) > {"hp": hpbullet, "sp": spbullet}[mr[0]]) {cCh.send(`**${cUser.tag}**, you do not have that many ${mr[0].toUpperCase()} bullets.`); return}
									else if (Number(mr[1] <= 0)) {cCh.send(`**${cUser.tag}**, incorrect argument.`); return}
									else {
									for (i = 0; i < Number(mr[1]); i++) 
									{fn.effectApplication[mr[0] + "bullet"](cUser)}
									cCh.send(`**${cUser.tag}** used ${mr[1]} ${mr[0].toUpperCase()} bullets. (${healCalc(cUser, mr[2], 15*Number(mr[1]))} ${jn[mr[0]+"heal"]}, ${cUser[mr[0]] + "/" + cUser.stats[["hp", "sp"].indexOf(mr[0])]} ${jn[mr[0]]} currently)`)
									}
								}
								else {
								fn.effectApplication[mr[0] + "bullet"](cUser)
								cCh.send(`**${cUser.tag}** used an ${mr[0].toUpperCase()} bullet. (${healCalc(cUser, mr[2], 15)} ${jn[mr[0]+"heal"]}, ${cUser[mr[0]] + "/" + cUser.stats[["hp", "sp"].indexOf(mr[0])]} ${jn[mr[0]]} currently)`)
								}										
							}
							else cCh.send(`**${cUser.tag}**, you do not have any ${mr[0].toUpperCase()} bullets.`)
							}
							k = 1
							if (inv.some(i => i[0] === "hpbullet")) hpbullet = inv.find(i => i[0] === "hpbullet")[1]
							if (inv.some(i => i[0] === "spbullet")) spbullet = inv.find(i => i[0] === "spbullet")[1]
							menumsg.edit(header + `\n	Bullet inventory:\n		${jn.hpheal} HP Bullets: ${hpbullet}\n		${jn.spheal} SP Bullets: ${spbullet}\n\n	Type in 'hp' or 'sp' to use the respective bullet, 'sp'/'hp' (number) to use multiple bullets, 'cancel' to go back, 'exit' to exit.`)
							}
							break
							
							case "equip":
							if (menuIndex === "equip" && ret != 1 && k != 1) {
							if (cUser.effectArray.some(e => Number(e[0]) === 1)) {
								ch.send(`**${cUser.tag}**, you are still on an E.G.O. change cooldown.`)
								ret = 1
							}
							else {
							updateInventories()
							suits = inventoryS.map(s => `${bck+s.index+bck}) ${suit(s.id)}`)
							weapons = inventoryW.map(w => `${bck+w.index+bck}) ${weapon(w.id)}`)
							if (exists(suits) === false) suits = "None."
							if (exists(weapons) === false) weapons = "None."
							menumsg.edit(header + `\n		Suits:\n	${suits.join("\n	")}\n		Weapons:\n	${weapons.join("\n	")}\n\n	Type in the number corresponding to the piece of E.G.O. gear you would like to equip, or go back with 'cancel'.`)
							if (inventorySW.some(i => i.index === Number(mr[0]))) {
								let choiceLocal = inventorySW.find(i => i.index === Number(mr[0]))
								let choiceItem = gear[choiceLocal.type+"s"].find(i => Number(i.id) === choiceLocal.id)
								let choiceText
								if (choiceLocal.type === "suit")
									choiceText = suit(choiceLocal.id)
								else choiceText = weapon(choiceLocal.id)
								if (cUser.stats.every((s, i) => s >= choiceItem.requirements[i])) {
									cCh.send(`**${cUser.tag}** equipped ${choiceText}`)
									fn.effectApplication.egoChange(cUser, jn.risk.indexOf(choiceItem.level)+1)
									cUser[choiceLocal.type] = choiceItem.id
								} else {cCh.send(`**${cUser.tag}**, error: you do not meet the requirements for equipping that piece of E.G.O. gear. (**${choiceItem.reqString}**)`); ret = 1}
							}
							k = 1
							}} break
							case "discard": 
							if (menuIndex === "discard" && ret != 1 && k != 1) {
							updateInventories(1)
							suits = inventoryS.map(s => `${bck+s.index+bck}) ${suit(s.id)}`)
							weapons = inventoryW.map(w => `${bck+w.index+bck}) ${weapon(w.id)}`)
							if (exists(suits) === false) suits = ["None."]
							if (exists(weapons) === false) weapons = ["None."]
							menumsg.edit(header + `\n		Suits:\n	${suits.join("\n	")}.\n		Weapons:\n	${weapons.join("\n	")}.\n\n	Type in the number corresponding to the piece of E.G.O. gear you would like to **discard**, or go back with 'cancel'.`)
							if (inventorySW.some(i => i.index === Number(mr[0]))) {
								let choiceLocal = inventorySW.find(i => i.index === Number(mr[0]))
								let choiceItem = gear[choiceLocal.type+"s"].find(i => Number(i.id) === choiceLocal.id)
								let choiceText
								if (choiceLocal.type === "suit")
									choiceText = suit(choiceLocal.id)
								else choiceText = weapon(choiceLocal.id)
								cCh.send(`**${cUser.tag}** discarded ${choiceText}`)
								removeItemID(cUser, "inventory"+choiceLocal.type[0], choiceItem.id)
								menuIndex = "main"
								ret = 1
							} else k = 1
							} break
							
							default:
							k = 1
							menuIndex = "fail"
							break
						}
						ki++
						}
						if (ki > 5) menuIndex = "fail"
					} else menuIndex = "exit"
					} else menuIndex = "interExit"
					} else menuIndex = "timeout"

					}).catch(console.error)
				}
				if (menuIndex === "exit") menumsg.edit(menumsg.content + `\n\n	You have exited the menu.`)
				else if (menuIndex === "timeout") menumsg.edit(menumsg.content + `\n\n	Menu timed out.`)
				else if (menuIndex === "fail") menumsg.edit(menumsg.content + `\n\n	Something in the bot broke. Contact your local codemonkey to fix this issue.`)
				else if (menuIndex === "test") menumsg.edit(menumsg.content + `\n\n	Testing concluded.`)
				else if (menuIndex === "interExit") menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Another command noticed, automatically exiting the menu.`)
				else if (menuIndex === "silentexit") console.log("Exited silently. Woosh!")
				
			}
		
			menuNavigationInventory()
			})}
			inv(dbployees.e(msg.author.id), msg.channel)
			} break
			
			case "b": {
			let cUser = dbployees.e(msg.author.id)
			let cCh = msg.channel
			let mr = msg.content.toLowerCase()
			let inv = cUser.inventory.split("/").map(i => [i.split("|")[0], i.split("|")[1]]).filter(i => i[0] != undefined && i[0] != "" && i[0] != 'undefined')
			let hpbullet = 0
			let spbullet = 0
			if (inv.some(i => i[0] === "hpbullet")) hpbullet = inv.find(i => i[0] === "hpbullet")[1]
			if (inv.some(i => i[0] === "spbullet")) spbullet = inv.find(i => i[0] === "spbullet")[1]
			if ((mr.split(" ")[2] === "sp") || (mr.split(" ")[2] === "hp")) {
			if ({"hp": hpbullet, "sp": spbullet}[mr.split(" ")[2]] > 0) {
				if (cUser.dead === 1 || cUser.dead === "1") {
					cCh.send(`**${cUser.tag}**, you are currently dead and cannot use buff bullets.`)
					return
					}
				if (Number.isInteger(Number(mr.split(" ")[3]))) {
					if (Number(mr.split(" ")[3]) > {"hp": hpbullet, "sp": spbullet}[mr.split(" ")[2]]) {cCh.send(`**${cUser.tag}**, you do not have that many ${mr.split(" ")[2].toUpperCase()} bullets.`); return}
					else if (Number(mr.split(" ")[3] <= 0)) {cCh.send(`**${cUser.tag}**, incorrect argument.`); return}
					else {
					for (i = 0; i < Number(mr.split(" ")[3]); i++) 
					{fn.effectApplication[mr.split(" ")[2] + "bullet"](cUser)}
					cCh.send(`**${cUser.tag}** used ${mr.split(" ")[3]} ${mr.split(" ")[2].toUpperCase()} bullets. (${healCalc(cUser, mr.split(" ")[2], 15*Number(mr.split(" ")[3]))} ${jn[mr.split(" ")[2]+"heal"]}, ${cUser[mr.split(" ")[2]] + "/" + cUser.stats[["hp", "sp"].indexOf(mr.split(" ")[2])]} ${jn[mr.split(" ")[2]]} currently)`)
					}
				}
				else {
				fn.effectApplication[mr.split(" ")[2] + "bullet"](cUser)
				cCh.send(`**${cUser.tag}** used an ${mr.split(" ")[2].toUpperCase()} bullet. (${healCalc(cUser, mr.split(" ")[2], 15)} ${jn[mr.split(" ")[2]+"heal"]}, ${cUser[mr.split(" ")[2]] + "/" + cUser.stats[["hp", "sp"].indexOf(mr.split(" ")[2])]} ${jn[mr.split(" ")[2]]} currently)`)
				}										
			}
			else cCh.send(`**${cUser.tag}**, you do not have any ${mr.split(" ")[2].toUpperCase()} bullets.`)
			}
			} break
			
			case "help": {
			if (drFind(msg.member) === "") {
				ch.send("**" + msg.author.tag + "**, " + "To get assigned to a team, type in !lc assign (Team name).")
				
			} else {
				let helpArr = [
					"Disambiguation: arguments in [square brackets] are optional, arguments in (parentheses) are required for the command to work, arguments in {curly brackets} are options and only one needs to be specified.\n",
					"	`!lc p [employee's nickname/discord tag]` - shows the employee's profile if one is specified, shows yours otherwise.",
					"	`!lc w (abnormality ID) {instinct/insight/attachment/repression}` - executes the selected work order on the abnormality with the specified ID. Use `!lc w list` to see the list of all abnormalities currently in the facility.",
					"	`!lc ex [abnormality ID]` - shows the extraction menu. If an abnormality ID is specified, immediately takes you to that abnormality's equipment extraction menu.",
					"	`!lc debuff {apply/remove} (stat) [value]` - applies or removes a debuff on the selected stat. Removing a debuff does not require specifying the value.",
					"	`!lc list [department name]` - lists all departments' captains and member count if a department is not specified, lists a department's members and captain otherwise. Example: `!lc list training`",
					"	`!lc leave` - initiates the procedure of department unassignment. *Does* have a confirmation message.",
					"	`!lc captain`:",
					"		`!lc captain vote (@employee)` - initiates a vote for the mentioned employee to become the captain of your department, if one is not assigned already.",
					"		`!lc captain resign` - (captain command) initiates the procedure of captain role resignation. *Does* have a confirmation message."
				]
				ch.send(helpArr.join("\n"))
			}} break
			
			case "assign": {
			if (deproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false)) {
				var rtmp = ciCmd[2]
				if (jn.nccideproles.includes(rtmp)) {
					msg.member.addRole(getRole(ncdeproles[jn.nccideproles.indexOf(rtmp)]))
					employees.push({"id": msg.author.id, "tag": msg.author.tag, "team": drFind(msg.member), "tjtime": Date.now()})
					ch.send("**" + msg.author.tag + "**, " + "you have been successfully assigned to work in the " + ncdeproles[jn.nccideproles.indexOf(rtmp)] + "!")
					async function thisshit() {
						await wait(200)
						databaseEmployees()
						await wait(200)
						databaseEmployees()
						dbployees.e(msg.author.id).tjtime = Date.now()
					}
					thisshit()
				} else {ch.send("**" + msg.author.tag + "**, " + "error: incorrect team name. Example: !lc assign extraction team")}
			} else {ch.send("**" + msg.author.tag + "**, " + "you can only work in one team at a time. Leave your team (!lc leave) if you want to join another team.")}
			} break
			
			case "leave": {
			if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false)) {
			if (deproles.some(t => msg.member.roles.map(r => r.name).includes(t))) {
				ch.send("**" + msg.author.tag + "**, " + "do you really want to leave the " + drFind(msg.member) + "? **y**/**n**")
				const collector = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { time: 10000 })
				collector.on('collect', cmsg => {
				if (cmsg.content.toLowerCase() === "y") {
					ch.send("**" + msg.author.tag + "**, " + "you have left the " + drFind(msg.member) + ".") 
					if (dbployees.e(msg.author.id).buffListArray.some(b => b[0].startsWith("team"))) {
					fn.effectApplication['department'](dbployees.e(msg.author.id), drFind(msg.member), "take", 0)	
					}
					dbployees.e(msg.author.id).tjtime = 'undefined'
					msg.member.removeRole(getRole(drFind(msg.member)))
					collector.stop()
				}
				if (cmsg.content.toLowerCase() === "n") {ch.send("**" + msg.author.tag + "**, " + "team leave cancelled."); collector.stop()}
				})
			} else {ch.send("**" + msg.author.tag + "**, " + "you are not currently assigned to any team.")}
			} else {ch.send("**" + msg.author.tag + "**, " + "captains cannot simply leave their team! (!lc captain resign)")}
			} break
			case "debuff": {
			if (ciCmd[2]) {
				if (ciCmd[2] === "apply") {
				if (jn.stats.includes(ciCmd[3])) {
				if (/\D/.test(ciCmd[4]) === false) {
				if (Number(ciCmd[4]) > 0) {	
				if (exists(dbployees.e(msg.author.id).bufflist)) {
					if (dbployees.e(msg.author.id).bufflist.split("|").some(b => b.startsWith("manualDebuff/" + ciCmd[3]))) {
						ch.send("**" + msg.author.tag + "**, " + "you already have a debuff on " + ciCmd[3] + ". Remove and reapply it to change the value.")
						break
						return
					}
				}
				if ((dbployees.e(msg.author.id).stats[jn.stats.indexOf(ciCmd[3])] - ciCmd[4]) < 17) {
					ch.send("**" + msg.author.tag + "**, " + `the value of a stat cannot go below 17 (would be ${dbployees.e(msg.author.id).stats[jn.stats.indexOf(ciCmd[3])] - ciCmd[4]} with the specified argument)`)
					return
				} 
					fn.effectApplication['manualDebuff'](dbployees.e(msg.author.id), ciCmd[3], Number(ciCmd[4]), "apply")
					ch.send("**" + msg.author.tag + "**, " + `applied a ${ciCmd[4]} ${emoji(ciCmd[3], ESERV())} debuff.`)
				} else ch.send("**" + msg.author.tag + "**, " + "error: cannot give debuffs for 0 or less.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect argument.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect stat specified.")
				}
				else if (ciCmd[2] === "remove") {
				if (dbployees.e(msg.author.id).bufflist != undefined) {
				if (dbployees.e(msg.author.id).bufflist.split("|").some(b => b.startsWith("manualDebuff"))) {
				if (jn.stats.includes(ciCmd[3])) {
					let cbuff = dbployees.e(msg.author.id).bufflist.split("|").find(b => b.startsWith("manualDebuff/" + ciCmd[3]))
					fn.effectApplication['manualDebuff'](dbployees.e(msg.author.id), ciCmd[3], 0, "remove")
					ch.send("**" + msg.author.tag + "**, " + `removed the ${cbuff.split("/")[2]} ${emoji(cbuff.split("/")[1], ESERV())} debuff.`)
				} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect stat specified.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: you do not have any active removable debuffs.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: you do not have any active removable debuffs.")
				}
				else ch.send("**" + msg.author.tag + "**, " + "error: incorrect usage. Example 1: !lc debuff apply fortitude 30; Example 2: !lc debuff remove")
			} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect usage. Example 1: !lc debuff apply fortitude 30; Example 2: !lc debuff remove temperance")
			} break
			
			case "ex":
			case "extraction": {
			if (ciCmd[2] != "list") {
			function ext(emp, channel) {
				cUser = emp
				const cCh = DELTAS().channels.get(channel)
				let currentAbno
				let currentAbnoCode
				let currentShop
				let cPurchase
				let cInv
				let item
				let objItem
				let menuIndex = "main"
				let instAbno = 0
				if (jn.abnWorkable.includes(ciCmd[2])) {
					menuIndex = "shop"
					currentAbnoCode = ciCmd[2]
					currentAbno = abn.abn[abn.lista.indexOf(ciCmd[2])]
					instAbno = 1
				}
				let prices
				let totalBalance
				let price
				let k
				function invResponse(msg) {ch.send("**" + msg.author.tag + "**, " + "error: invalid response.").then(tmp => tmp.delete(3000))}
				function forceReturn(msg, code) {ch.send("**" + msg.author.tag + "**, " + code).then(tmp => tmp.delete(4000))}
				
				cCh.send("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Please input the code of the abnormality, EGO equipment of which you wish to extract, or 'bullet' to view the buff bullet manufacturing menu.`)
				.then(menumsg => {
				if (instAbno === 1) {
					currentShop = {"boxes": Number(cUser.getBox(currentAbnoCode)), "name": currentAbno.name, "gear": [suitObj(currentAbno.id), weapObj(currentAbno.id)]}
					menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Extraction of E.G.O:	${currentAbno.name}\n		${suit(currentAbno.id)}  -  ${currentShop.gear[0].cost} ${jn.pebox}\n		${weapon(currentAbno.id)}  -  ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${cUser.balance} PPE boxes.\n	Type in 'suit' or 'weapon' to purchase, 'exit' to exit or 'return' to select a different abnormality.`)
					instAbno = 0
				}
					
			/*func*/async function menuNavigationExtraction() {
						while ((menuIndex != "exit") && (menuIndex != "timeout") && (menuIndex != "fail") && (menuIndex != "test") && (menuIndex != "silentexit") && (menuIndex != "interExit")) {
						await cCh.awaitMessages(r => r.author.id === cUser.id, { max: 1, time: 25000 }).then(r => {
						
						
						let rp = r.first()
			/*========*/if (rp != undefined) {
						let mr = rp.content.toLowerCase()
						
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
								} else if (mr === "bullet" || mr === "bullets") menuIndex = "bulletshop"
								else {invResponse(rp); k = 1}
								break
								
								case "bulletshop":
									let hpCost = gear.items.find(i => i.name === "hpbullet").cost
									let spCost = gear.items.find(i => i.name === "spbullet").cost
									menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Select a bullet type to manufacture using your PPE boxes:\n\n		${jn.hpheal} HP Bullets - ${hpCost} ${jn.ppebox} PPE boxes\n		${jn.spheal} SP Bullets - ${spCost} ${jn.ppebox} PPE boxes\n\n	Type in 'hp'/'sp' to purchase the respective bullet, or 'hp'/'sp' (number) to purchase in bulk, 'return' to go back to the main extraction menu or 'exit' to exit.`)
									if (["hp", "sp"].includes(mr.split(" ")[0])) {
									mr0 = mr.split(" ")[0]
									let amt
									let price = {"hp": hpCost, "sp": spCost}[mr0]
									if (mr.split(" ")[1] === undefined || Number.isInteger(Number(mr.split(" ")[1])) === false) amt = 1
									else amt = Number(mr.split(" ")[1])
									
									if (amt*price > cUser.balance) forceReturn(rp, "you do not have enough PE boxes to make this purchase.")
									else {
									let inv = cUser.inventory.split("/").map(i => [i.split("|")[0], i.split("|")[1]]).filter(i => i[0] != undefined && i[0] != "" && i[0] != 'undefined')
									if (inv.some(i => i[0].startsWith(mr0)) === false) inv.push([mr0+"bullet", amt])
									else inv.find(i => i[0].startsWith(mr0))[1] -= -amt
									cUser.balance -= amt*price
									inv = inv.map(i => {return i.join("|")})
									cUser.inventory = inv.join("/")
									cCh.send("**" + cUser.tag + "**, " + `succesfully purchased ${amt} ${jn[mr0+"heal"]} ${mr0.toUpperCase()} bullet(s).`) 
									}}
									k = 1
								break
									
								case "shop":
									currentShop = {"boxes": Number(cUser.getBox(currentAbnoCode)), "name": currentAbno.name, "gear": [gear.suits[currentAbno.id], gear.weapons[currentAbno.id]]}
									menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Extraction of E.G.O:	${currentAbno.name}\n		${suit(currentAbno.id)}  -  ${currentShop.gear[0].cost} ${jn.pebox}\n		${weapon(currentAbno.id)}  -  ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${cUser.balance} PPE boxes.\n	Type in 'suit' or 'weapon' to purchase, 'exit' to exit or 'return' to select a different abnormality.`)
									if ((rp.content.toLowerCase() === "suit") || (rp.content.toLowerCase() === "weapon")) menuIndex = "purchase"
									else k = 1
								break
								
								case "purchase":
									switch (rp.content.toLowerCase()) {
										case "suit":
											cInv = "inventorys"
											objItem = gear.suits[currentAbno.id]
											item = suit(currentAbno.id)
											break
										case "weapon":
											cInv = "inventoryw"
											objItem = gear.weapons[currentAbno.id]
											item = weapon(currentAbno.id)
											break
									}
									
									price = objItem.cost
									totalBalance = Number(currentShop.boxes) + cUser.balance
									if (totalBalance < Number(price)) {forceReturn(rp, "you do not have enough PE boxes to make this purchase."); menuIndex = "shop"; k = 1; break}
									prices = []
									if (Number(currentShop.boxes) >= price) prices = [price, 0]
									else prices = [Number(currentShop.boxes), price - Number(currentShop.boxes)]
									if (prices[1] > price/4) {forceReturn(rp, "you can only use PPE boxes to pay a quarter of the price."); menuIndex = "shop"; k = 1; break}
									let tmptxt = ""
										if (prices[1] > 0) {tmptxt = ` and ${prices[1]} PPE boxes`}
									//menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + empex.tag + ".\n	Extraction of EGO:"  + `${currentShop.name}` + "```\n" + `	Are you sure? This will cost you ${prices[0]} PE boxes${tmptxt}. (*y*/*n*)`)
									
									if (cUser.inventoryFullness > 3) {forceReturn(rp, "your inventory is full. Discard an item in the inventory menu."); menuIndex = "shop"; k = 1; break}
									menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Extraction of E.G.O: ${currentAbno.name}\n		${suit(currentAbno.id)}  -  ${currentShop.gear[0].cost} ${jn.pebox}\n		${weapon(currentAbno.id)}  -  ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${cUser.balance} ${jn.ppebox} PPE boxes.\n\n	Are you sure you want to purchase ${item}? This will cost you ${prices[0]} PE boxes${tmptxt}. (**y**/**n**)`)
									menuIndex = "purChoice"
									k = 1
								break
								
								case "purChoice":
									if ((rp.content.toLowerCase() != "y") && (rp.content.toLowerCase() != "n")) {forceReturn(rp, "invalid response."); menuIndex = "shop"; k = 1; break}
									if (rp.content.toLowerCase() === "y") {
										rp.reply("Successfully purchased " + item)
										cUser.bumpBox(currentAbnoCode, -prices[0])
										cUser.balance -= prices[1]
										addItemID(cUser, cInv, currentAbno.id)
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
						} else {menuIndex = "main"; menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Please input the code of the abnormality, EGO equipment of which you wish to extract, or 'bullet' to view the buff bullet manufacturing menu.`)}
						} else menuIndex = "exit"
						} else menuIndex = "interExit"
			/*========*/} else menuIndex = "timeout"

						}).catch(console.error)
					}
					if (menuIndex === "exit") menumsg.edit(menumsg.content + `\n\n	You have exited the menu.`)
					else if (menuIndex === "timeout") menumsg.edit(menumsg.content + `\n\n	Menu timed out.`)
					else if (menuIndex === "fail") menumsg.edit(menumsg.content + `\n\n	Something in the bot broke. Contact your local codemonkey to fix this issue.`)
					else if (menuIndex === "test") wait(200).then(() => {menumsg.edit(menumsg.content + `\n\n Testing concluded.`)})
					else if (menuIndex === "interExit") menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Another command noticed, automatically exiting the menu.`)
					else if (menuIndex === "silentexit") console.log("Exited silently. Woosh!")
					
			/*func*/}
			
					menuNavigationExtraction()
				})
			}
			ext(dbployees.e(msg.author.id), msg.channel.id)
			} else {
			let cUser = dbployees.e(msg.author.id)
			let baseStr = " List of abnormality-specific PE boxes of employee " + cUser.tag + ":```\n		"
			let workableIDs = jn.abnWorkable
			workableIDs.sort(function(a, b){return Number(a.split("-")[2])-Number(b.split("-")[2])})
			workableIDs.sort(function(a, b){return jn.risk.indexOf(abno(a).risk)-jn.risk.indexOf(abno(b).risk)})
			let workableArr = []
			let workableCpx = []
			let index = 0
			workableIDs.forEach(aID => {
				if (aID != "o-01-01") {
				let cBal = cUser.balancespecific.split(" ").find(b => b.startsWith(aID)).split("|")
				workableArr.push(emoji(abno(aID).risk.toLowerCase(), ESERV()) + "	`" + abno(aID).name + "`  -  " + `${cBal[1] + " " + jn.pebox}`)
				}
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
			} break
			
			case "captain": {
			// Non-captain commands
			if (ncdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
				switch (ciCmd[2]) {
					case "vote":
					if (ciCmd[3]) {
					if (voting != 1) {
						voteeid = ""
						ciCmd[3].split("").forEach(c => {
							if (nmbrs.includes(c)) {voteeid += c}
						})
						if (ciCmd[3].startsWith("<@") || ciCmd[3].startsWith("<!@>") || ciCmd[3].startsWith("<@!>")) {
						if (drFind(DELTAS().members.find("id", voteeid)) === drFind(msg.member)) {
						if (DELTAS().roles.get(getRole(drFind(msg.member) + " (C)").id).members.map(m=>m.user.tag)[0] === undefined) {
								debugVariables.voting = 1
								votingteam = drFind(msg.member)
								console.log(ciCmd[3].slice((ciCmd[3].length - 19), (ciCmd[3].length - 2)))							
								setTimeout(function(){ch.send("Initiating vote for **" + ciCmd[3] + "** to become the " + drFind(msg.member) + " captain. Cast your vote by reacting with ✅ or 🚫 to this message.")}, 100)

						} else {ch.send("**" + msg.author.tag + "**, " + "Your department already has a captain, **" + DELTAS().roles.get(getRole(drFind(msg.member) + " (C)").id).members.map(m=>m.user.tag)[0] + "**!"); break}
						} else if (deproles.every(t => DELTAS().members.find("id", voteeid).roles.map(r => r.name).includes(t) === false) === false) {ch.send("**" + msg.author.tag + "**, " + "the specified user is not in your department."); break} else {ch.send("**" + msg.author.tag + "**, " + "the specified user is not an employee."); break}
						break
						} else {ch.send("**" + msg.author.tag + "**, " + "error: invalid or missing argument. Usage: !lc captain vote @person"); break}
				} else {ch.send("**" + msg.author.tag + "**, " + "an election is in process currently!"); break}
				} else {ch.send("**" + msg.author.tag + "**, " + "error: no employee specified."); break}
				}
				// Captain commands
				} else if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
					switch (ciCmd[2]) {
						case "vote":
							ch.send("**" + msg.author.tag + "**, " + "you are your department's captain. If you want someone else to become the captain, type !lc captain resign first.")
							break
						case "resign":
							if (cdeproles.every(t => msg.member.roles.map(r => r.name).includes(t) === false) === false) {
								ch.send("**" + msg.author.tag + "**, " + "do you really want to resign your post as the " + drFind(msg.member) + " captain? **y**/**n**")
								const collector = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { time: 10000 })
								collector.on('collect', cmsg => {
								if (cmsg.content.toLowerCase() === "y") {
									ch.send("**" + msg.author.tag + "**, " + "you have resigned as the " + drFind(msg.member) + " captain.") 
									var cptxt = drFind(msg.member)
									msg.member.removeRole(getRole(cptxt + " (C)"))
									msg.member.addRole(getRole(cptxt))
									collector.stop()
									let bufflist = []
									if (dbployees.e(msg.author.id).bufflist != undefined) {
									bufflist = dbployees.e(msg.author.id).bufflist.split("|")
									}
									fn.effectApplication['department'](dbployees.e(msg.author.id), drFind(msg.member), "take", 1)	
								}
								if (cmsg.content.toLowerCase() === "n") {ch.send("**" + msg.author.tag + "**, " + "resign cancelled."); collector.stop()}
								})
							} else {ch.send("**" + msg.author.tag + "**, " + "you are not the captain of the " + drFind(msg.member) + "!")}
							break
						default:
							ch.send("**" + msg.author.tag + "**, " + "incorrect usage. Avaliable arguments: resign, list.")
							break
					}
				} else {ch.send("**" + msg.author.tag + "**, " + "ERROR: YOU SHOULD NOT BE SEEING THIS MESSAGE!")}
			} break
		}
		}
		
		
	} else ch.send("**" + msg.author.tag + "**, " + "the appropriate channels for the use of !lc commands are <#653538398681825300>, <#654361755857846303> and <#655509126612385812>.")
	
	} break
	
	case "": {
	
	
	
	} break
	
} // [/Command switch]

} // Commands end here

if (/hmmm*/i.test(mesc.split("").filter(c => c != " ").join("")))
	msg.react("607330826052698114") 

if ((mesc.toLowerCase().split(" ").indexOf('uwu') > -1 ) || (mesc.toLowerCase().split(" ").indexOf('owo') > -1)) {
	if (mesc.toLowerCase().split(" ").indexOf('uwu') > mesc.toLowerCase().split(" ").indexOf('owo')) {ch.send('OwO')}
	else {ch.send('UwU')}
}

})

// THIS  MUST  BE  THIS  WAY
// NO TOUCHING
//______________________________\\/
client.login(process.env.BOT_TOKEN)
}) // End