import Helper from 'hubot-test-helper'
import chai from 'chai'
import sinon from 'sinon'
import assert from 'assert'
let messages = require('../scripts/messages.js').messages
let formatting = require('../scripts/formatting.js').formatting
let milestone = require('../scripts/milestone.js')
let issue = require('../scripts/issue.js')

let expect = chai.expect

let scriptHelper = new Helper('./scripts/specific-script.coffee')
let helper = new Helper('../scripts/main.js')

describe('Messages parsing', function () {
    let msg
    let room
    let sendMsg
    let sendGst
    let getRoom
    let createIssue
    let createMilestone
    let closeMilestone
    beforeEach(function () {
        createIssue = sinon.stub(issue, "createIssue")
        createMilestone = sinon.stub(milestone, "createMilestone")
        closeMilestone = sinon.stub(milestone, "closeMilestone")
        sendMsg = sinon.stub(messages, "sendMessage")
        sendGst = sinon.stub(messages, "sendGist")
        getRoom = sinon.stub(formatting, 'getRoom').resolves({"name": "test"})
        room = helper.createRoom()
        msg = "+todo do @test this one"
    })

    afterEach(function () {
        room.destroy()
        createIssue.restore()
        createMilestone.restore()
        closeMilestone.restore()
        sendMsg.restore()
        sendGst.restore()
        getRoom.restore()
    })
    it('create issue', function () {
        return room.user.say('mikanebu', `bot issue "This is test issue" about "We want to test" in "datahq/docs""`).then(function () {
            assert.equal(createIssue.callCount, 1)
            assert.equal(room.messages[1][1].substr(0, 15), "@mikanebu Issue")
        })
    })
    it('+standup', function () {
        return room.user.say('mikanebu', "+standup blocker: none, last24: test next24: test").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })
    it('return +standups gdocs url', function () {
      return room.user.say('mikanebu', "bot standups").then(function () {
        assert.equal(room.messages[1][1].substr(0, 14), "@mikanebu http")
        assert.equal((room.messages).length, 2)
      })
    })
    it('+link in the beginning', function () {
        return room.user.say('weirdguy', "+link do this one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })
    it('+link in the middle', function () {
        return room.user.say('weirdguy', "do this +link one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })
    it('+link in the end', function () {
        return room.user.say('weirdguy', "do this one +link").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })
    it('create milestone', function () {
        return room.user.say('mikanebu', `bot create milestone "13 Jan 2018" in "datahq/docs"`).then(function () {
            assert.equal(createMilestone.callCount, 1)
        })
    })
    it('create milestone with typo', function () {
        return room.user.say('mikanebu', `bot create milestones in "13 Jan 2018" in "datahq/docs"`).then(function () {
            assert.equal(createMilestone.callCount, 0)
        })
    })
    it('create milestone with invalid format', function () {
        return room.user.say('mikanebu', `bot milestone "13 Jan 2018" in "datahq/docs"`).then(function () {
            assert.equal(createMilestone.callCount, 0)
        })
    })

    it('create milestone all', function () {
        return room.user.say('mikanebu', `bot create milestone all "13 Jan 2018"`).then(function () {
            assert.equal(createMilestone.callCount, 1)
        })
    })
    it('create milestone all with typo', function () {
        return room.user.say('mikanebu', `bot created milestone all "13 Jan 2018"`).then(function () {
            assert.equal(createMilestone.callCount, 0)
        })
    })
    it('close milestone', function () {
        return room.user.say('mikanebu', `bot close milestone "13 Jan 2018" in "datahq/docs"`).then(function () {
            assert.equal(closeMilestone.callCount, 1)
        })
    })
    it('close milestone with typo', function () {
        return room.user.say('mikanebu', `bot2 close milestone "13 Jan 2018" in "datahq/docs"`).then(function () {
            assert.equal(closeMilestone.callCount, 0)
        })
    })
    it('close milestone with invalid format', function () {
        return room.user.say('mikanebu', `bot close milestone test "13 Jan 2018" in "datahq/docs"`).then(function () {
            assert.equal(closeMilestone.callCount, 0)
        })
    })
    it('close milestone all', function () {
        return room.user.say('mikanebu', `bot close milestone all "13 Jan 2018"`).then(function () {
            assert.equal(closeMilestone.callCount, 1)
        })
    })
    it('close milestone all with typo', function () {
        return room.user.say('mikanebu', `bot closing milestone "13 Jan 2018"`).then(function () {
            assert.equal(createMilestone.callCount, 0)
        })
    })
    it('create milestone all with invalid format', function () {
        return room.user.say('mikanebu', `bot milestone close "13 Jan 2018"`).then(function () {
            assert.equal(createMilestone.callCount, 0)
        })
    })
    it('return +todo gdocs url', function () {
      return room.user.say('mikanebu', "bot todos").then(function () {
        assert.equal(room.messages[1][1].substr(0, 14), "@mikanebu http")
        assert.equal((room.messages).length, 2)
      })
    })
    it('return +link gdocs url', function () {
      return room.user.say('mikanebu', "bot links").then(function () {
        assert.equal(room.messages[1][1].substr(0, 14), "@mikanebu http")
        assert.equal((room.messages).length, 2)
      })
    })
    it('starting with bot should reply help message', function () {
      return room.user.say('mikanebu', "bot help").then(function () {
        assert.equal(room.messages[1][1].substr(0, 22), "@mikanebu ### Commands")
        assert.equal((room.messages).length, 2)
      })
    })

    it('starting with /bot should reply help message', function () {
      return room.user.say('mikanebu', "/bot help").then(function () {
        assert.equal(room.messages[1][1].substr(0, 22), "@mikanebu ### Commands")
        assert.equal((room.messages).length, 2)
      })
    })

    it('only word bot should reply help message', function () {
      return room.user.say('mikanebu', "bot").then(function () {
        assert.equal(room.messages[1][1].substr(0, 22), "@mikanebu ### Commands")
        assert.equal((room.messages).length, 2)
      })
    })

    it('only word /bot should reply help message', function () {
      return room.user.say('mikanebu', "/bot").then(function () {
        assert.equal(room.messages[1][1].substr(0, 22), "@mikanebu ### Commands")
        assert.equal((room.messages).length, 2)
      })
    })

    it('containing not only bot should not reply help message', function () {
      return room.user.say('mikanebu', "bot test").then(function () {
        assert.equal((room.messages).length, 1)
      })
    })

    it('ending with bot should not reply help message', function () {
      return room.user.say('mikanebu', "our friend is bot").then(function () {
        assert.equal((room.messages).length, 1)
      })
    })

    it('having bot in the middle of sentence should not reply help message', function () {
      return room.user.say('mikanebu', "this is our bot for DataHub").then(function () {
        assert.equal((room.messages).length, 1)
      })
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
    it('Message Formatting, without assignees', function () {
        messages.formatMessage({"text": "do this +todo", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.assignees, "@test (Test)")
        })
    })

    it('Gist formatting', function () {
        messages.formatGist({"text": "+todo do this", "user": {"login":"test", "name": "Test (@Test)"}, "room": "sadqwewqeqw"}, function (res) {
            assert.equal(res.substr(0, 5), "todo,")
        })
    })

    it('Typo in tag', function () {
        return room.user.say('weirdguy', "+tod do this one").then(function () {
            assert.equal(sendMsg.callCount, 0)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Without typo in tag', function () {
        return room.user.say('weirdguy', "+todo do this one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Without any tag', function () {
        return room.user.say('weirdguy', "do this one").then(function () {
            assert.equal(sendMsg.callCount, 0)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Tag in middle', function () {
        return room.user.say('weirdguy', "do +todo this one").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })

    it('Tag in the end', function () {
        return room.user.say('weirdguy', "do this one +todo").then(function () {
            assert.equal(sendMsg.callCount, 1)
            assert.equal(sendGst.callCount, 0)
        })
    })
});