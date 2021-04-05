const { MessageEmbed } = require("discord.js");
//const PREFIX = process.env.NODE_ENV === 'production' ? require("../config.json").prefix : require("../config.json").devPrefix;
const error = require("../utils/components/error")
function execute(message, args) {
    const colors = [
        "#FFFFFD",
        "#ff0000",
        "#00ff00",
        "#ffa500",
        "#ffff00",
        "#0000ff"
    ]
    const rand = Math.floor(Math.random()*5);
    const color = colors[rand];
    
    const helpEmbed = new MessageEmbed()
    .setTitle("Commands & Information")
    .setColor(color)
    .setFooter("cubing@home", "https://cubingathome.com/logo.png","https://cubingathome.com")
    .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Blue_question_mark_icon.svg/1200px-Blue_question_mark_icon.svg.png")
    .addFields(
        {name: "Commands:", value: "https://github.com/Cubing-at-Home/cubingathome-bot/tree/main/docs/README.md"}
    )

    message.author.send(helpEmbed)
        .then(
            _ => {
                message.reply("DM'ed!")
                    .then(msg => {
                        message.delete({ timeout: 5000 }).catch(err => error("Failed to delete",err))
                        msg.delete({ timeout: 5000 }).catch(err => error("Failed to delete",err))
                    })
            }
        )
        .catch(err => {
            error(message, "Failed to DM you, please turn on your DM's from server mutuals!")
        })
    
}

module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 5,
    description: "Returns this message",
    execute
}