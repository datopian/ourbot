import Gitter from 'node-gitter';

let gitter = new Gitter(process.env.HUBOT_GITTER2_TOKEN)


let getRoom = (roomId) => {
    return gitter.rooms.find(roomId)
}

let getDataMask = (text, mask) => {
    let act = text.match(mask)
    if(act != null) return act[0].trim()
    return ""
}

let getName = (text) => {
    return text.substr(0, text.indexOf(' '))
}

let removeFromMessage = (text, rem) => {
    return text.replace(rem, '').trim().replace(/\s+/g, " ")
}

let getStandup = (text, action, mask) => {
    text = text.replace(action, '').trim().replace(/\s+/g, " ")
    let standup = text.match(mask)
    if(standup != null) return standup[1]
    return ""
}

exports.formatting = {
    getRoom: getRoom,
    getDataMask: getDataMask,
    getStandup: getStandup,
    getName: getName,
    removeFromMessage: removeFromMessage
}
