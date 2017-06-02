# ArchBot

Bot for the /r/archlinux Discord. Right now, it has 3 commands:

- `!info @user`: gives you the set info on a user
- `!chinfo <info>`: changes your listing
- `!rminfo <info>`: removes your listing

## Installation

Move `db_sample.json` to `db.json` and `config_sample.json` to `config.json`
In config.json, add your Discord bot token.
```sh
$ npm install
$ node main.js```
