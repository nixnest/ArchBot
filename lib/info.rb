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
  end
  
  command(:chinfo) do |event|
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
  end
end