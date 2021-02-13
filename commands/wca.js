const WCA = require("../utils/wca-api");
const error = require("../utils/components/error");
const wcaEmbed = require("../utils/components/wcaEmbed");

function execute(message, args) {
    if (args.length>1) {
        error(message, "Too many parameters!");
    } else if (args.length==0) {
        error(message, "Too few parameters!");
    } else if (!args[0].match(/\d{4}[a-zA-Z]{4}\d{2}/)) {
        error(message, "Invalid WCA ID! Example: *2016MEUN01*")
    } else {
        WCA.baseAPI(`/persons/${args}`)
        .then(data => message.channel.send(wcaEmbed(data)))
        .catch(err => {
            error(message,"Person not found!")
        })
    }
}

module.exports = {
    name: "wca",
    description: "Get WCA info",
    execute
}