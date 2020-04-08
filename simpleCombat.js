const abn = require("./abnb.json") // Abnormalities
const jn = require("./junk.json") // Miscellaneous stuff
const gear = require("./gear.json") // Gear and items
const fn = require("./functions.js") // Functions, like all effects - on-consume of consumables, on-work of abnos etc.
const main = require("./bot.js")
Number.prototype.shortFixed = function(length) {return Math.round(this*Math.pow(10, length))/Math.pow(10, length)}

targetsExternal = new Discord.Collection
targetsExternal.set(-1, {"name": "Left door", "id": -1, "position": 0})
targetsExternal.set(-2, {"name": "Right door", "id": -1, "position": 25})

allMoves = jn.allMoves
baseMoves = jn.baseMoves

function getStatus(combatants, mobileOverride, r) {
let statusArray = []
let statusText = ``
let lengths = new Array(6).fill(0)
combatants.forEach(c => {
	let status = []
	status.push(bck + c.name)
	if (c.raw.dead === 1)
	status.push(`${bck}[${["dead", "d"][mobileOverride]}]`)
	else if (c.raw.panicked === 1)
	status.push(`${bck}[${["panicked", "p"][mobileOverride]}]`)
	else status.push(`${bck}[${["alive", "a"][mobileOverride]}]`)
	if (c.type === "employee") {
	status.push(`${bck}${c.raw.hp.shortFixed(1)}/${c.raw.fortL}`, `${bck}${c.raw.sp.shortFixed(1)}/${c.raw.prudL}`)//Hp [2]
	if (c.raw.panicked === 0)
	status.push(`${bck}${c.ap.shortFixed(1)}/${c.apMax}`)
	else status.push("`(?)")
	} else {
	status.push(`${bck}${Math.round(c.raw.hp/c.raw.hpMax*100)}%`, "`(X)", `${bck}${c.ap.shortFixed(1)}/${c.apMax}`/*"`(?)"*/)//Hp
	}
	status.push(`${bck}<${c.position.shortFixed(1)}>`)
	statusArray.push(status)
})
//console.log(DELTAS().presences.cache.get(getUser("mush").id).clientStatus)
{
let fillChar = " "
if (DELTAS().presences.cache.get(r.author.id) || mobileOverride === 1) {
if (DELTAS().presences.cache.get(r.author.id).clientStatus.mobile === "online" || mobileOverride === 1) 
fillChar = "_"
}
statusArray = arrayNormalizer(statusArray, fillChar, "`")
}
statusArray = statusArray.map((status, sIndex) => {
status[2] += " " + jn.hp
status[3] += " " + jn.sp
status[4] += " AP"
status[5] += " LM"
return status
})
statusText = statusArray.map(s => s.join("   ")).join("\n	")
return statusText
}

function generalTargeting(user, combatants, move) {
let targets
if (user.type === "employee") {
switch (move.target) {
case "enemy": { 
	targets = combatants.filter(c => c.type !== 'employee' && c.raw.dead === 0).filter(c => {
		let distance = Math.abs(c.position - user.position)
		return distance <= move.range
	})
} break
case "ally": {
	targets = combatants.filter(c => c.type === 'employee' && c.id !== user.id && c.raw.dead === 0 && c.raw.panicked === 0).filter(c => {
		let distance = Math.abs(c.position - user.position)
		return distance <= move.range
	})
} break
case "any": {
	targets = combatants.filter(c => c.id !== user.id).filter(c => {
		let distance = Math.abs(c.position - user.position)
		return distance <= move.range
	})
} break
} // [/move target switch]
} else {
switch (move.target) {
case "enemy": {
targets = combatants.filter(c => c.type === 'employee' && c.id !== user.id && c.raw.dead === 0).filter(c => {
	let distance = Math.abs(c.position - user.position)
	return distance <= move.range
})
} break
} // [/move target switch]
if (mv.moveD[move.name](user)[2]) {
if (mv.moveD[move.name](user)[2][1] === 1) {
targets = targets.filter(c => {
if (c.type === "employee") {console.log([true, false][c.raw.panicked] + " " + c.name); return [true, false][c.raw.panicked]}
else return true
})}}
}
return targets
} 

function statusUpdate(combatants, fight) { // Checks and updates employees/abnos being dead/OOC and the fight victory condition
combatants.forEach(c => {
	if (c.raw.hp <= 0) c.raw.dead = 1
	if (c.type === "employee" && c.raw.dead === 0) {
		if (c.raw.sp <= 0) c.raw.panicked = 1
	}
})
let enemies = combatants.filter(c => c.type !== "employee")
if (enemies !== []) {
if (enemies.every(e => e.raw.dead === 1)) {
fight.victory = "employee"
combatGoing = false
fight.end = true
}}
let employees = combatants.filter(c => c.type === "employee")
if (employees !== []) {
if (employees.every(e => e.raw.dead === 1 || e.raw.panicked === 1)) {
fight.victory = "enemies"
combatGoing = false
fight.end = true
}}
}

class entity {
constructor(entityRaw, type = "abnormality") {
	if (type === "employee") {
		this.id = entityRaw.entityID
		this.type = "employee"
		this.weapon = gear.weapons.find(w => w.id === entityRaw.weapon)
		this.name = entityRaw.tag
		this.hpMax = entityRaw.fortL
		this.spMax = entityRaw.prudL
		this.apMax = this.weapon.apMax // (sic)
		this.ap = Math.round(this.apMax/3) // (sic) Stand-in
		this.moves = baseMoves.concat(this.weapon.moves) // (sic)
		this.raw = entityRaw
	} else {
		this.id = entityRaw.entityID
		this.type = "abnormality"
		this.name = entityRaw.name
		this.hpMax = entityRaw.hpMax
		this.apMax = 50 // (sic)
		this.ap = Math.round(this.apMax/3) // (sic) Stand-in
		this.ai = entityRaw.ai
		this.raw = entityRaw
	}
}
}





async function instCombat(combatantsExternal, channel) {
	
	combatGoing = true
	let ch = channel
	let combatants = combatantsExternal
	
	let latestStatusMessage
	let fight = {"roomSize": 25, "victory": undefined, "turn": 0, "end": false}
	
	combatants.forEach(c => { // Roll the initiatives
	while (combatants.some(c1 => c1.initRoll === c.initRoll && c1 !== c) || c.initRoll === undefined) 
	{c.initRoll = roll(20)}
	if (c.position === undefined) {
	if (c.type !== "employee" || c.panicked === 1) c.position = roll(roomSize)
	else c.position = (roll(2) - 1) * roomSize
	}})
	combatants.sort((c1, c2) => {return c2.initRoll - c1.initRoll})
	
	function turnEnder(combatant) {
	if (combatant.ap < combatant.apMax) combatant.ap += Math.round(Math.pow(combatant.apMax, 0.7)/2)
	if (combatant.ap > combatant.apMax) combatant.ap = cCombatant.apMax
	}
	
	start: while (fight.end === false) {
		
		let menuMessage
		let cCombatant = combatants.array()[fight.turn]
		while (cCombatant.raw.dead === 1 || cCombatant.raw.panicked === 1) { // If the combatant is dead/OOC then just skip them
			if (cCombatant.raw.dead === 1)
			ch.send(`**${cCombatant.name}** is busy being dead.`)
			else ch.send(`**${cCombatant.name}** is busy being batshit fucking insane.`)
			await wait(1500)
			if (fight.turn === combatants.array().length - 1) fight.turn = 0
			else fight.turn++
			cCombatant = combatants.array()[fight.turn]
		}
		
		switch (cCombatant.type) {
		
		case "abnormality": { // Abnormality turn-taking
		statusUpdate(combatants, fight)
		
		let moveRoll = roll(100)
		let move
		let targets
		let moves = allMoves.filter(m => cCombatant.ai[m.name] !== undefined) // allMoves - will need to replace! (sic)
		moves.forEach(moveL => {
		if (move === undefined) {
		if (moveRoll > cCombatant.ai[moveL.name]) moveRoll -= cCombatant.ai[moveL.name]
		else move = moveL
		}
		})
		if (move.name !== "Skip") {
		if (move.target !== "self") {
		
		targets = generalTargeting(cCombatant, combatants, move)
		
		if (targets.array().length > 0) {
		let target = targets.get(targets.array()[roll(targets.array().length)-1].id)
		ch.send(`**${cCombatant.name}** used '${move.name}' on ${target.name}. (${mv.moves[move.name](cCombatant, target)})`)
		} else { // If no targets
			mv.moves["Skip"](cCombatant)
			ch.send(`**${cCombatant.name}** skipped their turn.`) 
		}
		} else ch.send(`**${cCombatant.name}** used '${move.name}'.`) // If self-targeted
		} else { // If skip
		mv.moves["Skip"](cCombatant)
		ch.send(`**${cCombatant.name}** skipped their turn.`) 
		}
		await wait(2000)
		statusUpdate(combatants, fight)
		} break // [/abnormality turn-taking] 
		
		case "employee": { // Employee turn-taking
		let turnEnd = false
		let moved = false
		let skipAvailable = true
		let moves = cCombatant.moves.map((m, i) => `	${bck}${i+1}${bck}) ${m.name} - ${mv.moveD[m.name](cCombatant)[1]}`).join("\n")
		
		menuMessage = await ch.send("```" + ` ⚔️ | Your turn, ${cCombatant.name}.` + "```" + `	${cCombatant.raw.hp.shortFixed(1)}/${cCombatant.raw.fortL} ${jn.hp}	${cCombatant.raw.sp.shortFixed(1)}/${cCombatant.raw.prudL} ${jn.sp}	${cCombatant.ap}/${cCombatant.apMax} AP	${cCombatant.position.shortFixed(1)} LM\nAvailable moves: \n${moves}`)
		
		let latestMove
		turn: while (turnEnd === false && fight.end === false && cCombatant.raw.dead === 0 && cCombatant.raw.panicked === 0) {
		statusUpdate(combatants, fight)
		let rEx = await ch.awaitMessages(r => r.author.id !== client.user.id, { max: 1, time: 25000 })
		let r = rEx.first()
		
		if (r === undefined) { // If no response is given
		if (moved === false)
		ch.send(`**${cCombatant.name}** skipped their turn. (${mv.moves['Skip'](cCombatant)})`)
		else {
		ch.send(`**${cCombatant.name}**, turn ended. (Timeout)`)
		turnEnder(cCombatant)
		}
		turnEnd = true
		} else { // If a response is given
		let rArgs = r.content.toLowerCase().split(" ")
		let mobileOverride = 0
		if (rArgs.includes("-m")) mobileOverride = 1
		switch (rArgs[0]) {
		case "ef": {
			ch.send("Ended the fight.")
			combatGoing = false
			fight.end = true
			turnEnd = true
		} break
		
		case "repeat":
		case "r": {
			if (latestMove !== undefined) {
			if (cCombatant.ap >= mv.moveD[latestMove.move.name](cCombatant)[0]) {
			if (latestMove.target !== "self") {
			if (latestMove.target.id > 0) {
			if (Math.abs(cCombatant.position - latestMove.target.position) <= latestMove.move.range) {
			if (combatants.get(latestMove.target.id).dead === 0) {
			ch.send(`**${cCombatant.name}** used '${latestMove.move.name}' on ${latestMove.target.name}. (${mv.moves[latestMove.move.name](cCombatant, latestMove.target)})`)
			} else ch.send(`${latestMove.target.name} that you last used '${latestMove.move.name}' on is dead. (${cCombatant.ap}/${mv.moveD[latestMove.move.name][0]} AP)`)
			} else ch.send(`You aren't in range to repeat '${latestMove.move.name}' on ${latestMove.target.name}. (${cCombatant.ap}/${mv.moveD[latestMove.move.name][0]} AP)`)
			} else {
			ch.send(`**${cCombatant.name}** used '${latestMove.move.name}' on ${latestMove.target.name}. (${mv.moves[latestMove.move.name](cCombatant, latestMove.target)})`)
			}
			} else {
			ch.send(`**${cCombatant.name}** used '${latestMove.move.name}'. (${mv.moves[latestMove.move.name](cCombatant)})`)
			}
			} else ch.send(`You don't have enough AP to repeat '${latestMove.move.name}'. (${cCombatant.ap}/${mv.moveD[latestMove.move.name](cCombatant)[0]} AP)`)
			} else ch.send("You haven't yet used a move on this turn.")
		r.delete({ 'timeout': 500 })
		} break
		
		case "e": {
			turnEnd = true
			if (cCombatant.ap < cCombatant.apMax) cCombatant.ap += Math.round(Math.pow(cCombatant.apMax, 0.7)/2)
			if (cCombatant.ap > cCombatant.apMax) cCombatant.ap = cCombatant.apMax
			r.delete({ 'timeout': 100 })
		} break
		case "status":
		
		case "s": {
			ch.send(`${b3ck} Current status of the battle: ${b3ck}	${getStatus(combatants, mobileOverride, r)}`).then(async function statusUpdater(statusMessage) {
				latestStatusMessage = statusMessage.id
				let timeout = false
				wait(60000).then(() => timeout = true)
				while (latestStatusMessage === statusMessage.id && timeout === false) {
				await ch.awaitMessages(r => r.author.id !== client.user.id, { max: 1, time: 2000 })
				await wait(50)
				statusMessage.edit(`${b3ck} Current status of the battle: ${b3ck}	${getStatus(combatants)}`)
				}
				statusMessage.edit(statusMessage.content + "\n Status message timed out.")
			})
			r.delete({ 'timeout': 100 })
		} break
		
		default: {
			// These two check if the response is a move name or a move index
			let isMoveName = cCombatant.moves.some(m => m.name.toLowerCase() === r.content.toLowerCase())
			let isMoveIndex = /\D/.test(rArgs[0]) === false && cCombatant.moves[Number(rArgs[0]) - 1] !== undefined
			if (isMoveName || isMoveIndex) {
			r.delete({ 'timeout': 100 })
			let move
			if (isMoveIndex) move = cCombatant.moves[Number(rArgs[0]) - 1]
			else move = cCombatant.moves.find(m => m.name.toLowerCase() === r.content.toLowerCase())
			
			if (move.name === "Skip") { // Checks if the move is 'Skip' since it's a special case
				if (moved === false) {
				ch.send(`**${cCombatant.name}** skipped their turn. (${mv.moves['Skip'](cCombatant)})`)
				turnEnd = true
				} else ch.send(`**${cCombatant.name}**, you can only skip at the beginning of your turn.`)
			} else {
			let moveCost = mv.moveD[move.name](cCombatant)[0]
			if (cCombatant.ap >= moveCost) {
			if (move.target !== "self") {
			let selfIndex
			let targets = generalTargeting(cCombatant, combatants, move)
			targets.set(cCombatant.id, cCombatant)
			if (move.name === "Move") {
			targets.set(-1, {"id": "-1", "name": "Left door", "type": "object", "position": 0})
			targets.set(-2, {"id": "-2", "name": "Right door", "type": "object", "position": fight.roomSize})}
			let targetsArranged = targets.sort((a, b) => a.position - b.position)
			let targetsMapped = targetsArranged.filter(t => t !== cCombatant).array().map((e, i) => {return {"i": i+1, "name": e.name, "id": e.id}})
			let targetsArray = targetsArranged.array().map((e, i) => {
				let distance = (cCombatant.position - e.position).shortFixed(1)
				let direction = Math.abs(distance) + " LM right"
				if (Math.sign(distance) === 1) direction = Math.abs(distance) + " LM left"
				else if (distance === 0) direction = "on top of you"
				if (e.id === cCombatant.id) {selfIndex = i;	return [`${bck}`, `${bck}`, `${bck}`, `${bck}`]}
				let ret = [`${bck}${e.name}`, `${bck}<${direction}>`]
				switch (e.type) {
				case "employee": ret.push(`${bck}${e.raw.hp.shortFixed(1)}/${e.raw.fortL}`, `${bck}${e.raw.sp.shortFixed(1)}/${e.raw.prudL}`)
				break
				case "abnormality": ret.push(`${bck}${Math.round(e.raw.hp/e.raw.hpMax*100)}%`, `${bck} `)
				break
				default: ret.push(`${bck} `, `${bck} `)
				break
				} return ret
			})
			targetsArray.splice(selfIndex, 1)
			{ let fillChar = " "
			if (DELTAS().presences.cache.get(r.author.id) || mobileOverride === 1) {
			if (DELTAS().presences.cache.get(r.author.id).clientStatus.mobile === "online" || mobileOverride === 1) 
			fillChar = "_"
			}
			targetsArray = arrayNormalizer(targetsArray, fillChar, "`").map((c, i) => {
				c.unshift("`" + (i + 1) + "`)")
				c[3] += jn.hp
				c[4] += jn.sp
				return c
			})}
			let targetsText = targetsArray.map(a => a.join("  "))
			targetsText.splice(selfIndex, 0, "----------you are here----------")

			let chosen = false
			let cancelled = false
			let choiceMessage = await ch.send(`Choose a target to use '${move.name}' on:\n${targetsText.join("\n")}`)
			choice: while (chosen === false && cancelled === false) {
			let rpEx = await ch.awaitMessages(r => r.author.id !== client.user.id, { max: 1, time: 30000 })
			let rp = rpEx.first()
			if (rp === undefined) {
			ch.send(`**${cCombatant.name}**, move cancelled. (Timeout)`)
			chosen = true
			} else if (rp.content.toLowerCase() === "c" || rp.content.toLowerCase() === "cancel") {
			ch.send(`**${cCombatant.name}**, move cancelled.`)
			rp.delete({ 'timeout': 100 })
			cancelled = true
			} else {
			if (targetsMapped.some(e => e.i === Number(rp.content))) {
			let target
			if (Number(targetsMapped.find(e => e.i === Number(rp.content)).id) < 0) {
			target = targetsExternal.get(Number(targetsMapped.find(e => e.i === Number(rp.content)).id))
			} else target = combatants.get(targetsMapped.find(e => e.i === Number(rp.content)).id)
			ch.send(`**${cCombatant.name}** used '${move.name}' on ${target.name}. (${mv.moves[move.name](cCombatant, target)})`)
			latestMove = {"move": move, "target": target}
			chosen = true
			moved = true
			rp.delete({ 'timeout': 100 })
			}}
			if (chosen === false && cancelled === false) continue choice
			} choiceMessage.delete({ 'timeout': 200 })

			} else { // Else if self
			 // Nothing
			}
			} else ch.send(`**${cCombatant.name}**, you do not have enough AP to use '${move.name}'! (${cCombatant.ap}/${moveCost} AP)`)
			}} // [/all of the move processing]
		} break
		
		} // [/response switch]
		} // [/else]
		
		
		
		
		statusUpdate(combatants, fight)
		menuMessage.edit("```" + ` ⚔️ | Your turn, ${cCombatant.name}.` + "```" + `	${cCombatant.raw.hp.shortFixed(1)}/${cCombatant.raw.fortL} ${jn.hp}	${cCombatant.raw.sp.shortFixed(1)}/${cCombatant.raw.prudL} ${jn.sp}	${cCombatant.ap}/${cCombatant.apMax} AP	${cCombatant.position.shortFixed(1)} LM\nAvailable moves: \n${moves}`)
		} // [/turn: while(...) etc]
		
		menuMessage.edit("```" + ` ⚔️ | ${cCombatant.name} has taken their turn.` + "```" + `	${cCombatant.raw.hp.shortFixed(1)}/${cCombatant.raw.fortL} ${jn.hp}	${cCombatant.raw.sp.shortFixed(1)}/${cCombatant.raw.prudL} ${jn.sp}	${cCombatant.ap}/${cCombatant.apMax} AP	${cCombatant.position.shortFixed(1)} LM\n\n	Turn ended.`)
		
		} // [/employee turn taking]
		
		} // [/combatant type switch]
	if (fight.turn === combatants.array().length - 1) fight.turn = 0
		else fight.turn++
		if (fight.end === false) continue start
	}
	ch.send(`Victory for: ${fight.victory}`)
}


