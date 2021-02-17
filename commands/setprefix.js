const error = require("../utils/components/error");
const { setPrefix } = require("../db/connections/guilds/guild");

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
        setPrefix(message.guild.id,args)
            .then(res=>{
                message.channel.send(`Successfully set prefix to **${args}**`);
            })
            .catch(err=>{
                error(message, "Failed to set new prefix!");
            })

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