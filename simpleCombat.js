  const jn = require("./junk.json")
  const gear = require("./gear.json")
  const fn = require("./functions.js")
  const main = require("./bot.js")

	//begin here :D

	// Getting the damage calc function from bot.js 'cause that's probably smart
	rDamage = function rDamageC(rec, dea, res) {return main.rDamage(rec, dea, res)}
	
	function roll(sides) {
		return Math.floor(Math.random() * sides) + 1
	}
	
	class encounter {
		constructor(combatants, initRolls) {
			this.combatants = combatants
			this.initRolls = new Array(combatants.length)
		}
	}