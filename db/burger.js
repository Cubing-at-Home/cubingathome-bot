const db = require("./connect").defaultDB;

async function burger(message) {
    const guildId = message.guild.id;

    let res = "";
    await db
        .collection("GuildSettings")
        .doc(guildId)
        .get()
        .then(async guildData => {
            const burgerLast = guildData.data().burger;
            if (new Date().getTime() > burgerLast) {
                await db.collection("GuildSettings").doc(guildId).update({
                    burger: new Date().getTime() + (12 * 60 * 60 * 1000),
                    burgerCaller: message.author.id
                })
                res = "set"
            } else {
                res = guildData.data();
            }
        })
        return res;
}

module.exports = {
    burger: burger
}