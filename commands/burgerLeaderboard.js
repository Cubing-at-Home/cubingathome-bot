const cahEmbed = require("../utils/components/cahEmbed");
const getLeaderboard = require("../db/burger").getLeaderboard;
const getUsernames = require("../utils/discord-api").getUsernames;
const paginationEmbed = require("discord.js-pagination");
const { MessageEmbed } = require("discord.js");

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
                })

                const sortedUserIDs = sorted.map(elem => elem[0]);
                getUsernames(sortedUserIDs.slice(0,10))
                    .then(users => {
                        const numPages = Math.ceil(users.length/3);
                        var pages = [];
                        console.log(numPages);
                        for (i=0;i<numPages;i++) {
                            var fields = [];
                            for (j=0;j<3;j++) {
                                if (users[(3*i)+j]) {
                                    fields.push({
                                        name: `${(3*i)+j<3 ? awards[(3*i)+j] : `**${(3*i)+j+1}.**`} ${users[(3*i)+j].data.username}`, 
                                        value: sorted[(3*i)+j][1]
                                    })
                                }
                            }
                            console.log(pages);
                            pages.push(cahEmbed(":hamburger: Burger Leaderboard :hamburger:", fields));
                        }
                        paginationEmbed(message, pages)
                        .then(val => console.log("success"))
                        .catch(err => console.log(err))
                    })
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