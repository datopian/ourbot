import GoogleSpreadsheet from 'google-spreadsheet';
import * as creds from '../config.json';
import async from 'async';

let doc = new GoogleSpreadsheet(process.env.WORKSHEET)
let worksheetinfo

let setAuth = function (callback) {
    async.series([
        function setAuth(step) {
            doc.useServiceAccountAuth({
                "private_key": process.env.PRIVATE_KEY,
                "client_email": process.env.CLIENT_EMAIL
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

let sendMessage = function (message, callback) {
    let messageObj = formatMessage(message)
    if (messageObj) {

        doc.addRow(worksheetinfo.worksheets[0].id, messageObj, function (err, info) {
            if (err) console.log(err)
            callback(info)
        })
    }
    return "Specify parameters"
}

let formatMessage = function (message) {
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

    return {
        "action": action.trim().substring(1),
        "timestamp": new Date().toISOString(),
        "poster": "@" + message.user.login + " ("+ name +")",
        "assignees": assignees,
        "message": msg
    }
}

exports.messages = {
    setAuth: setAuth,
    sendMessage: sendMessage
};
