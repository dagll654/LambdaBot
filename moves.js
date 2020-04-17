const jn = require("./junk.json")
Number.prototype.shortFixed = function(length) {return Math.round(this*Math.pow(10, length))/Math.pow(10, length)}
 
function roll(sides) {
	return Math.ceil(Math.random() * sides)
}

// Check if something is not assigned a meaningful value
function exists(v) {
if (typeof(v) === 'number') return true
return (v != undefined) && (v != 'undefined') && (v != '') && (v != null) && (v != 'null') && (v != [])
}

exports.moves = {
	"Skip": function skip(user) {
		if (user.ap < user.apMax)
		user.ap += (user.apRegen*1.7).shortFixed(1)
		if (user.ap > user.apMax) user.ap = user.apMax
		return `+${(user.apRegen*1.7).shortFixed(1)} AP`
	},
	"Punch": function punch(employee, target) {
		let damage = target.raw.damage("ZAYIN", "red", employee.raw.fortL/10)
		employee.ap -= 5
		return `${damage} ${jn.dtype[0]}` 
	},
	"Nudge": function nudge(employee, target) {
		target.ap += Math.ceil(employee.raw.justL/10) + Math.ceil(employee.raw.tempL/10)
		if (target.ap > target.apMax) target.ap = target.apMax
		employee.ap -= Math.round((Math.ceil(employee.raw.justL/10) + Math.ceil(employee.raw.tempL/10))*1.3)
		return `+${Math.ceil(employee.raw.justL/10) + Math.ceil(employee.raw.tempL/10)} AP`
	},
	"Shrug Off": function shrugOff(employee) {
		let heal = employee.raw.heal("hp", Math.ceil(employee.raw.fortL/15))
		employee.ap -= 7
		return `${heal} ${jn.hpheal}`
	},
	"Commit Sudoku": function sudoku(employee) {
		employee.raw.hp = 0
		return `oof`
	},
	"Commit Mental Sudoku": function sudokuMental(employee) {
		employee.raw.sp = 0
		return `mental oof`
	},
	"Stare": function stare(abnormality, target) {
		damage = target.raw.damage("ZAYIN", "white", 1 * abnormality.damageMultiplier)
		return `${damage} ${jn.dtype[1]}`
	},
	"Stare Harder": function stare2(abnormality, target) {
		damage = target.raw.damage("ZAYIN", "white", 2 * abnormality.damageMultiplier)
		return `${damage} ${jn.dtype[1]}`
	},
	"Stare Really, Really Hard": function stare3(abnormality, target) {
		damage = target.raw.damage("ZAYIN", "white", 3 * abnormality.damageMultiplier)
		return `${damage} ${jn.dtype[1]}`
	},
	"Dematerialize": function dematerialize(user, target) {
		damage = target.raw.damage("ALEPH", "white", 999, true)
		return `${damage}`
	},
	"Move": function move(user, target) {
		let initialPosition = user.position
		let moveAmt = ((2 + (user.raw.justL - 17)*0.015) * Math.sign(target.position - user.position)).shortFixed(1)
		let direction
		if (moveAmt !== 0) {
			let minDistance
			if (target.id > 0) minDistance = 0.5
			else minDistance = 0
			if (Math.abs(target.position - user.position) < Math.abs(moveAmt) + minDistance) {
				user.position = (target.position - minDistance * Math.sign(moveAmt))
				moveAmt = Math.sign(moveAmt) * Math.abs(user.position - initialPosition)
			}
			else user.position += moveAmt
		} else return `not funny didn't laugh`
		if (Math.sign(moveAmt) === -1) direction = "left"
		else direction = "right"
		user.ap -= Math.floor(user.apRegen - 1)
		return `moved ${Math.abs(moveAmt)} LM ${direction}`
	},
	"Suppress": function suppress(employee, target) {
		let damage = target.raw.damage("ZAYIN", "red", (3 + roll(3)) * employee.damageMultiplier)
		employee.ap -= 4
		return `${damage} ${jn.dtype[0]}` 
	},
	"Overpower": function overpower(employee, target) {
		let risk
		if (target.type === "abnormality") risk = jn.risk.indexOf(target.risk) + 1
		else risk = target.employeeLevel
		let hit = 3.5 - risk // 2.5 at risk 1/zayin, 1.5 at risk 2/teth
		if (hit <= 0) hit = 0.25
		let damage = target.raw.damage("ZAYIN", "red", ((3 + roll(2)) * hit) * employee.damageMultiplier)
		employee.ap -= 8
		return `${damage} ${jn.dtype[0]}` 
	},
	"Swing": function realitySlash(employee, target) {
		let red = target.raw.damage("ZAYIN", "red", roll(2) * employee.damageMultiplier)
		employee.ap -= 7
		return `${red} ${jn.dtype[0]}`
	},
	"Ban": function ban(employee, target) {
		let red = target.raw.damage("DEBUG", "red", 999)
		return `${red} ${jn.dtype[0]}`
	},
	"Kick": function kick(employee, target) {
		let white = target.raw.damage("DEBUG", "white", 999, false, true)
		return `${white} ${jn.dtype[1]}`
	},
	"Time Out": function timeOut(employee, target) {
		let black = target.raw.damage("DEBUG", "black", 999, false, true)
		return `${black} ${jn.dtype[2]}`
	},
	"TO THE RANCH": function toTheRanch(employee, target) {
		let red = target.raw.damage("DEBUG", "red", 999)
		let white = target.raw.damage("DEBUG", "white", 999, false, true)
		let black = target.raw.damage("DEBUG", "black", 999, false, true)
		let pale = target.raw.damage("DEBUG", "pale", 999)
		return `${red} ${jn.dtype[0]}, ${white} ${jn.dtype[1]}, ${black} ${jn.dtype[2]}, ${pale} ${jn.dtype[3]}`
	},
	"Effect Test": function effectTest(employee) {
		if (exists(employee.raw.effects)) employee.raw.effects += "|test/bt/Effect Test/0"
		else employee.raw.effects = "test/bt/Effect Test/0"
		return `...`
	},
	"Sharp Wing": function sharpWing(employee, target) {
		let red = target.raw.damage("ZAYIN", "red", (4 + roll(3)) * employee.damageMultiplier)
		employee.ap -= 5
		return `${red} ${jn.dtype[0]}`
	},
	"Pure Heart": function pureHeart(employee) {
		if (exists(employee.raw.effects)) employee.raw.effects += "|0/8/F-04-83"
		else employee.raw.effects = "0/8/F-04-83"
		employee.ap -= 7.5
		return `applied the effect`
	},
	"Judgement": function judgement(employee, target) {
		let white = target.raw.damage("ZAYIN", "white", (4 + roll(3)) * employee.damageMultiplier, false, true)
		employee.ap -= 5
		return `${white} ${jn.dtype[1]}`
	},
	"Confession": function confession(employee) {
		let sp = employee.raw.heal("sp", roll(4) + roll(4))
		employee.ap -= 10
		return `${sp} ${jn.spheal}`
	},
	"Burst of Flame": function burstOfFlame(employee, target) {
		let red = target.raw.damage("TETH", "white", (19 + roll(11)) * employee.damageMultiplier)
		employee.ap -= 12.5
		return `${red} ${jn.dtype[0]}`
	},
	"Burning Hatred": function burningHatred(employee, target) {
		let missed = [true, false][roll(2)-1]
		let red = target.raw.damage("TETH", "white", (39 + roll(11)) * employee.damageMultiplier)
		employee.ap -= 20
		if (missed) return `missed`
		else return `${red} ${jn.dtype[0]}`
	},
	"Piercing Universe": function piercingUniverse(employee, target) {
		let black = target.raw.damage("TETH", "black", (4 + roll(5)) * employee.damageMultiplier, false, true)
		employee.ap -= 3.7
		return `${black} ${jn.dtype[3]}`
	},
	"Echo From Beyond": function echoFromBeyond(employee, target) {
		let spRoll = roll(100)
		let effect = ``
		if (spRoll <= 33) {
			if (exists(employee.raw.effects)) employee.raw.effects += "|gear_echo/3/Resonance"
			else employee.raw.effects = "gear_echo/3/Resonance"
			effect = `, applied the effect`
		}
		let black = target.raw.damage("TETH", "black", (9 + roll(6)) * employee.damageMultiplier, false, true)
		employee.ap -= 11.1
		return `${black} ${jn.dtype[0]}${effect}`
	},
	"Pity": function pity(employee, target) {
		let headacheMod = 0
		let effects = employee.raw.effectArray
		if (exists(effects)) {
		if (effects.some(e => e[0] === "headache")) {
			headacheMod = Number(effects.find(e => e[0] === "headache")[3]) * 5
		}
		}
		let red = target.raw.damage("TETH", "red", (11 + headacheMod + roll(7)) * employee.damageMultiplier)
		employee.ap -= 7.5
		return `${red} ${jn.dtype[0]}`
	},
	"Headache": function headache(employee) {
		let effects = employee.raw.effectArray
		let headacheMod = 0
		if (exists(effects)) {
			if (effects.some(e => e[0] === "headache")) {
				effects.find(e => e[0] === "headache")[3] -= -1
				headacheMod = Number(effects.find(e => e[0] === "headache")[3])
			}
			else effects.push(["headache", "bt", "Headache", 1])
			employee.raw.effects = effects.map(e => e.join("/")).join("|")
		}
		else employee.raw.effects = "headache/bt/Headache/1"
		employee.ap -= 14
		employee.raw.hp -= (employee.raw.fortL/100*(15 + headacheMod * 7)).shortFixed(1)
		return `applied the effect`
	},
	"Soda Splash": function sodaSplash(employee, target) {
		let red = target.raw.damage("ZAYIN", "red", roll(2) * employee.damageMultiplier)
		employee.ap -= 1.8
		return `${red} ${jn.dtype[0]}`
	},
	"Cheers!": function cheers(employee) {
		let rollT = roll(100)
		let effect = 0
		let picked = 0
		let arrT = [30, 30, 25, 15]
		console.log(rollT)
		arrT.forEach((n, i) => {
			if (picked === 0) {
			if (rollT > n) rollT -= n 
			else {
			effect = i; picked = 1
			}
			}
		})
		console.log(effect)
		switch (effect) {
			case 0: {
			let hp = employee.raw.heal("hp", (employee.raw.fortL/2.5).shortFixed(1))
			return `${hp} ${jn.hpheal}`
			} break
			case 1: {
			let sp = employee.raw.heal("sp", (employee.raw.prudL/2.5).shortFixed(1))
			return `${sp} ${jn.spheal}`
			} break
			case 2: {
			let hp = employee.raw.heal("hp", (employee.raw.fortL/5).shortFixed(1))
			let sp = employee.raw.heal("sp", (employee.raw.prudL/5).shortFixed(1))
			return `${hp} ${jn.hpheal}, ${sp} ${jn.spheal}`
			} break
			case 3: {
			employee.raw.hp -= (employee.raw.fortL/2).shortFixed(1)
			employee.raw.sp -= (employee.raw.prudL/2).shortFixed(1)
			return `lost 50% of ${jn.hp} ${jn.sp}`
			} break
			default:
			return `UH OH STINKEYYYY`
		}
	},
	"Cluck": function cluck(employee, target) {
		let white = target.raw.damage("TETH", "white", roll(2) * employee.damageMultiplier, false, true)
		employee.ap -= 2.5
		return `${white} ${jn.dtype[1]}`
	},
	"Pomf": function pomf(employee) {
		let sp = employee.raw.heal("sp", roll(4) + roll(4))
		employee.ap -= 10
		return `${sp} ${jn.spheal}`
	}
}
exports.moveD/*isambiguations*/ = {
	"Skip": function skipD(user) {
		return [0, `Restores ${(user.apRegen*1.7).shortFixed(1)} Action Points.`]
	},
	"Punch": function punchD(employee) {
		return [5, `(5 AP) Punch something or someone square in the face (or whatever else it has) for ${jn.dtype[0]} ${Math.ceil(employee.raw.fortL/10)} damage.`]
	},
	"Nudge": function nudgeD(employee) {
		return [Math.round((Math.ceil(employee.raw.justL/10) + Math.ceil(employee.raw.tempL/10))*1.3), `(${Math.round((Math.ceil(employee.raw.justL/10) + Math.ceil(employee.raw.tempL/10))*1.3)} AP) Nudge a friend a little bit in the right direction to give them a slight advantage. Gives the target ${Math.ceil(employee.raw.justL/10) + Math.ceil(employee.raw.tempL/10)} AP.`]
	},
	"Shrug Off": function shrugOffD(employee) {
		return [7, `(7 AP) Just casually shrug off a small portion of damage taken based on your maximum HP. (${Math.ceil(employee.raw.fortL/15)} ${jn.hpheal})`]
	},
	"Commit Sudoku": function sudokuD(employee) {
		return [-999, `Go down like a true samurai.`]
	},
	"Commit Mental Sudoku": function sudokuMentalD(employee) {
		return [-999, `Go down like a true samurai..?`]
	},
	"Stare": function stareD(target) {
		return [0, ` `, [0, 1, 0, 0]]
	},
	"Stare Harder": function stare2D(target) {
		return [0, ` `, [0, 1, 0, 0]]
	},
	"Stare Really, Really Hard": function stare3D(target) {
		return [0, ` `, [0, 1, 0, 0]]
	},
	"Dematerialize": function dematerialize(target) {
		return [0, ` A decimating attack.`, [0, 1, 0, 0]]
	},
	"Move": function moveD(user) {
		return [Math.floor(user.apRegen - 1), `(${Math.floor(user.apRegen - 1)} AP) - allows you to move ${(2 + (user.raw.justL - 17)*0.015).shortFixed(1)} LM towards any other combatant.`, [0, 0, 0, 0]]
	},
	"Suppress": function suppressD(employee, target) {
		return [4, `(4 AP) flail at something with your baton and pray it dies before you do. (${4 * employee.damageMultiplier}-${6 * employee.damageMultiplier} ${jn.dtype[0]}) <1.0 LM>`, [1, 0, 0, 0]]
	},
	"Overpower": function suppressD(employee, target) {
		return [8, `(8 AP) flail at something, but harder. Deals more damage to weaker targets. <0.7 LM>`, [1, 0, 0, 0]]
	},
	"Swing": function suppressD(employee, target) {
		return [7, `(5 AP) Swing your stick at something. (${1 * employee.damageMultiplier}-${2 * employee.damageMultiplier} ${jn.dtype[0]}) <1.5 LM>`, [1, 0, 0, 0]]
	},
	"Ban": function banD(employee, target) {
		return [-128, `:sans:`, [1, 0, 0, 0]]
	},
	"Kick": function kickD(employee, target) {
		return [-128, `kick the fucker`, [0, 1, 0, 0]]
	},
	"Time Out": function timeOutD(employee, target) {
		return [-128, `I don't believe in time`, [0, 0, 1, 0]]
	},
	"TO THE RANCH": function toTheRanchD(employee, target) {
		return [-128, `Sends the target straight to the ranch. By means of absolute annihilation.`, [1, 1, 1, 1]]
	},
	"Effect Test": function effectTestD(employee) {
		return [0, `For testing purposes.`, [0, 0, 0, 0]]
	},
	"Sharp Wing": function sharpWingD(employee, target) {
		return [5, `(5 AP) Normal attack. (${5 * employee.damageMultiplier}-${7 * employee.damageMultiplier} ${jn.dtype[0]}) <1.2 LM>`, [1, 0, 0, 0]]
	},
	"Pure Heart": function pureHeartD(employee) {
		return [7.5, `(7.5 AP) Grants the "fairies' care" effect for 8 seconds.`, [0, 0, 0, 0]]
	},
	"Judgement": function judgementD(employee, target) {
		return [5, `(5 AP) Normal attack. (${5 * employee.damageMultiplier}-${7 * employee.damageMultiplier} ${jn.dtype[1]}) <1.2 LM>`, [0, 1, 0, 0]]
	},
	"Confession": function confessionD(employee) {
		return [10, `(10 AP) Have a moment of self-reflection to ease your mind. (2-8 ${jn.spheal})`, [0, 0, 0, 0]]
	},
	"Burst of Flame": function burstOfFlameD(employee, target) {
		return [12.5, `(12.5 AP) Normal attack. (${20 * employee.damageMultiplier}-${30 * employee.damageMultiplier} ${jn.dtype[0]}) <6 LM>`, [0, 1, 0, 0]]
	},
	"Burning Hatred": function burningHatredD(employee, target) {
		return [20, `(20 AP) A powerful, but inaccurate burst of flame and emotion. (${40 * employee.damageMultiplier}-${50 * employee.damageMultiplier} ${jn.dtype[0]}) <6 LM>`, [0, 1, 0, 0]]
	},
	"Piercing Universe": function piercingUniverse(employee, target) {
		return [3.7, `(3.7 AP) Normal attack. (${5 * employee.damageMultiplier}-${9 * employee.damageMultiplier} ${jn.dtype[3]}) <1.6 LM>`, [0, 0, 1, 0]]
	},
	"Echo From Beyond": function echoFromBeyond(employee, target) {
		return [11.1, `(11.1 AP) Strong attack that has a 33% chance of applying an SP-restoring effect (3.3% max SP/second) for 3 seconds. (10-15 ${jn.dtype[3]}) <1.8 LM>`, [0, 0, 1, 0]]
	},
	"Pity": function pityD(employee, target) {
		let headacheMod = 0
		if (employee.raw.effectArray) {
		if (employee.raw.effectArray.some(e => e[0] === "headache"))
			headacheMod = Number(employee.raw.effectArray.find(e => e[0] === "headache")[3]) * 5
		}
		return [7.5, `(7.5 AP) Nornal attack. (${(12 + headacheMod) * employee.damageMultiplier}-${(18 + headacheMod) * employee.damageMultiplier} ${jn.dtype[0]}) <2 LM>`, [1, 0, 0, 0]]
	},
	"Headache": function headacheD(employee) {
		let headacheMod = 0
		if (employee.raw.effectArray) {
		if (employee.raw.effectArray.some(e => e[0] === "headache"))
			headacheMod = Number(employee.raw.effectArray.find(e => e[0] === "headache")[3])
		}
		return [14, `(14 AP) Bang your head on something to lose ${(15 + headacheMod * 7).shortFixed(1)}% HP, but gain 5-5 damage on the main move for the duration of battle.`, [0, 0, 0, 0]]
	},
	"Soda Splash": function sodaSplashD(employee, target) {
		return [1.8, `(1.8 AP) Nornal attack. (${1 * employee.damageMultiplier}-${2 * employee.damageMultiplier} ${jn.dtype[0]}) <4 LM>`, [1, 0, 0, 0]]
	},
	"Cheers!": function cheersD(employee) {
		return [9, `(9 AP) Take a sip of the dangerously sweet soda. 30% chance to heal 30% of your max HP, 40% to heal 40% of your max SP, 25% to heal 20% of both HP and SP, 15% to lose 50% of SP and HP.`, [0, 0, 0, 0]]
	}
}