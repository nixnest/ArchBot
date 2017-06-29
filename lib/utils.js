const jsonfile = require('jsonfile');

exports.fixPings = function (text) {
  return text.replace(/[?<=@](everyone|here)/g, '@‍$1');
};
exports.saveFile = function (file, content) {
  jsonfile.writeFile(file, content, function (err) {
    if (err) console.error(err);
  });
};
exports.formatBytes = (bytes, decimals) => {
  // stolen from https://stackoverflow.com/a/18650828
  if (bytes === 0) return '0 Bytes';
  var k = 1000;
  var dm = decimals || 2;
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
