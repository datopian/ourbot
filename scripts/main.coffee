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
    
  messages = require('./messages.js').messages
  messages.setAuth((err, res) ->
      console.log("Logged in: " + res[1].title)
  )

  robot.hear conf.keys, (res) ->
      messages.sendMessage(res.message, (r) ->
          console.log("Added at: " + r.updated))

  robot.hear /badger/i, (res) ->
    res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"

  robot.error (err, res) ->

    console.log(err)
    robot.logger.error "DOES NOT COMPUTE"

    if res?
      res.reply "DOES NOT COMPUTE"
