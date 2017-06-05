const jsonfile = require('jsonfile');
const utils = require('../lib/utils.js');

var db;

exports.run = function (msg, args, usertype) {
  if (usertype === 'sudoer') {
    msg.reply('if you\'re trying to remove a bad info, just use rminfo instead');
    return;
  }
  db = jsonfile.readFileSync('./db.json');
  if (typeof (args[0]) === 'undefined') {
    delete db[msg.author.id];
    msg.channel.send('Info removed.');
  } else {
    db[msg.author.id] = args.join(' ').replace(/[`]/g, '');
    msg.channel.send('Info changed to: ```' + db[msg.author.id] + '```');
  }
  utils.saveFile('./db.json', db);
};
