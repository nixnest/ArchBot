const cowsay = require('cowsay');

const utils = require('../lib/utils.js');

exports.run = function (msg, args, usertype) {
  msg.channel.send('```\n' + cowsay.say({
    text: utils.fixPings(args.join(' ').replace(/[`]/g, ''))
  }) + '\n```');
};
