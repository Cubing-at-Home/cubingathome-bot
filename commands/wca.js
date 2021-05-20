const WCA = require("../utils/wca-api");
const error = require("../utils/components/error");
const wcaEmbed = require("../utils/components/wcaEmbed");

function getWCAProfile(args) {
    return new Promise((resolve, reject) => {
        if (args.length>1) {
            reject("Too many parameters!");
        } else if (args.length==0) {
            reject("Too few parameters!");
        } else if (!args[0].match(/\d{4}[a-zA-Z]{4}\d{2}/)) {
            reject("Invalid WCA ID! Example: *2016MEUN01*")
        } else {
            WCA.baseAPI(`/persons/${args}`)
            .then(data => resolve(wcaEmbed(data)))
            .catch(err => {
                reject("Person not found!")
            })
        }
    })
}

function execute(message, args) {
    getWCAProfile(args)
        .then(res => message.channel.send(res))
        .catch(err => error(message, err))
}

const slash = {
    commandData: {
        name: 'wca',
        description: 'Get basic info from someone\'s WCA ID',
        options: [{
            type: 3,
            required: true,
            name: "id",
            description: "A valid WCA ID, ie 2016MEUN01"
        }]
    },
    async slashFunc(interaction) {
        try {
            const response = await getWCAProfile([interaction.data.options[0].value])
            return {
                embeds: [response]
            }
        } catch(err) {
            return {
                content: err
            }
        }
    }
}
module.exports = {
    name: "wca",
    description: "Get WCA info",
    cooldown: 5,
    slash,
    execute
}