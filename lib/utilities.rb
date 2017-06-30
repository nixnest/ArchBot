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
end