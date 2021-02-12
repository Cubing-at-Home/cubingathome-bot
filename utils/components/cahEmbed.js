const { MessageEmbed } = require("discord.js")

function cahEmbed(title,fields) {
    const colors = [
        "#ff0000",
        "#00ff00",
        "#ffa500",
        "#ffff00",
        "#0000ff"
    ]
    const rand = Math.floor(Math.random()*5);
    const color = colors[rand];

    const res = new MessageEmbed()
        //.setAuthor(author.name,author.icon)
        .setColor(color)
        .setTitle(title)
        .setFooter("cubing@home","https://cubingathome.com/logo.png")
    fields.forEach(field=>{
        res.addField(field.name,field.value)
    })
    return res;
}

module.exports = cahEmbed;