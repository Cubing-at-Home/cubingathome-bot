const { MessageEmbed, Message } = require("discord.js");

function wcaEmbed(person) {
    const personEmbed = new MessageEmbed()
        .setAuthor(person.person.country_iso2,`https://www.countryflags.io/${person.person.country_iso2}/flat/64.png`)
        .setTitle(`${person.person.name}`)
        .setColor("#F8C300")
        .setImage(person.person.avatar.thumb_url)
        .setDescription(`[${person.person.wca_id}](https://worldcubeassociation.org/persons/${person.person.wca_id})`)
        if (person.person.teams.length>0) {
            personEmbed.setFooter(person.person.teams.map(team=>team.friendly_id).join(", "))
        }
    personEmbed.addFields(
        {name: "🥇", value: person.medals.gold, inline: true},
        {name: "🥈", value: person.medals.silver, inline: true},
        {name: "🥉", value: person.medals.bronze, inline: true}
    )
   
    return personEmbed;
}

module.exports = wcaEmbed;