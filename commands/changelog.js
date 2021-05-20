const cahEmbed = require("../utils/components/cahEmbed");
const error = require("../utils/components/error");
const getCommits = require("../utils/github-api")

function getChangeLog() {
    return new Promise((resolve, reject) => {
        getCommits()
            .then(commits => {
                let data = [];
                for (var i=0;i<5;i++) {
                    data.push({name: `${new Date(commits[i].commit.committer.date).toLocaleString()} `, value: `[${commits[i].commit.message}](${commits[i].html_url})`})
                }
                resolve(cahEmbed("Update Logs (via Github)", data))
            })
            .catch(err => reject(err))
    })
}


function execute(message, args) {
    getChangeLog()
        .then(res => message.channel.send(res))
        .catch(err => console.log(err))
}

const slash = {
    commandData: {
        'name': 'changes',
        'description': 'View recent updates to b@h'
    },
    async slashFunc(interaction) {
        const changes = await getChangeLog();
        return { embeds: [changes] }
    }
}

module.exports = {
    name: "changelog",
    description: "Get recent updates to BottingAtHome",
    aliases: ["logs","changes"],
    slash,
    execute
}