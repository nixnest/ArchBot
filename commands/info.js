const jsonfile = require('jsonfile');
const utils = require('../lib/utils.js');

//const db = require('../db.json')
var db = jsonfile.readFileSync('/home/tdeo/ArchBot/db.json');

exports.run = function(msg, args, usertype) {
  let userId;
  if (typeof(args[0]) === 'undefined') {
    userId = msg.author.id;
  } else if (args[0].substr(2, 1) === '!') {
    userId = msg.content.substr(3, 18);
  } else {
    userId = msg.content.substr(2, 18);
  }
  try { 
    msg.channel.send('```' + db.info[userId] + '```');
  }
  catch(e) {
    msg.channel.send(e+'No info found for <@' + userId + '>');
  }
}
