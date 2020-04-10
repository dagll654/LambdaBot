const nodemon = require('nodemon')
nodemon({ script: 'bot.js', ext: 'js json' })
nodemon.on('start', function () {
  console.log('App has started')
})

nodemon.on('message', message => {
	nodemon.emit(message)
})