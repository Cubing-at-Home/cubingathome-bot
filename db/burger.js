const db = require("./connect").defaultDB;

async function burger(authorID, guildID) {
    //needs guild id and author id
    //const guildId = message.guild.id;

    let res = "";
    await db
        .collection("GuildSettings")
        .doc(guildID)
        .get()
        .then(async guildData => {
            const burgerLast = guildData.data().burger;
            if (new Date().getTime() > burgerLast) {
                const oldLeaderboard = guildData.data().burgerLeaderboard ? guildData.data().burgerLeaderboard : {};
                oldLeaderboard[authorID] 
                    ? oldLeaderboard[authorID] ++
                    : oldLeaderboard[authorID] = 1 
                await db.collection("GuildSettings").doc(guildID).update({
                    burger: new Date().getTime() + (6 * 60 * 60 * 1000),
                    burgerCaller: authorID,
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