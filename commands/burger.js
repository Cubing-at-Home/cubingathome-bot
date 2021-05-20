const burger = require("../db/burger").burger;
const getUsername = require("../utils/discord-api").getUsername;

function callBurger(messageID, guildID, _args) {
    return new Promise((resolve, reject) => {
        burger(messageID, guildID)
            .then(data => {
                if (data=="set") {
                    resolve("🍔");
                } else {
                    getUsername(data.burgerCaller)
                        .then(user => {
                            resolve(`Burger was already called by **${user.username}**, and can be called again in ${Math.floor(new Date(data.burger - new Date().getTime()).getTime()/(1000*60*60)*100)/100} hours.`)
                        })
                        .catch(err => {
                            reject("An error occurred!")
                        })
                }
        })
    })
}


function execute(message, args) {
    callBurger(message.author.id, message.guild.id)
        .then(res => message.channel.send(res))
        .catch(err => console.log(err))
}

const slash = {
    commandData: {
        name: 'burger',
        description: 'Can you get the burger?'
    },
    async slashFunc(interaction) {
        const burger = await callBurger(interaction.member.user.id, interaction.guild_id);
        return {'content': burger}
    }
}

module.exports = {
    name: "burger",
    aliases: ["aaron"],
    cooldown: 15,
    slash,
    execute
}
