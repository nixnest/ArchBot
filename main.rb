#!/usr/bin/env ruby

require 'discordrb'
require 'fullwidth'
require 'yaml'
require 'figlet'
require 'cowsay'
require 'fortune_gem'

require_relative 'lib/patches'
require_relative 'lib/utilities'
require_relative 'lib/fun'
require_relative 'lib/admin'

$config = YAML.load_file('config.yaml')
$pasta = YAML.load_file('pasta.yaml')

# Figlet initialization
$figlet = Figlet::Typesetter.new(Figlet::Font.new("fonts/#{$config['figletFont']}.flf"))

$bot = Discordrb::Commands::CommandBot.new(token: $config['token'],
                                           prefix: $config['prefix'],
                                           advanced_functionality: true,
                                           spaces_allowed: true,
                                           chain_delimiter: '|',
                                           previous: '-',
                                           ignore_bots: true,
                                           command_doesnt_exist_message: 'zsh: command not found')

$bot.include! Utilities
$bot.include! Fun
$bot.include! Admin

$user_type = 'normal'

$bot.command :sudo do |event, *args|
  if event.author.roles.select { |role| role.id == $config['roles']['sudoersRole'] }.empty?
    event.channel.send_message("<@#{event.author.id}> is not in the sudoers file. This incident will be reported.")
  else
    run_command = args[0]
    args.slice!(0)
    $user_type = 'sudoer'
    $bot.execute_command(run_command.to_sym, event, args)
    $user_type = 'normal'
  end
  break # Avoids garbage messages
end

$pasta.keys.each do |pasta| # Slightly improved
  $bot.command pasta.to_sym do |event, *args|
    catch :RegexError do
      sed = []
      args.each { |string| string.split('/').each { |subs| sed.push(subs) } }
      $pasta = YAML.load_file('pasta.yaml') # Required to reload the pastas
      message = $pasta[pasta]
      unless sed.empty?
        sed.each_slice(2) do |match, replace|
          begin
            message.gsub!(/#{match}/i, replace || '')
          rescue RegexpError
            event.channel.send_message('Error: Invalid Regex')
            throw :RegexError
          end
        end
      end
      event.channel.send_message(message)
    end
  end
end

$bot.run
