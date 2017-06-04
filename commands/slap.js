const utils = require('../lib/utils.js')

exports.run = function(msg, args, usertype) {
  if (typeof(args[0]) === 'undefined') {
    msg.channel.send('<@' + msg.author.id + '> slaps around a bit with a large trout');
  } else {
    msg.channel.send(utils.fixPings('<@' + msg.author.id + '> slaps ' + args.join(" ") + ' around a bit with a large trout'));
  }
 }
