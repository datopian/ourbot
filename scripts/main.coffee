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

  # robot.hear /\+todo/i, (res) ->
  #     messages.sendMessage(res.message, (r) ->
  #         console.log("Added at: " + r.updated))
  #
  # robot.hear /\+standup/i, (res) ->
  #     messages.sendMessage(res.message, (r) ->
  #         console.log("Added at: " + r.updated))
    # messageText = res.message.text.indexOf(' ')+1
    # assignees = res.message.text.substr(messageText).match(/(@.*\s)/)
    # if !assignees
    #   assignees = "none"
    # else
    #   assignees = assignees[0].trim()
    # if messageText
    #   addRowDoc({"action": " +todo", "timestamp": new Date().toLocaleString(), "poster": res.message.user.name, "assignees": assignees, "message": res.message.text.substr(messageText)})
    #   res.send "Todo saved with text: " + res.message.text.substr(messageText)
    # else
    #   res.send "No parameter specified"
      # data = JSON.stringify({
      #   "description": "TODO",
      #   "public": true,
      #   "files": {
      #     "file1.txt": {
      #       "content": res.message.text.substr(res.message.text.indexOf(' ')+1)
      #     }
      #   }
      # })
      # robot.http("https://api.github.com/gists")
      #   .header('Content-Type', 'application/json')
      #   .header('Accept', 'application/vnd.github.v3+json')
      #   .post(data) (err, resp, body) ->
      #     this.body = JSON.parse(body)
      #     if err
      #       res.send "Encountered an error :( #{err}"
      #       return

  robot.hear /badger/i, (res) ->
    res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"

  robot.error (err, res) ->

    console.log(err)
    robot.logger.error "DOES NOT COMPUTE"

    if res?
      res.reply "DOES NOT COMPUTE"
