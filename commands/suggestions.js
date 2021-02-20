const { getSuggestions } = require("../db/suggest");
const error = require("../utils/components/error");

function execute(message, args) {
    getSuggestions(message.author)
        .then(suggestions => {
            if (!suggestions) {
                error(message, "You are banned from suggesting! If you think this is a mistake, please contact **@LOUIS#3375**");
            } else {
                if (suggestions.length===0) {
                    message.channel.send("You have not suggested, use **suggest** to start!")
                } else {
                    message.channel.send("**Your current suggestions:**")
                    suggestions.forEach(suggestion=>message.channel.send("> " + suggestion))
                }
            }
        })
}

module.exports = {
    name:"suggestions",
    description: "View your previous suggestions' status",
    execute
}