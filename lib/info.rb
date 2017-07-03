module Info
  extend Discordrb::Commands::CommandContainer
  command(:info) do |event|
    if event.message.mentions.length == 1
      @user = event.message.mentions[0]
    else
      @user = event.message.author
    end
    if $info.include? @user.id
        "Info for <@#{@user.id.to_s}>: ```#{$info[@user.id]}```"
      else
        "No info found for <@#{@user.id.to_s}>."
    end

  command(:chinfo) do |event, *args|
    event.message.reply \
      ('if you\'re trying to remove a bad info, just use rminfo instead') and break if \
      event.user.roles.include?($config['sudoresRole']) or \
      args.empty?
    $info[event.user] = '```' + args + '```'
    File.write($info, $info.to_yaml)
  end
end
