const utils = require('../lib/utils.js');

exports.run = function (msg, args, usertype) {
  msg.reply('You are a ' + usertype + ' user.');
};
