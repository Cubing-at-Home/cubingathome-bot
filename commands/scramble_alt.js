const scr = require("../utils/scr");
const scramble = require("./scramble");
//can call scramble with any of the aliases from the main command
let aliases = [];
scramble.scrTypes.forEach(scr => {
   aliases = aliases.concat(scr.aliases)
})

function execute(message, args) {
    scramble.execute(message,[message.content.split("!")[1].split(" ")[0],...args])
}

module.exports = {
    name:"3",
    aliases: aliases,
    cooldown: 2.5,
    description: "Generates Rubik's Cube scrambles",
    execute
}