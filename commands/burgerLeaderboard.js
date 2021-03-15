const cahEmbed = require("../utils/components/cahEmbed");
const getLeaderboard = require("../db/burger").getLeaderboard;

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
                sorted.sort((a, b) => {
                    return b[1]-a[1]
                })

                for (var i=0; i<3; i++) { 
                    if (!sorted[i]) {
                        i=3;
                    } else {
                        //.console.log(message.client.users.cache.get(sorted[i][0]).username)
                        fields.push({
                            name: `${awards[i]} ${message.client.users.cache.get(sorted[i][0]) ? message.client.users.cache.get(sorted[i][0]).username : "Gone :("}`,
                            value: sorted[i][1]
                        })
                    }
                }
                message.channel.send(cahEmbed("Burger Leaderboard :hamburger:", fields))
            }
        })
}

module.exports = {
    name: "leaderboard",
    aliases: ["burgerleaderboard", "burgertop"],
    cooldown: 5,
    execute
}