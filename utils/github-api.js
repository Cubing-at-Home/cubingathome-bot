const axios = require("axios");

const GITHUB_API = "https://api.github.com/repos/louismeunier/cubingathome-bot/commits";

function getCommits() {
    return new Promise((resolve, reject) => {
        axios.get(GITHUB_API)
            .then(commits => {
                resolve(commits.data)
            })
            .catch(error => {
                reject(error);
            })
    })
}

module.exports = getCommits;