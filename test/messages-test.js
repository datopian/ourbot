import async from 'async'
import chai from 'chai'
import sinon from 'sinon'
let messages = require('../scripts/messages.js').messages


describe('Google Docs and Gists Logging', function () {
    it('Google Docs messaging', function () {
        let message = {
            "text": "+todo testing @test",
            "user": {
                "name": "test"
            }
        }
        sinon.stub(messages, "sendMessage", function () {
            return "0"
        })

        messages.sendMessage(message, "dest", function (inf) {})

        sinon.assert.calledOnce(messages.sendMessage)

    })

    it('Gist messaging', function () {
        let message = {
            "text": "+todo testing @test",
            "user": {
                "name": "test"
            }
        }
        sinon.stub(messages, "sendGist", function () {
            return "0"
        })

        messages.sendGist(message, "dest", function (inf) {})

        sinon.assert.calledOnce(messages.sendGist)
    })
})
