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
    let {createMilestone,closeMilestone} = require("./milestone.js")
    let {createIssue} = require("./issue.js")
    let moment = require('moment')
    let fs = require('fs')
    let path = require('path')
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
    
    robot.hear(/bot (?:create|close) milestone "([^"]+)"(?: in "([\w\d-_]+)(?:\/([\w\d-_]+))?")/i, (res) => {
        let message = res.message.text
        message = message.split(' ')
        let title = res.match[1]
        let org = res.match[2]
        let repo = res.match[3]
        if(message[1] ==="create") {
            let myDate = moment(title, 'DD-MMM-YYYY').toDate()
            if(moment(myDate, moment.ISO_8601, true).isValid()){
              let titleWithSprint = "Sprint - "+title
              createMilestone(titleWithSprint, myDate, org, repo)
              res.reply("Milestone successfully created at 'https://github.com/"+org+"/"+repo+"/milestones")
            } else {
              createMilestone(title, myDate, org, repo)
              res.reply("Milestone successfully created at 'https://github.com/"+org+"/"+repo+"/milestones")
            }
        } else {
          closeMilestone(title, org, repo)
          res.reply("Milestone successfully closed at 'https://github.com/"+org+"/"+repo+"/milestones")
        }
    })
    robot.hear(/bot (?:create|close) milestone all "([^"]+)"/i, (res) => {
        let message = res.message.text
        message = message.split(' ')
        let title = res.match[1]
        if(message[1] ==="create") {
            let myDate = moment(title, 'DD-MMM-YYYY').toDate()
            if(moment(myDate, moment.ISO_8601, true).isValid()){
              let titleWithSprint = "Sprint - "+title
              createMilestone(titleWithSprint, myDate)
              res.reply("Milestone successfully created")
            } else {
              createMilestone(title, myDate)
              res.reply("Milestone successfully created")
            }
        } else {
            closeMilestone(title)
            res.reply("Milestones successfully closed")
        }
    })
    
    robot.hear(/bot issue "([^"]+)"(?: (?:about|regarding|re|body|description) "([^"]+)")?(?: in "([\w\d-_]+)(?:\/([\w\d-_]+))?")/i, (res) => {
        let title = res.match[1]
        let body = res.match[2]
        let org = res.match[3]
        let repo = res.match[4]
        createIssue(title, body, org, repo)
        res.reply("Issue created at 'https://github.com/"+org+"/"+repo+"/issues")
    })

    robot.hear(/bot help|bot/i, (res) => {
        let message = res.message.text
        message = message.split(' ')
        if(message.length === 1 && (message[0] === "bot" || message[0] === "/bot")){
            const getMarkdown = fs.readFileSync(path.join(__dirname, '../docs/help.md'), 'utf8')
            res.reply(getMarkdown)         
        }
        else if(message.length == 2 && (message[0] === "bot" && message[1] === "help") || (message[0] === "/bot" && message[1] === "help")){
            const getMarkdown = fs.readFileSync(path.join(__dirname, '../docs/help.md'), 'utf8')
            res.reply(getMarkdown)          
        }
    })
    
    robot.hear(/bot todos/i, (res) => {
        let message = res.message.text
        message = message.split(' ')
        if(message.length === 2) {
            res.reply("https://docs.google.com/spreadsheets/d/"+process.env.GOOGLE_WORKSHEET)
        }
    })
    robot.hear(/bot links/i, (res) => {
        let message = res.message.text
        message = message.split(' ')
        if(message.length === 2) {
            res.reply("https://docs.google.com/spreadsheets/d/"+process.env.GOOGLE_WORKSHEET+"#gid=1977716389")
        }
    })
    robot.hear(/bot standups/i, (res) => {
        let message = res.message.text
        message = message.split(' ')
        if(message.length === 2) {
            res.reply("https://docs.google.com/spreadsheets/d/"+process.env.GOOGLE_WORKSHEET+"#gid=1440664551")
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
