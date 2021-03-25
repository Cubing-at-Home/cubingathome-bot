const burger = require("../db/burger").burger;
const getUsername = require("../utils/discord-api").getUsername;

function execute(message, args) {
    burger(message)
        .then(data => {
            console.log(data);
            if (data == "set") {
                message.channel.send("🍔")
            } else {
                getUsername(data.burgerCaller)
                    .then(user => {
                        message.channel.send(`Burger was already called by **${user.username}**, and can be called again in ${Math.floor(new Date(data.burger - new Date().getTime()).getTime()/(1000*60*60)*100)/100} hours.`)
                    })
                    .catch(err => message.channel.send("An error occurred!") && console.log(err))
            }
        })
}

module.exports = {
    name: "burger",
    cooldown: 15,
    execute
}
