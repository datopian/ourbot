import GoogleSpreadsheet from 'google-spreadsheet'
import async from 'async'

let doc
let worksheetinfo

const setAuth = (key, callback) => { // eslint-disable-line func-names
  doc = new GoogleSpreadsheet(key)
  async.series([
    function setAuth(step) { // eslint-disable-line func-names
      doc.useServiceAccountAuth({
        private_key: process.env.GOOGLE_PRIVATE_KEY, // eslint-disable-line camelcase
        client_email: process.env.GOOGLE_CLIENT_EMAIL // eslint-disable-line camelcase
      }, step)
    },
    function getInfoAndWorksheets(step) { // eslint-disable-line func-names
      doc.getInfo((err, info) => {
        worksheetinfo = info
        step(null, worksheetinfo)
      })
    }
  ], callback)
}

const addRow = (id, row, callback) => {
  doc.addRow(id, row, (err, info) => {
    if (err) {
      console.log(err)
    }
    callback(err, info)
  })
}

exports.gdocs = {
  setAuth,
  addRow
}
