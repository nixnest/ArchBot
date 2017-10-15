module Admin
  extend Discordrb::Commands::CommandContainer

  command(:clear,
          description: "Clears N amount of messages. If no arguments are " \
                       "specified, 100 messages will be cleared. " \
                       "Requires superuser",
          help_available: false) \
  do |event, *args|
    unless $userType != 'sudoer'
      event.channel.send_message("Invalid amount") &&
        break if args[0].to_i > 100
      toDelete = event.channel.history(args.empty? ? 100 : args[0].to_i+1)
      event.channel.delete_messages(toDelete)
      "Clearing..."
    else
      "Permission denied."
    end
  end

  command(:timeout,
          description: "Times out a user for N seconds. Requires superuser",
          min_args: 2,
          usage: "[user to timeout] [seconds of timeout]",
          help_available: false) \
  do |event, *args|
    unless $userType != 'sudoer'
      timeOut = fork do
        user = event.message.mentions[0].on($config['serverID'])
        user.add_role($config['timeoutRole'])
        sleep args[1].to_i
        user.remove_role($config['timeoutRole'])
        "#{user.name} timed out for #{args[1].to_i}"
      end
      puts Process.detach(timeOut) #This puts is imporant so the thread ID
    else                           #Doesn't get outputted by the bot
      "Permission denied."
    end

  end
end
