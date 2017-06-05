const utils = require('../lib/utils.js');

exports.run = function (msg, args, usertype) {
  if (typeof (args[0]) === 'undefined') {
    msg.channel.send('<@' + msg.author.id + '> steps');
  } else if (args[0] === 'on') {
    msg.channel.send(utils.fixPings('<@' + msg.author.id + '> steps ' + args.join(' ')));
  } else {
    msg.channel.send(utils.fixPings('<@' + msg.author.id + '> steps on ' + args.join(' ')));
  }
};
