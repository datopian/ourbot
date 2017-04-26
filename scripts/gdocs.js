import GoogleSpreadsheet from 'google-spreadsheet';
import * as creds from '../config.json';
import async from 'async';

let doc
let worksheetinfo

let setAuth = (key, callback) => {
    doc = new GoogleSpreadsheet(key)
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

let addRow = (id, row, callback) => {
    doc.addRow(id, row, function (err, info) {
        if (err) console.log(err)
        callback(err, info)
    })
}

exports.gdocs = {
    setAuth: setAuth,
    addRow: addRow
}
