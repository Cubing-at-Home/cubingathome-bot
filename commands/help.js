const { MessageEmbed } = require("discord.js");
const PREFIX = require("../config.json").prefix;

function execute(message, args) {
    const colors = [
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
    .setFooter("cubing@home", "https://cubingathome.com/logo.png")
    .addFields(
        {name: PREFIX+"scramble *[event]* *[number of scrambles, max 5]*", value: "Generates random Rubik's cube scrambles"},
        {name: PREFIX+"server", value: "Gets the number of server members"},
        {name: PREFIX+"help", value: "Returns this message"}
    )

    message.author.send(helpEmbed);

    message.reply("DM'ed!")
        .then(msg => {
            message.delete({ timeout: 5000 });
            msg.delete({ timeout: 5000 })
        })
        .catch();
}

module.exports = {
    name: "help",
    aliases: ["h"],
    description: "Returns this message",
    execute
}