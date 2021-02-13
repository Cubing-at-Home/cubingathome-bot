const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const prefix = require("../../config.json").prefix;

function cahError(message, error) {
    //logging errors
    fs.appendFile("./logs.txt", `${error} || ${message} || ${message.author.id}\n`, () => {
        console.log("Error logged")
    });

    const errorEmbed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle("An Error Occurred!")
        .setDescription(`<@${message.author.id}>, ${error}`)
        .setFooter(`use ${prefix}help for help`,"https://cubingathome.com/logo.png")

    //auto-delete both error and message that caused error after 5 seconds
    message.channel.send(errorEmbed)
        .then(msg => {
            msg.delete({ timeout: 5000 }).catch(err => console.log("Failed to delete"))
            message.delete({ timeout: 5000 }).catch(err => console.log("Failed to delete"))
        })
}
module.exports = cahError;