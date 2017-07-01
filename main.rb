require 'discordrb'
require 'fullwidth'
require 'yaml'
require_relative 'lib/utilities'
require_relative 'lib/fun'
require_relative 'lib/info'

$config = YAML.load_file('config.yaml')
$info = YAML.load_file('info.yaml')

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

$bot.run
