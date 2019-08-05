const Discord = require('discord.js');

const client = new Discord.Client();

 x = 0 

client.on('ready', () => {
	
	console.log('I am ready!');
	client.bot.setActivity('!help', { type: 'TRY' })
});

 

client.on('message', msg => {

 if(msg.author.bot) return;
 if (msg.content === '!quote') {
 	 msg.react("607330826052698114")
	 //var x = Math.floor((Math.random() * 4)+1)
	 x = x + 1
	 if (x === 5) {
		 x = 1
	 }
	 console.log(x)
	 switch (x) {
		 case 1:
		  var txt = "It's not cheating if you make the rules!"
		  break
		 case 2:
		  var txt = "Clerk? What clerk? Oh, that one? His head just exploded accidentally. I didn't do it, why are you asking?"
		  break
		 case 3:
		  var txt = "No I will NOT lower the difficulty!"
		  break
		 case 4:
		  var txt = "No I didn't jinx myself!.. well maybe I did..."
	}
	 var txt2 = "Lambdadelta Quote of the day: " + txt
	 msg.reply(txt2)
		  
	 
 };
	if (msg.content === 'hmm') {
 	 msg.react("607330826052698114") 
 };
	if (msg.content === 'actreset1337') {
 	 client.bot.setActivity('!help', { type: 'TRY' })
 };
  var par = msg.content.indexOf("!")
  if (par === 0) {
	if (msg.content.slice(1, 9) === "giverole") {
		if (msg.content.slice(10) === '607596327165231114') {
  	msg.member.addRole(msg.content.slice(10))
  	msg.channel.send("Given the role <@&" + msg.content.slice(10) + "> to " + msg.author)
	} else {msg.channel.send("The command cannot be performed because it has been typed in incorrectly or the specified role cannot be given.")}}
	if (msg.content.slice(1, 11) === "removerole") {
		if (msg.content.slice(12) === '607596327165231114') {
  	msg.member.removeRole(msg.content.slice(12))
	msg.channel.send("Removed the role <@&" + msg.content.slice(12) + "> from " + msg.author)
	} else {msg.channel.send("The command cannot be performed because it has been typed in incorrectly or the specified role cannot be removed.")}}
	if (msg.content.slice(1, 5) === "help") {
		var tst1 = msg.content.slice(6)
		switch (tst1) {
			case "giverole":
				msg.reply("Usage: !giverole RoleId. You can get the role's ID by putting \ before @Role. Awaliable roles: Bot Tinkerer.")
				break
			case "removerole":
				msg.reply("Usage: !removerole RoleId. Works just like giverole and for the same roles.")
				break
			case "quote":
				msg.reply("Gives a quote of Lambdadalta. Quote accuracy not guaranteed.")
				break
			case "math":
				msg.reply("Makes the bot do basic math. Works only for addition and substraction of single digit numbers.")
				break
			case "help":
				msg.reply("Why do you need help with the help command? Anyway, usage: !help CommandName.")
				break
			default:
				msg.reply("Avaliable commands: !giverole, !removerole, !quote, !math. Use !help CommandName to get more details.")
				break
		}
	}
	if (msg.content.slice(1, 5) === "math")  {
		var a = msg.content.charAt(6)
		var b = msg.content.charAt(10)
		if (typeof(Number(a)) === "number" && typeof(Number(b)) == "number") {
			switch (msg.content.charAt(8)) {
			case "+":
			var c = Number(a) + Number(b)
			break
			case "-":
			var c = Number(a) - Number(b)
			break
			default:
			var c = "nope"
			msg.reply("I can't do that!")
			break
			}
		var a = a - 0
		var b = b - 0
		var doot = "a" - 0
		if (a === doot || b === doot) {
			msg.reply("I can't do that!")
			var c = "nope"
		}
		if (c != "nope") {
		msg.channel.send(a + " " + msg.content.charAt(8) + " " + b + " = " + c)
		}}
	}	
	
  }
})


 

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);//BOT_TOKEN is the Client Secret
