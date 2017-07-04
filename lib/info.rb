module Info
  extend Discordrb::Commands::CommandContainer
  command(:info) do |event|
    if event.message.mentions.length == 1
      @user = event.message.mentions[0]
    else
      @user = event.message.author
    end
    $info = YAML.load_file('info.yaml')
    if $info.include? @user.id
        "Info for <@#{@user.id.to_s}>: ```#{$info[@user.id]}```"
      else
        "No info found for <@#{@user.id.to_s}>."
    end
  end

  command(:chinfo) do |event, *args|
    event.message.reply('if you\'re trying to remove a bad info, just use rminfo instead') and break if event.user.roles.include?($config['sudoresRole']) or args.empty?
    yamlInfo = File.read 'info.yaml'
    currentInfo = YAML.load yamlInfo
    currentInfo[event.user.id] = args.join(' ')
    toWrite = YAML.dump currentInfo
    File.write('info.yaml', toWrite)
    "Info added."
  end

  command(:rminfo) do |event|
    yamlInfo = File.read 'info.yaml'
    currentInfo = YAML.load yamlInfo
    currentInfo[event.user.id] = ''
    toWrite = YAML.dump currentInfo
    File.write('info.yaml', toWrite)
    "Information removed."
  end
end
