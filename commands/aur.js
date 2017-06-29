// const utils = require('../lib/utils.js')
const rp = require('request-promise-native');

exports.run = function (msg, args, usertype) {
  rp('https://aur.archlinux.org/rpc/?v=5&type=info&arg[]=' + args.join(' ').toLowerCase())
    .then(htmlString => {
      try {
        let pkg = JSON.parse(htmlString).results[0];
        let licence;
        let plural = '';
        if (pkg.License.length == null) licence = 'None';
        if (pkg.License.length === 1) licence = pkg.License[0];
        if (pkg.License.length >= 2) {
          licence = pkg.License.join(', ');
          plural = 's';
        }
        console.log(pkg);
        msg.channel.send({
          embed: {
            color: 1545169,
            description: `<:arch:305467628028428288> [**${pkg.Name}** ${pkg.Version}](https://www.archlinux.org/packages/${pkg.repo}/${pkg.arch}/${pkg.pkgname}/)\n\n${pkg.Description}\n\nDependencies: ${pkg.Depends.length}\nLicence${plural}: ${licence}`
          }
        });
      } catch (e) {
        msg.channel.send({
          embed: {
            color: 1545169,
            description: '<:downarch:317522424012996608> **Package not found.**'
          }
        });
        console.log(e);
      }
    })
    .catch(function (err) {
      msg.channel.send({
        embed: {
          color: 1545169,
          description: '<:downarch:317522424012996608> **An error occurred.**'
        }
      });
      console.log(e);
    });
};
