const error = require("../utils/components/error");
const suggest = require("../db/connections/suggest");

function execute(message, args) {
    if (!args) {error(message, "No suggestion given!");return;}
    if (args.join(" ").length>100) {error(message, "Too long! Please make suggestions concise.");return;}
    suggest(message.author.id, args.join(" "))
        .then(suggestionReg => {
            if (suggestionReg==="passed") {
                message.reply("Your suggestion has been received! You will be DM'ed if your suggestion is considered/denied. **MISUSE OF THE SUGGEST COMMAND WILL RESULT IN YOU BEING BLACKLISTED FROM USING IT**");
            } else if (suggestionReg==="many") {
                error(message, "You have suggested too many times! Please wait for one of your suggestions to be approved/denied. ");
            } else if (suggestionReg==="banned") {
                error(message, "You are banned from suggesting! Contact `@LOUIS#3375` if you believe this is an error.")
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