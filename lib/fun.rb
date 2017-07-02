module Fun
  extend Discordrb::Commands::CommandContainer
  command :aesthic do |event, *args|
    args.join(' ').to_fullwidth
  end

  command :step do |event, *args|
    if args[0] == 'on'
      "<@#{event.author.id.to_s}> steps #{args.join(' ')}"
    else
      "<@#{event.author.id.to_s}> steps on #{args.join(' ')}"
    end
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
end
