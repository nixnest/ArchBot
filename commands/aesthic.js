// const utils = require('../lib/utils.js')
const fullwidth = require('fullwidth').default;

exports.run = function (msg, args) {
  msg.channel.send(fullwidth(args.join('')));
};
