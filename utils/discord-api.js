const { default: axios } = require("axios")

const DISCORD_API = "https://discord.com/api/v6/";
const TOKEN = process.env.NODE_ENV === 'production' ? process.env.TOKEN : process.env.DEV_TOKEN;

function getUsername(userID) {
    return new Promise((resolve, reject) => {
        axios.get(`${DISCORD_API}users/${userID}`, {
            headers: {
                "Authorization": `Bot ${TOKEN}`
            }
        })
            .then(user => resolve(user.data))
            .catch(err => reject(err))
    }) 
}

function getUsernames(userIDs) {
    return new Promise((resolve, reject) => {
        const requests = userIDs.map(userID => axios.get(`${DISCORD_API}users/${userID}`, {headers: {"Authorization": `Bot ${TOKEN}`}}))
        axios.all(requests)
            .then(axios.spread((...users) => {
                resolve(users)
            }))
            .catch(err => reject(err))
    }) 
}

module.exports = {
    getUsername: getUsername,
    getUsernames: getUsernames
}