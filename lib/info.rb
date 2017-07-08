module Info
  extend Discordrb::Commands::CommandContainer

  def infoWrite(index, message)
    yamlInfo = File.read $infofile
    currentInfo = YAML.load yamlInfo
    currentInfo[index] = message
    toWrite = YAML.dump currentInfo
    File.write($infofile, toWrite)
  end

  module_function :infoWrite

  command(:info) do |event|
    if event.message.mentions.length == 1
      @user = event.message.mentions[0]
    else
      @user = event.message.author
    end
    info = YAML.load_file($infofile)
    if info.include? @user.id and info[@user.id] != ''
        "Info for <@#{@user.id.to_s}>: ```#{info[@user.id]}```"
      else
        "No info found for <@#{@user.id.to_s}>."
    end
  end

  command(:chinfo) do |event, *args|
    event.message.reply('if you\'re trying to remove a bad info, just use rminfo instead') and break if args.empty?
    msgParsed = event.message.content
    msgParsed.sub!(/^.\bchinfo\b\s/, '')
    Info.infoWrite(event.user.id, msgParsed)
    "Info added."
  end

  command(:rminfo) do |event, *args|
    if ! args.empty?
      $userType == 'sudoer' ? Info.infoWrite(args.id, '') : event.channel.send("Permission denied.") && break
    else
      Info.infoWrite(event.user.id, '')
    end
    "Information removed."
  end
end
