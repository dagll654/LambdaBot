const abn = require("./abnb.json") // Abnormalities
const jn = require("./junk.json") // Miscellaneous stuff
const gear = require("./gear.json") // Gear and items
const fn = require("./functions.js") // Functions, like all effects - on-consume of consumables, on-work of abnos etc.
const main = require("./bot.js")
Number.prototype.shortFixed = function(length) {return Math.round(this*Math.pow(10, length))/Math.pow(10, length)}
Array.prototype.ids = function() {return this.map(e => e.id)}
Array.prototype.e = function(id) {return this.find(e => e.id === id)}

//begin here :D

// Getting the damage calc function from bot.js 'cause that's probably smart
/*rDamage = function rDamageC(rec, dea, res) {return main.rDamage(rec, dea, res)}

function roll(sides) {
	return Math.floor(Math.random() * sides) + 1
}

combatAIs = {
	"0": {"attack": 100, "special": 0}
}


class encounter {
	constructor(combatants) {
		this.combatants = combatants
	}
}

class entity {
	constructor(type = "a", points = {"hp": 100, "sp": 100}, attack, special, /*actionPoints = 10, id) {
		this.type = type
		this.points = points
		this.actionPoints = 5
		this.id = id
		if (type === "a") this.combatAI = combatAIs["0"]
		else this.combatAI = "inapplicable"
	}
	get raw() {
		if (this.type === "a") return abn.abn.find(a => a.id === this.id)
		else return main.dbployees.e(this.id)
	}
}

function initiateEncounter(encounter, cCh) {
	let round = 1
	let header = "\n```mb\n ⚔️ | Round " + round + " of some fight idk```" + `		${jn.pebox} PPE Boxes: ${cUser.balance}\n`
	cCh.send(header)
	async function encounterHandler() {
		while 
	}
	
	
	
}


let testAbno = new entity(abn.abn[0].entity.type, abn.abn[0].entity.points, abn.abn[0].entity.attack, abn.abn[0].entity.special, abn.abn[0].id)

let testEObject = encounter

exports.entityTest = function() {
	console.log(testAbno)
	console.log(testAbno.raw)
}
exports.testEncounter = function(channel) {initiateEncounter(testEObject, channel)}