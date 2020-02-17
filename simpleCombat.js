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
rDamage = function rDamageC(rec, dea, res) {return main.rDamage(rec, dea, res)}

function roll(sides) {
	return Math.floor(Math.random() * sides) + 1
}

combatAIs = {
	"test": function testAI() {
		return {"attack": 100, "special": 0}
	}
}

class encounter {
	constructor(combatants) {
		this.combatants = combatants
	}
}

class entity {
	constructor(type = "a", points = {"hp": 100, "sp": 100}, attack, special, actionPoints = 10, id) {
		this.type = type
		this.points = points
		this.actionPoints = actionPoints
		this.id = id
		if (type === "a") this.combatAI = combatAIs[0]
		if (this.type === "a") this.raw = abn.abn.find(a => a.id === id)
		else this.raw === "poop"
	}
}

function initiateEncounter(encounter, channel) {
	let round = 1
	let header = "\n```mb\n ⚔️ | Round " + round + " of some fight idk```" + `		${jn.pebox} PPE Boxes: ${cUser.balance}\n`
	
	
	
	
}


let testAbno = new entity(abn.abn[0].entity.type, abn.abn[0].entity.points, abn.abn[0].entity.attack, abn.abn[0].entity.special)

let testEObject = encounter

exports.entityTest = function() {console.log(testAbno)}
exports.testEncounter = function(channel) {initiateEncounter(testEObject, channel)}