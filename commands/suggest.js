const error = require("../utils/components/error");
const { addSuggestion } = require("../db/suggest");

function execute(message, args) {
    if (!args || args.length==0) {error(message, "No suggestion given!");return;}
    if (args.join(" ").length>100) {error(message, "Too long! Please make suggestions concise.");return;}
    addSuggestion(message.author, args.join(" "))
        .then(suggestionReceived => {
            if (suggestionReceived) {
                message.reply("Thanks for the suggestion! You can check the status of your suggestions at any time with **suggestions**");
            } else {
                error(message, "You are banned from suggesting! If you think this is a mistake, please contact **@LOUIS#3375**")
            }
        })
        .catch(err => {
            error(message, err);
        })
}

module.exports = {
    name: "suggest",
    description: "Suggest changes/new features!",
    cooldown: 60,
    execute
}