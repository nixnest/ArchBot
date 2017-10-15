module Utilities
  extend Discordrb::Commands::CommandContainer

  command(:random,
          description: "Picks a random number.",
          usage: "<min> <max>",
          min_args: 2) \
  do |event|
    # Parse the message and keep all parts but the command
    # ["::random 1 2 4 5  -5"] => ["1", "2", "4", "5", "-5"]
    args = (event.message.content.split (' '))[1 .. -1]

    # Args to integer
    input = Array.new(args.size){ |i| args[i].to_i }

    case input.size
    when 0
      # Integer "limits" (there's no such thing in ruby though)
      min = -(2**(0.size * 8 -2))
      max = min.abs
    when 1
      min = 0
      max = 0
      # If one args is given, the result will be of the same sign as the arg
      input[0] >= 0? max = input[0] : min = input[0]
    else
      min = input.min
      max = input.max
    end
    rand(min .. max)
  end

  command(:echo,
          description: "Echoes text.",
          usage: "[text to echo]",
          min_args: 1) \
  do |event, *args|
    args.join(' ')
  end

  command(:lusers,
          description: "Prints the amount of lusers currently online.",
          usage: "!lusers") \
  do |event|
    "Amount of lusers currently #{$config['lusersList'].sample}: #{event.server.online_users(include_idle: true).length.to_s}"
  end

  command(:checksudo,
          description: "Prints if you're a sudoer",
          usage: "!checksudo") \
  do |event|
    "You are a #{event.user.roles.include?($config['sudoersRole'])?'sudoer':'regular user'}."
  end
end
