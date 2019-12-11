  const jn = require("./junk.json");
  const gear = require("./gear.json")
  	const deproles = jn.deproles
	const ncdeproles = jn.ncdeproles
	const cdeproles = jn.cdeproles
	const help1 = jn.help1 
	const qte = jn.qte
	const qte2 = "Lambdadelta Quote #"
	const cmds = jn.cmds
//module.js
exports.hello = function() {
  return "Hello";
}

	// was (frick puriora)
exports.wait = function(msc) {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve('resolved')
			}, msc)
		})
	}	
	
	// Function for increasing the amount of Specific PE Boxes by val on abnormality with code abn for user with id id
exports.bumpBoxes = function(val, abn, id) {

		
		upd()
		let emp = dbployees[dbids.indexOf(id)]
		let bAbnos = []
		let bBals = []
		let bGotten = emp.balancespecific.split(" ")
		bGotten.forEach(bg => {
			bAbnos.push(bg.split("|")[0])
			bBals.push(bg.split("|")[1])
		})
		bBals[bAbnos.indexOf(abn)] = Number(bBals[bAbnos.indexOf(abn)]) + val
		let bToSend = []
		bAbnos.forEach(a => {
			bToSend.push(a + "|" + bBals[bAbnos.indexOf(a)])
		})
		connection.query("UPDATE `employees` SET `balancespecific` = '" + bToSend.join(" ") + "' WHERE `employees`.`userid` = '" + id + "';", function (err, result) {if (err) throw err})
			

	}
	
	// Function for checking if all the elements of arr are included in arr2
exports.checkArray = function(arr, arr2) {
		return arr.every(i => arr2.includes(i));
	}
	
	// Function for getting the damage modifier of risk level 1 (receiving end) against risk level 2 (dealing end), with the receiving end having res resistance
exports.rDamage = function(rec, dea, res) {
		let levelDifference = jn.risk.indexOf(rec.toUpperCase()) - jn.risk.indexOf(dea.toUpperCase())
		let dMult = 1
		//console.log(levelDifference)
		//4 = 40%; 3 = 60%; 2 = 70%; 1 = 80%; 0 = 100%; -1 = 100%; -2 = 120%; -3 = 150%; -4 = 200%
		switch (levelDifference) {
			case 4: dMult = 0.4; break;
			case 3: dMult = 0.6; break;
			case 2: dMult = 0.7; break;
			case 1: dMult = 0.8; break;
			case 0:
			case -1: dMult = 1; break;
			case -2: dMult = 1.2; break;
			case -3: dMult = 1.5; break;
			case -4: dMult = 2; break;
		}
		return (dMult * res)
	}

	// Function for checking if all the symbols of a given string are included in an array
exports.checkSymbols = function(str, arr) {
		return str.split("").every(i => arr.includes(i))
	}
	
	// Function for checking if all the symbols of a given string are the same as compoint
exports.checkStringSame = function(str, compoint) {
		return str.split("").every(i => i === compoint)
	}
	
	// Function for checking if all the elements of arr are are the same as compoint
exports.checkSame = function(arr, compoint) {
		if (arr.length === 0) {return false} else {return arr.every(i => i === compoint)}
	}
	
exports.statLVL = function(stat) {
		if (stat < 30) {return "I"}
		else if (stat < 45) {return "II"}
		else if (stat < 65) {return "III"}
		else if (stat < 85) {return "IV"}
		else if (stat < 100) {return "V"}
		else {return "EX"}
	}
	
	// Function for checking if the given amount of arguments is valid
exports.argCheck = function(arr, argcount) {
		return arr.length >= argcount
	}
	
	// Just a function that times the message out in x seconds
exports.yeet = function(sec) {
		setTimeout(function(){msg.delete().catch(console.error)}, sec * 1000)
	}
	
	// Function for getting an emoji by name
exports.emoji = function(nme, srv = msg.guild, a = false, id = false) {
		if (id === true) {emvar = srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)]}
		else {if (a === true) {emd = "<a:"} else {emd = "<:"}
			emvar = emd + nme + ":" + srv.emojis.map(e => e.id)[srv.emojis.map(e => e.name).indexOf(nme)] + ">"}
		return emvar
	}
	
	// Function for getting a box by array explaining its contents
exports.box = function(arr) {// 1 = 1, -1 = 3, 0 = 7
		let a = 0
		if (arr[0] === 1) {a = a + 1}
		else if (arr[0] === -1) {a = a + 3}
		else {a = a + 7}
		//console.log("A1 " + a) 
		if (arr[1] === 1) {a = a + 1}
		else if (arr[0] === -1) {a = a + 3}
		else {a = a + 7}
		//console.log("A2 " + a) 
		return jn.boxes[jn.boxcodes.indexOf(a)]
	}
	
	// Roll an x-sided die, even if that makes absolutely no sence in practice
exports.roll = function(sides) {
		return Math.ceil(Math.random() * sides)
	}
	
	// Function for getting a role by name 
exports.getRole = function(nme) {
		if (msg.guild.roles.map(r => r.name).includes(nme)) {
			return msg.guild.roles.find(role => role.name === nme)
		} else {return void(0)}
	}
	
	// Function for checking whether an emoji (found by name) is animated
exports.emanim = function(name, srv = msg.guild) {
		return srv.emojis.get("650293931791089684").animated
	}