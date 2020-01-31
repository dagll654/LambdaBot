  const jn = require("./junk.json");
  const gear = require("./gear.json")
  	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const cmds = jn.cmds

	function statLVN(stat) {
		if (stat < 30) {return 1}
		else if (stat < 45) {return 2}
		else if (stat < 65) {return 3}
		else if (stat < 85) {return 4}
		else {return 5}
	}
	
	// Roll an x-sided die, even if that makes absolutely no sense in practice
	function roll(sides) {
		return Math.floor(Math.random() * sides) + 1
	}
	
	function empLVL(statcount) {
		if (statcount < 6) {return "I"}
		else if (statcount < 9) {return "II"}
		else if (statcount < 12) {return "III"}
		else if (statcount < 16) {return "IV"}
		else {return "V"}
	}
	
	function useConsumable(employee, cns) {
		let inv = employee.inventory.split("/").map(i => [i.split("|")[0], i.split("|")[1]])
		console.log(inv)
		if (inv.some(i => cns === i[0])) {
			cnsInv = inv.find(i => cns === i[0])
			if (cnsInv[1] > 0) {
				cnsInv[1] -= 1
				if (cnsInv[1] === 0) inv = inv.map(i => {if (i != cnsInv) return i.join("|")}).filter(i => i != undefined)
				else inv = inv.map(i => {return i.join("|")})
				employee.inventory = inv.join("/")
			}
		}
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

function giftManip(employee, giftID, action) {
	if (action === "add") {
	if (employee.gifts != undefined && employee.bufflist != "" && employee.bufflist != 'undefined') {
		let gifts = employee.gifts.split("|")
		let gift = gear.gifts.find(g => Number(g.id) === Number(giftID))
		gifts.push(gift.slot + "/" + giftID)
		if (gifts.length > 1) employee.gifts = gifts.join("|") 
			else employee.gifts = gifts[0]
		buffs.buff(employee, gift.buff, "give")
	} else employee.gifts = gift.slot + "/" + giftID
	console.log("Test: ADD")
	}
	else if (action === "remove") {
	if (employee.gifts != undefined && employee.gifts != "" && employee.gifts != 'undefined') {
		let gifts = employee.gifts.split("|")
		let gift = gear.gifts.find(g => {return Number(g.id) === Number(giftID)})
		gifts.filter(g => g.split("/")[1] != giftID)
		if (gifts != "") employee.gifts = gifts.join("|")
		else employee.gifts = ""
		buffs.buff(employee, gift.buff, "take")
		console.log("Test: TAKE")
	}
	}
}

exports.debug = function(employee, giftID, action) {giftManip(employee, giftID, action)}

exports.affstat = function(abn, stat, employee) {
	if (abn.toLowerCase() === "o-06-20") {
		switch (stat) {
			case "fortitude":
			return (8*(5-statLVN(employee.fortL)))
			break
			case "temperance":
			return (10*(5-statLVN(employee.fortL)))
			default:
			console.log("nothing")
			return 0
		}
	}
	
	return 0
}

exports.gift = function(employee, abnoID, result) {
	switch (Number(abnoID)) {
		case 3:
		
	}
}


exports.effects = {
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
	"3": function a3 (employee, result, workorder) {
		if (result > 1) {
			employee.sp = employee.sp + 3
		}
		return [false]
	},
	"5": function a5 (employee, result, workorder) {
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
	"8": function a8 (employee, result, workorder) {
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
	"9": function a9 (employee, result, workorder) {
		if (employee.tempL < 30) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have fallen asleep. Good night, sweet prince."]
		} else return [false]
	},
	"10": function a10 (employee, result, workorder) {
		if (employee.prudL < 30 || workorder === "insight") {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have been cocooned. I hope you like getting digested."]
		} else return [false]
	},
	"14": function a14 (employee, result, workorder) {
		let effects = employee.effects.split("|")
		console.log("14Test: " + employee.tag + " " + effects)
		if (effects.length > 0) {
			if (effects.length > 1) {
				effects.push("14/inf/T-04-06")
				employee.effects = effects.join("|")
				return [false]
			}
			else {
				employee.effects += "|14/inf/T-04-06"
				return [false]
			}
		}
		else {
			employee.effects = "14/inf/T-04-06"
			return [false]
		}
		console.log("14Test2: " + employee.tag + " " + effects)
		return [false]
		
		
		/*	effects = employee.effects.split("|")
			function checkEffect14(eff) {
				if (eff.startsWith("14/")) {return true}
				else {return false}
			}
			console.log(employee.tag + " " + effects)
			if (effects.every(eff => {
				return (eff.startsWith("14/") === false)
			})) {effects.push("14/inf/T-04-06"); effects.shift(); employee.effects = effects.join("|")}
			else {effects[effects.findIndex(checkEffect14)] = "14/inf/T-04-06"; employee.effects = effects.join("|")}
		return [false]*/
		
	},
	"15": function a15 (employee, result, workorder) {
		if (result === 0 || employee.fortL < 65) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have been found to be much more *loving* than usual. And then disposed of with an execution bullet."]
		} else {
			return[false]
		}
	},
	"16": function a16 (employee, result) {
		if (result != 2) {
			let oofChance = 17*(2-result) + ((employee.fortL - employee.hp)/employee.fortL)*25
			let nonoRoll = roll(100)
			if (nonoRoll < oofChance) {
				employee.hp = 0
				employee.sp = 0
				employee.dead = 1
				return [true, "\n	You became a disgusting worm nest and were dealt with."]
			} else return [false]
		} else return [false]
	},
	"19": function a19 (employee, result) {
		if ((result === 2) && (employee.tempL < 45)) {
				employee.hp = 0
				employee.sp = 0
				employee.dead = 1
				return [true, "\n	You just couldn't resist the pleasure and blew your load. Your brains all over the walls, that is."]
		} else return [false]
	},
	"20": function a20 (employee, result, workorder) {
		let effects = employee.effects.split("|")
		if (effects.some(e => {return e.startsWith("20/")})) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have been made a bit *heart*-ier."]}
		else if (result === 0 || employee.tempL > 44) {
			if (effects.every(eff => {return (eff.startsWith("20/") === false)})) {
				effects.push("20/inf/F-05-32")
				effects.shift()
				employee.effects = effects.join("|")
				}
		}
		return [false]
	},
	"21": function a21 (employee, result) {
		if ((result === 0) || (employee.fortL > 84) || (employee.tempL < 30)) {
				return [false]
		} else return [false]
	},
	"22": function a22 (employee, result) {
		if (employee.tempL < 45) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			return [true, "\n	You have been sucked into the abnormality. We will meet again as stars..."]
		} else return [false]
	},
	"egoChange": function egoChange (employee, index) {
		effects = employee.effects.split("|")
		effects.push("1/" + (index + 1) * 60 * 12 + "/E.G.O. adaptation")
		employee.effects = effects.join("|")
		return [false]
	},
	"workCD": function workCD (employee, boxes) {
		let effects = employee.effects.split("|")
		let CDEffect
		let fatiguemod = 0
		if (effects.some(e => {return e.startsWith("3/")})) {
			let fArr = effects.find(e => {return e.startsWith("3/")}).split("/")
			fatiguemod = Math.floor(Number(fArr[3])/3)
		}
		let CDEArr = ["2"]
		CDEArr.push(Math.round(Number(boxes)/1.7) + fatiguemod)
		CDEArr.push("Work cooldown")
		CDEffect = CDEArr.join("/")
		if (employee.effects === 'null') employee.effects = CDEffect
		else employee.effects += "|" + CDEffect
		return [false]
	},
	"fatigue": function fatigue (employee, risk) {
		let effects = employee.effects.split("|")
		if (employee.effects === 'null') effects = []
		let fatigueEffect
		if (effects.length > 0) {
			if (effects.some(e => {return e.startsWith("3/")})) {
				let fArr = effects.find(e => {return e.startsWith("3/")}).split("/")
				let fMod = jn.statLevels.indexOf(empLVL(employee.stats[4])) - risk + 1
				console.log("FMOD: " + fMod)
				fArr[3] = Number(fArr[3]) + fMod
				fArr[1] = 40 + Number(fArr[3])
				fatigueEffect = fArr.join("/")
				if (effects.length === 1) employee.effects = fatigueEffect
				else {
					effects[effects.indexOf(effects.find(e => {return e.startsWith("3/")}))] = fatigueEffect
					employee.effects = effects.join("|")
				}
			} else employee.effects += fatigueEffect
		}
		else {
			employee.effects = "3/40/fatigue/0"
		}
		return [false]
	},
	"department": function department (employee, dep, action, level = 0) {
		console.log("|" + employee.tag + "|" + dep + "|")
		buffs['buff'](employee, jn.bufflist['department'][dep][level], action)
		return [false]
	},
	"manualDebuff": function manualDebuff (employee, stat, amount, action) {
		if (action === "apply") {
			let bufflist = employee.bufflist
			if (bufflist === undefined || bufflist === '' || bufflist === null) employee.bufflist = "manualDebuff/" + stat + "/" + amount
			else employee.bufflist += "|manualDebuff/" + stat + "/" + amount
			let currentBuffs = employee.buffs.split("|")
			currentBuffs[jn.stats.indexOf(stat)] -= amount
			employee.buffs = currentBuffs.join("|")
		}
		else {
			let bufflist = employee.bufflist.split("|")
			let buff = employee.bufflist.split("|").find(b => {return b.startsWith("manualDebuff")}).split("/")
			if (bufflist.length <= 1) employee.bufflist = ''
			else {
				employee.bufflist = employee.bufflist.split("|").filter(b => {return (b.startsWith("manualDebuff/" + stat) === false)}).filter(b => b != undefined).filter(b => b != 'null')
				employee.bufflist = employee.bufflist.join("|")
			}
			let currentBuffs = employee.buffs.split("|")
			currentBuffs[jn.stats.indexOf(stat)] = Number(currentBuffs[jn.stats.indexOf(stat)]) + Number(buff[2])
			employee.buffs = currentBuffs.join("|")
		}
	},
	"hpbullet": function hpbullet (employee) {
		employee.hp = Number(employee.hp) + 15 
		if (employee.hp > employee.stats[0]) employee.hp = employee.stats[0]
		useConsumable(employee, "hpbullet")
	},
	"spbullet": function spbullet (employee) {
		employee.sp = Number(employee.sp) + 15 
		if (employee.sp > employee.stats[1]) employee.sp = employee.stats[1]
		useConsumable(employee, "spbullet")
		console.log("Used an SP bullet")
	}
}
