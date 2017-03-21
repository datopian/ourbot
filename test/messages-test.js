import async from 'async'
var messages = require('../scripts/messages.js').messages


describe('auth and messages test', function () {
    it('authenticate', function () {
        async.series([
            function setAuth(step) {
                step(null, messages.setAuth())
            }
        ])
    })
    it('message send', function () {
        async.series([
            function setAuth(step) {
                messages.setAuth()
            },
            function sendMessage(step) {
                    step(null, messages.sendMessage({
                        text: "+todo @assignees some text",
                        user: {
                            name: "Artem (weirdGuy)",
                            login: "weirdGuy"
                        }
                    }))
            },
        ])
    })

})
