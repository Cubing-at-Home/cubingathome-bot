const error = require("../utils/components/error");
const { updateGuildSettings } = require("../db/guilds");
//won't be slashing this either, just because of the irony it causes lol

function execute(message, args) {
    //must be admin
    if (!message.member.permissions.has("ADMINISTRATOR")) {
        error(message, "You must be an administrator to use this command!");
        return;
    }
    const validPrefix = new RegExp(/([a-zA-z])?[!\$&^|\*\?]$/gm);

    if (args.length>1) {
        error(message, "Too many arguments!");
        return;
    } 
    const newPrefix = args[0];
    if(newPrefix.match(validPrefix)) {
        updateGuildSettings(message.guild,newPrefix)
            .then(_=>message.channel.send(`Updated prefix to **${newPrefix}**`))
    } else {
        error(message, "Invalid prefix! Must match this Regular Expression: `/([a-zA-z])?[!\$&^|\*\?]$/`")
    }
}

module.exports = {
    name: "setprefix",
    description: "Set the prefix",
    cooldown: 120,
    execute
}