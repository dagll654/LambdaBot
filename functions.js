  const jn = require("./junk.json");
  const gear = require("./gear.json")
  	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const cmds = jn.cmds
//module.js
bufflist = {
	"department": {
		"Control Team": [{"list": "teamct/0"}, {"list": "teamct/1"}], 
		
		"Information Team": [{"stat": "0|0|7|0", "list": "teamin/0"}, {"stat": "0|0|10|0", "list": "teamin/1"}], 
		
		"Security Team": [{"stat": "7|7|0|0", "list": "teamsc/0"}, {"stat": "10|10|0|0", "list": "teamsc/1"}], 
		
		"Training Team": [{"list": "teamtr/0"}, {"list": "teamtr/1"}], 
		
		"Central Team": [{"stat": "3|3|3|3", "list": "teamctr/0"}, {"stat": "5|5|5|5", "list": "teamctr/1"}], 
		
		"Welfare Team": [{"defboost": "1.1|1.1|1.1|1.1", "list": "teamwf/0"}, {"defboost": "1.2|1.2|1.2|1.2", "list": "teamwf/1"}], 
		
		"Disciplinary Team": [{"dmgboost": "1.1|1.1|1.1|1.1", "list": "teamds/0"}, {"dmgboost": "1.2|1.2|1.2|1.2", "list": "teamds/1"}], 
		
		"Record Team": [{"stat": "4|4|4|4", "list": "teamrc/1"}, {"stat": "6|6|6|6", "list": "teamrc/1"}], 
		
		"Extraction Team": [{"defboost": "1.1|1.1|1.1|1.1", "dmgboost": "1.1|1.1|1.1|1.1", "list": "teamex/0"}, {"defboost": "1.2|1.2|1.2|1.2", "dmgboost": "1.2|1.2|1.2|1.2", "list": "teamex/1"}], 
		
		"Architecture Team": [{"stat": "5|5|5|5", "list": "teamar/0"}, {"stat": "7|7|7|7", "list": "teamar/1"}]
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
			
			}
		}
	}
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
			})) {effects.push("0/30/F-04-83"); employee.effects = effects.join("|")}
			else {effects[effects.findIndex(checkEffect)] = "0/30/F-04-83"; employee.effects = effects.join("|")}
		}
	},
	"egoChange": function(employee, index) {
		effects = employee.effects.split("|")
		effects.push("1/" + (index + 1) * 60 * 12 + "/EGO adaptation")
		employee.effects = effects.join("|")
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
	},
	"3": function(employee, result) {
		if (result > 1) {
			employee.sp = employee.sp + 3
		}
	},
	"fatigue": function(employee, result) {
			effects = employee.effects.split("|")
			
			if (effects.every(eff => {
				return (eff.startsWith("3/") === false)
			})) {effects.push("3/40/fatigue/0"); employee.effects = effects.join("|")}
			else {fatigue = effects[effects.findIndex(checkFatigue)].split("/")
			effects[effects.findIndex(checkFatigue)] = "3/" + (40 + Math.floor((Number(fatigue[3]))*2)) + "/fatigue/" + (Number(fatigue[3]) + Math.floor(Number(fatigue[3])/6) + 1)
			employee.effects = effects.join("|")}

	},
	"department": function(employee, dep, action, level = 0) {
		console.log("|" + dep + "|")
		console.log(bufflist['department']['Control Team'])
		buffs['buff'](employee, bufflist['department'][dep][level], action)
	}
}
