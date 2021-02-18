// const burger = require("../db/connections/jokes/globalBurger");

// function execute(message, args) {
//     burger()
//         .then(response => {
//             if (response==="set") {
//                 message.channel.send("🍔");
//             } else {
//                 message.channel.send(`Burger was already called recently, and can be called again in ${Math.round(((parseInt(response)-new Date().getTime())/(1000*60*60))*100)/100} hours. Good luck!`)
//             }
//         })
//         .catch(err => {
//             console.error(err);
//         })
// }

// module.exports = {
//     name: "burger",
//     description: "burger",
//     cooldown: 10,
//     execute
// }