import GoogleSpreadsheet from 'google-spreadsheet';
import * as creds from '../config.json';
import async from 'async';

let doc = new GoogleSpreadsheet(creds.workSheet)
let worksheetinfo

var setAuth = function () {
    async.series([
        function setAuth(step) {
            doc.useServiceAccountAuth(creds, step);
        },
        function getInfoAndWorksheets(step) {
            doc.getInfo(function(err, info) {
                worksheetinfo = info
                step()
            });
        },
    ]);
}

var sendMessage = function (message) {
    var messageObj = formatMessage(message)
    if (messageObj) {
        doc.addRow(worksheetinfo.worksheets[0].id, messageObj, function (err, info) {
            if (err) console.log(err)
            return "Got it!"
        })
    }
    return "Specify parameters"
}

var formatMessage = function (message) {
    var messageText = message.text.indexOf(' ')+1
    var msg = message.text.substr(messageText)
    if (!messageText) return null
    var assignees = message.text.substr(messageText).match(/@[^*\s]+/)
    if (!assignees)
      assignees = "none"
    else {
      assignees = assignees[0].trim()
      msg = message.text.substr(messageText).replace(assignees, '').trim()
    }

    var name = message.user.name.substr(0, message.user.name.indexOf(' '))

    return {
        "action": message.text.substr(1, messageText-2),
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
