# Description:
#   Example scripts for you to examine and try out.
#
# Notes:
#   They are commented out by default, because most of them are pretty silly and
#   wouldn't be useful and amusing enough for day to day huboting.
#   Uncomment the ones you want to try and experiment with.
#
#   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

module.exports = (robot) ->


  config = require('../config.json')
  messages = require('./messages.js').messages

  robot.hear /.*/i, (res) ->
      message = res.message.text.match(/\+[^*\s]+/)
      for key, val of config.monitor
          if(message != null)
              if(key == message[0])
                  for de in config.monitor[message[0]].dest
                      messages[config.docs[de].fun](res.message, config.docs[de].dest, (info) ->
                          console.log("Added at: " + info.updated)
                          )

  robot.hear /badger/i, (res) ->
    res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"

  robot.error (err, res) ->

    console.log(err)
    robot.logger.error "DOES NOT COMPUTE"

    if res?
      res.reply "DOES NOT COMPUTE"
