const { MessageEmbed } = require("discord.js");
const PREFIX = require("../config.json").prefix;
const error = require("../utils/components/error")
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
    .setFooter("cubing@home", "https://cubingathome.com/logo.png","https://cubingathome.com")
    .addFields(
        {name: PREFIX+"scramble *[event]* *[number of scrambles, max 5]*", value: "Generates random Rubik's cube scrambles"},
        {name: PREFIX+"server", value: "Gets the number of server members"},
        {name: PREFIX+"help", value: "Returns this message"},
        {name: PREFIX +"wca *[WCA ID]*", value:"Get a person's WCA profile"},
        {name: "Details:", value:"[Documentation](https://github.com/louismeunier/cubingathome-bot/blob/main/README.md"}
    )

    message.author.send(helpEmbed);

    message.reply("DM'ed!")
        .then(msg => {
            message.delete({ timeout: 5000 }).catch(err => error("Failed to delete",err))
            msg.delete({ timeout: 5000 }).catch(err => error("Failed to delete",err))
        })
        .catch(err=>error("Failed to DM", err));
}

module.exports = {
    name: "help",
    aliases: ["h"],
    cooldown: 5,
    description: "Returns this message",
    execute
}