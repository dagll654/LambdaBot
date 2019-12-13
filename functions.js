  const jn = require("./junk.json");
  const gear = require("./gear.json")
  	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const cmds = jn.cmds
//module.js
exports.effects = {
	// If {employee} is working on an abnormality with the code "abn" while under an effect that instakills on particular work orders, check whether to kill them or not
	// 0/30/o-01-01
	"deathOnWork": function(employee, abn) {
		let ret = false
		if (employee.effects.length > 0) {
			let effectArray = employee.effects.split("|")
			let deathEffect = []
			effectArray.forEach(e => {
				if (e.startsWith("0/")) {
					deathEffect = e.split("/")
				}
			})
			if (deathEffect.length > 0) {
				if (abn.toUpperCase() != deathEffect[2])
					ret = [true, deathEffect[2], "eaten by fairies."]
			}
		}
		return ret
	},
	"workCD": function(employee) {
		let ret = false
		if (employee.effects.length > 0) {
			let effectArray = employee.effects.split("|")
			let cdEffect = []
			effectArray.forEach(e => {
				if (e.startsWith("2/")) {
					cdEffect = e.split("/")
				}
			})
			if (cdEffect.length > 0) {
				ret = true
			}
		}
		return ret
	}
}
exports.effectApplication = {
	"5": function(employee, result) {
		if (result > 0) {
			effects = employee.effects.split("|")
			function checkEffect(eff) {
				if (eff.startsWith("0/")) {return true}
				else {return false}
			}
			//console.log(employee.tag + " " + effects)
			if (effects.every(eff => {
				return (eff.startsWith("0/") === false)
			})) {effects.push("0/5/F-04-83"); employee.effects = effects.join("|")}
			else {effects[effects.findIndex(checkEffect)] = "0/5/F-04-83"; employee.effects = effects.join("|")}
		}
	},
	"egoChange": function(employee, index) {
		effects = employee.effects.split("|")
		effects.push("1/" + (((index + 1) * 12) * 12) + "/EGO adaptation")
		employee.effects = effects.join("|")
	},
	"workCD": function(employee, boxes) {
		effects = employee.effects.split("|")
		effects.push("2/" + Math.ceil(Number(boxes)/5) + "/work cooldown")
		employee.effects = effects.join("|")
	}
}