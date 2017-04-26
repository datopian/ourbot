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

    robot.hear(/badger/i, (res) => {
        res.send("Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS")
    })

    robot.error((err, res) => {
        console.log(err)
        robot.logger.error("DOES NOT COMPUTE")

        if(res !== null) {
            res.reply("DOES NOT COMPUTE")
        }
    })
}
