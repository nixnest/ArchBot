const fortunes = require('fortunes');

// const utils = require('../lib/utils.js');

exports.run = function (msg, args, usertype) {
  fortunes.search(function (results) {
    msg.channel.send('```\n' + results[0] + '\n```');
  });
};
