const { MessageEmbed } = require("discord.js");
const prefix = process.env.NODE_ENV === 'production' ? require("../../config.json").prefix : require("../../config.json").devPrefix;


function cahError(message, error) {
    //console error logging
    console.log("\x1b[41m%s\x1b[0m","Error")
    console.log("\x1b[33m%s\x1b[0m", `${message.content} || @${message.author.username} (#${message.author.id}) || ${error}`)

    const errorEmbed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle("An Error Occurred!")
        .setDescription(`<@${message.author.id}>, ${error}`)
        .setFooter(`use ${prefix}help for help`,"https://cubingathome.com/logo.png")

    //auto-delete both error and message that caused error after 5 seconds
    message.channel.send(errorEmbed)
        .then(msg => {
            msg.delete({ timeout: 3000 }).catch(err => console.log("Failed to delete"))
            message.delete({ timeout: 3000 }).catch(err => console.log("Failed to delete"))
        })
}
module.exports = cahError;