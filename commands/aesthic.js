exports.run = function (msg, args) {
  var fullWidth = '';
  for (var i=0; i < args.length; i++) {
    var char = args[i].charCodeAt(0);
    char += 0xFEE0;
    fullWidth += String.fromCharCode(char);
  }
  msg.channel.send(fullWidth);
};
