const moment = require('moment');
const DATETIME_FMT = 'MMM D YYYY HH:mm:ss';
const MD_FMT = 'MMM D';

function idFromName(fullname) {
  return fullname.split(" ")[0].toLowerCase();
}
function nameFromID(id) {
  // take an id (= email address), and return a name.
  return id.split("@")[0].toLowerCase();
}

// The message object comes from GiftedChat / this client
// The return item follows the server Message Style we have
function clientToServerFormat(message, username) {
  return {
    message: {
      content: message.text || message.emoji || message.transcript,
      content_type: message.type || "text"},
      created_at: moment().utc().format(DATETIME_FMT),
      user: {
        id: idFromName(username),
        name: username}};
}
// Turns a transcript object into a displayable string.
// XXX @todo: Use the ConversationDisplay object instead.
function transcriptMessageToString (message) {
  var {transcript, user, createdAt} = message;
  var day = moment(createdAt).format(MD_FMT);
  var str = user.name +  "'s conversation for " + day + ":\n" +
    transcript.map(function(turn, index) {
        return (turn.sayer + " said: " + turn.text);
    }).join("\n");
  return str;
}
// The content object comes straight from firebase
// Return item follows GiftedChat / client formatting
function serverToClientFormat(content, index) {
  var localized = new Date(moment.utc(content.created_at, DATETIME_FMT)
      .local().format(DATETIME_FMT));
  var type = content.message.content_type;
  var user = {_id: idFromName(content.user.name),
              name: nameFromID(content.user.name)};
  var message = {
    _id: index,
    type: type,
    createdAt: localized,
    user: user
  };
  if (type === "emoji") {
    message['emoji'] = content.message.content;
  } else if (type === "transcript") {
    message['transcript'] = content.message.content;
    message['text'] = transcriptMessageToString(message);
  } else if (type === "text") {
    message['text'] = content.message.content;
  } else {
    alert('Message type not recognized.');
  }
  return message;
}

module.exports = {
  idFromName: idFromName,
  serverToClientFormat: serverToClientFormat,
  clientToServerFormat: clientToServerFormat,
}

