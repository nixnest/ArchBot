// const utils = require('../lib/utils.js')
const rp = require('request-promise-native');
const txtwiki = require('txtwiki');
const linkRegex = /\[(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)) (.*?)\]/g;
const linkNoTextRegex = /\[(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*))\]/g;

exports.run = function (msg, args, usertype) {
  rp('https://wiki.archlinux.org/api.php?action=parse&format=json&page=' + args.join(' ').toLowerCase() + '&redirects=1&prop=wikitext&section=0&sectionpreview=1&disabletoc=1&utf8=1')
    .then(htmlString => {
      try {
        let text = JSON.parse(htmlString).parse.wikitext['*'].split('\n');
        let title = JSON.parse(htmlString).parse.title;
        text = text.filter(function (item) {
          if (item.startsWith('[[') || item.startsWith('{{') || item === '') return false;
          return true;
        });
        text.forEach(function (part, index, arr) {
          if (part.startsWith(':')) arr[index] = '    ' + arr[index].substr(1);
          else arr[index] = txtwiki.parseWikitext(arr[index]).replace(linkRegex, '[$4]($1)').replace(linkNoTextRegex, '[(link)]($1)');
        });
        msg.channel.send({
          embed: {
            color: 1545169,
            description: `<:arch:305467628028428288> [**${title}**](https://wiki.archlinux.org/index.php/${title.replace(/ /g, '%20')})\n\n${text.join('\n\n')}`
          }
        });
      } catch (e) {
        msg.channel.send({
          embed: {
            color: 1545169,
            description: '<:downarch:317522424012996608> **Article not found.**'
          }
        });
      }
    })
    .catch(function (err) {
      msg.channel.send({
        embed: {
          color: 1545169,
          description: '<:downarch:317522424012996608> **An error occurred.**'
        }
      });
      void err;
    });
};
