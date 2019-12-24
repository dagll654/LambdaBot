  const jn = require("./junk.json");
  const gear = require("./gear.json")
  	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const cmds = jn.cmds
//module.js

	function statLVN(stat) {
		if (stat < 30) {return 1}
		else if (stat < 45) {return 2}
		else if (stat < 65) {return 3}
		else if (stat < 85) {return 4}
		else {return 5}
	}
	
	// Roll an x-sided die, even if that makes absolutely no sense in practice
	function roll(sides) {
		return Math.ceil(Math.random() * sides)
	}

buffs = {
	"buff": function(employee, buff, action) {
		for (const b in buff) {
			switch (b) {
			case "stat":
				if (action === "give") {
					let statbuffs = employee.buffs.split("|")
					let buffing = buff[b].split("|")
					for (i = 0; i < 4; i++) {
						statbuffs[i] = Number(statbuffs[i]) + Number(buffing[i]) 
					}
					employee.buffs = statbuffs.join("|")
				} 
				else if (action === "take") {
					let statbuffs = employee.buffs.split("|")
					let buffing = buff[b].split("|")
					for (i = 0; i < 4; i++) {
						statbuffs[i] = Number(statbuffs[i]) - Number(buffing[i]) 
					}
					employee.buffs = statbuffs.join("|")
				}	
				break
			case "list":
				if (action === "give") {
					if (employee.bufflist != undefined && employee.bufflist != "" && employee.bufflist != 'undefined') {
						let bufflist = employee.bufflist.split("|")
						bufflist.push(buff[b])
						if (bufflist.length > 1) {employee.bufflist = bufflist.join("|")} else {employee.bufflist = bufflist[0]}
					} else {employee.bufflist = buff[b]}
				} 
				else if (action === "take") {
					if (employee.bufflist != undefined && employee.bufflist != "" && employee.bufflist != 'undefined') {
						let bufflist = employee.bufflist.split("|")
						let bufflistNew = []
						bufflist.forEach(bf => {if (bf != buff[b]) {bufflistNew.push(bf)}})
						if (bufflistNew.length > 0) {if (bufflistNew.length > 1){employee.bufflist = bufflistNew.join("|")} else {employee.bufflist = bufflistNew[0]}} else {employee.bufflist = 'undefined'}
					}
				}	
				break
			case "defboost":
				if (action === "give") {
					let abuffs = employee.defensebuffs.split("|")
					let newabuffs = buff[b].split("|")
					for (i = 0; i < 4; i++) {
						abuffs[i] = Number(abuffs[i]) * Number(newabuffs[i]) 
					}
					employee.defensebuffs = abuffs.join("|")
				} 
				else if (action === "take") {
					let abuffs = employee.defensebuffs.split("|")
					let newabuffs = buff[b].split("|")
					for (i = 0; i < 4; i++) {
						abuffs[i] = Number(abuffs[i]) / Number(newabuffs[i]) 
					}
					employee.defensebuffs = abuffs.join("|")
				}
				break				
			}
		}
	}
}



exports.affstat = function(abn, stat, employee) {
	if (abn.toLowerCase() === "o-06-20") {
		switch (stat) {
			case "fortitude":
			return (8*(5-statLVN(employee.fortitude)))
			break
			case "temperance":
			return (10*(5-statLVN(employee.temperance)))
			default:
			console.log("nothing")
			return 0
		}
	}
	
	return 0
}


exports.effects = {
	// If {employee} is working on an abnormality with the code "abn" while under an effect that instakills on particular work orders, check whether to kill them or not
	// 0/30/o-01-01
	// 0: death on work, 1: ego change CD, 2: work CD, 3: fatigue
	"deathOnWork": function(employee, abn) {
		let ret = false
		if (employee.effects.length > 0) {
			let effectArray = employee.effects.split("|")
			let deathEffect = []
			let deathCause = ""
			effectArray.forEach(e => {
				if (e.startsWith("0/")) {
					deathEffect = e.split("/")
					deathCause = "fairies"
				}
				if (e.startsWith("14/")) {
					deathEffect = e.split("/")
					deathCause = "bear"
				}
				if (e.startsWith("20/")) {
					deathEffect = e.split("/")
					deathCause = "woodsman"
				}
			})
			if (deathEffect.length > 0 && deathCause === "fairies") {
				if (abn.toUpperCase() != deathEffect[2]) {
				ret = [true, deathEffect[2], "eaten by fairies."]}
			}
			if (deathEffect.length > 0 && deathCause === "bear") {
				if (abn.toUpperCase() === "T-04-06") {
				ret = [true, deathEffect[2], "given a big warm hug."]}
				else {
					let newEffects = []
					effectArray.forEach(ef => {
						if (ef.startsWith("14/") === false) newEffects.push(ef)
					})
					employee.effects = newEffects.join("|")
					
				}
			}
			if (deathEffect.length > 0 && deathCause === "woodsman") {
				if (abn.toUpperCase() === "F-05-32") {
				ret = [true, deathEffect[2], "became too *heart*-y."]}
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
					cdEffect.push(e.split("/"))
				}
			})
			if (cdEffect.length > 0) {
				ret = true
			}
		}
		return ret
	}
}
		function checkFatigue(eff) {
				if (eff.startsWith("3/")) {return true}
				else {return false}
			}
exports.effectApplication = {
	"5": function(employee, result, workorder) {
		if (result > 0) {
			effects = employee.effects.split("|")
			function checkEffect(eff) {
				if (eff.startsWith("0/")) {return true}
				else {return false}
			}
			//console.log(employee.tag + " " + effects)
			if (effects.every(eff => {
				return (eff.startsWith("0/") === false)
			})) {effects.push("0/30/F-04-83"); employee.effects = effects.join("|")}
			else {effects[effects.findIndex(checkEffect)] = "0/30/F-04-83"; employee.effects = effects.join("|")}
		}
		return [false]
	},
	"14": function(employee, result, workorder) {
			effects = employee.effects.split("|")
			function checkEffect14(eff) {
				if (eff.startsWith("14/")) {return true}
				else {return false}
			}
			console.log(employee.tag + " " + effects)
			if (effects.every(eff => {
				return (eff.startsWith("14/") === false)
			})) {effects.push("14/inf/T-04-06"); employee.effects = effects.join("|")}
			else {effects[effects.findIndex(checkEffect14)] = "14/inf/T-04-06"; employee.effects = effects.join("|")}
		return [false]
	},
	"20": function(employee, result, workorder) {
		if (result === 0 || employee.temperance > 44) {
			effects = employee.effects.split("|")
			function checkEffect20(eff) {
				if (eff.startsWith("20/")) {return true}
				else {return false}
			}
			//console.log(employee.tag + " " + effects)
			if (effects.every(eff => {
				return (eff.startsWith("20/") === false)
			})) {effects.push("20/inf/T-04-06"); employee.effects = effects.join("|")}
			else {effects[effects.findIndex(checkEffect20)] = "20/inf/T-04-06"; employee.effects = effects.join("|")}
		}
		return [false]
	},
	"8": function(employee, result, workorder) {
		if (result > 0) {
			switch (workorder) {
				case "instinct":
				employee.hp = employee.hp + 1.5
				break
				case "insight":
				employee.sp = employee.sp + 1.5
				break
				case "attachment":
				case "repression":
				employee.hp = employee.hp + 1
				employee.sp = employee.sp + 1
				break
			}
			return [false]
		} else {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have been taken away to a fishing boat."]
		}
	},
	"15": function(employee, result, workorder) {
		if (result === 0 || employee.fortitude < 65) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have been found to be much more *loving* than usual. And then disposed of with an execution bullet."]
		} else {
			return[false]
		}
	},
	"16": function(employee, result) {
		if (result != 2) {
			let oofChance = 30*(2-result) + ((employee.fortL - employee.hp)/employee.fortL)*50
			if (roll(100) < oofChance) {
				employee.hp = 0
				employee.sp = 0
				employee.dead = 1
				return [true, "\n	You became a disgusting worm nest and were dealt with."]
			} else return [false]
		} else return [false]
	},
	"19": function(employee, result) {
		if ((result === 2) && (employee.tempL < 45)) {
				employee.hp = 0
				employee.sp = 0
				employee.dead = 1
				return [true, "\n	You just couldn't resist the pleasure and blew your load. Your brains all over the walls, that is."]
		} else return [false]
	},
	"9": function(employee, result, workorder) {
		if (employee.tempL < 30) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have fallen asleep. Good night, sweet prince."]
		} else return [false]
	},
	"10": function(employee, result, workorder) {
		if (employee.prudL < 30 || workorder === "insight") {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have been cocooned. I hope you like getting digested."]
		} else return [false]
	},
	"egoChange": function(employee, index) {
		effects = employee.effects.split("|")
		effects.push("1/" + (index + 1) * 60 * 12 + "/E.G.O. adaptation")
		employee.effects = effects.join("|")
		return [false]
	},
	"workCD": function(employee, boxes) {
		effects = employee.effects.split("|")
		if (effects.every(eff => {return (eff.startsWith("3/") === false)})) {fatiguemod = 0}
		else {
			fatigue = effects[effects.findIndex(checkFatigue)].split("/")
			fatiguemod = Math.floor(Number(fatigue[3])/3)			
		}
		effects.push("2/" + (Math.round(Number(boxes)/1.4) + fatiguemod - 1) + "/work cooldown")
		employee.effects = effects.join("|")
		return [false]
	},
	"3": function(employee, result, workorder) {
		if (result > 1) {
			employee.sp = employee.sp + 3
		}
		return [false]
	},
	"fatigue": function(employee, risk) {
			effects = employee.effects.split("|")
			
			if (effects.every(eff => {
				return (eff.startsWith("3/") === false)
			})) {effects.push("3/40/fatigue/0"); employee.effects = effects.join("|")}
			else {fatigue = effects[effects.findIndex(checkFatigue)].split("/")
			effects[effects.findIndex(checkFatigue)] = "3/" + (40 + Math.floor((Number(fatigue[3])/risk)*2)) + "/fatigue/" + Math.round((Number(fatigue[3]) + Math.floor(Number(fatigue[3])/6) + 1)/risk)
			employee.effects = effects.join("|")}
		return [false]
	},
	"department": function(employee, dep, action, level = 0) {
		console.log("|" + employee.tag + "|" + dep + "|")
		buffs['buff'](employee, jn.bufflist['department'][dep][level], action)
		return [false]
	}
}
