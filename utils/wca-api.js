const axios = require("axios")

function baseAPI(route) {
    const BASE_URL = "https://worldcubeassociation.org/api/v0";
    return new Promise((resolve, reject) => {
        axios.get(BASE_URL+route)
            .then(response=>resolve(response.data))
            .catch(error=>reject(error))
    })
    
}

const WCA = {
    baseAPI: baseAPI
}
module.exports = WCA;