const cahEmbed = require("../utils/components/cahEmbed");
const getLeaderboard = require("../db/burger").getLeaderboard;
const getUsernames = require("../utils/discord-api").getUsernames;

function execute(message, args) {
    getLeaderboard(message.guild.id)
        .then(res => {
            if (!!!res) {
                message.channel.send("There is no leaderboard for this guild yet.");
            } else {
                let fields = [];
                const awards = ["🥇", "🥈", "🥉"];

                var sorted = [];
                for (var tbs in res) {
                    sorted.push([tbs, res[tbs]])
                }
                sorted = sorted.sort((a, b) => {
                    return b[1]-a[1]
                }).slice(0,2)

                const sortedUserIDs = sorted.map(elem => elem[0]);
                getUsernames(sortedUserIDs)
                    .then(users => {
                        users.forEach((user, key) => {
                            fields.push({
                                name: `${awards[key]} ${user.data.username}`,
                                value: sorted[key][1]
                            })
                        })
                    })
                    .then(_ => message.channel.send(cahEmbed("Burger Leaderboard :hamburger:", fields)))
                    .catch(err => console.log(err))
            }
        })
}

module.exports = {
    name: "leaderboard",
    aliases: ["burgerleaderboard", "burgertop"],
    cooldown: 5,
    execute
}