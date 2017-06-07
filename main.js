const Discord = require('discord.js');

const utils = require('./lib/utils.js');

const config = require('./config.json');
const pasta = require('./pasta.json');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Bot started! (${client.user.username})`);
});

client.on('message', msg => {
  if (msg.author === client.user) return;
  if (!msg.content.startsWith(config.prefix)) return;

  let command = msg.content.substr(config.prefix.length).split(' ')[0];
  let args = msg.content.split(' ').slice(1);
  let usertype = 'regular';

  let errMesg = 'archbot: command not found: ' + command;

  if (typeof (pasta[command]) !== 'undefined') {
    let regPasta = pasta[command];
    if (Object.prototype.toString.call(pasta[command]) === '[object Object]') {
      if (args.length !== 0) {
        let txtPasta = regPasta.embed.description;
        for (let x in args) {
          let find = args[x].split('/')[0];
          let replace = args[x].split('/')[1];
          let regex = new RegExp(find, 'gi');
          txtPasta = txtPasta.replace(regex, replace);
        }
        regPasta.embed.description = txtPasta;
      }
      msg.channel.send(regPasta);
    } else if (Object.prototype.toString.call(pasta[command]) === '[object Array]') {
      regPasta.forEach(function (embPasta) {
        if (args.length !== 0) {
          let txtPasta = embPasta.embed.description;
          for (let x in args) {
            let regex = new RegExp(args[x].split('/')[0], 'gi');
            txtPasta = txtPasta.replace(regex, args[x].split('/')[1]);
            embPasta.embed.description = txtPasta;
          }
        }
        msg.channel.send(embPasta);
      });
    }
    return;
  }

  if (command === 'sudo') {
    if (!msg.member.roles.exists('id', config.sudoersRole)) {
      msg.channel.send('<@' + msg.author.id + '> is not in the sudoers file. This incident will be reported.');
      client.channels.get(config.sudoLogChannel).send('<@' + msg.author.id + '> is getting coal for Christmas.');
      return;
    } else {
      usertype = 'sudoer';
      command = args[0];
      args = args.slice(1);
      errMesg = 'archbot: sudo: command not found: ' + command;
    }
  }

  try {
    let cmdFile = require('./commands/' + command);
    cmdFile.run(msg, args, usertype);
  } catch (e) {
    msg.channel.send(errMesg);
    console.log(e);
  }
});

client.on('guildMemberAdd', member => {
  client.channels.get(config.joinLogChannel).send('Joined: <@' + member.id + '>');
});

client.login(config.token).then(function () {
  client.user.setGame('');
  /* if you want the bot not to have a "Playing..." message, you have to
   * pass an empty parameter and wait for the bot to leave the channel before restarting */
});
