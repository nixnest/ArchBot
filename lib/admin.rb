module Admin
  extend Discordrb::Commands::CommandContainer

  command :clear do |event, *args|
    unless $userType != 'sudoer'
      event.channel.send_message("Invalid amount") && break if args[0].to_i > 100
      toDelete = event.channel.history(args[0].to_i || 100)
      event.channel.delete_messages(toDelete)
    else
      event.channel.send_message("Permission denied") && break
    end
  end

end
