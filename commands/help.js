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
    .addFields(
        {name: "scramble *[event]* *[num scrambles]*", value: "Generates random Rubik's cube scrambles, AND pictures of the scrambles (available for 30 seconds)"},
        {name: "*[event]* *[num scrambles]*", value: "Same command as above but shorter!"},
        {name:"server", value: "Gets the number of server members"},
        {name: "help", value: "Returns this message"},
        {name:  "wca *[WCA ID]*", value:"Get a person's WCA profile"},
        {name: "avg", value:"Quickly get the ao5 or mo3 of a number of times (times must be in *(mm:)ss.mm(m)* format)"},
        {name: "invite", value: "Invite BottingAtHome to your own server!"},
        {name: "changes", value: "View recent updates to BottingAtHome"},
        {name: "suggest", value: "Suggest changes, report bugs, and give feedback *(misuse will result in a ban from using this command!)*"},
        {name: "setprefix", value: "Set a new prefix for BottingAtHome for your server! Restrictions apply"},
        {name: "Found a bug? Report below, DM **@LOUIS#3375**, or use suggest!", value:"[Github](https://github.com/louismeunier/cubingathome-bot/blob/main/README.md)"}
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