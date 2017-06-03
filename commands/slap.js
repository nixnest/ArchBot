exports.run = function(msg, args, usertype) {
  if (msg.content.substr(6) === '') {
    msg.channel.send('<@' + msg.author.id + '> slaps around a bit with a large trout');
  } else if (!/everyone/g.test(msg.content) && !/here/g.test(msg.content)) {
    msg.channel.send('<@' + msg.author.id + '> slaps ' + msg.content.substr(6) + ' around a bit with a large trout');
  } else if (usertype === "sudoer") {
    msg.channel.send('<@' + msg.author.id + '> slaps around a bit with a large trout');
  } else {
    msg.channel.send(config.prefix + 'slap: Permission denied');
  }
}
