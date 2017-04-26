import Gists from 'gists';
import Gitter from 'node-gitter';
let formatting = require('./formatting.js').formatting
let gdocs = require('./gdocs.js').gdocs

let gitter = new Gitter(process.env.HUBOT_GITTER2_TOKEN)

let gists = new Gists({
    username: process.env.GIST_USERNAME,
    password: process.env.GIST_PASSWORD
})

let sendGist = (message, dest, callback) => {
    gists.download({id: dest }, function(err, res) {
        formatGist(message, function (data) {
            gists.edit({"description": "the description for this gist", "files": {"log.txt": { "content": res.files["log.txt"].content + "\n" + data }}, "id": dest }, function (err, inf) {
                callback({"updated": res.updated_at})
            })
        })
    });
}

let sendMessage = (message, dest, callback) => {
    formatMessage(message, function (res) {
        gdocs.setAuth(dest, function (err, info) {
            if(!err) {
                gdocs.addRow(info[1].worksheets[0].id, res, function (err, info) {
                    if (err) console.log(err)
                    callback(info)
                })
            }
        })
    })
}

let formatGist = (message, callback) => {
    let action = formatting.getDataMask(message.text, /\+[^*\s]+/)
    let assignees = formatting.getDataMask(message.text, /@[^*\s]+/)
    let name = formatting.getName(message.user.name)
    let msg = formatting.removeFromMessage(message.text, action)

    formatting.getRoom(message.room).then(function (room) {
        callback(action.substr(1) + "," + new Date().toISOString() + "," + "@" + message.user.login + " ("+ name +")" + "," + room.name +"," + assignees + "," + formatting.removeFromMessage(msg, assignees))
    })
}

let formatMessage = (message, callback) => {
    let action = formatting.getDataMask(message.text, /\+[^*\s]+/)
    let assignees = formatting.getDataMask(message.text, /@[^*\s]+/)
    let name = formatting.getName(message.user.name)
    let msg = formatting.removeFromMessage(message.text, action)

    formatting.getRoom(message.room).then(function (room) {
        callback({
            "action": action.substr(1),
            "timestamp": new Date().toISOString(),
            "poster": "@" + message.user.login + " ("+ name +")",
            "assignees": assignees,
            "message": formatting.removeFromMessage(msg, assignees),
            "room": room.name
        })
    })
}


exports.messages = {
    sendMessage: sendMessage,
    sendGist: sendGist,
    formatMessage: formatMessage,
    formatGist: formatGist
};
