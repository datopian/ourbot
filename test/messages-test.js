/* eslint-env mocha */
import assert from 'assert'
import Github from 'github-base'
import async from 'async'
import sinon from 'sinon'

const messages = require('../scripts/messages.js').messages
const formatting = require('../scripts/formatting.js').formatting
const gdocs = require('../scripts/gdocs.js').gdocs

describe('Google Docs and Gists Logging', () => {
  let format
  let auth
  let gitGist
  let gitGistPatch
  let gDoc
  beforeEach(() => {
    format = sinon.stub(formatting, 'getRoom').resolves({name: 'test'})
    auth = sinon.stub(async, 'series').callsFake((arr, cb) => {
      cb(null, [null, {worksheets: [{id: '1'}]}])
    })

    gitGist = sinon.stub(Github.prototype, 'get').callsFake((path, data, cb) => {
      cb(null, {files: {'log.txt': {content: 'hello'}}, updated_at: 'yes'}) // eslint-disable-line camelcase
    })
    gitGistPatch = sinon.stub(Github.prototype, 'patch').callsFake((path, data, cb) => {
      cb({updated_at: 'yes'}) // eslint-disable-line camelcase
    })

    gDoc = sinon.stub(gdocs, 'addRow').callsFake((id, row, callback) => {
      callback(null, 'Done')
    })
  })

  afterEach(() => {
    format.restore()
    auth.restore()
    gitGist.restore()
    gitGistPatch.restore()
    gDoc.restore()
  })

  it('Gist sending', () => {
    messages.sendGist({text: '+todo do this', user: {login: 'test', name: 'Test (@Test)'}, room: 'sadqwewqeqw'}, 'me', info => {
      assert.equal(info.updated, 'yes')
    })
  })

  it('GDoc sending', () => {
    messages.sendMessage({text: '+todo do this', user: {login: 'test', name: 'Test (@Test)'}, room: 'sadqwewqeqw'}, 'me', info => {
      assert.equal(info, 'Done')
    })
  })
})
