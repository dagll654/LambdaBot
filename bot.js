// Required stuff 
const Discord = require('discord.js') // Self-explanatory
const db = require('mysql') // Mysql dependency for accessing the database
const fs = require('fs')
// Additional files
const wnp = require("./wnp.js") // war and peace
const why = require("./jazz.js") // the bee movie
const fic = require("./fic.js") // also known as omega why
const fic2 = require("./fic2.js") // also known as omega why
const abn = require("./abnb.json") // Abnormalities
const jn = require("./junk.json") // Miscellaneous stuff
const gear = require("./gear.json") // Gear and items
const fn = require("./functions.js") // Functions, like all effects - on-consume of consumables, on-work of abnos etc.
const sc = require("./simpleCombat.js") // The simple version of combat
const readline = require('readline').createInterface({
input: process.stdin,
output: process.stdout
})

var db_config  = {
    host: "lacreme2.heliohost.org",
	user: "lacreme2_bot",
	password: process.env.DB_PASS,
	database: "lacreme2_bot"
}
 
var pool = db.createPool(db_config)

/* function handleDisconnect() {
  connection = db.createConnection(db_config); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err2) {              // The server is either down
    if(err2) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
} */

// Wait
function wait(msc) {
	return new Promise(resolve => {
setTimeout(() => {resolve('resolved')}, msc)
	})
}

async function purge() {
try {
pool.getConnection((err, connection) => {
if (!connection) {console.log("Error: connection not established (purge)"); setTimeout(() => {purge()}, 1000); return}
connection.query(`SHOW PROCESSLIST;`, (err, result) => {
	if (err) {connection.release(); purge(); console.log(`${err}`); return}
	let deadConnections = result.filter(c => c.Command === "Sleep")
	let failed = 0
	let total = deadConnections.length
	deadConnections.forEach(c => {
		try {connection.query(`KILL ${c.Id};`, err => {if (err) throw err})}
		catch(err) {console.log(err); failed++}
		})
	if (failed !== 0 && total !== 0)
		console.log(`Killed off ${total - failed} connections, failed to kill ${failed} connections.`)
})
connection.release()
})}
catch(err) {connection.release(); purge(); console.log(`${err}`); return}
}
purge()

process.on('error', err => {console.log(err)})

const client = new Discord.Client()
function DELTAS() {return client.guilds.cache.get('607318782624399361')} // Lambda's Deltas server
function ESERV() {return client.guilds.cache.get('513660754633949208')} // Emote server for the minigame stuff
global.deltas = function deltas() {return DELTAS()}
const admins = ['556890472141029376', '143261987575562240', '389226857679159336'] // People with a Second-in-command role and me
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

Number.prototype.shortFixed = function(length) {return Math.round(this*Math.pow(10, length))/Math.pow(10, length)}
Array.prototype.ids = function() {return this.map(e => e.id)}
Array.prototype.e = function(id) {return this.find(e => e.id === id)}
var employees = [] // Later filled with all employees with a department role
global.dbployees = [] // Later filled with all employee data from the database and used everywhere
exports.dbployees = function() {return dbployees}
var abnos = [] // Later filled with all workable abnormalities
global.dbnos = [] // Later filled with all abno data from the database
bans = [] // Later filled with information about ongoing "bans." Data structure: [id, remaining_duration]
// Debug variables
debugVariables = {
	'debug_duck': 0, // /shrug
	'debug_say': 0, // If 0, !say is off
	'voting': 0, // Used in voting I guess
	'heal_pulser': 1, // If 1, the heal pulser is on
	'stop_all': 0, // If 1, bot accepts no commands except from bot author
	'effect_log': 999, // Rules how often the effect on employees are logged
	'get_log': 0, // Logs stuff from getUser() and getEmployee()
	'log_periodics': 0, // Logs ticks at which updateData() and healPulse() execute.
	'ml_used': 0, // Used in the mod lottery.
	'current_tick': 0, // Which 'tick' the bot's internal clock is, one tick being one second.
	'last_update_tick': 0, // The last tick on which updateData() was called.
	'last_heal_tick': 0, // Last tick on which healPulse() was called.
	'nigmus': false // Used to annoy Enigmus.
}
quotelog = []
votingteam = ""
voting = 0	
efflog = 0

function listener() {
readline.question(``, answer => {
if (answer === 'srs') {
	updateData()
	client.destroy()
	connection.destroy()
	wait(2000).then(() => console.log('restart'))
}
if (answer === 'upd') {
	updateData()
}
listener()
})
}
listener()

// Check if something is not assigned a meaningful value
function exists(v) {
	if (typeof(v) === 'number') return true
	return (v != undefined) && (v != 'undefined') && (v != '') && (v != null) && (v != 'null') && (v != [])
}

// Breaks up a string into an array of strings of length <= pageLength, preserving the sentence structure.
function breaker(string, pageLength) {
let originalArray = string.split(" ")
let formattedArray = []
let cProcessing = []
let b = 0
let lastFStop = 0
let stop = false
while (!stop) {
	cProcessing.push(originalArray[b])
	if (/[(\041|\077|\056)"*]$/.test(originalArray[b])) lastFStop = b
	b += 1
if (cProcessing.join(" ").length >= pageLength) {
	formattedArray.push(originalArray.splice(0, lastFStop + 1).join(" "))
	b = 0
	cProcessing = []
}
if (originalArray[b] === undefined) {
	formattedArray.push(originalArray.join(" "))
	stop = true
}
}
return formattedArray
}

// Function for finding the dep role among a member's roles
function drFind(member) {
	if (exists(member)) {
	if (member.roles.cache.some(r => r.name.split(" ")[1] === "Team"))
	return member.roles.cache.find(r => r.name.split(" ")[1] === "Team").name.split(" ")[0] + " " + member.roles.cache.find(r => r.name.split(" ")[1] === "Team").name.split(" ")[1]
	else return undefined
	} else return undefined
}

var latestID = -1
function assignEntityID() {
	latestID++
	return latestID
}

async function pagedMessage(array, ch, title = "") {
let index = 0
let l = await ch.send(`${b3ck}(Page ${index + 1}/${array.length}) ${title} ${b3ck}` + array[index])
l.react('👈').then(l.react('👉')).then(l.react('❌'))
const filter = (reaction, user) => ['👈', '👉', '❌'].includes(reaction.emoji.name) && user.id !== client.user.id
let stop = false
let forceStop = false
while (!stop) {
let rctT = await l.awaitReactions(filter, { max: 1, time: 200000 })
if (!rctT) {stop = true; return}
let recEmoji = rctT.first().emoji.name
if (recEmoji === '👈') {
	index -= 1
	if (index < 0) index = array.length - 1
	l.edit(`${b3ck}(Page ${index + 1}/${array.length}) ${title} ${b3ck}` + array[index])
}
if (recEmoji === '👉') {
	index += 1
	if (index > (array.length - 1)) index = 0
	l.edit(`${b3ck}(Page ${index + 1}/${array.length}) ${title} ${b3ck}` + array[index])
}
if (recEmoji === '❌') {
	stop = true
	forceStop = true
}
}
if (forceStop) l.edit(l.content + `\n\n Timed out manually.`)
else l.edit(l.content + `\n\n Timed out.`)
}

function stringNormalizer(string, length) {
	if (Math.abs(length) >= string.length) {
	if (length > 0) return string + new Array(Math.abs(length) - string.length).fill(" ").join("")
		else return new Array(Math.abs(length) - string.length).fill(" ").join("") + string
	} else return string
}

function arrayNormalizer (arrayEx, char = " ", closingChar = "") {
	let array = arrayEx
	if (array[0] === undefined) console.log(arrayEx)
	let lengths = new Array(array[0].length).fill(0)
	array.forEach(s => {
	s.forEach((p, i) => {
	if (p.length > lengths[i]) lengths[i] = p.length
	})})
	
	array = array.map((sub, sIndex) => {
	return sub.map((property, pIndex) => {
		let pTemp = property
		if (property.length < lengths[pIndex]) 
			pTemp += new Array(lengths[pIndex] - property.length).fill(char).join("")
		return pTemp + closingChar
	})
	})
	
	return array
}

// Employee class
class cEmp {
	constructor(id, tag, hp = 1700, sp = 1700, fortitude = 17, prudence = 17, temperance = 17, justice = 17, suit = "0", weapon = "0", inventorys, inventoryw, working = 0, dead = 0, panicked = 0, balance = 0, balancespecific = "", subpoints = "0|0|0|0", effects = 'null', buffs = "0|0|0|0", defensebuffs = "1|1|1|1", bufflist, tjtime = Date.now(), statlimit = 100, gifts = "", inventory = "", sidearm = "0", bullets = "0|0|0|0|0|0", luck = 0) {
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
		this.panicked = Number(panicked)
		this.balance = Number(balance)
		this.balancespecific = balancespecific
		this.subpoints = subpoints
		this.effects = effects
		this.buffs = buffs
		this.defensebuffs = defensebuffs
		this.bufflist = bufflist
		if (exists(tjtime))
		this.tjtime = tjtime
		else this.tjtime = Date.now()
		this.statlimit = statlimit
		this.gifts = gifts
		this.inventory = inventory
		this.sidearm = sidearm
		this.bullets = bullets
		this.luck = 0
		this.entityID = assignEntityID()
		this.type = 'employee'
	}
	get sidearmArray() {
		if (exists(this.sidearm))
		return this.sidearm.split("|")
		else return []
	}
	get bulletsArray() {
		if (exists(this.bullets))
		return this.bullets.split("|")
		else return []
	}
	get effectArray() {
		if (exists(this.effects))
		return this.effects.split("|").map(e => e.split("/"))
		else return []
	}
	get inventoryArray() {
		if (exists(this.inventory))
		return this.inventory.split("/").map(t => t.split("|"))
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
		let i = 0
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
		if (exists(this.gifts)) return this.gifts.split("|").map(g => g.split("/"))
		else return []
	}
	get damageMultiplier() {
		let mult = 1
		if (exists(this.effectArray)) {
		if (this.effectArray.some(e => e[0] === "dmult")) {
		let dMultArray = this.effectArray.filter(e => e[0] === "dmult")
		dMultArray.forEach(e => mult = mult * Number(e[3]))
		}}
		return mult
	}
	getBox(abno) {
		return this.balanceSpecificArray.find(b => b[0] === abno.toLowerCase())[1]
	}
	statLevels(textForm = 0) { // Stat level
		let statArray = [this.fortL, this.prudL, this.tempL, this.justL]
		let statLevelsArray = []
		let i = 0
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
		if (this.hp > this.fortL) this.hp = this.fortL
		if (this.sp > this.prudL) this.sp = this.prudL
		return Number(amt)
	}
	damage(risk, typeL, amount, returnDamageType, dealtByEmployee) { // Deal amount of type damage to employee, calculated to include defense and return the real amount of damage dealt (in non-technical form because reasons)
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
			if (!dealtByEmployee) this.sp -= amt
			else this.heal("sp", amt)
			break
			case "black":
			amt = Number(amt)*Number(this.defenseArray[2])*rDamage(suitObj(Number(this.suit)).level, risk)
			this.hp -= amt
			if (!dealtByEmployee) this.sp -= amt
			else this.heal("sp", amt)
			break
			case "pale":
			amt = Number(this.defenseArray[3])*(this.fortL/100*amt)*rDamage(suitObj(Number(this.suit)).level, risk)
			this.hp -= amt
			break
		}
		if (returnDamageType) return `${amt.shortFixed(1)} ${jn.dtype[jn.damageTypes.indexOf(type)]}`
		else return Number(amt).shortFixed(1)
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
			if (this.statsReal[statIndex] < this.statlimit) {
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
	panicResponse(abno) {
		let risk = abno.risk
		let levelDifference = (jn.risk.indexOf(risk) + 1) - this.employeeLevel
		switch (levelDifference) {
			case 7:
			case 6:
			case 5:
				this.sp = 0
				return 5
			break
			case 4:
				this.sp = 0
				return 4
			break
			case 3:
				this.sp -= Math.round((this.prudL/100)*60)
				return 3
			break
			case 2:
				this.sp -= Math.round((this.prudL/100)*30)
				return 2
			break
			case 1:
				this.sp -= Math.round((this.prudL/100)*10)
				return 1
			break
			default:
				return 0
		}
	}
	addEffect(effect, update = false, updateValue = 1) {
		let eArr = effect.split("/")
		if (exists(this.effectArray)) {
		if (update === true) {
		if (this.effectArray.some(e => e[0] === eArr[0])) {
		let effects = this.effectArray
		this.effectArray.find(e => e[0] === eArr[0])[3] += updateValue
		this.effects = effects.map(e => e.join("/")).join("|")
		return this.effectArray.find(e => e[0] === eArr[0])[3]
		}
		else {
		this.effects += "|" + effect
		if (eArr[3]) return eArr[3]
		else return 0
		}
		}
		else {
		this.effects += "|" + effect
		if (eArr[3]) return eArr[3]
		else return 0
		}
		}
		else this.effects = effect
		if (eArr[3]) return eArr[3]
		else return 0
	}
}

// [/emp]
// Switch between technical and normal names of gift slots
function sSlotText(text) {
	let technical = ['brooch1', 'brooch2', 'head1', 'head2', 'mouth1', 'mouth2', 'hand1', 'hand2', 'eye', 'face', 'cheek', 'back1', 'back2']
	let normal = ['Brooch 1', 'Brooch 2', 'Head 1', 'Head 2', 'Mouth 1', 'Mouth 2', 'Hand 1', 'Hand 2', 'Eye', 'Face', 'Cheek', 'Back 1', 'Back 2']
	if (technical.includes(text)) return normal[technical.indexOf(text)]
	else if (normal.includes(text)) return technical[normal.indexOf(text)]
	else return text
}

// Returns the abnormality by code
function abno(code) {
	if (!code) return undefined
	if (abn.abn.some(a => a.code === code.toLowerCase()))
		return abn.abn.find(a => a.code === code.toLowerCase())
	else if (abn.abn.some(a => a.code.split("-")[2] === code))
		return abn.abn.find(a => a.code.split("-")[2] === code)
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

// Abno class
class clAbn {
	constructor(id, qcounter, hp = 20, breaching = 0, dead = 0, effects = 'null', defensebuffs = "1|1|1|1", bufflist, override = {}) {
		if (override.id) this.id = override.id
		else this.id = id
		this.qcounter = qcounter
		this.hp = Number(hp)
		this.breaching = Number(breaching)
		this.dead = Number(dead)
		this.effects = effects
		this.defensebuffs = defensebuffs
		this.bufflist = bufflist
		let raw = abn.abn.find(a => a.id === id)
		if (override.name) this.name = override.name
		else this.name = raw.nameShort
		this.targetingAI = undefined
		this.hpMax = Number(raw.hpMax)
		this.defense = raw.defense
		this.risk = raw.risk
		this.ai = raw.ai
		this.entityID = assignEntityID()
		this.type = 'abnormality'
	}
	get effectArray() {
		if (exists(this.effects))
		return this.effects.split("|").map(e => e.split("/"))
		else return []
	}
	get buffListArray() {
		if (exists(this.bufflist)) return this.bufflist.split("|").map(i => i.split("/"))
		else return []
	}
	get defenseBuffArray() {return this.defensebuffs.split("|").map(b => Number(b))}
	get defenseArray() {
		let arr = []
		let i = 0
		for (i = 0; i < 4; i++) {
		arr.push(Number(this.defenseBuffArray[i]) * Number(this.defense.split("|")[i]))
		}
		return arr
	}
	get damageMultiplier() {
		let mult = 1
		if (exists(this.effectArray)) {
		if (this.effectArray.some(e => e[0] === "dmult")) {
		let dMultArray = this.effectArray.filter(e => e[0] === "dmult")
		dMultArray.forEach(e => mult = mult * Number(e[3]))
		}}
		return mult
	}
	heal(pointsEx, amount) {
		let points = pointsEx.toLowerCase()
		if (points !== "hp") {console.log(points + " " + amount); return undefined}
		let buffs = this.buffListArray
		let amt = Number(amount)
		if (exists(buffs)) {
		let regBuff = new RegExp(`misc/healbuff/hp`)
		buffs.forEach(b => {
			if (regBuff.test(b.join("/"))) amt += Number(b[3])*amount
		})
		}
		this.hp += Number(amt)
		if (this.hp > this.hpMax) this.hp = this.hpMax
		return Number(amt)
	}
	damage(risk, typeL, amount, returnDamageType = false) {
		let amt = amount
		let type = typeL
		if (Array.isArray(type)) type = type[roll(type.length)]
		switch (type.toLowerCase()) {
			case "red":
			amt = Number(amt)*Number(this.defenseArray[0])*rDamage(this.risk, risk)
			this.hp -= amt
			break
			case "white":
			amt = Number(amt)*Number(this.defenseArray[1])*rDamage(this.risk, risk)
			this.hp -= amt
			break
			case "black":
			amt = Number(amt)*Number(this.defenseArray[2])*rDamage(this.risk, risk)
			this.hp -= amt
			break
			case "pale":
			let amtL = Number(this.defenseArray[3])*(this.hpMax/1000*amt)*rDamage(this.risk, risk)
			if (amtL >= amt) amt = amtL
			this.hp -= amt
			break
		}
		if (returnDamageType) return `${amt.shortFixed(1)} ${jn.dtype[jn.damageTypes.indexOf(type)]}`
		return Number(amt).shortFixed(1)
	}
	addEffect(effect, update = false, updateValue = 1) {
		let eArr = effect.split("/")
		if (exists(this.effectArray)) {
		if (update === true) {
		if (this.effectArray.some(e => e[0] === eArr[0])) {
		let matchingEffects = this.effectArray.filter(e => e[0] === eArr[0])
		let otherEffects = this.effectArray.filter(e => e[0] !== eArr[0])
		matchingEffects = matchingEffects.map(e => e += updateValue)
		this.effects = matchingEffects.concat(otherEffects).map(e => e.join("/")).join("|")
		return
		}
		else {
		this.effects += "|" + effect
		return
		}
		}
		else {
		this.effects += "|" + effect
		}
		}
		else this.effects = effect
	}
}

// Checks how similar to original compoint is and returns a value between 0 and 1 representing the similarity (case-insensitive)
// (may be wonky)
function checkSimilarity(originalEx, compointEx) {
	let original = originalEx
	let compoint = compointEx
	let len = 0 //Math.round((original.length + compoint.length)/2)
	if (typeof(original) != 'string' || typeof(compoint) != 'string' || original == '' || compoint == '') return 0
	if (original.length < compoint.length) len = compoint.length
	else len = original.length
	similarity = 0
	for (let i = 1; i <= len; i++) {
		if (original.toLowerCase().slice(0, i) == compoint.toLowerCase().slice(0, i)) similarity += 0.5
		if (original.toLowerCase().slice(-i) == compoint.toLowerCase().slice(-i)) similarity += 0.25
		if (original.toLowerCase()[i-1] == compoint.toLowerCase()[i-1]) similarity += 0.25
	}
	return similarity/len
}

// Gets user by name/tag/mention/id.
function getUser(getter) {
	if (!getter) return undefined
	if ((/\D/.test(getter) === false && /\d{17,19}/g.test(getter)) || (getter.startsWith("<@") && /\d{17,19}/g.test(getter)))
		if (client.users.cache.get(/\d{17,19}/g.exec(getter)[0])) return client.users.cache.get(/\d{17,19}/g.exec(getter)[0])
		else return undefined
	else {
		let nicknames = global.deltas().members.cache.filter(m => m.nickname)
			.map(m => {
				return {
					"id": m.user.id, 
					"nickname": m.nickname.replace(" ", "_"), 
					"similarity": checkSimilarity(m.nickname.replace(" ", "_"), getter)
					}
			})
			//.filter(m => m.similarity > 0.1)
		let tags = global.deltas().members.cache
			.map(m => {
				return {
					"id": m.user.id, 
					"tag": m.user.tag.slice(0, m.user.tag.length - 5).replace(" ", "_"), 
					"similarity": checkSimilarity(m.user.tag.slice(0, m.user.tag.length - 5).replace(" ", "_"), getter)
					}
			})
			//.filter(m => m.similarity > 0.1)
		//console.log(nicknames)
		//console.log(tags)
		let both = nicknames.concat(tags).sort((a, b) => {return b.similarity - a.similarity})
		if (both[0]) return client.users.cache.get(both[0].id)
		else return undefined
	}
}

// Like the previous one, but searches only among the employees, so it doesn't return undefined in some cases
function getEmployee(getter) {
	if (exists(getter) === false) return undefined
	if ((/\D/.test(getter) === false && /\d{17,19}/g.test(getter)) || (getter.startsWith("<@") && /\d{17,19}/g.test(getter)))
		return client.users.cache.get(/\d{17,19}/g.exec(getter)[0])
	else {
		let employeesTemp = employees.map(e => DELTAS().members.cache.get(e.id))
		let nicknames = employeesTemp.map(m => [m.user.id, checkSimilarity(m.nickname, getter), m.nickname])
		let tags = employeesTemp.map(m => [m.user.id, checkSimilarity(m.user.tag, getter), m.user.tag])
		nicknames.sort((a, b) => {return b[1] - a[1]})
		tags.sort((a, b) => {return b[1] - a[1]})
		if (debugVariables.get_log === 1) {
			console.log(tags)
			console.log(nicknames)
		}
		if (nicknames[0][1] === 0 && tags[0][1] === 0) return undefined
		if (nicknames[0][1] > tags[0][1]) return client.users.cache.get(nicknames[0][0])
			else return client.users.cache.get(tags[0][0])
	}
	return undefined
}

// Returns an emoji by name
function emoji(nme, srv = DELTAS(), a = false, id = false) {
	let e
	let emd
	if (nme === "none") {return ""}
	if (id === true) e = srv.emojis.cache.find(em => em.name.toLowerCase() === nme.toLowerCase()).id
	else {if (a === true) emd = "<a:"; else emd = "<:"}
	let eObj = srv.emojis.cache.find(em => em.name.toLowerCase() === nme.toLowerCase())
		emvar = emd + eObj.name + ":" + eObj.id + ">"
	return emvar
}

// A text resentation of a suit (non-technical)
function suit(idS, d = [1, 1, 1, 1]) {
	let suit = gear.suits.find(s => s.id === Number(idS).toString())
	return (`${emoji(suit.level.toLowerCase(), ESERV())} ${suit.name}  -  ${(suit.resistance[0]*d[0]).shortFixed(2)} ${jn.dtype[0]} ${(suit.resistance[1]*d[1]).shortFixed(2)} ${jn.dtype[1]} ${(suit.resistance[2]*d[2]).shortFixed(2)} ${jn.dtype[2]} ${(suit.resistance[3]*d[3]).shortFixed(2)} ${jn.dtype[3]}`)
}

// A text resentation of a weapon (non-technical)
function weapon(idW) {
	let weapon = gear.weapons.find(w => w.id === idW.toString())
	let wepd = `${weapon.damage[0]} - ${weapon.damage[1]} `
	let i = 0
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
	if (inv === "inventoryw") ws = "weapon"
	else ws = "suit"
	if (Number(emp[ws]) === Number(id)) emp[ws] = ""
}

// Function for getting a role by name 
function getRole(nme) {
	if (DELTAS().roles.cache.some(role => role.name.toLowerCase() === nme.toLowerCase()))
		return DELTAS().roles.cache.find(role => role.name.toLowerCase() === nme.toLowerCase())
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

// Vote function. Now improved. Even though I didn't want to.
async function initVote(channel, voter, candidate) {
	let team = getRole(drFind(voter))
	voteMessage = await channel.send(`Initiating vote for **${candidate.user.tag}** to become the captain of ${team.name}.`)
	let voters = team.members.map(v => v.id)
	voteMessage.react('✅')
	voteMessage.react('🚫')
	let requiredVotes
	if (voters.length > (5 + Math.floor(voters.length / 2))) requiredVotes = 5 + Math.floor(voters.length / 2)
		else requiredVotes = voters.length
	let timeout = 1
	let yee = 0
	let boo = 0
	function filter(message, user, messageReactions) {
	return voters.includes(user.id) || user.id === '143261987575562240'
	}
	let collector = voteMessage.createReactionCollector(filter, { time: 15000 }) 
	collector.on('collect', (reaction, user) => {
	voters.splice(voters.indexOf(user.id), 1)
	if (reaction.emoji.name === '✅') yee++
	if (reaction.emoji.name === '🚫') boo++
	if (reaction.emoji.name === '🦆' && user.id === '143261987575562240') {
		yee = requiredVotes
		boo = 0
		timeout = 0
		collector.stop()
	}
	if (voters.length === 0) {timeout = 0; collector.stop()}
	})
	collector.on('end', () => {
	if (timeout === 1) {
	channel.send(`Cancelling the vote (timeout). ${requiredVotes - voters.length}/${requiredVotes} people participated.`)
	} else {
	let voteResult
	if (boo > yee) {
	voteResult = `**${candidate.user.tag}** will not become the captain of ${team.name}.` 
	} else {
		voteResult = `**${candidate.user.tag}** is now the captain of ${team.name}!`
		candidate.roles.remove(team)
		candidate.roles.add(getRole(team.name + " (C)"))
		let captainEmployee = dbployees.e(candidate.id)
		if (captainEmployee.buffListArray.some(eff => eff[0].startsWith("team"))) 
		fn.effectApplication['department'](captainEmployee, team.name, "take")
		fn.effectApplication['department'](captainEmployee, team.name, "give", 1)
	}
	channel.send(`Voting over. ${requiredVotes - voters.length}/${requiredVotes} people participated: ${yee} voted ✅ and ${boo} voted 🚫. \n	` + voteResult)
	}
	})
}

// The new and (hopefully) improved work function
function work(employee1, abno1, order1, channel) {
	
	const e = employee1
	e.working = 1
	const cAbno = abno(abno1)
	const order = order1
	let statIndex = jn.workOrders.indexOf(order)
	let respectiveStat = jn.stats[statIndex]
	let userStat = e.stats[statIndex]
	let userTemp = e.tempL
	let luck = Math.ceil(jn.risk.indexOf(cAbno.risk)/2) + e.luck
	if (cAbno.code === "o-01-01") luck = 3
	let userStatLevel = e.statLevels()[statIndex]
	let panicResponse = jn.panicLevels[e.panicResponse(cAbno)]
	
	let successChance = 0
	let successChancet = (userTemp * 0.002 + cAbno.workPreferences[statIndex][userStatLevel - 1])*100
	//console.log(successChance + " " + successChancet)
	if (e.buffListArray.some(b => b[0] === cAbno.code)) {
		let b = e.buffListArray.find(b => b[0] === cAbno.code)
		if (b[1] === "schance" && Number.isNaN(Number(b[2])) === false) successChancet += Number(b[2])
	}
	if (e.buffListArray.some(b => b[0] === order)) {
		let b = e.buffListArray.find(b => b[0] === order)
		if (b[1] === "schance" && Number.isNaN(Number(b[2])) === false) successChancet += Number(b[2])
	}
	if (cAbno.affstat[0] === true) {
		successChancet -= fn.affstat(cAbno.code, respectiveStat, e)
	}
	if (cAbno.effect[1] === true) {
		let sci = fn['effectSCInfluence'](dbnos.e(cAbno.id))
		successChancet += sci
		console.log("SCI: " + sci)
	}
	if (successChancet > 95) successChance = 95; else successChance = successChancet
	console.log(`Success chance for ${e.tag} on ${cAbno.code}: ${successChance}%`)
	let damageArray = []
	let neboxes = 0
	let peboxes = 0
	let ppeboxes = 0
	let rollArr = []
	let asdf = 0
	let snap = ["a", "a"]
	for (asdf = 0; asdf < cAbno.peoutput; asdf++) {
	if (e.hp > 0 && e.sp > 0) {
		let cRoll = roll(100)
		let luckRoll = roll(1000)
		if (e.luck_roll_override === "true") luckRoll = 0
		if (cRoll > successChance) {
		if (luckRoll <= luck) rollArr.push([luckRoll, "WIN"])
		else rollArr.push([cRoll, cRoll > successChance, luckRoll + " lr/" + luck + " lrm"])
		} 
		else rollArr.push([cRoll, cRoll > successChance, luckRoll + " lr/" + luck + " lrm"])
		if (cRoll > successChance && luckRoll > luck) {
			neboxes++
			let dmg = (roll(cAbno.damage[1] - cAbno.damage[0] + 1) - 1) + cAbno.damage[0]
			let dIndex = cAbno.dtype.indexOf(1)
			let aDmg = e.damage(cAbno.risk, jn.damageTypes[dIndex], dmg)
			let aDmgStr
			if (dIndex === 3) aDmgStr = `${aDmg.toFixed(1)} (${(aDmg/e.fortL*100).toFixed(1)}%) ${jn.dtype[3]}`
			else aDmgStr = `${aDmg.toFixed(1)} ${jn.dtype[dIndex]}`
			damageArray.push(aDmgStr)
			snap[0] = Number(e.hp).shortFixed(1)
			snap[1] = Number(e.sp).shortFixed(1)
		}
		else if (roll(15) === 15) ppeboxes++
		else peboxes++
	} else {
		e.dead = 1
		snap[0] = Number(e.hp).shortFixed(1)
		snap[1] = Number(e.sp).shortFixed(1)
		}
	}
	async function asyncEdit(rMsg) {
		let mood = ""
		let moodResult = 0
		let moodEffectResult = ""
		let boxTotal = peboxes + ppeboxes
		if (Number(e.hp) <= 0 || Number(e.sp) <= 0) e.dead = 1
		let initialDead = e.dead
		if (boxTotal >= cAbno.mood[2]) {mood = jn.goodresult; moodResult = 2}
		else if (boxTotal >= cAbno.mood[1]) {mood = jn.normalresult; moodResult = 1}
		else {mood = jn.badresult; moodResult = 0}
		if (cAbno.effect[0] === true) {
			let abnoEffect = fn.effectApplication[cAbno.id](e, moodResult, order, dbnos.e(cAbno.id))
			if (abnoEffect[0] === true) abnoEffectResult = abnoEffect[1]
		}
		if (damageArray.length === 0) damageArray.push("none")
		let wTime = Math.floor((cAbno.peoutput/2).shortFixed(1))
		let wTimeReal = Math.floor(((boxTotal+neboxes)/2).shortFixed(1))
		if (cAbno.code === "o-01-01") {wTime = 10; wTimeReal = 10}
		rMsg.edit("\n```mb\n ⚙️ | Employee " + e.tag + " is working " + order + " on " + cAbno.name + "\n```" + `	Employee's panic response:	${panicResponse}\n	Currently working, this will take approximately ${wTime} seconds.`)
		await wait(wTimeReal*1000)
		if (initialDead === 0) {
		ppe = ""
		if (ppeboxes > 0) ppe = `\n	PPE boxes: ${ppeboxes}`
		if (e.dead === 0)
			rMsg.edit("\n```mb\n ⚙️ | Employee " + e.tag + " is working " + order + " on " + cAbno.name + "\n```" + `	Employee's panic response:	${panicResponse}\n	Work complete!\n	PE boxes: ${peboxes}	\n	Result: ${mood}\n	NE boxes: ${neboxes}  ${ppe}\n	Remaining HP:	${Number(e.hp).toFixed(1)} / ${e.fortL} ${jn.health}\n	Remaining SP:	${Number(e.sp).toFixed(1)} / ${e.prudL} ${jn.sanity}\n	Damage taken: ${damageArray.join(", ")}.`)
		else 
			rMsg.edit("\n```mb\n ⚙️ | Employee " + e.tag + " is working " + order + " on " + cAbno.name + "\n```" + `	Employee's panic response:	${panicResponse}\n	Work complete. But...${abnoEffectResult}\n	PE boxes: ${peboxes}	\n	Result: ${mood}\n	NE boxes: ${neboxes}  ${ppe}\n	Remaining HP:	${Number(e.hp).toFixed(1)} / ${e.fortL} ${jn.health}\n	Remaining SP:	${Number(e.sp).toFixed(1)} / ${e.prudL} ${jn.sanity}\n	Damage taken: ${damageArray.join(", ")}.`)
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
			let giftRoll = fn.gift(e, cAbno.id, {"mood": moodResult, "order": order, "dbno": dbnos.e(cAbno.id), "pe": boxTotal})
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
		} else rMsg.edit("\n```mb\n ⚙️ | Employee " + e.tag + " is working " + order + " on " + cAbno.name + "\n```" + `	Employee's panic response:	${panicResponse}\n	Work incomplete... You have died. Lost nothing, for now.${moodEffectResult}\n	Remaining HP:	${snap[0]} ${jn.health}\n	Remaining SP:	${snap[1]} ${jn.sanity}\n	Damage taken: ${damageArray.join(",  ")}.`)	
		e.working = 0
	}
	channel.send("\n```mb\n ⚙️ | User " + e.tag + " is working " + order + " on " + cAbno.name + "\n```").then(m => {
	asyncEdit(m)})
	console.log(rollArr)
}

// Push an employee into an array
function eArrPush(e, arr = dbployees) {
	arr.push(new cEmp(e.userid, e.tag, e.hp, e.sp, e.fortitude, e.prudence, e.temperance, e.justice, e.suit, e.weapon, e.inventorys, e.inventoryw, e.working, e.dead, e.panicked, e.balance, e.balancespecific, e.subpoints, e.effects, e.buffs, e.defensebuffs, e.bufflist, e.tjtime, 100, e.gifts, e.inventory, e.sidearm, e.bullets))
}
// Push an abno into an array
function aArrPush(a, arr = dbnos) {
	arr.push(new clAbn(a.id, a.qcounter, a.hp, a.breaching, a.dead, a.effects, a.defensebuffs, a.bufflist))
}

// Ticks all employees' effects
function globalEffectTick() {
	efflog = efflog + 1 // efflog is responsible for effect logging
	dbployees.forEach(e => {
	if (e.fighting) return
	if (exists(e) === false) return // If the employee doesn't exist, don't bother
	let effects = []
	let effectsNew = []
	let persistentEffects = ["1"] // Effects that don't get removed on death
	if (exists(e.effectArray)) { // If the effect array has anything in it
		effects = e.effectArray.filter(e => exists(e[0])) // Filter out any effects that are null or otherwise nonexistent
		effects.forEach(eff => {
		if (eff[0] === "0") e.heal("hp", 0.1) // Fairies' effect heals 0.1 hp per tick (second)
		if (Number(e.dead) === 1 && persistentEffects.includes(eff[0]) === false) eff = 'null' // If the effect is EGO change cooldown then it doesn't get removed on death
		else if (eff[1] != "inf") { // We don't touch inf effects
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
		else if (efflog === debugVariables["effect_log"]) console.log(`${e.tag}: ${effectsNew}`)
	}
	})
	dbnos.forEach(a => {
	let effects = []
	let effectsNew = []
		if (exists(a.effects)) {
		effects = a.effectArray.filter(e => exists(e[0])) // Filter out any effects that are null or otherwise nonexistent
		effects.forEach(eff => {
			if (exists(eff)) {
			let effectNew = eff
			effectNew[1] -= 1
			if (effectNew[1] > 0) effectsNew.push(effectNew)
			}
		})
		}
		a.effects = effectsNew.map(eff => eff.join("/")).join("|")
		if (exists(a.effects) === false) a.effects = 'null'
	})
	if (efflog >= debugVariables["effect_log"]) efflog = 0
}

// Updates the data to the database
async function updateData() {
debugVariables.last_update_tick = debugVariables.current_tick
pool.getConnection((err, connection) => {
	let dbployeesActual = []
	let pushBig = []
	if (!connection) {setTimeout(() => {updateData()}, 5000); console.log(`Error: connection not established. (updateData)`); return}
	try {
	connection.query("SELECT * FROM `employees`", function (err, result) {
	if (err) {connection.release(); setTimeout(() => {updateData()}, 5000); console.log(`${err} (updatedata/employees)`); return}
	result.forEach(r => {
	eArrPush(r, dbployeesActual)
	})
	if (err) throw err
	dbployees.forEach((e, i) => { //DELETE FROM `employees` WHERE `employees`.`userid` = \'308531879953563650\'
		if (exists(DELTAS().members.cache.get(e.id))) {
		let eActual = dbployeesActual.find(d => d.id === e.id)
		if (exists(e) === false) return
		let pushSmall = []
		for (const prop in e) {
		if (prop == "tag") {
			if (exists(DELTAS().members.cache.get(e.id)))
			if (DELTAS().members.cache.get(e.id).user.tag !== e.tag) {
			e.tag = DELTAS().members.cache.get(e.id).user.tag
			}
		}
		if (eActual)
		if (eActual[prop] !== undefined && prop !== "luck" && prop !== "entityID") {
			let lValue = e[prop]
			if (prop === "hp" || prop === "sp") lValue = Number(lValue)*100
			if (eActual[prop] != lValue && Number(eActual[prop]) != lValue) {					
			pushSmall.push("`" + prop + "` = '" + lValue + "'")
			}
		}
		}
		let pushSmallStr = "UPDATE `employees` SET " + pushSmall.join(", ") + " WHERE `employees`.`userid` = '" + e.id + "';"
		if (exists(pushSmall)) pushBig.push(pushSmallStr)
		} /* else connection.query("DELETE FROM `employees` WHERE `employees`.`userid` = \'" + e.id + "\'", function (err, result) {
			if (err) throw err
			console.log("Deleted " + e.tag + " from the database. Sad!")
			if (e.tag === undefined) {
				console.log("What the fuck.")
				console.log(e)
				dbployees.filter(dbp => exists(dbp) && exists(dbp.id))
			}
			dbployees.filter(dbp => dbp.id !== e.id)
		}) */
	})
	pushBig.forEach(q => connection.query(q))
	//console.log("Updated the database.")
	//console.log(pushBig)
	})}
	catch (err) {connection.release(); setTimeout(() => {updateData()}, 5000); console.log(`${err} (updatedata/employees)`); return}
	let dbnosActual = []
	pushBigA = []
	try {
	connection.query("SELECT * FROM `abnormalities`", function (err, result) {
	if (err) {connection.release(); setTimeout(() => {updateData()}, 5000); console.log(`${err} (updatedata/abnos)`); return}
	result.forEach(r => aArrPush(r, dbnosActual))
	dbnos.forEach(localAbno => {
		let databaseAbno = dbnosActual.find(d => Number(d.id) === Number(localAbno.id))
		if (exists(databaseAbno) === false || exists(localAbno) === false) {
			/* console.log(exists(databaseAbno))
			console.log(databaseAbno)
			console.log(localAbno.id)
			console.log("What?") */
			return
		}
		let pushSmall = []
		for (const prop in localAbno) {
		if (databaseAbno[prop] !== undefined && prop !== "entityID") {
			let lValue = localAbno[prop]
			if (databaseAbno[prop] !== lValue && Number(databaseAbno[prop]) !== lValue) {					
			pushSmall.push("`" + prop + "` = '" + lValue + "'")
			}
		}
		}
		let pushSmallStr = "UPDATE `abnormalities` SET " + pushSmall.join(", ") + " WHERE `abnormalities`.`id` = '" + localAbno.id + "';"
		if (exists(pushSmall)) pushBigA.push(pushSmallStr)
	})
	pushBigA.forEach(q => connection.query(q))
	})}
	catch(err) {connection.release(); setTimeout(() => {updateData()}, 5000); console.log(`${err} (updatedata/abnos)`); return}

	let bansActual = []
	let pushBigBans = []
	try {
	connection.query("SELECT * FROM `bans`", async function (err, result) {
	if (err) {connection.release(); setTimeout(() => {updateData()}, 5000); console.log(`${err} (updatedata/bans)`); return}
	result.forEach(r => {
		if (!bans.some(b => b.ban_id === r.ban_id)) 
			pushBigBans.push("DELETE FROM `bans` WHERE `bans`.`ban_id` = \'" + r.ban_id + "\';")
	})
	if (bans.length > 0) {
	let newBans = bans.filter(b => !result.some(ab => ab.ban_id.toString() === b.ban_id.toString()))
	newBans.forEach(nb => pushBigBans.push("INSERT INTO bans (ban_id, id, duration, timestamp, roles) VALUES ('" + nb.ban_id + "', '" + nb.id + "', '" + nb.duration + `', '${nb.timestamp}', '${nb.roles}')`))
	}
	if (pushBigBans.length > 0) {
	try {pushBigBans.forEach(q => connection.query(q))}
	catch(err) {connection.release(); setTimeout(() => {updateData()}, 5000); console.log(`${err} (updatedata/pushbigbans)`); return}
	}
	})
	}
	catch(err) {connection.release(); setTimeout(() => {updateData()}, 5000); console.log(`${err} (updatedata/bans)`); return}


connection.release()
if (debugVariables.log_periodics === 1) console.log(`Updated data at tick ${debugVariables.current_tick}.`)
})}

// Functions like databaseEmployees()
async function databaseAbnormalities() {
pool.getConnection((err, connection) => {
	if (!connection) {setTimeout(() => {databaseAbnormalities()}, 1000); console.log("Error: connection not established (dbnos)"); return}
	abnos = []
	dbnos = []
	jn.abnWorkable.forEach(a => {
	abnos.push({"id": abno(a).id, "tag": a})
	})
	try {
	connection.query("SELECT * FROM `abnormalities`", function (err, result) {
	if (err) {connection.release(); databaseAbnormalities(); console.log(`${err} (dbnos)`); return}
	result.forEach(r => aArrPush(r))
	let abnodbpush = []
	abnos.forEach(a => {
	if (dbnos.some(dbAbno => dbAbno.id === a.id) === false) abnodbpush.push(a.id)
	//else console.log(`${abn.abn.find(a1 => a1.id === a.id).name} included!`)
	})
	abnodbpush.forEach(e => {
		let sql = "INSERT INTO abnormalities (id) VALUES ('" + e + "')";
		connection.query(sql, function (err, result) {
		if (err) throw err;
		console.log(`${abn.abn.find(a => a.id === e).name} inserted!`)
		})
	})
	})}
	catch (err) {connnection.release(); setTimeout(() => {databaseAbnormalities()}, 1000); console.log(`${err} (dbnos)`); return}
connection.release()
})}

// Gets the employee data from the database
async function databaseEmployees() {
pool.getConnection((err, connection) => {
	if (!connection) {console.log("Error: connection not established (databaseemployees)"); setTimeout(() => {databaseEmployees()}, 1000); return}
	return new Promise(resolve => {
	employees = []
	dbployees = []
	let dbpush = []
	DELTAS().members.cache.forEach(m => {
	if (drFind(m)) employees.push({"id": m.id, "tag": m.user.tag, "team": drFind(m)})
	})
	try {
	connection.query("SELECT * FROM `employees`", function dbeQuery(err, result) {
		if (err) {connection.release(); setTimeout(() => {databaseEmployees()}, 1000); console.log(`${err} (databaseemployees)`); return}
		let zeroBalanceArray = abn.abn.map(a => [a.code, "0"])
		result.forEach(e => eArrPush(e))
		employees.forEach(e => {
			if (dbployees.ids().includes(e.id)) {/*console.log(`Employee ${e.tag} is included!`)*/}
			else {dbpush.push({"id": e.id, "tag": e.tag})}
		})
		console.log("To push:")
		console.log(dbpush)
		dbpush.forEach(e => {
		var sql = "INSERT INTO employees (userid, tag, balancespecific, hp, sp) VALUES ('" + e.id + "', '" + e.tag + `', '${zeroBalanceArray.map(b => b.join("|")).join(" ")}', '1700', '1700')`;
		queryAndWait(sql, connection)
		console.log(`${e.tag} inserted!`)
		console.log(`cEmp'ing and simping: ${e.id} ${e.tag}`)
		dbployees.push(new cEmp(e.id, e.tag))
		})
		
		dbployees.forEach(e => {
			zeroBalanceArray.forEach(b => {
			if (e.balanceSpecificArray.some(bs => bs[0].toLowerCase() === b[0].toLowerCase()) === false)
				e.balancespecific += ` ${b.join("|")}`
			})
		})
	})
	}
	catch(err) {
		connection.release()
		console.log(`${err}`)
		setTimeout(() => {databaseEmployees()}, 1000)
	}
	resolve('resolved')
	})
connection.release()
})}

// Gets the ban data from the database
async function databaseBans() {
pool.getConnection((err, connection) => {
	if (!connection) {console.log("Error: connection not established (databasebans)"); setTimeout(() => {databaseBans()}, 1000); return}
	try {
	connection.query("SELECT * FROM `bans`", function (err, result) {
		if (err) {connection.release(); console.log(`${err} (databasebans)`); setTimeout(() => {databaseBans()}, 1000)}
		result.forEach(b => bans.push(b))
		console.log("Bans:")
		console.log(bans)
	})
	}
	catch(err) {connection.release(); console.log(`${err} (databasebans)`); setTimeout(() => {databaseBans()}, 1000)}
connection.release()
})}

// The heal pulse in regenerator rooms
function healPulse() {
	if (debugVariables.heal_pulser === 1) {
	dbployees.forEach(em => {
	async function healTick(e) {
		/* if (e.id === '143261987575562240') console.log("Heal SP: " + dbployees.e(e.id).heal("sp", Math.ceil(e.prudL/60) + e.prudL/60))
			else */ dbployees.e(e.id).heal("sp", Math.ceil(e.prudL/50) + e.prudL/60)
		await wait(1)
		/* if (e.id === '143261987575562240') console.log("Heal HP: " + dbployees.e(e.id).heal("hp", Math.ceil(e.fortL/60) + e.fortL/60))
			else */ dbployees.e(e.id).heal("hp", Math.ceil(e.fortL/50) + e.fortL/60)
		await wait(1)
		if (e.hp < -0.5*e.fortL) e.hp = -0.5*e.fortL
		if (e.sp < -0.5*e.prudL) e.hp = -0.5*e.prudL
		if (e.hp > e.fortL) e.hp = e.fortL
		if (e.sp > e.prudL) e.sp = e.prudL
		if ((e.hp >= Number(e.fortL)) && (e.sp >= Number(e.prudL)) && (Number(e.dead) === 1)) 
		{e.dead = 0; e.panicked = 0}
		if (e.sp >= Number(e.prudL) && Number(e.panicked) === 1) 
		e.panicked = 0
		
		else e.working = 0
	if (DELTAS().members.cache.get(e.id) != undefined) {
	if (drFind(DELTAS().members.cache.get(e.id))) {
	if (exists(e.tjtime) === false) e.tjtime = Date.now()
	if (exists(e.buffListArray)) {
	if (e.buffListArray.some(eff => eff[0].startsWith("team")) === false) {
	if (e.tjtime != undefined && (Date.now() - (e.tjtime - 0))/(1000*60*60*24) > 3) {
	fn.effectApplication['department'](e, drFind(DELTAS().members.cache.get(e.id)), "give")
	}}}}}}
	if (!em.fighting) healTick(em)
	})
	}
	dbnos.forEach(d => {
	if (d.dead === 1) {
		let raw = abn.abn.find(a => a.id === d.id)
		d.breaching = 0
		d.dead = 0
		d.hp = raw.hpMax
	}
	})
	debugVariables.last_heal_tick = debugVariables.current_tick
	if (debugVariables.log_periodics === 1) console.log(`Healed all employees at tick ${debugVariables.current_tick}.`)
}

async function globalBanTick() {
	if (bans.length > 0) {
		let toUnban = bans.filter(b => (Date.now() >= (Number(b.timestamp) + Number(b.duration) * 1000)))
		toUnban.forEach(ub => {
			let member = DELTAS().members.cache.get(ub.id)
			member.roles.set(ub.roles.split("|"))
			bans = bans.filter(b => b.ban_id !== ub.ban_id)
		})
	}
}

// Responsible for all regular time-based things
async function globalTicker() {
	while (true) {
		await wait(1000)
		debugVariables.current_tick++
		globalEffectTick()
		globalBanTick()
		if ((debugVariables.current_tick - debugVariables.last_update_tick) >= 30) {
			updateData()
			setTimeout(() => {purge()}, 1000)
		}
		if ((debugVariables.current_tick - debugVariables.last_heal_tick) >= 60) {
			healPulse()
		}
	}
}

// On ready
client.on('ready', () => {

global.client = client
bch = DELTAS().channels.cache.get("607558082381217851");
// Bot readiness announcement, both in the log, #botspam and in my DMs
console.log('I am ready!')
//bch.send("Bot started.")
client.users.cache.get('143261987575562240').send('Bot started up succesfully.')
// Setting the bot's current game to 'try !help'
client.user.setActivity('the sound of himself being played like a fiddle', { type: 'LISTENING' })



// Get employee and abno data from the database
databaseEmployees()
databaseAbnormalities()
databaseBans()
// Global ticker function, responsible for the heal pulser, data updating and effect ticking
globalTicker()
	
})

/*
client.on('typingStart', (channel, user) => {
	if (user.id === '389226857679159336' && debugVariables.nigmus == true && !bans.some(b => b.id === '389226857679159336')) {
	member = DELTAS().members.cache.get('389226857679159336')
	roles = member.roles.cache.map(r => r.id)
	member.roles.set(['673218574101512214'])
	channel.send(`Banned **${user.tag}** for 1 second.`)
	bans.push({
		"ban_id": member.user.id.toString() + Date.now().toString().slice(-8),
		"id": member.user.id,
		"duration": 1,
		"timestamp": Date.now(),
		"roles": roles.join("|")
		
	})
	updateData()
	}
})
*/

client.on('guildMemberUpdate', (old, m) => {
async function dip(member, action = 0) {
	await wait(1000)
	if (action === 1)
	await member.roles.remove(DELTAS().roles.cache.find(r => r.name === "TO THE RANCH"))
		.catch(console.error)
	else await member.roles.add(DELTAS().roles.cache.find(r => r.name === "TO THE RANCH"))
		.catch(console.error)
	return true
}
if (m.roles.cache.some(r => r.name === "TO THE RANCH")) {
	let risks = jn.risk
	if (m.roles.cache.some(r => risks.includes(r.name)))
	m.roles.remove(m.roles.cache.filter(r => risks.includes(r.name)))
	return
}
let regLevel = new RegExp(`\\bLevel`)
	if (m.roles.cache.some(r => r.name.split(" ")[0] === "Level") && !m.roles.cache.some(r => r.name === "banned")) {
		let level = m.roles.cache.find(r => r.name.split(" ")[0] === "Level").name
		let index = jn.levels.indexOf(level)
		let channelRole = DELTAS().roles.cache.find(r => r.name.toLowerCase() === jn.risk[index].toLowerCase())
		if (m.roles.cache.array().some(r => r.name === "ALEPH")) 
			channelRole = DELTAS().roles.cache.find(r => r.name === "ALEPH")
		let currentCRoles = m.roles.cache.array().filter(r => jn.risk.slice(0, 4).includes(r.name)).filter(r => r !== channelRole).map(r => r.id)
		if (currentCRoles.length > 0) {
			m.roles.remove(currentCRoles)
			.catch(console.error)
		}
		if (m.roles.cache.array().some(r => r.id === channelRole.id) === false) {
			m.roles.add(channelRole)
			.catch(console.error)
		}
	}
	if (m.roles.cache.some(r => r.name === "RANCHDIP")) {
		if (m.roles.cache.some(r => r.name === "TO THE RANCH")) dip(m, 1)
		else dip(m)
	}
/*DELTAS().members.forEach(m => {
	if (m.roles.cache.some(r => regLevel.test(" " + r.name))) {
	let levelRole = m.roles.cache.find(r => regLevel.test(" " + r.name))
		if (m.roles.cache.some(r => jn.risk.includes(r.name))) {
			if (m.roles.cache.some(r => r.name === "TO THE RANCH"))
				m.roles.remove(m.roles.cache.find(r => jn.risk.includes(r.name)))
				.catch(console.error)
		} else if (m.roles.cache.some(r => r.name === "TO THE RANCH") === false) 
			m.roles.add(DELTAS().roles.cache.find(r => r.name === jn.risk[jn.levels.indexOf(levelRole.name)]).id)
			.catch(console.error)
	}
	if (m.roles.cache.some(r => r.name === "RANCHDIP")) {
		if (m.roles.cache.some(r => r.name === "TO THE RANCH")) dip(m, 1)
		else dip(m)
	}
})*/
	
})

client.on('roleUpdate', (oldR, newR) => {
if (newR.name.toLowerCase() == "mem") newR.setName("QOF")
else if (oldR.name.toLowerCase() == "qof" && newR.name.toLowerCase() != "qof") newR.setName("QOF")
})

client.on('roleCreate', newR => {
if (newR.name.toLowerCase() == "mem") newR.setName("QOF")
})

client.on('channelUpdate', (oldC, newC) => {
if (newC.name == "mem") newC.edit({ name: "qof"})
else if (oldC.name == "qof" && newC.name != "qof") newC.edit({ name: "qof"})
})

client.on('channelCreate', newC => {
if (newC.name == "mem") newC.edit({ name: "qof"})
})

client.on('message', initialMessage => {
	
global.sudo = 0
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
	sudo = 1
	} else (tempMessage.channel.send(`**${tempMessage.author.tag}**, ` + "error: you do not have permission to use `sudo`."))
}}
sudoCheck()
let content = tempMessage.content
while (content.split(" ")[0].slice(0,2) === ">!") {
	content = content.slice(2)
	let cArr = content.split(" ")
	if (getUser(cArr[0]) === client.user || tempMessage.author.id === '143261987575562240') {
	if (getUser(cArr[0]) != undefined) {
		tempMessage.author = client.users.cache.get(getUser(cArr[0]).id)
		tempMessage.member = DELTAS().members.cache.get(getUser(cArr[0]).id)
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

// Handy vars
ch = msg.channel
mesc = msg.content

// Evil logger so I can see everything that goes on at the sever >:Dc
if (ch.type != 'dm') {
if (msg.member !== null) {
let d = new Date()
let time = `(${(Number(d.getUTCHours()) + 3) % 24})/${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`
let date = `${d.getUTCDate()}.${d.getUTCMonth()}.${d.getUTCFullYear().toString().slice(2)}`
console.log(`${time} ${date} [${ch.name}] (${msg.member.nickname ? msg.member.nickname : msg.author.username}): ${mesc}`) // Logs all of the messages.
} else console.log("What the FUCK")

}

// If the message's author is a bot, just ignore it
if ((msg.author.bot && botPass === 0) || msg.channel.id === '695577286568837220') return;

if ((debugVariables.stop_all === 1) && (msg.author.id != '143261987575562240')) return // If the 'stop" debug variable is 1, the bot only parses my commands

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
	
	case "qof": {
	if (msg.member.roles.cache.find(r => r.name === "QOF")) {
		msg.member.roles.remove(DELTAS().roles.cache.find(r => r.name === "QOF"))
		ch.send("**" + msg.author.tag + "**, " + "skidaddle skidoodle you no longer have coroner.").then(m => m.delete({ 'timeout': 2000 }))
		msg.delete({ 'timeout': 2000 })
		}
	else {
		msg.member.roles.add(DELTAS().roles.cache.find(r => r.name === "QOF"));
		ch.send("**" + msg.author.tag + "**, " + "qof qof, you have been infected.").then(m => m.delete({ 'timeout': 2000 }))
		msg.delete({ 'timeout': 2000 })
		}
	} break
	case "help": {
	if (jn.cmds.includes(ciCmd[1])) {
	let index = jn.cmds.indexOf(ciCmd[1]) + 1
	ch.send("**" + msg.author.tag + "**, " + jn.help1[index])
	} else {
	ch.send("**" + msg. author.tag + "**, " + jn.help1[0])
	}
	} break
	case "ssb": {
		pagedMessage(fic2.fic2, ch, "https://www.fanfiction.net/s/4112682")
		/* fs.writeFile("./test.txt", "[\r\n" + breaker(fic2.fic2.join("\\\\n  "), 1940).map(l => l = "`" + l + "`").join(",\r\n") + "\r\n]", err => {
			if (err) throw err
			console.log("The file was saved!");
		}) */
	} break
	case "kancolle": {
		pagedMessage(fic.fic, ch, "https://www.fanfiction.net/s/10333897")
	} break
	case "wnp": {
		pagedMessage(wnp.wnp, ch, "why? why the hell not")
		/* fs.writeFile("./test.txt", "[\r\n" + breaker(wnp.wnp, 1920).map(l => l = "`" + l + "`").join(",\r\n") + "\r\n]", err => {
			if (err) throw err
			console.log("The file was saved!");
		}) */
	} break
	case "cbt": {
		pagedMessage(breaker(why.cbt, 1000), ch, "https://en.wikipedia.org/wiki/Cock_and_ball_torture")
	} break
	case "beemovie": {
		pagedMessage(why.scriptArray, ch, "No, I don't know why I did this.")
	} break
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
		ch.send(qte2 + (qRoll + 1) + ": " + qte[qRoll])
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
	
	case "ml": {
		//if (Date.now() - debugVariables.latest_ml_use < 120000 && global.sudo === 0) {
		if (debugVariables.ml_used === 1 && global.sudo != 1) {
		ch.send(`The command has already been used today. /shrug`)
		return
		}
		debugVariables.ml_used = 1
		let mods = DELTAS().members.cache.filter(m => m.roles.cache.some(r => r.name === "Mod"))
		let unmods = DELTAS().members.cache.filter(m => m.roles.cache.some(r => r.name === "Mod" || r.name === "Second-in-command" || r.name === "Commissar" || r.name === "Rubber Tyrant") === false && m.user.bot === false && m.roles.cache.some(r => ["Level III", "Level IV", "Level V"].includes(r.name)))
		loser = mods.array()[roll(mods.array().length) - 1]
		winner = unmods.array()[roll(unmods.array().length) - 1]
		if (loser === undefined || winner === undefined) {
		ch.send(`The command broke, for some reason. Try again.`)
		console.log(loser)
		console.log(winner)
		return
		}
		loser.roles.remove(DELTAS().roles.cache.find(r => r.name === "Mod"))
		winner.roles.add(DELTAS().roles.cache.find(r => r.name === "Mod"))
		ch.send(`Results of the mod lottery: **${loser.user.tag}** gave his role to **${winner.user.tag}**.`)
	} break
	
	case "unban": {
	if (!admins.includes(msg.author.id) && !msg.member.roles.cache.some(r => r.name === "Commissar")) {
		ch.send("**" + msg.author.tag + "**, " + "you do not have permission to use `!unban`.")
		return
	}
	if (!getUser(ciCmd[1])) {
		ch.send("**" + msg.author.tag + "**, " + "error: invalid member.")
		return
	}
	let member = DELTAS().members.cache.get(getUser(ciCmd[1]).id)
	if (!bans.some(b => b.id === member.user.id)) {
		ch.send("**" + msg.author.tag + "**, " + "error: specified member is not banned.")
		return
	} else {
		let toUnban = bans.find(b => b.id === member.user.id)
		console.log(toUnban)
		toUnban.amount = 0
		toUnban.timestamp = 0
		console.log(toUnban)
		console.log(bans)
		ch.send(`Unbanned **${member.user.tag}**.`)
	}
	updateData()
	} break
	
	case "ban": {
	
	if (admins.includes(msg.author.id) === false && msg.member.roles.cache.some(r => r.name === "Mod" || r.name === "Commissar") === false) {
		ch.send("**" + msg.author.tag + "**, " + "you do not have permission to use `!ban`.")
		return
	}
	let amount
	if (/\D/.test(ciCmd[2])) amount = 5
	else amount = Number(ciCmd[2])
	if (amount < 0 || (amount > 240 && !global.sudo)) {
		ch.send("**" + msg.author.tag + "**, " + "error: cannot ban for less than 0 or more than 240 seconds.")
		return
	}
	if (amount > 10 && admins.includes(msg.author.id) === false) {
	if (msg.member.roles.cache.some(r => r.name === "Commissar")) {
	if (amount > 30) {
		ch.send("**" + msg.author.tag + "**, " + "error: members with the Commissar role cannot ban for more than 30 seconds.")
		return
	}
	} else {
		ch.send("**" + msg.author.tag + "**, " + "error: members with the Mod role cannot ban for more than 10 seconds.")
		return
	}}
	if (!getUser(ciCmd[1])) {
		ch.send("**" + msg.author.tag + "**, " + "error: invalid member.")
		return
	}
	let member = DELTAS().members.cache.get(getUser(ciCmd[1]).id)
	let roles = member.roles.cache.filter(r => r.managed === false).array().map(r => r.id)
	console.log(roles)
	if (roles.includes('673218574101512214')) {
		ch.send("**" + msg.author.tag + "**, " + "error: specified member already banned.")
		return
	}
	if (roles.includes('675402831351775257')) {
		ch.send("**" + msg.author.tag + "**, " + "I'm sorry, but ${member.nickname ? member.nickname : member.user.username} is too powerful. (**@not gay**)"
		return
	}
	if (member.user.bot === true) {
		ch.send("**" + msg.author.tag + "**, " + `error: cannot ban bots. (**${getUser(ciCmd[1]).tag}**)`)
		return
	}
	let bannedRoles = ['673218574101512214']
	if (member.roles.cache.some(r => r.name.split(" ")[0] === "Level"))
		bannedRoles.push(member.roles.cache.find(r => r.name.split(" ")[0] === "Level").id)
	member.roles.set(bannedRoles)
	ch.send(`Banned **${getUser(ciCmd[1]).tag}** for ${amount} seconds.`)
	/* async function banDbify(user, amount, roles) {
	pool.getConnection((err, connection) => {
	if (!connection) {setTimeout(() => {banDbify(user, amount, roles)}, 1000); console.log("Error: connection not established (!ban)"); return}
	try {
	connection.query("INSERT INTO bans (ban_id, id, duration, timestamp, roles) VALUES ('" + user.id.toString() + Date.now().toString().slice(-8) + "', '" + user.id + "', '" + amount + `', '${Date.now()}', '${roles.join('|')}')`)
	
	} catch(err) {connection.release(); setTimeout(() => {banDbify(user, amount, roles)}, 1000); console.log(err + " (!ban)"); return}
	})}
	banDbify(member.user, amount, roles) */
	bans.push({
		"ban_id": member.user.id.toString() + Date.now().toString().slice(-8),
		"id": member.user.id,
		"duration": amount,
		"timestamp": Date.now(),
		"roles": roles.join("|")
		
	})
	updateData()
	} break
	
	case "debug": {
		
	if (admins.includes(msg.author.id) === false) {
		ch.send("**" + msg.author.tag + "**, " + "you do not have permission to use debug commands.")
		return
	}
	
	switch (csCmd[1]) {
		case "nig": {
			debugVariables.nigmus = !debugVariables.nigmus
		} break
		case "check_sudo": {
			console.log("Sudo: " + global.sudo)
		} break
		case "list_variables": {
			console.log(debugVariables)
		} break
		case "uba": {
			bans = bans.map(b => {
				let d = b
				d.duration = 0
				d.timestamp = 0
				return b
			})
		} break
		case "clearbans": {
			console.log(bans.map(b => b.ban_id))
			bans = []
			console.log(bans.map(b => b.ban_id))
		} break
		case "tw": {
			fs.writeFile("./test.txt", "[\r\n" + ["foo", "bar", "por"].join(",\r\n") + "\r\n]", err => {
				if (err) throw err
				console.log("The file was saved!");
			})
		} break
		case "tl": 
			sc.tl()
		break
		case "te": { // testEncounters
			let testCombatants = [dbployees.e('143261987575562240'), /* 			*/ dbnos.e('1')]
			sc.encounter(testCombatants, ch)
		} break
		case "dmt": {
			console.log(dbployees.e('143261987575562240').damageMultiplier)
		} break
		case "quit":
			updateData()
			client.destroy()
			connection.destroy()
			wait(1000).then(() => console.log('quit'))
		break
		case "restart":
			updateData()
			client.destroy()
			connection.destroy()
			wait(200).then(() => console.log('restart'))
		break
		case "kc":
			connection.query(`KILL ${csCmd[2]};`, (err, result) => {
				if (err) throw err
			})
		break
		case "test":
			
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
			let tempch = DELTAS().channels.cache.get(ciCmd[2])
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
			if (exists(ciCmd[2]) && exists(ciCmd[3]) && debugVariables[csCmd[3]] !== undefined) {
				if (typeof(debugVariables[csCmd[3]]) == "number") debugVariables[csCmd[3]] = Number(ciCmd[4])
				else debugVariables[csCmd[3]] = ciCmd[4]
				}
			else ch.send("Error: incorrect usage. " + `(${exists(ciCmd[2])} ${ciCmd[2]} ${exists(ciCmd[3])} ${exists(ciCmd[3])} ${debugVariables[csCmd[2]] !== undefined} ${csCmd[2]}`)
			console.log(exists(0))
		break
		case "uc":
			if (dbployees.some(d => exists(d.id) === false)) ch.send("Found one, chief.")
			else ch.send("No anomalies in sight.")
		break
		case "p":
		case "profile": // !debug[0] profile[1] quack[2] hp[3] 100[4] 
			{
			let uid
			let lValue
			let argument = csCmd.slice(4).join(" ")
			if (exists(getUser(ciCmd[2]))) uid = getUser(ciCmd[2]).id; else uid = '143261987575562240'
			if (/^-?\d*/.exec(argument)[0] === argument && typeof(dbployees.e(uid)[ciCmd[3]]) === "number") lValue = Number(argument)
			else lValue = argument
			dbployees.e(uid)[ciCmd[3]] = lValue
			updateData() 
			}
		break
		case "dbptest":
			sc.dbptest()
		break
		case "role":
			async function rtest() {
			let m = DELTAS().members.cache.get('610962908695887912')
			let roles = m.roles.cache.array().map(r => r.id)
			m.roles.set([])
			console.log("yeet")
			await wait(3000)
			m.roles.set(roles)
			console.log("yort")
			}
			rtest()
		break
		case "b":
		case "box": {// !debug[0] box[1] quack[2] o-03-03[3] 1[4]
		let uid
		let lValue
		if (exists(getUser(ciCmd[2]))) uid = getUser(ciCmd[2]).id; else uid = '143261987575562240'
		if (/^-?\d*/.exec(ciCmd[4])[0] === ciCmd[4] && jn.abnWorkable.includes(ciCmd[3])) {
		lValue = Number(ciCmd[4])
		dbployees.e(uid).bumpBox(ciCmd[3], lValue)
		} else ch.send("Incorrect argument.")
		} break
		case "entitytest":
			sc.entityTest()
		break
		case "ap": {
		let aid = csCmd[2]
		let lValue
		let argument = csCmd.slice(4).join(" ")
		if (/^-?\d*/.exec(argument)[0] === argument && typeof(dbnos.e(aid)[ciCmd[3]]) === "number") lValue = Number(argument)
		else lValue = argument
		dbnos.e(aid)[ciCmd[3]] = lValue
		updateData() 
		} break
		case "a": {
		if (dbnos.some(a => Number(a.id) === Number(csCmd[2]))) {
		let cAbno = dbnos.e(csCmd[2])
		console.log(cAbno)
		} else ch.send("Incorrect abnormality ID.")
		} break
		case "araw":
			console.log(dbnos)
		break
		case "afix":
			dbnos.forEach(d => {
				d.qcounter = "X"
				d.breaching = 0
				d.dead = 0
				let cAbno = abn.abn.find(a => a.id === d.id)
				if (cAbno.qcounter != undefined) d.qcounter = cAbno.qcounter
				})
		break
		case "apology": {
			dbployees.forEach(d => {
			d.balance += 500
			})
		} break
		case "gift": {
			if (getEmployee(csCmd[2]).id) {
			if (abn.abn.some(a => Number(a.id) === Number(csCmd[3]))) { 
			if (abn.abn.find(a => Number(a.id) === Number(csCmd[3])).gift === "true") {
			let cAbno = abn.abn.find(a => Number(a.id) === Number(csCmd[3]))
			fn.gift(dbployees.e(getUser(csCmd[2]).id), cAbno.id, {"override": true})
			} else ch.send("Incorrect abnormality specified. (that one doesn't have a gift yet)")
			} else ch.send("Incorrect abnormality specified.")
			} else ch.send("Incorrect user specified.")
			} 
			break
		case "ungift": {
			if (getEmployee(csCmd[2]).id) {
			if (abn.abn.some(a => Number(a.id) === Number(csCmd[3]))) { 
			if (abn.abn.find(a => Number(a.id) === Number(csCmd[3])).gift === "true") {
			let cAbno = abn.abn.find(a => Number(a.id) === Number(csCmd[3]))
			fn.giftManip(dbployees.e(getUser(csCmd[2]).id), cAbno.id, "remove")
			} else ch.send("Incorrect abnormality specified. (that one doesn't have a gift yet)")
			} else ch.send("Incorrect abnormality specified.")
			} else ch.send("Incorrect user specified.")
			} 
			break
		case "sudogift": {
			if (getUser(csCmd[2]).id) {
			fn.gift(dbployees.e(getUser(csCmd[2]).id), csCmd[3], {"override": true})
			} else ch.send("Incorrect user specified.")
			}
			break
		case "sudoungift": {
			if (getUser(csCmd[2]).id) {
			fn.giftManip(dbployees.e(getUser(csCmd[2]).id), csCmd[3], "remove")
			} else ch.send("Incorrect user specified.")
			}
			break
		case "abnoinit": 
			databaseAbnormalities()
			break
		case "healtest":
			console.log("heal test: " + dbployees.e('143261987575562240').heal("sp", 100))
			
			break
		case "var":
			if (exists(csCmd[2]) && exists(csCmd[3]) && exists(debugVariables[csCmd[2]])) {
				debugVariables[csCmd[2]] = Number(csCmd[3])
			}
			break
		case "revive":
			{
			let uid
			if (exists(getUser(ciCmd[2]))) uid = getUser(ciCmd[2]).id; else uid = '143261987575562240'
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
					let cDepartment = getRole(jn.ncdeproles.find(r => r.toLowerCase().startsWith(ciCmd[2])))
					let cDepMembers = cDepartment.members.array().map(m => m.user.tag)
					let cDMText = cDepMembers.join(", ")
					if (cDMText === "") cDMText = "The department is empty... *crickets*"
					let cDepCaptain = "none."
					let cDCRole = getRole(cDepartment.name + " (C)")
					if (cDCRole.members.array().length !== 0) cDepCaptain = cDCRole.members.array()[0].user.tag
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
						depArray.push(`[${r}] (${cDepECount} employee${ifEIO}) \n		Captain:\n#		${cDepCaptain}`)
					})
					ch.send("List of departments and the respective captains: \n```md\n" + depArray.join(", \n") + ".```")
				}
				
			} break
			
			case "w":
			case "work": {
			if (ciCmd[2] != "list") {
				if (abno(ciCmd[2])) {
				if (/\D/.test(ciCmd[2]) === false)
					ciCmd[2] = abn.abn.find(a => a.code.split("-")[2] === ciCmd[2]).code
				if (jn.abnWorkable.includes(ciCmd[2])) {
				if (jn.workOrders.includes(ciCmd[3])) {
				if (dbployees.e(msg.author.id).working === 0) {
				//if (dbployees.e(msg.author.id).panicked === 0) {
				if (dbployees.e(msg.author.id).dead === 0) {
				let effectDead = false
				let effectDeathCause = ""
				let onCooldown = false
				let cdVal = 0
				let deathOnWork = fn.effects.deathOnWork(dbployees.e(msg.author.id), ciCmd[2])
				if (deathOnWork[0] === true) {
					effectDead = true
					effectDeathCause = deathOnWork[2]
				}
				if (dbployees.e(msg.author.id).effectArray.some(e => Number(e[0]) === 2)) {
					onCooldown = true
					cdVal = dbployees.e(msg.author.id).effectArray.find(e => Number(e[0]) === 2)[1]
					ch.send("**" + msg.author.tag + "**, " + "you are still on a cooldown. " + `(~${Number(cdVal) + 1} second(s))`)
					return
				}
				let fightStarted = false
				if (dbnos.some(d => d.breaching === 1 && d.dead === 0)) {
					let breaching = dbnos.filter(d => d.breaching === 1 && d.dead === 0)
					console.log(breaching)
					let chance = 0//breaching.length * 10
					let cRoll = roll(100)
					if (cRoll <= chance) {
					fightStarted = true
					let enemy = breaching[roll(breaching.length)-1]
					ch.send("You have been waylaid by enemies and must defend yourself!")
					sc.encounter([dbployees.e(msg.author.id), enemy], ch)
				}}
				
				if (onCooldown === false && fightStarted === false) {
				if (effectDead === false) {
					work(dbployees.e(msg.author.id), ciCmd[2], ciCmd[3], msg.channel)
				} else {
					dbployees.e(msg.author.id).dead = 1
					dbployees.e(msg.author.id).hp = 0
					dbployees.e(msg.author.id).sp = 0
					dbployees.e(msg.author.id).effects = "null"
					ch.send("**" + msg.author.tag + "**, " + "you have died. Cause of death: " + effectDeathCause)
				}}
				} else ch.send("**" + msg.author.tag + "**, " + "error: you are dead.")
				//} else ch.send("**" + msg.author.tag + "**, " + "error: you are panicking.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: you are already currently working on an abnormality.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect work order. Orders: instinct, insight, attachment, repression.")
				} else ch.send("**" + msg.author.tag + "**, " + "error: work on the specified abnormality unavailable. (!lc w list)")
				} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect abnormality code specified or specified abnormality unavailable. (!lc w list)")
				} else if (ciCmd[2]) { // Else it is the list
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
					let i = 0
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
				} else ch.send("**" + msg.author.tag + "**, " + "error: missing argument.")
			} break
			
			case "p":
			case "profile": {
			let cUser
			if (exists(getEmployee(ciCmd[2]))) {
			if (dbployees.ids().includes(getEmployee(ciCmd[2]).id)) {
				cUser = dbployees.e(getEmployee(ciCmd[2]).id)
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
					if (e[1] === "inf" || e[1] === "bt") 
						effectTime = `???`
					else {
						if (Number(e[1]) > 60) effectTime = (Number(e[1])/60).toFixed(1) + " minute(s)"
						else effectTime = e[1] + " second(s)"
					}
					if (e[2] === "Fatigue")
						effectSpecialString = ` [+${Math.floor(Number(e[3])/3)} second(s) to work CD]`
					effectArray.push(`${"\n" + e[2]} ${effectSpecialString} <${effectTime}>`)
				})
			} else effectArray = ["none"]
			let state = "alive"
			if (cUser.dead === 1) state = "dead"
			else if (cUser.panicked === 1) state = "panicked"
			let statsString = []
			for (m = 0; m < 4; m++) {
				let statLV = "LV " + statLVL(cUser.stats[m])
				let pn
				if (cUser.statBuffArray[m] < 0) pn = ""
				else pn = "+"
				let statCount = `${cUser.statsReal[m]}${pn}${cUser.statBuffArray[m]}`
				if (statLV.length < 6)
					for (k = 0; k < (7 - statLV.length); k++) {statLV = " " + statLV}
				if (statCount.length < 6)
					for (k = 0; k < (7 - statCount.length); k++) {statCount += " "}
				statsString.push("	`‌" + statLV + "‌` " + jn[jn.stats[m]] + " `‌" + statCount + "‌`")
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
				subPointString.push("	" + stat + " `‌" + subPointCount + "‌`")
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
`\nCurrently:	${state}.`,
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
			const header = "\n```mb\n 📦 | Showing inventory of " + cUser.tag + "```" + `		${jn.ppebox} PPE Boxes: ${cUser.balance}\n`
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
								ret = 1
								ch.send(`The bullet menu is under reconstruction.`)
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
				else if (menuIndex === "interExit") menumsg.edit(menumsg.content + `	\n\nAnother command noticed, automatically exiting the menu.`)
				else if (menuIndex === "silentexit") console.log("Exited silently. Woosh!")
				
			}
		
			menuNavigationInventory()
			})}
			inv(dbployees.e(msg.author.id), msg.channel)
			} break
			
			case "g": {
				
			if (ciCmd[2] !== "list") {
			
			function giftInventory(emp, channel) {
			class localGift { // Because it fucking refuses to work without a class.
				constructor(id, index, slot, locked) {
					this.raw = gear.gifts.find(g => Number(g.id) === Number(id))
					this.id = Number(id)
					this.index = index
					this.slot = this.raw.slot
					if (exists(locked) === false) this.locked = "🔓"
					else this.locked = "🔒"
					if (abn.abn.find(a => Number(a.id) === Number(id)))
					this.abno = abn.abn.find(a => Number(a.id) === Number(id)).code.toUpperCase()
					else this.abno = "???"
				}
			}
			let cUser = emp
			const cCh = channel
			if (exists(cUser.giftArray) === false) {
				cCh.send(`**${cUser.tag}**, you do not have any gifts.`) 
				return
			}
			const header = "\n```mb\n 📦 | Showing the gift inventory of employee " + cUser.tag + "```\n"
			const acts = `Type in 'lock' to open the gift locking menu or 'exit' to leave.`
			let inventoryG
			let gifts
			function updateGifts(l = 0) {
				inventoryG = cUser.giftArray.map((g, i) => new localGift(g[1], i+1, g[0], g[2]))
				if (l === 0) gifts = inventoryG.map(g => `${g.locked} <${bck}${g.abno}${bck}> ${g.raw.name} - ${g.raw.text} [${sSlotText(g.slot)}]`).join("\n	")
				else gifts = inventoryG.map(g => `${g.index}) ${g.locked} <${bck}${g.abno}${bck}> ${g.raw.name} - ${g.raw.text} [${sSlotText(g.slot)}]`)
				.join("\n	")
			}
			updateGifts()
			
			cCh.send(header + `		Gifts:\n	${gifts}\n\n` + acts).then(menumsg => {
			
			let menuIndex = "main"
				
				async function menuNavigationGift() {
					while ((menuIndex != "exit") && (menuIndex != "timeout") && (menuIndex != "fail") && (menuIndex != "test") && (menuIndex != "interExit")) {
					await cCh.awaitMessages(r => r.author.id === cUser.id, { max: 1, time: 25000 }).then(r => {
					let rp = r.first()
					if (rp != undefined) {
					rp.delete({ 'timeout': 2000 })
					let mr = rp.content.toLowerCase().split(" ")
					
					if (mr[0] != "!lc") {
					if (mr[0] != "exit") {
					if (mr[0] === "cancel" || mr[0] === "return") {
						menuIndex = "main"
					}	
						let ret = 0
						let k = 0
						let ki = 0
						while (k === 0 && ki < 6) {
						switch (menuIndex) {
							case "main":
								updateGifts()
								menumsg.edit(header + `		Gifts:\n	${gifts}\n\n` + acts)
								if (ret === 1) {ret = 0; k = 1; break}
								if (mr[0] === "lock") menuIndex = "lock"
								else k = 1
							break
							
							case "lock":
							if (k != 1) {
								updateGifts(1)
								menumsg.edit(header + `		Gifts:\n	${gifts}\n\nType in the number corresponding to the gift you wish to lock or unlock, or 'cancel' to go back.`)
								if (inventoryG.some(g => g.index === Number(mr[0]))) {
									let gift = inventoryG.find(g => g.index === Number(mr[0]))
									let newGiftArray = cUser.giftArray
									let arrayGift = newGiftArray.find(g => Number(g[1]) === gift.id)
									if (exists(arrayGift[2])) {
										arrayGift.pop()
										cCh.send(`Unlocked the ${sSlotText(gift.slot)} slot.`)
										}
									else {
										arrayGift.push(1)
										cCh.send(`Locked the ${sSlotText(gift.slot)} slot.`)
										}
									cUser.gifts = newGiftArray.map(g => g.join("/")).join("|")
									menuIndex = "main"
									ret = 1
								} else k = 1
							}
							break
							
							default:
							if (k != 1) {
							k = 1
							menuIndex = "fail"
							}
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
				else if (menuIndex === "interExit") menumsg.edit(menumsg.content + `	\n\nAnother command noticed, automatically exiting the menu.`)
				else if (menuIndex === "silentexit") console.log("Exited silently. Woosh!")
				
			}
		
			menuNavigationGift()
			})}
			giftInventory(dbployees.e(msg.author.id), msg.channel)
			
			} else {
				let gifts = []
				gear.gifts.forEach(g => {
					if (abn.abn.find(a => a.id === g.id)) gifts.push(abn.abn.find(a => a.id === g.id).name)
					else console.log(g.id)
				})
				let giftsText = "The abnormalities that currently have gifts: " + gifts.join(", ") + "."
				ch.send(giftsText)
			}
			
			} break
			
			case "b": {
			cCh.send("The bullet menu is under reconstruction.")
			} break
			
			case "help": {
			if (drFind(msg.member) === "") {
				ch.send("**" + msg.author.tag + "**, " + "To get assigned to a team, type in !lc assign (Team name), e. g. !lc assign training")
				
			} else {
				let helpArr = [
					"Disambiguation: arguments in [square brackets] are optional, arguments in (parentheses) are required for the command to work.\n",
					"	`!lc assign (control/training/extraction etc)` - assigns you to the specified department.",
					"	`!lc p [employee's nickname/discord tag]` - shows the employee's profile if one is specified, shows yours otherwise.",
					"	`!lc i` - shows your inventory.",
					"	`!lc a (abnormality ID)` - shows an info card of the specified abnormality. Only useful in a few cases.",
					"	`!lc w (abnormality ID) (instinct/insight/attachment/repression)` - executes the selected work order on the abnormality with the specified ID. Use `!lc w list` to see the list of all abnormalities currently in the facility.",
					"	`!lc ex [abnormality ID]` - shows the extraction menu. If an abnormality ID is specified, immediately takes you to that abnormality's equipment extraction menu.",
					"	`!lc (ex/work) list` - shows the list of workable abnormalities. `!lc ex list` also shows how much abnormality-specific PE boxes you have.",
					"	`!lc debuff (apply/remove) (stat) [value]` - applies or removes a debuff on the selected stat. Removing a debuff does not require specifying the value.",
					"	`!lc list [department name]` - lists all departments' captains and member count if a department is not specified, lists a department's members and captain otherwise. Example: `!lc list training`",
					"	`!lc leave` - initiates the procedure of department unassignment. *Does* have a confirmation message.",
					"	`!lc captain`:",
					"		`!lc captain vote (@employee)` - initiates a vote for the mentioned employee to become the captain of your department, if one is not assigned already.",
					"		`!lc captain resign` - (captain command) initiates the procedure of captain role resignation. *Does* have a confirmation message."
				]
				ch.send(helpArr.join("\n"))
			}} break
			
			case "f": {
			if (dbnos.some(d => d.breaching === 1 && d.dead === 0)) {
				let breaching = dbnos.filter(d => d.breaching === 1 && d.dead === 0)
				console.log(breaching)
				let enemy = breaching[roll(breaching.length)-1]
				ch.send("You have found an enemy.")
				sc.encounter([dbployees.e(msg.author.id), enemy], ch)
			} else ch.send(`**${msg.author.tag}**, there is nothing to fight right now.`)
			} break
			
			case "a":
			case "abno": { // !lc a o-03-03
			if (/\D/.test(ciCmd[2]) === false)
				ciCmd[2] = abn.abn.find(a => a.code.split("-")[2] === ciCmd[2]).code
			if (jn.abnWorkable.includes(ciCmd[2])) {
			let cAbno = abno(ciCmd[2])
			let cDbno = dbnos.e(cAbno.id)
			const header = "\n```mb\n ℹ️ | Showing information about the abnormality " + cAbno.name + "```\n"
			let special = []
			switch (cAbno.code) {
				case "t-02-43": {
				let cocoons = 0
				if (exists(cDbno.effectArray)) {
				if (cDbno.effectArray.some(e => e[0] === "cocoon")) {
					cocoons = Math.ceil(Number(cDbno.effectArray.find(e => e[0] === "cocoon")[1])/600)
				}}
				special.push(",\n Cocoons:	" + cocoons + ".")
				} break
				case "f-02-44": {
				let state = "normal"
				if (cDbno.buffListArray.some(b => b[0] === "sick")) state = "sick"
				special.push(`,\n State:	${state}`)
				}
				default:
				special.push(".")
				break
			}
			ch.send(header + ` ${jn['qliphothcounter']} Qliphoth Counter:	(${cDbno.qcounter}),\n Containment status:	${["contained", "breaching"][cDbno.breaching]}${special.join("")}`)
			
			} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect abnormality specified or the specified abnormality is not currently available in the facility.")
			} break
			case "assign": {
			if (msg.member) {
			if (drFind(msg.member) === undefined) {
			if (jn.nccideproles.includes(ciCmd[2])) {
				async function assign(member) {
					let departmentRole = getRole(ncdeproles[jn.nccideproles.indexOf(ciCmd[2])])
					if (dbployees.e(msg.member.user.id) === undefined) {
					updateData()
					await wait(100)
					msg.member.roles.add(departmentRole)
					await wait(100)
					await databaseEmployees()
					await wait(100)
					console.log("New assign.")
					}
					else {
					msg.member.roles.add(departmentRole)
					dbployees.e(msg.member.user.id).tjtime = Date.now()
					console.log("Re-assign.")
					}
					dbployees.filter(e => exists(e))
					ch.send("**" + msg.author.tag + "**, " + "you have been successfully assigned to work in the " + departmentRole.name + "!")
				}
				assign(msg.member)
			} else ch.send("**" + msg.author.tag + "**, " + "error: incorrect team name. Example: !lc assign extraction team")
			} else ch.send("**" + msg.author.tag + "**, " + "you can only work in one team at a time. Leave your team (!lc leave) if you want to join another team.")
			} else ch.send("**" + msg.author.tag + "**, " + "something REALLY broke. I got nothing, dude. Report this shit.")
			} break
			
			case "leave": {
			if (cdeproles.every(t => msg.member.roles.cache.map(r => r.name).includes(t) === false)) {
			if (deproles.some(t => msg.member.roles.cache.map(r => r.name).includes(t))) {
				ch.send("**" + msg.author.tag + "**, " + "do you really want to leave the " + drFind(msg.member) + "? **y**/**n**")
				const collector = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { time: 10000 })
				collector.on('collect', cmsg => {
				if (cmsg.content.toLowerCase() === "y") {
					ch.send("**" + msg.author.tag + "**, " + "you have left the " + drFind(msg.member) + ".") 
					if (dbployees.e(msg.author.id).buffListArray.some(b => b[0].startsWith("team"))) {
					fn.effectApplication['department'](dbployees.e(msg.author.id), drFind(msg.member), "take", 0)	
					}
					dbployees.e(msg.author.id).tjtime = Date.now()
					msg.member.roles.remove(getRole(drFind(msg.member)))
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
						return
					}
					if (dbployees.e(msg.author.id).buffListArray.some(b => b[0] === "manualDebuffCD")) {
						ch.send("**" + msg.author.tag + "**, " + "you are currently on a manual debuff application cooldown. Wait until it wears off to apply another debuff.")
						return
					}
				}
				if ((dbployees.e(msg.author.id).stats[jn.stats.indexOf(ciCmd[3])] - ciCmd[4]) < 17) {
					ch.send("**" + msg.author.tag + "**, " + `the value of a stat cannot go below 17 (would be ${dbployees.e(msg.author.id).stats[jn.stats.indexOf(ciCmd[3])] - ciCmd[4]} with the specified argument)`)
					return
				}	
					fn.effectApplication['manualDebuffCD'](dbployees.e(msg.author.id))
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
				const cCh = DELTAS().channels.cache.get(channel)
				let currentAbno
				let currentAbnoCode
				let currentShop
				let cPurchase
				let cInv
				let item
				let objItem
				let menuIndex = "main"
				let instAbno = 0
				if (/\D/.test(ciCmd[2]) === false)
					ciCmd[2] = abn.abn.find(a => a.code.split("-")[2] === ciCmd[2]).code
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
				function invResponse(msg) {ch.send("**" + msg.author.tag + "**, " + "error: invalid response.").then(tmp => tmp.delete({ 'timeout': 3000 }))}
				function forceReturn(msg, code) {ch.send("**" + msg.author.tag + "**, " + code).then(tmp => tmp.delete({ 'timeout': 4000 }))}
				
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
						rp.delete({ 'timeout': 2000 })
						let mr = rp.content.toLowerCase()
						
						if (rp.content.toLowerCase().startsWith("!lc") === false) {
						if (rp.content.toLowerCase() !== "exit") {
						if (rp.content.toLowerCase() !== "return" && rp.content.toLowerCase() !== "cancel") {
							let k = 0
							let ki = 0
							while (k === 0 && ki < 4) {
							switch (menuIndex) {
								
								// Main menu of extraction 
								case "main": if (k !== 1) {
								if (jn.abnWorkable.includes(rp.content.toLowerCase())) {
									currentAbno = abn.abn[abn.lista.indexOf(rp.content.toLowerCase())]
									currentAbnoCode = rp.content.toLowerCase()
									menuIndex = "shop"
								} else if (mr === "bullet" || mr === "bullets") menuIndex = "bulletshop"
								else {invResponse(rp); k = 1}
								} break
								
								case "bulletshop": if (k !== 1) {
									let sidearms = gear.sidearms.map((s, i) => {return {"i": i+1, "name": s.name, "description": s.description, "cost": s.cost, "id": s.id, "type": "sidearms"}})
									let bullets = gear.bullets.map((b, i) => {return {"i": i+sidearms.length+1, "name": b.name, "description": b.description, "cost": b.cost, "id": b.id, "type": "bullets"}})
									let shop = sidearms.concat(bullets)
									let shopMessage = "\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```" + `		${jn.ppebox} PPE Boxes: ${cUser.balance}\n\n Available sidearms:\n	`
									let sidearmsArray = sidearms.map(s => `${bck + stringNormalizer(s.i.toString(), -2) + bck}) ${s.name}`)
									let bulletsArray = bullets.map(b => `${bck + stringNormalizer(b.i.toString(), -2) + bck}) ${b.name}`)
									shopMessage += sidearmsArray.join("\n	") + "\n\n Available bullet replicators:\n	" + bulletsArray.join("\n	")
									menumsg.edit(shopMessage + `\n\n	Type in the number corresponding to an item to bring up more actions and detailed information, or 'cancel'/'return' to go back.`)
									if (shop.some(s => s.i === Number(rp.content))) 
									menuIndex = "bulletpurchase"
									else k = 1
								} break
								
								case "bulletpurchase": if (k !== 1) {
									let sidearms = gear.sidearms.map((s, i) => {return {"i": i+1, "name": s.name, "description": s.description, "cost": s.cost, "id": s.id, "type": "sidearms"}})
									let bullets = gear.bullets.map((b, i) => {return {"i": i+sidearms.length+1, "name": b.name, "description": b.description, "cost": b.cost, "id": b.id, "type": "bullets"}})
									let shop = sidearms.concat(bullets)
									let item = shop.find(s => s.i === Number(rp.content))
									let itemRaw = gear[item.type].find(i => i.id === item.id)
									console.log(item)
									console.log(itemRaw)
									k = 1
								} break
									
								case "shop": if (k !== 1) {
									currentShop = {"boxes": Number(cUser.getBox(currentAbnoCode)), "name": currentAbno.name, "gear": [gear.suits[currentAbno.id], gear.weapons[currentAbno.id]]}
									menumsg.edit("\n```mb\n 📤 | Welcome to the extraction hub, employee " + cUser.tag + ".\n```\n" + `	Extraction of E.G.O:	${currentAbno.name}\n		${suit(currentAbno.id)}  -  ${currentShop.gear[0].cost} ${jn.pebox}\n		${weapon(currentAbno.id)}  -  ${currentShop.gear[1].cost} ${jn.pebox}\n	You have ${currentShop.boxes} ${jn.pebox} PE boxes and ${cUser.balance} PPE boxes.\n	Type in 'suit' or 'weapon' to purchase, 'exit' to exit or 'return' to select a different abnormality.`)
									if ((rp.content.toLowerCase() === "suit") || (rp.content.toLowerCase() === "weapon")) menuIndex = "purchase"
									else k = 1
								} break
								
								case "purchase": if (k !== 1) {
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
								} break
								
								case "purChoice": if (k !== 1) {
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
								}
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
					else if (menuIndex === "interExit") menumsg.edit(menumsg.content + `	\n\nAnother command noticed, automatically exiting the menu.`)
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
			let i = 0
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
			if (msg.member.roles.cache.some(r => ncdeproles.includes(r.name))) {
			switch (ciCmd[2]) {
			case "vote": {
			if (getRole(drFind(msg.member) + " (C)").members.array().length === 0) {
			if (getUser(csCmd[3])) {
			let candidate = DELTAS().members.cache.get(getUser(csCmd[3]).id)
			if (drFind(msg.member) === drFind(candidate)) {
			initVote(ch, msg.member, candidate)
			} else {ch.send("Error: specified user is not in a department or is in a department different from yours.")
			}
			} else ch.send("Error: invalid user specified.")
			} else ch.send("Error: your department already has a captain.")
			} break
			}
			// Captain commands
			} else if (msg.member.roles.cache.some(r => cdeproles.includes(r.name))) {
			switch (ciCmd[2]) {
			case "vote":
			ch.send("**" + msg.author.tag + "**, " + "you are your department's captain. If you want someone else to become the captain, type !lc captain resign first.")
			break
			case "resign":
			if (cdeproles.every(t => msg.member.roles.cache.map(r => r.name).includes(t) === false) === false) {
				ch.send("**" + msg.author.tag + "**, " + "do you really want to resign your post as the " + drFind(msg.member) + " captain? **y**/**n**")
				const collector = new Discord.MessageCollector(ch, m => m.author.id === msg.author.id, { time: 10000 })
				collector.on('collect', cmsg => {
				if (cmsg.content.toLowerCase() === "y") {
					ch.send("**" + msg.author.tag + "**, " + "you have resigned as the " + drFind(msg.member) + " captain.") 
					var cptxt = drFind(msg.member)
					msg.member.roles.remove(getRole(cptxt + " (C)"))
					msg.member.roles.add(getRole(cptxt))
					collector.stop()
					let bufflist = []
					if (dbployees.e(msg.author.id).bufflist != undefined) {
					bufflist = dbployees.e(msg.author.id).bufflist.split("|")
					}
					console.log(drFind(msg.member))
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
//}) // End 