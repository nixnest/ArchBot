const jsonfile = require('jsonfile');

exports.fixPings = function (text) {
  return text.replace(/[?<=@](everyone|here)/g, '@‍$1');
};
exports.saveFile = function (file, content) {
  jsonfile.writeFile(file, content, function (err) {
    if (err) console.error(err);
  });
};
