const jsonfile = require('jsonfile');
const Discord = require('discord.js');
const cowsay_mod = require("cowsay");
const fortunes = require('fortunes');
const figlet_mod = require('figlet');
const client = new Discord.Client();
const config = require('./config.json');

var file = 'db.json';
var db = jsonfile.readFileSync(file);

function saveFile(file) {
  jsonfile.writeFile(file, db, function (err) {
    if(err) console.error(err);
  });
}
function help(msg) {
  msg.channel.send("Commands:\n\n`!info @user`: gives you the set info on a user\n`!chinfo <info>`: changes your listing\n`!rminfo`: removes your listing\n\nOther commands:\n\n`!interject`\n`!norichard`\n`!gentoo`\n`!paste`\n`!cowsay <text>`\n`!fortune`\n`!step`\n`!figlet`");
}
function info(msg) {
  let userId;
  if(msg.content.substr(8,1) === '!') {
    userId = msg.content.substr(9,18);
  }
  else if(msg.content.substr(6) === '') {
    userId = msg.author.id;
  }
  else {
    userId = msg.content.substr(8,18);
  }
  if(db.info[userId]) {
    msg.channel.send('```'+db.info[userId]+'```');
  }
  else {
    msg.channel.send('No info found for <@' + userId + '>');
  }
}

function chinfo(msg) {
  if(msg.content.substr(8) === '') {
    delete db.info[msg.author.id];
    msg.channel.send('Info removed.');
  }
  else {
    db.info[msg.author.id] = msg.content.substr(8).replace(/[`]/g, '');
    msg.channel.send('Info changed to: ```'+db.info[msg.author.id]+'```');
  }
  saveFile(file);
}

function rminfo(msg) {
  delete db.info[msg.author.id];
  msg.channel.send('Info removed.');
  saveFile(file);
}

function slap(msg) {
  if(msg.content.substr(6) === "") {
    msg.channel.send('<@'+msg.author.id+'> slaps around a bit with a large trout');
  }
  else if(!/everyone/g.test(msg.content) && !/here/g.test(msg.content)) {
    msg.channel.send('<@'+msg.author.id+'> slaps '+ msg.content.substr(6) +' around a bit with a large trout');
  }
  else {
    msg.channel.send(config.prefix + 'slap: Permission denied');
  }
}

function interject(msg) {
  const pasta = "I'd just like to interject for a moment. What you’re referring to as Linux, is in fact, GNU/Linux, or as I’ve recently taken to calling it, GNU plus Linux. Linux is not an operating system unto itself, but rather another free component of a fully functioning GNU system made useful by the GNU corelibs, shell utilities and vital system components comprising a full OS as defined by POSIX. Many computer users run a modified version of the GNU system every day, without realizing it. Through a peculiar turn of events, the version of GNU which is widely used today is often called “Linux”, and many of its users are not aware that it is basically the GNU system, developed by the GNU Project. There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine’s resources to the other programs that you run. The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system. Linux is normally used in combination with the GNU operating system: the whole system is basically GNU with Linux added, or GNU/Linux. All the so-called “Linux” distributions are really distributions of GNU/Linux."; 
  let args = msg.content.substr(11).split('/');
  if (args[1]) msg.channel.send(pasta.replace(/GNU/g, args[0]).replace(/Linux/g, args[1]));
  else msg.channel.send(pasta);
}

function norichard(msg) {
  msg.channel.send("No, Richard, it's 'Linux', not 'GNU/Linux'. The most important contributions that the FSF made to Linux were the creation of the GPL and the GCC compiler. Those are fine and inspired products. GCC is a monumental achievement and has earned you, RMS, and the Free Software Foundation countless kudos and much appreciation.\nFollowing are some reasons for you to mull over, including some already answered in your FAQ.\nOne guy, Linus Torvalds, used GCC to make his operating system (yes, Linux is an OS -- more on this later). He named it 'Linux' with a little help from his friends. Why doesn't he call it GNU/Linux? Because he wrote it, with more help from his friends, not you. You named your stuff, I named my stuff -- including the software I wrote using GCC -- and Linus named his stuff. The proper name is Linux because Linus Torvalds says so. Linus has spoken. Accept his authority. To do otherwise is to become a nag. You don't want to be known as a nag, do you?\n(An operating system) != (a distribution). Linux is an operating system. By my definition, an operating system is that software which provides and limits access to hardware resources on a computer. That definition applies whereever you see Linux in use. However, Linux is usually distributed with a collection of utilities and applications to make it easily configurable as a desktop system, a server, a development box, or a graphics workstation, or whatever the user needs. In such a configuration, we have a Linux (based) distribution. Therein lies your strongest argument for the unwieldy title 'GNU/Linux' (when said bundled software is largely from the FSF). Go bug the distribution makers on that one. Take your beef to Red Hat, Mandrake, and Slackware. At least there you have an argument. Linux alone is an operating system that can be used in various applications without any GNU software whatsoever. Embedded applications come to mind as an obvious example.");
  msg.channel.send("Next, even if we limit the GNU/Linux title to the GNU-based Linux distributions, we run into another obvious problem. XFree86 may well be more important to a particular Linux installation than the sum of all the GNU contributions. More properly, shouldn't the distribution be called XFree86/Linux? Or, at a minimum, XFree86/GNU/Linux? Of course, it would be rather arbitrary to draw the line there when many other fine contributions go unlisted. Yes, I know you've heard this one before. Get used to it. You'll keep hearing it until you can cleanly counter it.\nYou seem to like the lines-of-code metric. There are many lines of GNU code in a typical Linux distribution. You seem to suggest that (more LOC) == (more important). However, I submit to you that raw LOC numbers do not directly correlate with importance. I would suggest that clock cycles spent on code is a better metric. For example, if my system spends 90% of its time executing XFree86 code, XFree86 is probably the single most important collection of code on my system. Even if I loaded ten times as many lines of useless bloatware on my system and I never excuted that bloatware, it certainly isn't more important code than XFree86. Obviously, this metric isn't perfect either, but LOC really, really sucks. Please refrain from using it ever again in supporting any argument.\nLast, I'd like to point out that we Linux and GNU users shouldn't be fighting among ourselves over naming other people's software. But what the heck, I'm in a bad mood now. I think I'm feeling sufficiently obnoxious to make the point that GCC is so very famous and, yes, so very useful only because Linux was developed. In a show of proper respect and gratitude, shouldn't you and everyone refer to GCC as 'the Linux compiler'? Or at least, 'Linux GCC'? Seriously, where would your masterpiece be without Linux? Languishing with the HURD?");
  msg.channel.send("Be grateful for your abilities and your incredible success and your considerable fame. Continue to use that success and fame for good, not evil. Also, be especially grateful for Linux' huge contribution to that success. You, RMS, the Free Software Foundation, and GNU software have reached their current high profiles largely on the back of Linux. You have changed the world. Now, go forth and don't be a nag.\nThanks for listening.");
}

function gentoo(msg) {
  msg.channel.send("http://i.imgur.com/RLF8XyU.gif");
  msg.delete();
}
function paste(msg) {
  msg.channel.send("Please paste your log/message here: https://paste.fedoraproject.org/");
}
function cowsay(msg) {
  msg.channel.send("```\n"+ cowsay_mod.say({text: msg.content.substr(8)}) +"\n```");
}
function fortune(msg) {
  fortunes.search(function(results){
    msg.channel.send('```'+results[1]+'```');
  });
}
function step(msg) {
  if(msg.content.substr(6) === "") {
    msg.channel.send('<@'+msg.author.id+'> steps');
  }
  else if(msg.content.substr(6,2) === "on" && !/everyone/g.test(msg.content) && !/here/g.test(msg.content)) {
    msg.channel.send('<@'+msg.author.id+'> steps on '+ msg.content.substr(9));
  }
  else if(!/everyone/g.test(msg.content) && !/here/g.test(msg.content)) {
    msg.channel.send('<@'+msg.author.id+'> steps on '+ msg.content.substr(6));
  }
  else {
    msg.channel.send(config.prefix + 'step: Permission denied');
  }
}
function figlet(msg) {
  msg.channel.send("```\n"+ figlet_mod.textSync(msg.content.substr(8)) +"\n```");
}
function sudo(msg) {
  if(!msg.member.roles.exists('name', 'sudoers')) {
    msg.channel.sendMessage('<@'+msg.author.id+'> is not in the sudoers file. This incident will be reported.');
    client.channels.get(config.sudoLogChannel).sendMessage('<@'+msg.author.id+'> is on santa\'s naughty list and will receive coal for Christmas.');
    return;
  }
  if(msg.content.substr(8, 4) === 'info') {
    let userId;
    let message;
    if(msg.content.substr(8,1) === '!') {
      userId = msg.content.substr(16,18);
      message = msg.content.substr(36);
    }
    else {
      userId = msg.content.substr(15,18);
      message = msg.content.substr(35);
    }
    if(msg.content.substr(6, 6) === 'chinfo') {
      db.info[userId] = message;
      msg.channel.send('Info changed to: ```'+db.info[userId]+'```');
    }
    else if(msg.content.substr(6, 6) === 'rminfo') {
      delete db.info[userId];
      msg.channel.send('Info removed.');
   }
    saveFile(file);
  }
  else if(msg.content.substr(6,4) === 'slap') {
    msg.channel.send('<@'+msg.author.id+'> slaps '+ msg.content.substr(11) +' around a bit with a large trout');
  }
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
  if(msg.author === client.user) return;
       if(msg.content.substr(0,  5) === config.prefix + 'help')          help(msg);
  else if(msg.content.substr(0,  5) === config.prefix + 'info')          info(msg);
  else if(msg.content.substr(0,  7) === config.prefix + 'chinfo')        chinfo(msg);
  else if(msg.content.substr(0,  7) === config.prefix + 'rminfo')        rminfo(msg);
  else if(msg.content.substr(0,  5) === config.prefix + 'slap')          slap(msg);
  else if(msg.content.substr(0, 10) === config.prefix + 'interject')     interject(msg);
  else if(msg.content.substr(0, 10) === config.prefix + 'norichard')     norichard(msg);
  else if(msg.content.substr(0,  7) === config.prefix + 'gentoo')        gentoo(msg);
  else if(msg.content.substr(0,  6) === config.prefix + 'paste')         paste(msg);
  else if(msg.content.substr(0,  7) === config.prefix + 'cowsay')        cowsay(msg);
  else if(msg.content.substr(0,  8) === config.prefix + 'fortune')       fortune(msg);
  else if(msg.content.substr(0,  5) === config.prefix + 'step')          step(msg);
  else if(msg.content.substr(0,  7) === config.prefix + 'figlet')        figlet(msg);
  else if(msg.content.substr(0,  5) === config.prefix + 'sudo')          sudo(msg);
});

client.on('guildMemberAdd', member => {
  client.channels.get(config.logChannel).send('Joined: <@' + member.id + '>');
});

client.login(config.token).then(function() {
  client.user.setGame("I can't remove this text");
});
