const cahEmbed = require("../utils/components/cahEmbed");
const getLeaderboard = require("../db/burger").getLeaderboard;
const getUsernames = require("../utils/discord-api").getUsernames;
const paginationEmbed = require("discord.js-pagination");
const { MessageEmbed } = require("discord.js");

function getBurgerLeaderboard(guildID) {
    return new Promise((resolve, reject) => {
        getLeaderboard(guildID)
            .then(res => {
                if (!!!res) {
                    reject("There is no leaderboard for this guild yet.");
                } else {
                    //let fields = [];
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
                            //console.log(numPages);
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
                                //console.log(pages);
                                pages.push(cahEmbed(":hamburger: Burger Leaderboard :hamburger:", fields));
                            }
                            resolve(pages);
                        })
                        .catch(err => reject(err))
                }
            })
    })
}
function execute(message, args) {
    getBurgerLeaderboard(message.guild.id)
        .then(res => paginationEmbed(message, res))
        .catch(err => {
            if (typeof err == Error) {
                console.log(err)
            } else {
                message.channel.send(err)
            }
        })
}

const slash = {
    commandData: {
        'name': 'leaderboard',
        'description': 'See the top 3 burger-getters per server'
    },
    async slashFunc(interaction) {
        const leaderboard = await getBurgerLeaderboard(interaction.guild_id);
        return {'embeds': [leaderboard[0]]}
    }
}
module.exports = {
    name: "leaderboard",
    aliases: ["burgerleaderboard", "burgertop"],
    cooldown: 5,
    slash,
    execute
}