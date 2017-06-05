const figlet = require('figlet');

const utils = require('../lib/utils.js');

exports.run = function (msg, args, usertype) {
  msg.channel.send('```\n' + figlet.textSync(args.join(' ')) + '\n```');
};
