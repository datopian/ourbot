// Description:
//   Example scripts for you to examine and try out.
//
// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md


module.exports = (robot) => {
    let config = require('../config.json')
    let messages = require('./messages.js').messages
    let formatting = require('./formatting.js').formatting

    robot.hear(/.*/i, (res) => {
        let key, val, de, ref
        let message = formatting.getDataMask(res.message.text, /\+[^*\s]+/)
        for(key in config.monitor) {
            val = config.monitor[key]
            if(message !== null) {
                if(key === message) {
                    for(de in config.monitor[message].dest) {
                        ref = config.monitor[message].dest[de]
                        messages[config.docs[ref].fun](res.message, config.docs[ref].dest, (info) => {
                            console.log("Added at: " + info.updated)
                        })
                    }
                }
            }
        }
    })
    robot.hear(/bot help|bot/i, (res) => {
        var message = res.message.text
        message = message.split(' ')
        if(message.length === 1 && (message[0] === "bot" || message[0] === "/bot")){
            res.reply("Hi, I'm your helpful chatops bot! Please, see README for the usage https://github.com/datopian/ourbot#commands\n+todo - get logged to the Google doc, Gist\n +standup - get logged to the Google doc, Gist")
          }
        else if(message.length == 2 && (message[0] === "bot" && message[1] === "help") || (message[0] === "/bot" && message[1] === "help")){
            res.reply("Hi, I'm your helpful chatops bot! Please, see README for the usage https://github.com/datopian/ourbot#commands\n+todo - get logged to the Google doc, Gist\n +standup - get logged to the Google doc, Gist")
          }
    })
    robot.hear(/bot todos/i, (res) => {
        var message = res.message.text
        message = message.split(' ')
        if(message.length === 2) {
            res.reply("https://docs.google.com/spreadsheets/d/"+process.env.GOOGLE_WORKSHEET)
        }
    })
    robot.error((err, res) => {
        console.log(err)
        robot.logger.error("DOES NOT COMPUTE")

        if(res !== null) {
            res.reply("DOES NOT COMPUTE")
        }
    })
}
