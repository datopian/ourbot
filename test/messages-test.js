import Gists from 'gists'
import Gitter from 'node-gitter'
import Github from 'github-base'
import async from 'async'
import chai from 'chai'
import assert from 'assert'
import sinon from 'sinon'
let messages = require('../scripts/messages.js').messages
let formatting = require('../scripts/formatting.js').formatting
let gdocs = require('../scripts/gdocs.js').gdocs

describe('Google Docs and Gists Logging', function () {
    let format
    let auth
    let gitGist
    let gitGistPatch
    let gDoc
    beforeEach(function () {
        format = sinon.stub(formatting, "getRoom").resolves({"name": "test"})
        auth = sinon.stub(async, "series").callsFake(function (arr, cb) {
            cb(null, [null, {"worksheets":[{"id":"1"}]}])
        })

        gitGist = sinon.stub(Github.prototype, "get").callsFake(function (path, data, cb) {
            cb(null, {"files":{"log.txt":{"content": "hello"}}, "updated_at": "yes"})
        })
        gitGistPatch = sinon.stub(Github.prototype, "patch").callsFake(function (path, data, cb) {
            cb({"updated_at": "yes"})
        })

        gDoc = sinon.stub(gdocs, "addRow").callsFake(function (id, row, callback) {
            callback(null, "Done")
        })
    })

    afterEach(function () {
        format.restore()
        auth.restore()
        gitGist.restore()
        gitGistPatch.restore()
        gDoc.restore()
    })

    it('Gist sending', function () {
        messages.sendGist({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, "me", function (info) {
            assert.equal(info.updated, "yes")
        })
    })

    it('GDoc sending', function () {
        messages.sendMessage({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, "me", function (info) {
            assert.equal(info, "Done")
        })
    })

})
