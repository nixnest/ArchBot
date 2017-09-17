require 'discordrb'
require 'fullwidth'
require 'yaml'
require 'figlet'
require 'cowsay'
require 'fortune_gem'

require_relative 'lib/utilities'
require_relative 'lib/fun'
require_relative 'lib/info'
require_relative 'lib/admin'

$config = YAML.load_file('config.yaml')
$infofile = 'info.yaml'
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
$bot.include! Info
$bot.include! Admin

$userType = 'normal'

$bot.command :sudo \
do |event, *args|
  if event.author.roles.include?($config['sudoersRole'])
    runCommand = args[0]
    args.slice!(0)
    $userType = 'sudoer'
    $bot.execute_command(runCommand.to_sym, event, args)
    $userType = 'normal'
  else
    event.channel.send_message("<@#{event.author.id.to_s}> is not in the " \
                                 "sudoers file. This incident will be reported.")
    $bot.send_message($config['sudoLogChannel'], "<@#{event.author.id.to_s}> " \
                       "is getting coal for Christmas.")
  end
  nil
end

$pasta.keys.each do |pasta| # Slightly improved
  $bot.command pasta.to_sym do |event, *args|
    catch :RegexError do

      sed = []
      args.each { |string| string.split('/').each { |subs| sed.push(subs)}}
      event.channel.send_embed do |embed|
        $pasta = YAML.load_file('pasta.yaml')
        embed_raw = $pasta[pasta]['embed']
        embed.description = embed_raw['description']
        unless sed.empty?
          sed.each_slice(2) do |match, replace|
            begin
              embed.description.gsub!(/#{match}/i, replace || '')
            rescue RegexpError
              event.channel.send_message("ERROR: Invalid Regex")
              throw :RegexError
            end
          end
        end

        if embed_raw['author']
          embed_raw = embed_raw['author']
          embed.author = Discordrb::Webhooks::EmbedAuthor.new(
            name: embed_raw['name'],
            url: embed_raw['url'],
            icon_url: embed_raw['icon_url'] )
        end

        if embed_raw['image']
          embed_raw = embed_raw['image']
          embed.image = Discordrb::Webhooks::EmbedImage.new(
            url: embed_raw['url'])
        end

      end
    end
  end
end

$bot.run
