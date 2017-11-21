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
  const {createMilestone, closeMilestone, listMilestones} = require('./milestone.js')
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
                if (message === '+outcome') {
                  messages[config.docs[ref].fun](res.message, config.docs[ref].dest, info => {
                    console.log('Added at: ' + info['app:edited'])
                    res.reply('Outcome recorded: your score was ' + info.total + '/10')
                  })
                } else {
                  messages[config.docs[ref].fun](res.message, config.docs[ref].dest, info => {
                    console.log('Added at: ' + info['app:edited'])
                    res.reply(message + ' recorded')
                  })
                }
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
        createMilestone(titleWithSprint, myDate, org, repo).then(info => {
          res.reply('Milestone successfully created at https://github.com/' + org + '/' + repo + '/milestone/' + info.data.number)
        })
      } else {
        createMilestone(title, myDate, org, repo).then(info => {
          res.reply('Milestone successfully created at https://github.com/' + org + '/' + repo + '/milestone/' + info.data.number)
        })
      }
    } else {
      let myDate = moment(title, 'DD-MMM-YYYY').toDate()
      myDate = moment(myDate, 'DD-MM-YYYY')
      if (moment(myDate, moment.ISO_8601, true).isValid()) {
        const titleWithSprint = 'Sprint - ' + title
        closeMilestone(titleWithSprint, org, repo).then(info => {
          res.reply('Milestone successfully closed at https://github.com/' + org + '/' + repo + '/milestone/' + info.data.number)
        })
      } else {
        closeMilestone(title, org, repo).then(info => {
          res.reply('Milestone successfully closed at https://github.com/' + org + '/' + repo + '/milestone/' + info.data.number)
        })
      }
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
      let myDate = moment(title, 'DD-MMM-YYYY').toDate()
      myDate = moment(myDate, 'DD-MM-YYYY')
      if (moment(myDate, moment.ISO_8601, true).isValid()) {
        const titleWithSprint = 'Sprint - ' + title
        closeMilestone(titleWithSprint)
        res.reply('Milestones successfully closed')
      } else {
        closeMilestone(title)
        res.reply('Milestones successfully closed')
      }
    }
  })

  robot.hear(/bot issue "([^"]+)" about "([^"]+)" in "([\w\d-_]+)(?:\/([\w\d-_]+))?" to "([^"]+)"|bot issue "([^"]+)" about "([^"]+)" in "([\w\d-_]+)(?:\/([\w\d-_]+))?"/i, res => {
    if (res.match[5]) {
      const title = res.match[1]
      const body = res.match[2]
      const org = res.match[3]
      const repo = res.match[4]
      const milestoneTitle = res.match[5]
      listMilestones(org, repo).then(info => {
        info.data.forEach(milestones => {
          if (milestones.title === milestoneTitle) {
            const milestone = milestones.number
            createIssue(title, body, org, repo, milestone).then(info => {
              res.reply('Issue created at https://github.com/' + org + '/' + repo + '/issues/' + info.data.number)
            })
          }
        })
      })
    } else {
      const title = res.match[6]
      const body = res.match[7]
      const org = res.match[8]
      const repo = res.match[9]
      const milestoneTitle = 'Backlog'
      listMilestones(org, repo).then(info => {
        info.data.forEach(milestones => {
          if (milestones.title === milestoneTitle) {
            const milestone = milestones.number
            createIssue(title, body, org, repo, milestone).then(info => {
              res.reply('Issue created at https://github.com/' + org + '/' + repo + '/issues/' + info.data.number)
            })
          }
        })
      })
    }
  })

  robot.hear(/bot issue "([^"]+)" in "([\w\d-_]+)(?:\/([\w\d-_]+))?" to "([^"]+)"|bot issue "([^"]+)" in "([\w\d-_]+)(?:\/([\w\d-_]+))?"/i, res => {
    const body = ''
    if (res.match[4]) {
      const title = res.match[1]
      const org = res.match[2]
      const repo = res.match[3]
      const milestoneTitle = res.match[4]
      listMilestones(org, repo).then(info => {
        info.data.forEach(milestones => {
          if (milestones.title === milestoneTitle) {
            const milestone = milestones.number
            createIssue(title, body, org, repo, milestone).then(info => {
              res.reply('Issue created at https://github.com/' + org + '/' + repo + '/issues/' + info.data.number)
            })
          }
        })
      })
    } else {
      const title = res.match[5]
      const org = res.match[6]
      const repo = res.match[7]
      const milestoneTitle = 'Backlog'
      listMilestones(org, repo).then(info => {
        info.data.forEach(milestones => {
          if (milestones.title === milestoneTitle) {
            const milestone = milestones.number
            createIssue(title, body, org, repo, milestone).then(info => {
              res.reply('Issue created at https://github.com/' + org + '/' + repo + '/issues/' + info.data.number)
            })
          }
        })
      })
    }
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

  robot.hear(/bot todos|bot standups|bot links|bot promises|bot integrities|bot outcomes|bot feedback/i, res => {
    const tags = [
      {tag: '+todo', command: 'todos'},
      {tag: '+standup', command: 'standups'},
      {tag: '+link', command: 'links'},
      {tag: '+promise', command: 'promises'},
      {tag: '+integrity', command: 'integrities'},
      {tag: '+outcome', command: 'outcomes'},
      {tag: '+feedback', command: 'feedback'}
    ]
    const message = res.message.text.split(' ')
    tags.forEach(tag => {
      if (tag.command === message[1]) {
        let key
        let ref
        for (key in config.monitor) {
          if (key === tag.tag) {
            formatting.getRoom(res.message.room).then(room => {
              for (let i = 0; i < config.monitor[tag.tag].dest.length; i++) {
                ref = config.monitor[tag.tag].dest[i]
                if (room.group.name === config.docs[ref].room) {
                  const gdoc = config.docs[ref].dest
                  gdocs.setAuth(gdoc, (err, info) => {
                    if (!err) {
                      info[1].worksheets.forEach(worksheet => {
                        if ('bot ' + worksheet.title === res.message.text) {
                          const glink = worksheet._links['http://schemas.google.com/visualization/2008#visualizationApi']
                          let gid = glink.split('?')
                          gid = gid[1]
                          switch (worksheet.title | res.message.text) {
                            case 'todos' | 'bot todos' :
                              res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                              break
                            case 'standups' | 'bot standups' :
                              break
                            case 'links' | 'bot links' :
                              res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                              break
                            case 'integrities' | 'bot integrities' :
                              res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                              break
                            case 'promises' | 'bot promises':
                              res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                              break
                            case 'outcomes' | 'bot outcomes':
                              res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                              break
                            case 'feedback' | 'bot feedback':
                              res.reply('https://docs.google.com/spreadsheets/d/' + gdoc + '#' + gid)
                              break
                            default:
                              break
                          }
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
  })
  robot.error((err, res) => {
    console.log(err)
    robot.logger.error('DOES NOT COMPUTE')

    if (res !== null) {
      res.reply('DOES NOT COMPUTE')
    }
  })
}
