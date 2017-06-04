const jsonfile = require('jsonfile');
const utils = require('../lib/utils.js');

var db = jsonfile.readFileSync('./db.json');

exports.run = function(msg, args, usertype) {
  let userId;
  if (typeof(args[0]) === 'undefined') {
    userId = msg.author.id;
  } else if (args[0].substr(2, 1) === '!') {
    userId = args[0].substr(3, 18);
  } else {
    userId = args[0].substr(2, 18);
  }
  if(typeof(db[userId]) === 'string') { 
    msg.channel.send('```' + db[userId] + '```');
  } else {
    msg.channel.send('No info found for <@' + userId + '>');
  }
}
