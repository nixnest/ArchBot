module Utilities
  extend Discordrb::Commands::CommandContainer
  command(:random,
          description: "Picks a random number.",
          usage: "[min] [max]",
          min_args: 2,
          max_args: 2) do |event, min, max|
    if min && max
      rand(min.to_i .. max.to_i)
    end
  end

  command(:bold,
          description: "Makes a message bold.",
          usage: "[text to bold]",
          min_args: 1) do |event, *args|
    '**' + args.join(' ') + '**'
  end

 command(:echo,
          description: "Echoes text.",
          usage: "[text to echo]",
          min_args: 1) do |event, *args|
    args.join(' ')
  end

 command(:lusers,
         description: "Prints the amount of lusers currently online.",
         usage: "!lusers",
         min_args: 0) do |event|
    "Amount of lusers currently #{$config['lusersList'].sample}: " + event.server.online_users(include_idle: true).length.to_s
 end

 command(:checksudo,
         description: "Prints if you're a sudoer",
         usage: "!checksudo",
         min_args: 0) do |event|
    "You are a " + (event.user.roles.include?($config['sudoersRole']) ? "sudoer." : "regular user.")
 end
end
