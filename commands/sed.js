function codePointsFromString (str) {
  let codePoints = [];
  for (let index = 0; index < str.length; ++index) {
    let charCode = str.charCodeAt(index);
    if ((charCode & 0xfc00) === 0xd800) { // High surrogate.
      let charCode2 = str.charCodeAt(index + 1);
      if ((charCode2 & 0xfc00) === 0xdc00) { // Low surrogate.
        charCode = ((charCode & 0x3ff) << 10) | (charCode2 & 0x3ff) | 0x10000;
        ++index;
      }
    }
    codePoints.push(charCode);
  }
  return codePoints;
}

const commandFunctions = {
  's': function substitute (first, second, flags) {
    flags = flags.toLowerCase().replace(/[^gimuy]/g, '');
    first = new RegExp(first, flags);
    return str => str.replace(first, second);
  },
  'y': function transliterate (first, second, flags) {
    first = codePointsFromString(first);
    second = codePointsFromString(second);
    return str => String.fromCodePoint.apply(null, codePointsFromString(str).map(function (codePoint) {
      let index = first.indexOf(codePoint);
      return (index >= 0 && index < second.length) ? second[index] : codePoint;
    }));
  }
};

function commandsFromString (args) {
  const regexp = /([sy])([\ud800-\udbff][\udc00-\udfff]|\S)(.*?)\2(.*?)\2(\S*)/g;
  let commands = [];
  let match;
  while ((match = regexp.exec(args)) !== null) {
    let func = commandFunctions[match[1]];
    func && commands.push(func.apply(null, match.slice(3)));
  }
  return commands;
}

exports.run = function (obj, args) {
  try {
    if (args instanceof Array) args = args.join(' ');
    let str = obj.embed.description;
    str = commandsFromString(args).reduce((result, func) => func(result), str);
    obj.embed.description = str;
    return obj;
  } catch (err) {
    return `Error: ${err.message}`;
  }
};
