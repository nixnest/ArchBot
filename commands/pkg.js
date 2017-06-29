const utils = require('../lib/utils.js')
const rp = require('request-promise-native');

exports.run = function (msg, args, usertype) {
  rp('https://www.archlinux.org/packages/search/json/?name=' + args.join(' ').toLowerCase())
    .then(htmlString => {
      try {
        let pkg = JSON.parse(htmlString).results[0];
        let licence;
        let plural = '';
        if (pkg.licenses.length == null) licence = 'None';
        if (pkg.licenses.length === 1) licence = pkg.licenses[0];
        if (pkg.licenses.length >= 2) {
          licence = pkg.licenses.join(', ');
          plural = 's';
        }
        console.log(pkg);
        msg.channel.send({
          embed: {
            color: 1545169,
            description: `<:arch:305467628028428288> [**${pkg.pkgname}** ${pkg.pkgver}](https://www.archlinux.org/packages/${pkg.repo}/${pkg.arch}/${pkg.pkgname}/)\n\n${pkg.pkgdesc}\n\nDownload size: ${utils.formatBytes(pkg.compressed_size)}\nInstalled size: ${utils.formatBytes(pkg.installed_size)}\nDependencies: ${pkg.depends.length}\nLicence${plural}: ${licence}\nLast update: ${new Date(pkg.last_update).toDateString()}`
          }
        });
      } catch (e) {
        msg.channel.send({
          embed: {
            color: 1545169,
            description: "<:downarch:317522424012996608> **Package not found.** (Maybe it's a group or an AUR package?)"
          }
        });
        console.log(e);
      }
    })
    .catch(function (e) {
      msg.channel.send({
        embed: {
          color: 1545169,
          description: '<:downarch:317522424012996608> **An error occurred.**'
        }
      });
      console.log(e);
    });
};
