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
                const oldLeaderboard = guildData.data().burgerLeaderboard ? guildData.data().burgerLeaderboard : {};
                oldLeaderboard[message.author.id] 
                    ? oldLeaderboard[message.author.id] ++
                    : oldLeaderboard[message.author.id] = 1 
                await db.collection("GuildSettings").doc(guildId).update({
                    burger: new Date().getTime() + (12 * 60 * 60 * 1000),
                    burgerCaller: message.author.id,
                    burgerLeaderboard: oldLeaderboard
                })
                res = "set"
            } else {
                res = guildData.data();
            }
        })
        return res;
}

async function getLeaderboard(guildId) {
    return new Promise((resolve, reject) => {
        db
            .collection("GuildSettings")
            .doc(guildId)
            .get()
            .then(async guildData => {
                resolve(guildData.data().burgerLeaderboard)
            })
    })
    
}

module.exports = {
    burger: burger,
    getLeaderboard: getLeaderboard
}