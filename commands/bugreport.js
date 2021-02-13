const error = require("../utils/components/error")

function execute(message, args) {
    if (message.author.id === "493205788098035712") {
        message.author.send(args.join(" ") || "No message")
            .then(_=>message.delete().catch(err => error("Failed to delete",err)));
    } else {
        message.reply("You don't have permission to do that!")
            .then(msg=>{
                message.delete({ timeout: 2000 }).catch(err=>error("Failed to delete",err))
                msg.delete({ timeout: 2000 }).catch(err=>error("Failed to delete",err))
            })
    }
}

module.exports = {
    name: "bugreport",
    aliases: ["bug"],
    execute
}