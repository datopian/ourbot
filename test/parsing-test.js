/* eslint-env mocha */
import assert from 'assert'
import Helper from 'hubot-test-helper'
import sinon from 'sinon'
import async from 'async'

const messages = require('../scripts/messages.js').messages
const formatting = require('../scripts/formatting.js').formatting
const milestone = require('../scripts/milestone.js')
const issue = require('../scripts/issue.js')

const helper = new Helper('../scripts/main.js')

describe('Messages parsing', () => {
  let auth
  let msg
  let msgStandup
  let room
  let sendMsg
  let sendGst
  let getRoom
  let createIssue
  let createMilestone
  let closeMilestone
  let listMilestones
  beforeEach(() => {
    auth = sinon.stub(async, 'series').callsFake((arr, cb) => {
      cb(null, [null, {
        worksheets: [
          {
            id: '1', title: 'todos', _links: {'http://schemas.google.com/visualization/2008#visualizationApi': 'https://docs.google.com/spreadsheets/d/1w4LBF6wbRNVynAk8cQURyz8yZCbTw5hPwcqr87S46hY/gviz/tq?gid=0'}
          },
          {
            id: '2', title: 'standups', _links: {'http://schemas.google.com/visualization/2008#visualizationApi': 'https://docs.google.com/spreadsheets/d/1w4LBF6wbRNVynAk8cQURyz8yZCbTw5hPwcqr87S46hY/gviz/tq?gid=0'}
          },
          {
            id: '3', title: 'links', _links: {'http://schemas.google.com/visualization/2008#visualizationApi': 'https://docs.google.com/spreadsheets/d/1w4LBF6wbRNVynAk8cQURyz8yZCbTw5hPwcqr87S46hY/gviz/tq?gid=0'}
          },
          {
            id: '4', title: 'promises', _links: {'http://schemas.google.com/visualization/2008#visualizationApi': 'https://docs.google.com/spreadsheets/d/1w4LBF6wbRNVynAk8cQURyz8yZCbTw5hPwcqr87S46hY/gviz/tq?gid=0'}
          },
          {
            id: '5', title: 'integrities', _links: {'http://schemas.google.com/visualization/2008#visualizationApi': 'https://docs.google.com/spreadsheets/d/1w4LBF6wbRNVynAk8cQURyz8yZCbTw5hPwcqr87S46hY/gviz/tq?gid=0'}
          }
        ]
      }])
    })
    createIssue = sinon.stub(issue, 'createIssue').resolves({data: {number: 'test'}})
    createMilestone = sinon.stub(milestone, 'createMilestone').resolves({data: {number: 'test'}})
    closeMilestone = sinon.stub(milestone, 'closeMilestone').resolves({data: {number: 'test'}})
    listMilestones = sinon.stub(milestone, 'listMilestones').resolves({data: [{title: 'Backlog'}]})
    sendMsg = sinon.stub(messages, 'sendMessage')
    sendGst = sinon.stub(messages, 'sendGist')
    getRoom = sinon.stub(formatting, 'getRoom').resolves({name: 'test', group: {name: 'Datopian'}})
    room = helper.createRoom()
    msg = '+todo do @test this \n one'
    msgStandup = '+standup \n blockers: Need a review \n last24: tested bot \n next24: will test bot'
  })

  afterEach(() => {
    auth.restore()
    room.destroy()
    createIssue.restore()
    createMilestone.restore()
    closeMilestone.restore()
    listMilestones.restore()
    sendMsg.restore()
    sendGst.restore()
    getRoom.restore()
  })
  it('create issue', () => {
    return room.user.say('mikanebu', `bot issue "This is test issue" about "We want to test" in "datahq/docs"`).then(() => {
      assert.equal(createIssue.callCount, 1)
      assert.equal(room.messages[1][1].substr(0, 15), '@mikanebu Issue')
    })
  })
  it('+standup', () => {
    return room.user.say('mikanebu', '+standup blocker: none, last24: test next24: test').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })

  it('+standup for blockers, last24, next24 blocks', () => {
    assert.equal(formatting.getStandup(msgStandup, formatting.getDataMask(msg, /\@[^*\s]+/), /(blockers:|Blockers:)((.|\n)*)(last24|last 24|Last24|Last 24)/), ' Need a review \n ') // eslint-disable-line no-useless-escape
    assert.equal(formatting.getStandup(msgStandup, formatting.getDataMask(msg, /\@[^*\s]+/), /(last24:|last 24:|Last24:|Last 24:)((.|\n)*)(next24|next 24|Next24|Next 24)/), ' tested bot \n ') // eslint-disable-line no-useless-escape
    assert.equal(formatting.getStandup(msgStandup, formatting.getDataMask(msg, /\@[^*\s]+/), /(next24:|next 24:|Next24:|Next 24:)((.|\n)*)/), ' will test bot') // eslint-disable-line no-useless-escape
  })

  it('return +standups gdocs url', () => {
    return room.user.say('mikanebu', 'bot standups').then(() => {
      assert.equal(room.messages[1][1].substr(0, 14), '@mikanebu http')
      assert.equal((room.messages).length, 2)
    })
  })
  it('+link in the beginning', () => {
    return room.user.say('weirdguy', '+link do this one').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })
  it('+link in the middle', () => {
    return room.user.say('weirdguy', 'do this +link one').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })
  it('+link in the end', () => {
    return room.user.say('weirdguy', 'do this one +link').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })
  it('+integrity check', () => {
    return room.user.say('weirdguy', 'do this one +integrity').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })
  it('return +integity gdocs url', () => {
    return room.user.say('mikanebu', 'bot integrities').then(() => {
      assert.equal(room.messages[1][1].substr(0, 14), '@mikanebu http')
      assert.equal((room.messages).length, 2)
    })
  })
  it('+promise check', () => {
    return room.user.say('weirdguy', 'do this one +promise').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })
  it('return +promise gdocs url', () => {
    return room.user.say('mikanebu', 'bot promises').then(() => {
      assert.equal(room.messages[1][1].substr(0, 14), '@mikanebu http')
      assert.equal((room.messages).length, 2)
    })
  })
  it('create milestone', () => {
    return room.user.say('mikanebu', `bot create milestone "13 Jan 2018" in "datahq/docs"`).then(() => {
      assert.equal(createMilestone.callCount, 1)
    })
  })
  it('create milestone with typo', () => {
    return room.user.say('mikanebu', `bot create milestones in "13 Jan 2018" in "datahq/docs"`).then(() => {
      assert.equal(createMilestone.callCount, 0)
    })
  })
  it('create milestone with invalid format', () => {
    return room.user.say('mikanebu', `bot milestone "13 Jan 2018" in "datahq/docs"`).then(() => {
      assert.equal(createMilestone.callCount, 0)
    })
  })
  it('create milestone all', () => {
    return room.user.say('mikanebu', `bot create milestone all "13 Jan 2018"`).then(() => {
      assert.equal(createMilestone.callCount, 1)
    })
  })
  it('create milestone all with typo', () => {
    return room.user.say('mikanebu', `bot created milestone all "13 Jan 2018"`).then(() => {
      assert.equal(createMilestone.callCount, 0)
    })
  })
  it('close milestone', () => {
    return room.user.say('mikanebu', `bot close milestone "13 Jan 2018" in "datahq/docs"`).then(() => {
      assert.equal(closeMilestone.callCount, 1)
    })
  })
  it('close milestone with typo', () => {
    return room.user.say('mikanebu', `bot1 close milestone "13 Jan 2018" in "datahq/docs"`).then(() => {
      assert.equal(closeMilestone.callCount, 0)
    })
  })
  it('close milestone with invalid format', () => {
    return room.user.say('mikanebu', `bot close milestone test "13 Jan 2018" in "datahq/docs"`).then(() => {
      assert.equal(closeMilestone.callCount, 0)
    })
  })
  it('close milestone all', () => {
    return room.user.say('mikanebu', `bot close milestone all "13 Jan 2018"`).then(() => {
      assert.equal(closeMilestone.callCount, 1)
    })
  })
  it('close milestone all with typo', () => {
    return room.user.say('mikanebu', `bot closing milestone "13 Jan 2018"`).then(() => {
      assert.equal(createMilestone.callCount, 0)
    })
  })
  it('create milestone all with invalid format', () => {
    return room.user.say('mikanebu', `bot milestone close "13 Jan 2018"`).then(() => {
      assert.equal(createMilestone.callCount, 0)
    })
  })
  it('return +todo gdocs url', () => {
    return room.user.say('mikanebu', 'bot todos').then(() => {
      assert.equal(room.messages[1][1].substr(0, 14), '@mikanebu http')
      assert.equal((room.messages).length, 2)
    })
  })
  it('return +link gdocs url', () => {
    return room.user.say('mikanebu', 'bot links').then(() => {
      assert.equal(room.messages[1][1].substr(0, 14), '@mikanebu http')
      assert.equal((room.messages).length, 2)
    })
  })
  it('starting with bot should reply help message', () => {
    return room.user.say('mikanebu', 'bot help').then(() => {
      assert.equal(room.messages[1][1].substr(0, 22), '@mikanebu ### Commands')
      assert.equal((room.messages).length, 2)
    })
  })

  it('starting with /bot should reply help message', () => {
    return room.user.say('mikanebu', '/bot help').then(() => {
      assert.equal(room.messages[1][1].substr(0, 22), '@mikanebu ### Commands')
      assert.equal((room.messages).length, 2)
    })
  })

  it('only word bot should reply help message', () => {
    return room.user.say('mikanebu', 'bot').then(() => {
      assert.equal(room.messages[1][1].substr(0, 22), '@mikanebu ### Commands')
      assert.equal((room.messages).length, 2)
    })
  })

  it('only word /bot should reply help message', () => {
    return room.user.say('mikanebu', '/bot').then(() => {
      assert.equal(room.messages[1][1].substr(0, 22), '@mikanebu ### Commands')
      assert.equal((room.messages).length, 2)
    })
  })

  it('containing not only bot should not reply help message', () => {
    return room.user.say('mikanebu', 'bot test').then(() => {
      assert.equal((room.messages).length, 1)
    })
  })

  it('ending with bot should not reply help message', () => {
    return room.user.say('mikanebu', 'our friend is bot').then(() => {
      assert.equal((room.messages).length, 1)
    })
  })

  it('having bot in the middle of sentence should not reply help message', () => {
    return room.user.say('mikanebu', 'this is our bot for DataHub').then(() => {
      assert.equal((room.messages).length, 1)
    })
  })

  it('Action getting', () => {
    assert.equal(formatting.getDataMask(msg, /\+[^*\s]+/), '+todo')
  })

  it('Action remove from message', () => {
    assert.equal(formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\+[^*\s]+/)), 'do @test this \n one')
  })

  it('Assignees getting', () => {
    assert.equal(formatting.getDataMask(msg, /\@[^*\s]+/), '@test')  // eslint-disable-line no-useless-escape
  })

  it('Assignees removing from message', () => {
    assert.equal(formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\@[^*\s]+/)), '+todo do this \n one') // eslint-disable-line no-useless-escape
  })

  it('Action and Assignees removing from message', () => {
    const tmp = formatting.removeFromMessage(msg, formatting.getDataMask(msg, /\@[^*\s]+/)) // eslint-disable-line no-useless-escape
    assert.equal(formatting.removeFromMessage(tmp, formatting.getDataMask(tmp, /\+[^*\s]+/)), 'do this \n one')
  })

  it('Name getting', () => {
    assert.equal(formatting.getName('Test (@test)'), 'Test')
  })

  it('Message Formatting', () => {
    messages.formatMessage({text: '+todo do this', user: {login: 'test', name: 'Test (@Test)'}, room: 'sadqwewqeqw'}, res => {
      assert.equal(res.message, 'do this')
    })
  })

  it('Message Formatting, with tag in middle', () => {
    messages.formatMessage({text: 'do +todo this', user: {login: 'test', name: 'Test (@Test)'}, room: 'sadqwewqeqw'}, res => {
      assert.equal(res.action, 'todo')
    })
  })

  it('Message Formatting, with tag in the end', () => {
    messages.formatMessage({text: 'do this +todo', user: {login: 'test', name: 'Test (@Test)'}, room: 'sadqwewqeqw'}, res => {
      assert.equal(res.action, 'todo')
    })
  })
  it('Message Formatting, without assignees', () => {
    messages.formatMessage({text: 'do this +todo', user: {login: 'test', name: 'Test (@Test)'}, room: 'sadqwewqeqw'}, res => {
      assert.equal(res.assignees, '@test (Test)')
    })
  })

  it('Gist formatting', () => {
    messages.formatGist({text: '+todo do this', user: {login: 'test', name: 'Test (@Test)'}, room: 'sadqwewqeqw'}, res => {
      assert.equal(res.substr(0, 5), 'todo,')
    })
  })

  it('Typo in tag', () => {
    return room.user.say('weirdguy', '+tod do this one').then(() => {
      assert.equal(sendMsg.callCount, 0)
      assert.equal(sendGst.callCount, 0)
    })
  })

  it('Without typo in tag', () => {
    return room.user.say('weirdguy', '+todo do this one').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })

  it('Without any tag', () => {
    return room.user.say('weirdguy', 'do this one').then(() => {
      assert.equal(sendMsg.callCount, 0)
      assert.equal(sendGst.callCount, 0)
    })
  })

  it('Tag in middle', () => {
    return room.user.say('weirdguy', 'do +todo this one').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })

  it('Tag in the end', () => {
    return room.user.say('weirdguy', 'do this one +todo').then(() => {
      assert.equal(sendMsg.callCount, 1)
      assert.equal(sendGst.callCount, 0)
    })
  })
})
