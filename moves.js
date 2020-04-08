const jn = require("./junk.json")
Number.prototype.shortFixed = function(length) {return Math.round(this*Math.pow(10, length))/Math.pow(10, length)}
 
function roll(sides) {
	return Math.ceil(Math.random() * sides)
}
 
exports.moves = {
	"Skip": function skip(user) {
		if (user.ap < user.apMax)
		user.ap += Math.round(Math.pow(user.apMax, 0.9)/4 + 1 + Math.pow(user.apMax, 0.3))
		if (user.ap > user.apMax) user.ap = user.apMax
		return `+${Math.round(Math.pow(user.apMax, 0.9)/4 + 1 + Math.pow(user.apMax, 0.3))} AP`
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
		damage = target.raw.damage("ZAYIN", "white", 1)
		return `${damage} ${jn.dtype[1]}`
	},
	"Stare Harder": function stare2(abnormality, target) {
		damage = target.raw.damage("ZAYIN", "white", 2)
		return `${damage} ${jn.dtype[1]}`
	},
	"Stare Really, Really Hard": function stare3(abnormality, target) {
		damage = target.raw.damage("ZAYIN", "white", 3)
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
		user.ap -= Math.round(Math.pow(user.apMax, 0.7)/2) - 1
		return `moved ${Math.abs(moveAmt)} LM ${direction}`
	},
	"Suppress": function suppress(employee, target) {
		let damage = target.raw.damage("ZAYIN", "red", 3 + roll(3))
		employee.ap -= 4
		return `${damage} ${jn.dtype[0]}` 
	},
	"Overpower": function overpower(employee, target) {
		let risk
		if (target.type === "abnormality") risk = jn.risk.indexOf(target.risk) + 1
		else risk = target.employeeLevel
		let hit = 3.5 - risk // 2.5 at risk 1/zayin, 1.5 at risk 2/teth
		if (hit <= 0) hit = 0.25
		let damage = target.raw.damage("ZAYIN", "red", ((3 + roll(2)) * hit).shortFixed(1))
		employee.ap -= 8
		return `${damage} ${jn.dtype[0]}` 
	},
	"Reality Slash": function realitySlash(employee, target) {
		let red = target.raw.damage("LUL", "red", roll(2))
		let white = target.raw.damage("LUL", "white", roll(2))
		employee.ap -= 15
		return `${red} ${jn.dtype[0]}, ${white} ${jn.dtype[1]}`
	}
}
exports.moveD/*isambiguations*/ = {
	"Skip": function skipD(user) {
		return [0, `Restores ${Math.round(Math.pow(user.apMax, 0.9)/4 + 1 + Math.pow(user.apMax, 0.3))} Action Points.`]
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
		return [0, ` - A decimating attack.`, [0, 1, 0, 0]]
	},
	"Move": function moveD(user) {
		return [Math.round(Math.pow(user.apMax, 0.7)/2) - 1, `(${Math.round(Math.pow(user.apMax, 0.7)/2) - 1} AP) - allows you to move ${(2 + (user.raw.justL - 17)*0.015).shortFixed(1)} LM towards any other combatant.`]
	},
	"Suppress": function suppressD(employee, target) {
		return [4, `(4 AP) - flail at something with your baton and pray it dies before you do. (4-6 ${jn.dtype[0]}) <1.0 LM>`]
	},
	"Overpower": function suppressD(employee, target) {
		return [8, `(8 AP) - flail at something, but harder. Deals more damage to weaker targets. <0.7 LM>`]
	},
	"Reality Slash": function suppressD(employee, target) {
		return [15, `(15 AP) - Wield the power of memes to tear through your enemies. (69-138 ${jn.dtype[0]}${jn.dtype[1]}) <10 LM>`]
	}
}