function execute(message, args) {
    if (message.author.id === "493205788098035712") {
        message.author.send(args.join(" ") || "No message")
            .then(_=>message.delete());
    } else {
        message.reply("You don't have permission to do that!")
            .then(msg=>{
                message.delete({ timeout: 2000 });
                msg.delete({ timeout: 2000 })
            })
    }
}

module.exports = {
    name: "bugreport",
    aliases: ["bug"],
    execute
}