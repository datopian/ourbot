import Helper from 'hubot-test-helper'
import chai from 'chai'
import sinon from 'sinon'
import assert from 'assert'
let messages = require('../scripts/messages.js').messages
let formatting = require('../scripts/formatting.js').formatting

let expect = chai.expect


let helper = new Helper('../scripts/main.coffee')

describe('Messages parsing', function () {
    let msg
    let room
    let sendMsg
    let sendGst
    let getRoom
    beforeEach(function () {
        sendMsg = sinon.stub(messages, "sendMessage")
        sendGst = sinon.stub(messages, "sendGist")
        getRoom = sinon.stub(formatting, 'getRoom').resolves({"name": "test"})
        room = helper.createRoom()
        msg = "+todo do @test this one"
    })

    afterEach(function () {
        room.destroy()
        sendMsg.restore()
        sendGst.restore()
        getRoom.restore()
    })

    it('Action getting', function () {
        assert.equal(formatting.getDataMask(msg, /\+[^*\s]+/), "+todo")
    })

    it('Action remove from message', function () {
        assert.equal(formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\+[^*\s]+/)), "do @test this one")
    })

    it('Assignees getting', function () {
        assert.equal(formatting.getDataMask(msg, /\@[^*\s]+/), "@test")
    })

    it('Assignees removing from message', function () {
        assert.equal(formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\@[^*\s]+/)), "+todo do this one")
    })

    it('Action and Assignees removing from message', function () {
        let tmp = formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\@[^*\s]+/))
        assert.equal(formatting.removeFromMessage(tmp, formatting.getDataMask(tmp, /\+[^*\s]+/)), "do this one")
    })

    it('Name getting', function () {
        assert.equal(formatting.getName("Test (@test)"), "Test")
    })

    it('Message Formatting', function () {
        messages.formatMessage({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.message, "do this")
        })
    })

    it('Message Formatting, with tag in middle', function () {
        messages.formatMessage({"text": "do +todo this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.action, "todo")
        })
    })

    it('Message Formatting, with tag in the end', function () {
        messages.formatMessage({"text": "do this +todo", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.action, "todo")
        })
    })

    it('Gist formatting', function () {
        messages.formatGist({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.substr(0, 5), "todo,")
        })
    })

    it('Typo in tag', function () {
        room.user.say('weirdguy', "+tod do this one").then(function () {
            assert.equal(sendMsg.callCount, 0)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Without typo in tag', function () {
        room.user.say('weirdguy', "+todo do this one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 1)
        })
    })

    it('Without any tag', function () {
        room.user.say('weirdguy', "do this one").then(function () {
            assert.equal(sendMsg.callCount, 0)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Tag in middle', function () {
        room.user.say('weirdguy', "do +todo this one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 1)
        })
    })

    it('Tag in the end', function () {
        room.user.say('weirdguy', "do this one +todo").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 1)
        })
    })
});
