// Description:
//   Example scripts for you to examine and try out.
//
// Notes:
//   They are commented out by default, because most of them are pretty silly and
//   wouldn't be useful and amusing enough for day to day huboting.
//   Uncomment the ones you want to try and experiment with.
//
//   These are from the scripting documentation: https://github.com/github/hubot/blob/master/docs/scripting.md

module.exports = robot => {
  const config = require('../config.json')
  const messages = require('./messages.js').messages
  const formatting = require('./formatting.js').formatting
  const {createMilestone, closeMilestone} = require('./milestone.js')
  const {createIssue} = require('./issue.js')
  const moment = require('moment')
  const fs = require('fs')
  const path = require('path')
  const gdocs = require('./gdocs.js').gdocs
  robot.hear(/.*/i, res => {
    let key
    let ref
    const message = formatting.getDataMask(res.message.text, /\+[^*\s]+/)
    for (key in config.monitor) {
      if (message !== null) {
        if (key === message) {
          formatting.getRoom(res.message.room).then(room => {
            for (let i = 0; i < config.monitor[message].dest.length; i++) {
              ref = config.monitor[message].dest[i]
              if (room.group.name === config.docs[ref].room) {
                messages[config.docs[ref].fun](res.message, config.docs[ref].dest, info => {
                  console.log('Added at: ' + info['app:edited'])
                })
              }
            }
          })
        }
      }
    }
  })

  robot.hear(/bot (?:create|close) milestone "([^"]+)"(?: in "([\w\d-_]+)(?:\/([\w\d-_]+))?")/i, res => {
    let message = res.message.text
    message = message.split(' ')
    const title = res.match[1]
    const org = res.match[2]
    const repo = res.match[3]
    if (message[1] === 'create') {
      let myDate = moment(title, 'DD-MMM-YYYY').toDate()
      myDate = moment(myDate, 'DD-MM-YYYY').add(1, 'days')
      if (moment(myDate, moment.ISO_8601, true).isValid()) {
        const titleWithSprint = 'Sprint - ' + title
        createMilestone(titleWithSprint, myDate, org, repo)
        res.reply('Milestone successfully created at \'https://github.com/' + org + '/' + repo + '/milestones')
      } else {
        createMilestone(title, myDate, org, repo)
        res.reply('Milestone successfully created at \'https://github.com/' + org + '/' + repo + '/milestones')
      }
    } else {
      closeMilestone(title, org, repo)
      res.reply('Milestone successfully closed at \'https://github.com/' + org + '/' + repo + '/milestones')
    }
  })

  robot.hear(/bot (?:create|close) milestone all "([^"]+)"/i, res => {
    let message = res.message.text
    message = message.split(' ')
    const title = res.match[1]
    if (message[1] === 'create') {
      let myDate = moment(title, 'DD-MMM-YYYY').toDate()
      myDate = moment(myDate, 'DD-MM-YYYY').add(1, 'days')
      if (moment(myDate, moment.ISO_8601, true).isValid()) {
        const titleWithSprint = 'Sprint - ' + title
        createMilestone(titleWithSprint, myDate)
        res.reply('Milestone successfully created')
      } else {
        createMilestone(title, myDate)
        res.reply('Milestone successfully created')
      }
    } else {
      closeMilestone(title)
      res.reply('Milestones successfully closed')
    }
  })

  robot.hear(/bot issue "([^"]+)"(?: (?:about|regarding|re|body|description) "([^"]+)")?(?: in "([\w\d-_]+)(?:\/([\w\d-_]+))?")/i, res => {
    const title = res.match[1]
    const body = res.match[2]
    const org = res.match[3]
    const repo = res.match[4]
    createIssue(title, body, org, repo)
    res.reply('Issue created at \'https://github.com/' + org + '/' + repo + '/issues')
  })

  robot.hear(/bot help|bot/i, res => {
    let message = res.message.text
    message = message.split(' ')
    if (message.length === 1 && (message[0] === 'bot' || message[0] === '/bot')) {
      const getMarkdown = fs.readFileSync(path.join(__dirname, '../docs/help.md'), 'utf8')
      res.reply(getMarkdown)
    // eslint-disable-next-line no-mixed-operators
    } else if (message.length === 2 && (message[0] === 'bot' && message[1] === 'help') || (message[0] === '/bot' && message[1] === 'help')) {
      const getMarkdown = fs.readFileSync(path.join(__dirname, '../docs/help.md'), 'utf8')
      res.reply(getMarkdown)
    }
  })

  robot.hear(/bot todos|bot standups|bot links/i, res => {
    let key
    let ref
    let message = res.message.text.split(' ')
    message = '+' + message[1].substring(0, message[1].length - 1)
    for (key in config.monitor) {
      if (message !== null) {
        if (key === message) {
          formatting.getRoom(res.message.room).then(room => {
            for (let i = 0; i < config.monitor[message].dest.length; i++) {
              ref = config.monitor[message].dest[i]
              if (room.group.name === config.docs[ref].room) {
                const gdoc = config.docs[ref].dest
                gdocs.setAuth(gdoc, (err, info) => {
                  if (!err) {
                    info[1].worksheets.forEach(worksheet => {
                      if (worksheet.title === 'todos' && res.message.text === 'bot todos') {
                        const glink = worksheet._links['http://schemas.google.com/visualization/2008#visualizationApi']
                        let gid = glink.split('?')
                        gid = gid[1]
                        res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                      } else if (worksheet.title === 'standups' && res.message.text === 'bot standups') {
                        const glink = worksheet._links['http://schemas.google.com/visualization/2008#visualizationApi']
                        let gid = glink.split('?')
                        gid = gid[1]
                        res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                      } else if (worksheet.title === 'links' && res.message.text === 'bot links') {
                        const glink = worksheet._links['http://schemas.google.com/visualization/2008#visualizationApi']
                        let gid = glink.split('?')
                        gid = gid[1]
                        res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                      }
                    })
                  } else {
                    console.log(err)
                  }
                })
              }
            }
          })
        }
      }
    }
  })
  robot.error((err, res) => {
    console.log(err)
    robot.logger.error('DOES NOT COMPUTE')

    if (res !== null) {
      res.reply('DOES NOT COMPUTE')
    }
  })
}
