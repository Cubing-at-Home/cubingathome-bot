const db = require("./connect").defaultDB;


async function getGuildSettings(guild) {
    const guildId = guild.id;
    const guildSettings = await db.collection("GuildSettings").doc(guildId).get();
    return guildSettings.data();
}

async function createGuild(guild) {
    const guildId = guild.id;
    const guildName = guild.name;

    //check if guild already in db
    if (!await (await db.collection("GuildSettings").doc(guildId).get()).exists) {
        //create default guild entry
        await db.collection("GuildSettings").doc(String(guildId)).set({
            id: guildId,
            name: guildName,
            prefix: "s!",
            burger: 0,
            burgerCaller: null
        })
        console.log(`New guild created in db, ${guild.name} (${guild.id})`);
    } else {
        console.log("Guild exists!")
    }
}

async function deleteGuild(guild) {
    const guildId = guild.id;
    const ref = await db.collection("GuildSettings").doc(guildId).get()
    if (ref.exists) {
        await db.collection("GuildSettings").doc(String(guildId)).delete();
        console.log(`Deleted guild ${guild.name} (${guild.id}) from the db`)
    } else {
        console.log(`Attempted to delete guild ${guild.name} (${guild.id}), but does not exist?`)
    }
}

async function updateGuildSettings(guild, newPrefix) {
    const guildId = guild.id;
    await db.collection("GuildSettings").doc(String(guildId)).update({
        prefix: newPrefix
    })
}

module.exports = {
    getGuildSettings: getGuildSettings,
    createGuild: createGuild,
    deleteGuild: deleteGuild,
    updateGuildSettings: updateGuildSettings
};