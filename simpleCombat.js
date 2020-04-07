const abn = require("./abnb.json") // Abnormalities
const jn = require("./junk.json") // Miscellaneous stuff
const gear = require("./gear.json") // Gear and items
const fn = require("./functions.js") // Functions, like all effects - on-consume of consumables, on-work of abnos etc.
const main = require("./bot.js")
Number.prototype.shortFixed = function(length) {return Math.round(this*Math.pow(10, length))/Math.pow(10, length)}



