require 'discordrb'
require 'fullwidth'
require 'yaml'
require 'figlet'
require 'cowsay'
require 'fortune_gem'

require_relative 'lib/utilities'
require_relative 'lib/fun'
require_relative 'lib/admin'

$config = YAML.load_file('config.yaml')
$infofile = $config['infoFile']
$pasta = YAML.load_file('pasta.yaml')

#Figlet initialization
$font = Figlet::Font.new("fonts/#{$config['figletFont']}.flf")
$figlet = Figlet::Typesetter.new($font)

$bot = Discordrb::Commands::CommandBot.new(token: $config['token'],
  prefix: $config['prefix'],
  advanced_functionality: true,
  spaces_allowed: true,
  chain_delimiter: '|',
  previous: '-',
  ignore_bots: true,
  command_doesnt_exist_message: "zsh: command not found")

$bot.include! Utilities
$bot.include! Fun
$bot.include! Admin

$userType = 'normal'

$bot.command :sudo \
do |event, *args|
  if event.author.roles.select{|role| role.id == $config['sudoersRole']}.length > 0
    runCommand = args[0]
    args.slice!(0)
    $userType = 'sudoer'
    $bot.execute_command(runCommand.to_sym, event, args)
    $userType = 'normal'
  else
    event.channel.send_message("<@#{event.author.id.to_s}> is not in the sudoers file. This incident will be reported.")
  end
  nil
end

$pasta.keys.each do |pasta| # Slightly improved
  $bot.command pasta.to_sym do |event, *args|
    catch :RegexError do
      sed = []
      args.each { |string| string.split('/').each { |subs| sed.push(subs)}}
      $pasta = YAML.load_file('pasta.yaml')
      message = $pasta[pasta]
      unless sed.empty?
        sed.each_slice(2) do |match, replace|
          begin
            message.gsub!(/#{match}/i, replace || '')
          rescue RegexpError
            "Error: Invalid Regex"
            throw :RegexError
          end
        end
      end
      message
    end
  end
end

$bot.run
