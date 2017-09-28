import Gitter from 'node-gitter'

const gitter = new Gitter(process.env.HUBOT_GITTER2_TOKEN)

const getRoom = roomId => {
  return gitter.rooms.find(roomId)
}

const getDataMask = (text, mask) => {
  const act = text.match(mask)
  if (act !== null) {
    return act[0].trim()
  }
  return ''
}

const getName = text => {
  return text.substr(0, text.indexOf(' '))
}

const removeFromMessage = (text, rem) => {
  return text.replace(rem, '').trim().replace(/[^\S\r\n]+/g, ' ')
}

const getStandup = (text, action, mask) => {
  text = text.replace(action, '').trim()
  const standup = text.match(mask)
  if (standup !== null) {
    return standup[1]
  }
  return ''
}

exports.formatting = {
  getRoom,
  getDataMask,
  getStandup,
  getName,
  removeFromMessage
}
