const { MessageEmbed } = require("discord.js");

function cahError(message, error) {
    const errorEmbed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle("An Error Occurred!")
        .setDescription(`${error}`)
        .setFooter("use !help for help","https://cubingathome.com/logo.png")

    //auto-delete both error and message that caused error after 5 seconds
    message.channel.send(errorEmbed)
        .then(msg => {
            msg.delete({ timeout: 5000 })
            message.delete({ timeout: 5000 })
        })
}
module.exports = cahError;