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
				if (abn.toLowerCase() != deathEffect[2])
					ret = [true, deathEffect[2], "eaten by fairies."]
			}
		}
		return ret
	}
}
exports.effectApplication = {
	"5": function(employee, result) {
		if (result > 0) {
			let effectArray = employee.effects.split("|")
			let effectIDs = []
			if ((effectArray.length > 0) === false) {
			let deathEffect = []
			effectArray.forEach(e => {
				if (e.startsWith("0/")) {
					e = "0/5/f-04-83"
				}
				effectIDs.push(e.split("/"))[0]
			})

		} else if (effectIDs.includes("0") === false) {effectArray.push("0/5/f-04-83")}
			employee.effects = effectArray.join("|")
		}
		
	}
}
