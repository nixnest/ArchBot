require 'discordrb'
require 'fullwidth'
require 'yaml'
require 'figlet'
require 'cowsay'
require 'fortune_gem'
require_relative 'lib/utilities'
require_relative 'lib/fun'
require_relative 'lib/info'

$config = YAML.load_file('config.yaml')
$infofile = 'info.yaml'
$pasta = YAML.load_file('pasta.yaml')
$pastaArray =   %i(interject norichard stfu gentoo paste
                 systemd yearoftheemojidesktop emojidelete
                 emojinterject fossdating paytoilets lennyface)

#Figlet initialization
$font = Figlet::Font.new("fonts/#{$config['figletFont']}.flf")
$figlet = Figlet::Typesetter.new($font)

$bot = Discordrb::Commands::CommandBot.new(token: $config['token'],
                                           prefix: $config['prefix'],
                                           advanced_functionality: true,
                                           spaces_allowed: true,
                                           chain_delimiter: '|',
                                           previous: '-',
                                           ignore_bots: true)

$bot.include! Utilities
$bot.include! Fun
$bot.include! Info

$userType = 'normal'

$bot.command :sudo do |event, *args|
  if event.author.roles.include?($config['sudoersRole'])
    runCommand = args[0]
    args.slice!(0)
    $userType = 'sudoer'
    $bot.execute_command(runCommand.to_sym, event, args)
  else
    event.channel.send_message("<@#{event.author.id.to_s}> is not in the sudoers file. This incident will be reported.")
    $bot.send_message($config['sudoLogChannel'], "<@#{event.author.id.to_s}> is getting coal for Christmas.")
  end
end

$bot.command $pastaArray do |event| #This has to be the most disgusting hack ever. I'm not proud of it at all.
  index = event.message.content.delete($bot.prefix)
  event.channel.send_embed do |embed|
    unless $pasta[index]['embed']['author'].empty?
      embed.author ||= Discordrb::Webhooks::EmbedAuthor.new(
        name: $pasta[index]['embed']['author']['name'],
        url: '',
        icon_url: $pasta[index]['embed']['author']['icon_url'])
    end
    embed.description = ($pasta[index]['embed']['description'])
  end
end

$bot.run
