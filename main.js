const jsonfile = require('jsonfile');
const Discord = require('discord.js');
const cowsay_mod = require('cowsay');
const fortunes = require('fortunes');
const figlet_mod = require('figlet');

const config = require('./config.json');
const pasta = require('./pasta.json')

const client = new Discord.Client();

var db = jsonfile.readFileSync('db.json');

function saveFile(file, content) {
  jsonfile.writeFile(file, content, function(err) {
    if (err) console.error(err);
  });
}

function saveDB() {
  saveFile('db.json', db);
}

function info(msg) {
  let userId;
  if (msg.content.substr(8, 1) === '!') {
    userId = msg.content.substr(9, 18);
  } else if (msg.content.substr(6) === '') {
    userId = msg.author.id;
  } else {
    userId = msg.content.substr(8, 18);
  }
  if (db.info[userId]) {
    msg.channel.send('```' + db.info[userId] + '```');
  } else {
    msg.channel.send('No info found for <@' + userId + '>');
  }
}

function chinfo(msg) {
  if (msg.content.substr(8) === '') {
    delete db.info[msg.author.id];
    msg.channel.send('Info removed.');
  } else {
    db.info[msg.author.id] = msg.content.substr(8).replace(/[`]/g, '');
    msg.channel.send('Info changed to: ```' + db.info[msg.author.id] + '```');
  }
  saveDB()
}

function rminfo(msg) {
  delete db.info[msg.author.id];
  msg.channel.send('Info removed.');
  saveDB();
}


function cowsay(msg) {
  msg.channel.send("```\n" + cowsay_mod.say({
    text: msg.content.substr(8)
  }) + "\n```");
}

function fortune(msg) {
  fortunes.search(function(results) {
    msg.channel.send('```' + results[1] + '```');
  });
}

function step(msg) {
  if (msg.content.substr(6) === "") {
    msg.channel.send('<@' + msg.author.id + '> steps');
  } else if (msg.content.substr(6, 2) === "on" && !/everyone/g.test(msg.content) && !/here/g.test(msg.content)) {
    msg.channel.send('<@' + msg.author.id + '> steps on ' + msg.content.substr(9));
  } else if (!/everyone/g.test(msg.content) && !/here/g.test(msg.content)) {
    msg.channel.send('<@' + msg.author.id + '> steps on ' + msg.content.substr(6));
  } else {
    msg.channel.send(config.prefix + 'step: Permission denied');
  }
}

function figlet(msg) {
  msg.channel.send("```\n" + figlet_mod.textSync(msg.content.substr(8)) + "\n```");
}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
  if (msg.author === client.user) return;
  if (!msg.content.startsWith(config.prefix)) return;

  let command = msg.content.substr(config.prefix.length).split(" ")[0];
  let args = msg.content.split(" ").slice(1);
  let usertype = "regular";

  if (typeof(pasta[command]) !== "undefined") {
    if (typeof(pasta[command]) === "string") {
      msg.channel.send(pasta[command])
    } else if (typeof(pasta[command]) === "object") {
      pasta[command].forEach(function(part) {
        msg.channel.send(part);
      });
    }
    return;
  }

  if (command === "sudo") {
    if (!msg.member.roles.exists('id', config.sudoersRole)) {
      msg.channel.send('<@' + msg.author.id + '> is not in the sudoers file. This incident will be reported.')
      client.channels.get(config.sudoLogChannel).send('<@' + msg.author.id + '> is getting coal for Christmas.')
      return;
    } else {
      usertype = "sudoer";
      command = args[0];
      args = args.slice(1);
    }
  }

  try {
    let cmdFile = require("./commands/" + command);
    cmdFile.run(msg, args, usertype);
  } catch (e) {
    msg.channel.send('archbot: command not found: ' + command)
  }
});

client.on('guildMemberAdd', member => {
  client.channels.get(config.logChannel).send('Joined: <@' + member.id + '>');
});

client.login(config.token).then(function() {
  client.user.setGame('I can\'t remove this text');
});
