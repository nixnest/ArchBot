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

$bot.run
