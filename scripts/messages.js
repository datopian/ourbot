import GoogleSpreadsheet from 'google-spreadsheet';
import * as creds from '../config.json';
import async from 'async';
import Gists from 'gists';
import Gitter from 'node-gitter';

let doc
let worksheetinfo

let gitter = new Gitter(process.env.HUBOT_GITTER2_TOKEN)

let gists = new Gists({
    username: process.env.GIST_USERNAME,
    password: process.env.GIST_PASSWORD
})



let setAuth = function (callback) {
    async.series([
        function setAuth(step) {
            doc.useServiceAccountAuth({
                "private_key": process.env.GOOGLE_PRIVATE_KEY,
                "client_email": process.env.GOOGLE_CLIENT_EMAIL
            }, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
                worksheetinfo = info
                step(null, worksheetinfo)
            });
        }
    ], callback);
}

let sendGist = function (message, dest, callback) {
    gists.download({id: dest }, function(err, res) {
        gists.edit({"description": "the description for this gist", "files": {"log.txt": { "content": res.files["log.txt"].content + "\n" + formatGist(message) }}, "id": dest }, function (err, inf) {
            callback({"updated": res.updated_at})
        })
    });
}

let sendMessage = function (message, dest, callback) {
    doc = new GoogleSpreadsheet(dest)
    setAuth(function (err, info) {
        console.log(err)
        if(!err) {
            let messageObj = formatMessage(message, function (res) {
                doc.addRow(worksheetinfo.worksheets[0].id, res, function (err, info) {
                    if (err) console.log(err)
                    callback(info)
                })
            })
            return "Specify parameters"
        }
    })
}

let formatGist = function (message) {
    let msg = message.text
    let action = message.text.match(/\+[^*\s]+/)[0]
    msg = msg.replace(action, '').trim()
    if(!msg) return null
    let assignees = message.text.match(/@[^*\s]+/)
    if (!assignees)
      assignees = "none"
    else {
      assignees = assignees[0].trim()
      msg = msg.replace(assignees, '').trim()
    }

    let name = message.user.name.substr(0, message.user.name.indexOf(' '))

    return action.trim().substring(1) + " | " + new Date().toISOString() + " | " + "@" + message.user.login + " ("+ name +")" + " | " + assignees + " | " + msg

}

let formatMessage = function (message, callback) {
    let msg = message.text
    let action = message.text.match(/\+[^*\s]+/)[0]
    msg = msg.replace(action, '').trim()
    if(!msg) return null
    let assignees = message.text.match(/@[^*\s]+/)
    if (!assignees)
      assignees = "none"
    else {
      assignees = assignees[0].trim()
      msg = msg.replace(assignees, '').trim()
    }

    let name = message.user.name.substr(0, message.user.name.indexOf(' '))

    getRoom(message.room, function (roomid) {
        callback({
            "action": action.trim().substring(1),
            "timestamp": new Date().toISOString(),
            "poster": "@" + message.user.login + " ("+ name +")",
            "assignees": assignees,
            "message": msg,
            "room": roomid
        })
    })
}

let getRoom = function (roomId, callback) {
    gitter.rooms.find(roomId)
    .then(function(room) {
        callback(room.name)
    })
}

exports.messages = {
    setAuth: setAuth,
    sendMessage: sendMessage,
    sendGist: sendGist
};
