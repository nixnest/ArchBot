const jsonfile = require('jsonfile');
const utils = require('../lib/utils.js');

var db;

exports.run = function (msg, args, usertype) {
  db = jsonfile.readFileSync('./db.json');
  if (!args[0]) {
    delete db[msg.author.id];
    msg.channel.send('Info removed.');
  } else if (usertype === 'regular') {
    msg.reply('archbot: rminfo: permission denied');
  } else if (usertype === 'sudoer') {
    // if (args[0].substr(2, 1) === '!') {
    //   userId = args[0].substr(3, 18);
    // } else {
    //   userId = args[0].substr(2, 18);
    // }
    delete db[msg.author.id];
    msg.channel.send('Info removed.');
  }
  utils.saveFile('./db.json', db);
};
