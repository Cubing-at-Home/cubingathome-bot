const cahEmbed = require("../utils/components/cahEmbed");

const error = require("../utils/components/error");

const getCommits = require("../utils/github-api")

function execute(message, args) {
    getCommits()
        .then(commits => {
           //only going to use 5 most recent;
           let data = [];
            for (var i=0;i<5;i++) {
    
                data.push({name: `${new Date(commits[i].commit.committer.date).toLocaleString()} `, value: `[${commits[i].commit.message}](${commits[i].html_url})`})
            }
            message.channel.send(cahEmbed("Update Logs (via Github)", data));
        })
        .catch(err => error(message, err))
}

module.exports = {
    name: "changelog",
    description: "Get recent updates to BottingAtHome",
    aliases: ["logs","changes"],
    execute
}