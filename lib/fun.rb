module Fun
  extend Discordrb::Commands::CommandContainer
  command :aesthic do |event, *args|
    args.join(' ').to_fullwidth
  end

  command :step do |event, *args|
    args.to_a.delete_at(0) if args.include?('on')
    "<@#{event.author.id.to_s}> steps on #{args.join(' ')}"
  end

  command :slap do |event, *args|
    "<@#{event::author::id.to_s}> slaps #{args.join(' ')} around a bit with a large trout"
  end

  command :figlet do |event, *args|
    "```" + $figlet[args.join('')] + "```"
  end

  command :cowsay do |event, *args|
    "```" + Cowsay.say(args.join(' '), 'cow') + "```"
  end

  command :fortune do |event|
    "`" + FortuneGem.give_fortune + "`"
  end
end
