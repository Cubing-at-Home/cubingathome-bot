const getSuggestions = require("../db/connections/suggestions/suggest").getSuggestions; 
//suggestion.progress can be "new", "denied", "in progress", "considering", "completed"


function execute(message, args) {
    console.log(message.author.id);
    getSuggestions(message.author.id)
        .then(suggestions => {
            if (suggestions.length===0) {
                message.channel.send("You haven't made any suggestions! Use **suggest** to make a suggestion.");
            } else {
                message.channel.send("Your current queue of suggestions:")
                suggestions.forEach(s => {
                    switch (s.progress) {
                        case "new":
                            message.channel.send("```css\n [new: "+s.suggestion+"]```");
                            break;
                        case "denied":
                            message.channel.send("```diff\n- denied: "+s.suggestion+"```");
                            break;
                        case "considering":
                            message.channel.send("```fix\n considering:" +s.suggestion+"```");
                            break;
                        case "completed":
                            message.channel.send("```bash\n \"completed: " +s.suggestion+"```");
                    }
                })
            }
            })
}

module.exports = {
    name:"suggestions",
    description: "View your previous suggestions' status",
    execute
}