function execute(message, args) {
    message.channel.send("🍔");
}

module.exports = {
    name: "burger",
    description: "burger",
    cooldown: 60 * 60,
    execute
}