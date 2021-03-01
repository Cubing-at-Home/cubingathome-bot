const burger = require("../db/burger").burger;

function execute(message, args) {
    burger(message)
        .then(data => {
            console.log(data);
            if (data == "set") {
                message.channel.send("🍔")
            } else {
                message.channel.send(`Burger was already called by **${message.guild.member(data.burgerCaller).displayName}**, and can be called again in ${Math.floor(new Date(data.burger - new Date().getTime()).getTime()/(1000*60*60)*100)/100} hours.`)
            }
        })

}

module.exports = {
    name: "burger",
    cooldown: 15,
    execute
}