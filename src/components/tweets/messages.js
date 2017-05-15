const moment = require('moment');
const DATE_FMT = 'MMM D YYYY HH:mm:ss';

function idFromName(fullname) {
    return fullname.split(" ")[0].toLowerCase();
}
// The message object comes from GiftedChat / this client
// The return item follows the server Message Style we have
function clientToServerFormat(message, username) {
    return {
        message: {
            content: message.text || message.emoji,
            content_type: message.type || "text"},
            created_at: moment().utc().format(DATE_FMT),
            user: {
                id: idFromName(username),
                name: username}};
}
// The content object comes straight from firebase
// Return item follows GiftedChat / client formatting
function serverToClientFormat(content, index) {
  var localized = new Date(
    moment.utc(content.created_at, DATE_FMT).local().format(DATE_FMT)
  )
  var type = content.message.content_type
  var user = { _id: idFromName(content.user.name), name: content.user.name }

  const msgContent = content.message.content
  const text =
    Array.isArray(msgContent)
      ? msgContent.reduce((a, x) =>  `${a}\n>${x.text}`, '')
      : msgContent

  if (type === "emoji") {
    return {
      _id: index,
      type: type,
      emoji: msgContent,
      createdAt: localized,
      user: user
    }
  } else {
    return {
      type, text, user,
      _id: index,
      createdAt: localized,
    }
  }
}

module.exports = {
    idFromName: idFromName,
    serverToClientFormat: serverToClientFormat,
    clientToServerFormat: clientToServerFormat,
}

