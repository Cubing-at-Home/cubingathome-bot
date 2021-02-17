const burger = require("../db/connections/jokes/globalBurger");

function execute(message, args) {
    burger()
        .then(response => {
            if (response==="set") {
                message.channel.send("🍔");
            } else {
                message.channel.send(`Burger was already called recently, and can be called again ${new Date(parseInt(response)-new Date().getMilliseconds()).getHours()}`)
            }
        })
        .catch(err => {
            console.error(err);
        })
}

module.exports = {
    name: "burger",
    description: "burger",
    cooldown: 30,
    execute
}