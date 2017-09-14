import Gists from 'gists'

const formatting = require('./formatting.js').formatting
const gdocs = require('./gdocs.js').gdocs

const gists = new Gists({
  username: process.env.GIST_USERNAME,
  password: process.env.GIST_PASSWORD
})

const sendGist = (message, dest, callback) => {
  gists.download({id: dest}, (err, res) => {
    formatGist(message, data => {
      gists.edit({description: 'the description for this gist', files: {'log.txt': {content: res.files['log.txt'].content + '\n' + data}}, id: dest}, (err, inf) => { // eslint-disable-line no-unused-vars
        callback({updated: res.updated_at})
      })
    })
  })
}

const sendMessage = (message, dest, callback) => {
  formatMessage(message, res => {
    gdocs.setAuth(dest, (err, info) => {
      if (!err) {
        info[1].worksheets.forEach(worksheet => {
          if (res.action === 'todo' && worksheet.title === 'todos') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'link' && worksheet.title === 'links') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          } else if (res.action === 'standup' && worksheet.title === 'standups') {
            gdocs.addRow(worksheet.id, res, (err, info) => {
              if (err) {
                console.log(err)
              }
              callback(info)
            })
          }
        })
      } else {
        console.log(err)
      }
    })
  })
}

const formatGist = (message, callback) => {
  const action = formatting.getDataMask(message.text, /\+[^*\s]+/)
  const assignees = formatting.getDataMask(message.text, /@[^*\s]+/)
  const name = formatting.getName(message.user.name)
  const msg = formatting.removeFromMessage(message.text, action)

  formatting.getRoom(message.room).then(room => {
    // eslint-disable-next-line no-useless-concat
    callback(action.substr(1) + ',' + new Date().toISOString() + ',' + '@' + message.user.login + ' (' + name + ')' + ',' + room.name + ',' + assignees + ',' + formatting.removeFromMessage(msg, assignees))
  })
}

const formatMessage = (message, callback) => {
  const action = formatting.getDataMask(message.text, /\+[^*\s]+/)
  let assignees = formatting.getDataMask(message.text, /@[^*\s]+/)
  const name = formatting.getName(message.user.name)
  const poster = '@' + message.user.login + ' (' + name + ')'
  if (assignees === '') {
    assignees = poster
  }
  const msg = formatting.removeFromMessage(message.text, action)
  formatting.getRoom(message.room).then(room => {
    callback({
      action: action.substr(1),
      timestamp: new Date().toISOString(),
      poster,
      assignees,
      message: formatting.removeFromMessage(msg, assignees),
      room: room.name,
      standup: formatting.removeFromMessage(msg, assignees)
    })
  })
}

exports.messages = {
  sendMessage,
  sendGist,
  formatMessage,
  formatGist
}
