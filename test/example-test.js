var Helper = require('hubot-test-helper')
var chai = require ('chai')

var expect = chai.expect

var helper = new Helper('../scripts/example.coffee')

describe('example', function () {
    beforeEach(function () {
        this.room = helper.createRoom()
    })

    afterEach(function () {
        this.room.destroy()
    })

    it('doesn\'t need badgers', function () {
        this.room.user.say('alice', 'did someone call for a badger?')
        .then(
            expect(this.room.messages).to.eql [
                ['alice', 'did someone call for a badger?'],
                ['hubot', 'Badgers? BADGERS? WE DON\'T NEED NO STINKIN BADGERS']
            ])
    })
});
