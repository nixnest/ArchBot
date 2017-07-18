module Admin
  extend Discordrb::Commands::CommandContainer

  command :clear do |event, *args|
    unless $userType != 'sudoer'
      event.channel.history(args[0].to_i || $config['defaultClearAmount']).each do |message|
        event.channel.delete_message(message.id)
      end
      break #THIS IS VITAL DO NOT REMOVE
    else
      event.channel.send_message("Permission denied") && break
    end
  end

end
