  const jn = require("./junk.json");
  const gear = require("./gear.json")
  const main = require("./bot.js")
  dbnos = require("./bot.js")
  	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const cmds = jn.cmds

	Number.prototype.shortFixed = function(length) {return Math.round(this*Math.pow(10, length))/Math.pow(10, length)}
	
	// Check if something is not assigned a meaningful value
	function exists(v) {
		if (typeof(v) === 'number') return true
		return (v != undefined) && (v != 'undefined') && (v != '') && (v != null) && (v != 'null') && (v != [])
	}

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
	
	function healCalc(employee, pts, amt) {
		
		let buffs 
		if (exists(employee.bufflist) === false) buffs = []
		else buffs = employee.bufflist.split("|").map(i => i.split("/"))
		if (buffs === undefined || buffs === 'undefined' || buffs === "") return amt
		if (buffs.some(b => (b[0] === "misc" && b[1] === "healbuff" && b[2] === pts))) {
			let b = buffs.find(b => (b[0] === "misc" && b[1] === "healbuff" && b[2] === pts))
			console.log("Heal Buff Test")
			return amt * (1 + Number(b[3]))
		} else return amt
	}
	
	function useConsumable(employee, cns) {
		let inv = employee.inventory.split("/").map(i => [i.split("|")[0], i.split("|")[1]])
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
	if (employee.gifts !== undefined && employee.gifts !== "" && employee.gifts !== 'undefined') {
		let gifts = employee.gifts.split("|").filter(g => g != undefined)
		let gift = gear.gifts.find(g => Number(g.id) === Number(giftID))
		gifts.push(gift.slot + "/" + giftID)
		if (gifts.length > 1) employee.gifts = gifts.join("|") 
			else employee.gifts = gifts[0]
		buffs.buff(employee, gift.buff, "give")
	} else employee.gifts = gear.gifts.find(g => Number(g.id) === Number(giftID)).slot + "/" + giftID
	}
	else if (action === "remove") {
	if (employee.gifts != undefined && employee.gifts != "" && employee.gifts != 'undefined') {
		let gifts = employee.gifts.split("|")
		let gift = gear.gifts.find(g => {return Number(g.id) === Number(giftID)})
		gifts = gifts.map(g => {if (g.split("/")[1] != giftID) return g}).filter(g => g != undefined)
		if (gifts != "") employee.gifts = gifts.join("|")
		else employee.gifts = ""
		buffs.buff(employee, gift.buff, "take")
	}
	}
}

exports.giftManip = function(employee, giftID, action) {giftManip(employee, giftID, action)}

exports.affstat = function(abn, stat, employee) {
	if (abn.toLowerCase() === "o-06-20") {
		switch (stat) {
			case "fortitude":
			return (8*(5-statLVN(employee.fortL)))
			break
			case "temperance":
			return (10*(5-statLVN(employee.fortL)))
			default:
			return 0
		}
	}
	
	return 0
}

exports.gift = function(employee, abnoID, result) {
	let gRRes = [false, 0]
	if (result["override"] != true) {
	switch (Number(abnoID)) {
		case 1:
		if (result["mood"] === 2) gRRes = [true, 0]
		break
		case 3:
		let sinRoll = roll(20)
		if (result["mood"] === 2 && sinRoll === 12) gRRes = [true, 0]
		break
		case 5:
		gRRes = [false, 0]
		break
		case 6:
		if (result["pe"] === 12 && roll(3) === 3) gRRes = [true, 0]
		break
		case 7:
		if (employee.hp < 5 && roll(7) === 7) gRRes = [true, 0]
		break
		case 8:
		if (["attachment", "repression"].includes(result["order"]) && roll(7) === 7) gRRes = [true, 0]
		break
		case 10:
		if (result["dbno"].effectArray.some(e => e[0] === "cocoon") && roll(5) === 5) gRRes = [true, 0]
		break
		case 14:
		gRRes = [false, 0]
		break
		case 19:
		if (employee.buffListArray.some(b => b[0] === "porccubusgiftcounter")) {
		if (employee.buffListArray.find(b => b[0] === "porccubusgiftcounter")[1] > 4 && roll(5) === 5)
			gRRes = [true, 0]
		}
		break
		case 20:
		if (employee.fortL > 44 && roll(5) === 5) gRRes = [true, 0]
		break
		
		default: return [false, 2]
	}
	} else gRRes = [true, 0]
	if (employee.luck > 1000) gRRes = [true, 0]
	if (gRRes[0] === true) {
	let gift = gear.gifts.find(g => g.id === abnoID)
	let gifts
	if (employee.gifts !== undefined && employee.gifts !== "" && employee.gifts !== 'undefined') gifts = employee.gifts.split("|")
	else gifts = []
	if (gifts.some(g => g.startsWith(gift.slot)) === false)	{
		giftManip(employee, abnoID, "add")
	}
	else if (gifts.find(g => g.startsWith(gift.slot)).split("/")[2] === undefined && gifts.find(g => g.startsWith(gift.slot)).split("/")[1] !== abnoID) {
	console.log(`Gift roll bonk for employee ${employee.tag}.`)
	giftManip(employee, gifts.find(g => g.startsWith(gift.slot)).split("/")[1], "remove")
	giftManip(employee, abnoID, "add")
	gRRes = [true, 1]
	} else gRRes = [false, 1]
	}
	return gRRes
}


exports.effects = {
	"deathOnWork": function(employee, abn) {
		let ret = false
		if (employee.effects !== null)
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
				exports.gift(employee, "5", {"override": true})
			}
			if (deathEffect.length > 0 && deathCause === "bear") {
				if (abn.toUpperCase() === "T-04-06") {
				ret = [true, deathEffect[2], "given a big warm hug."]
				exports.gift(employee, "14", {"override": true})
				}
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
		if (result > 1)
			employee.heal("sp", 3)
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
				employee.hp = employee.hp + healCalc(employee, "hp", 1.5)
				break
				case "insight":
				employee.sp = employee.sp + healCalc(employee, "sp", 1.5)
				break
				case "attachment":
				case "repression":
				employee.hp = employee.hp + healCalc(employee, "hp", 1)
				employee.sp = employee.sp + healCalc(employee, "sp", 1)
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
	"10": function a10 (employee, result, workorder, dbno) {
		if (employee.prudL < 30 || workorder === "insight") {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			if (exists(dbno.effects) === false) dbno.effects = "cocoon/600"
			else {
				let newEffects = dbno.effectArray
				if (newEffects.some(e => e[0] === "cocoon")) {
					let eff = newEffects.find(e => e[0] === "cocoon")
					eff[1] = Number(eff[1]) + 600
					if (eff[1] > 2400) eff[1] = 2400
					dbno.effects = newEffects.map(a => a.join("/")).join("|")
				} else dbno.effects += "|cocoon/600"
			}
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
		} else {
			if (exists(employee.buffListArray)) {
				if (employee.buffListArray.some(b => b[0] === "porccubusgiftcounter")) {
					let newBuffList = employee.buffListArray
					newBuffList.find(b => b[0] === "porccubusgiftcounter")[1] -= -1
					employee.bufflist = newBuffList.map(b => b.join("/")).join("|")
				}
				else employee.bufflist += "|porccubusgiftcounter/1"
			} else employee.bufflist = "porccubusgiftcounter/1"
			return [false]
		}
	},
	"20": function a20 (employee, result, workorder, dbno) {
		if (Number(dbno.qcounter) === 0) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			dbno.qcounter = 1
			return [true, "\n	You have been made a bit *heart*-ier."]
			}
		if (result === 0 || employee.tempL > 44) {
			dbno.qcounter = 0
		}
		return [false]
	},
	"21": function a21 (employee, result) {
		if ((result === 0) || (employee.fortL > 64) || (employee.tempL < 30)) {
				employee.hp = 0
				employee.sp = 0
				employee.dead = 1
				return [true, "\n	You could not resist the allure."]
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
	"23": function a23 (employee, result, workorder, abnormality) {
		if (workorder === "repression") {
		if (abnormality.buffListArray.some(b => b[0] === "sick")) {
			employee.hp = 0
			employee.sp = 0
			employee.dead = 1
			abnormality.bufflist = abnormality.buffListArray.filter(b => b[0] !== "sick")
			return [true, "\n	...a new Beast is born."]
		}
		else {
			if (exists(abnormality.buffListArray)) abnormality.bufflist += "|sick"
				else abnormality.bufflist += "sick"
			return [false]
		}
		} else {
			abnormality.bufflist = abnormality.buffListArray.filter(b => b[0] !== "sick")
			return [false]
		}
	},
	"egoChange": function egoChange (employee, level) {
		effects = employee.effects.split("|")
		effects.push("1/" + level * 60 * 12 + "/E.G.O. adaptation")
		employee.effects = effects.join("|")
		return [false]
	},
	"manualDebuffCD": function manualDebuffCD (e) {
		if (exists(e.effectArray)) e.effects += "|manualDebuffCD/150/Manual debuff cooldown"
		else e.effects = "manualDebuffCD/150/Manual debuff cooldown"
		return [false]
	},
	"workCD": function workCD (employee, boxes) {
		if (employee.luck > 500) {employee.working = 0; return false}
		console.log(`Luck: ${employee.luck}`)
		let effects = employee.effectArray
		let fatigueMod = 0
		if (effects.some(e => e[0] === "3")) {
			fatigueMod = Number(effects.find(e => e[0] === "3")[3])
		} 
		console.log(`FMod: ${fatigueMod}`)
		effects.push([2, Math.round((Math.round(Number(boxes)/1.7) + Math.floor(fatigueMod/3))/1.5), "Work cooldown"])
		employee.effects = effects.map(e => e.join("/")).join("|")
	},
	"fatigue": function fatigue (employee, risk) {
		if (employee.luck > 500) return [false]
		let effects = employee.effectArray
		if (effects.some(e => e[0] === "3")) {
			let fatigue = effects.find(e => e[0] === "3")
			let riskMod = employee.stats[4] - (jn.risk.indexOf(risk) + 1)
			fatigue[3] = Number(fatigue[3]) + riskMod
			fatigue[1] = 40 + Number(fatigue[3])
		} else effects.push([3, 40, "Fatigue", 0])
		employee.effects = effects.map(e => e.join("/")).join("|")
	},
	"department": function department (employee, dep, action, level = 0) {
		console.log(`[SIGMA] Applied department buff to employee ${employee.tag} in ${dep}, action '${action}', level ${level}.`)
		buffs['buff'](employee, jn.bufflist['department'][dep][level], action)
		return [false]
	},
	"manualDebuff": function manualDebuff (employee, stat, amount, action) {
		if (action === "apply") {
			let bufflist = employee.bufflist
			if (exists(bufflist) === false) employee.bufflist = "manualDebuff/" + stat + "/" + amount
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
				employee.bufflist = employee.bufflist.split("|").filter(b => {return (b.startsWith("manualDebuff/" + stat) === false)}).filter(b => exists(b))
				employee.bufflist = employee.bufflist.join("|")
			}
			let currentBuffs = employee.buffs.split("|")
			currentBuffs[jn.stats.indexOf(stat)] = Number(currentBuffs[jn.stats.indexOf(stat)]) + Number(buff[2])
			employee.buffs = currentBuffs.join("|")
		}
	},
	"hpbullet": function hpbullet (employee, amount = 1) {
		let ret = employee.heal("hp", 20*amount)
		if (employee.hp > employee.stats[0]) employee.hp = employee.stats[0]
		let i = 0
		for (i = 0; i < amount; i++) {
		useConsumable(employee, "hpbullet")
		}
		return ret.shortFixed(1)
	},
	"spbullet": function spbullet (employee, amount = 1) {
		let ret = employee.heal("sp", 20*amount)
		if (employee.sp > employee.stats[1]) employee.sp = employee.stats[1]
		let i = 0
		for (i = 0; i < amount; i++) {
		useConsumable(employee, "spbullet")
		}
		return ret.shortFixed(1)
	}
}

exports.effectSCInfluence = function (dbno) {
	switch (Number(dbno.id)) {
		case 10:
			if (dbno.effectArray.some(e => e[0] === "cocoon")) 
			return Math.ceil(Number(dbno.effectArray.find(e => e[0] === "cocoon")[1])/600)*15
			else return 0
		break
		
		default:
		return 0
		break
	}
}