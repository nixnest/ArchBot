module Fun
  extend Discordrb::Commands::CommandContainer

  command(:aesthic,
          description: "Makes a message A E S T H E T I C",
          usage: "[text to convert]",
          min_args: 1) do |event, *args|
    args.join(' ').to_fullwidth
  end

  command(:step,
          description: "Show your soles to someone or something",
          usage: "[text]",
          min_args: 1) do |event, *args|
    args.to_a.delete_at(0) if args.include?('on')
    "<@#{event.author.id.to_s}> steps on #{args.join(' ')}"
  end

  command(:slap,
          description: "Hit someone or something",
          usage: "[text]") do |event, *args|
    "<@#{event::author::id.to_s}> slaps #{args.join(' ')} around a bit with a large trout"
  end

  command(:figlet,
          description: "Turns a message into big ASCII art letters",
          usage: "[text]",
          min_args: 1) do |event, *args|
    "```" + $figlet[args.join('')] + "```" if args.length > 0
  end

  command(:cowsay,
          description: "Wraps a message with an ASCII art cow",
          usage: "[text]",
          min_args: 1) do |event, *args|
    "```" + Cowsay.say(args.join(' '), 'cow') + "```"
  end

  command(:fortune,
          description: "Outputs a random fortune / divination / bad joke") do |event|
    "```" + FortuneGem.give_fortune + "```"
  end
end
