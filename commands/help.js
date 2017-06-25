// const utils = require('../lib/utils.js');

exports.run = function (msg) {
  msg.channel.send('``` * !info @user: gives you the set info on a user.\n * !chinfo <info>: changes your current info (**WARNING** This does NOT append, it OVERWRITES).\n * !rminfo: removes your current info.```\n\nThere are other fluff commands, but those are left for you to discover :wink:');
};
