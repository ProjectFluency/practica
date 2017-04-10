const React = require('react');
const ReactNative = require('react-native');

module.exports.json = (url, fetchOption) => {
  const reply = {
    status: 0,
    ok: false,
    body: {}
  };

  return fetch(url, fetchOption)
    .then((response) => {
      reply.status = response.status;
      reply.ok = response.ok;
      return response.json();
    })
    .then((json) => {
      reply.body = json;
      return reply;
    })
}
