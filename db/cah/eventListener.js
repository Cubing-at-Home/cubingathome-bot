// const cahDB = require("../connect").cahDB;
// require("dotenv").config();

// //Should change this to automate doc chosen
// async function addRoundListener(client) {
//     const CHANNEL_ID = process.env.NODE_ENV === "production" ? "691137105656807544" : "703359739584577579";
//     const CHANNEL = client.channels.cache.get(CHANNEL_ID);

//     const initialData = await cahDB.collection("competitions").doc("cah2.1").get();
//     let previousRounds = initialData.data().rounds;
//     console.log(previousRounds)

//     cahDB.collection("competitions").doc("cah2.1")
//         .onSnapshot(doc => {
//             let rounds = doc.data().rounds;
//             rounds.forEach((round, index) => {
//                 if (previousRounds[index].isOpen !== round.isOpen) {
//                     round.isOpen ? console.log(round.id + " is open!"): console.log(round.id + " is not open!")
//                     if (round.isOpen) {
//                         const roundId = round.id.replace("-r1","").replace("-r2","");
//                         const roundFormatted = {
//                             "333":"3x3",
//                             "222":"2x2",
//                             "555":"5x5",
//                             "skewb":"skewb",
//                             "minx":"megaminx",
//                             "333bf":"3x3 blindfolded"
//                         }[roundId];
//                         client.user.setActivity(`${round.id.replace("-r1"," round 1").replace("-r2", " round 2")}`,{type:"COMPETING"})
//                         CHANNEL.send(`@everyone, **${roundFormatted} ${round.id.replace("-r1"," round 1").replace("-r2"," round 2").replace(roundId,"")}** is happening now! Compete: https://www.cubingathome.com/cah2.1/compete`)
//                     } else {
//                         client.user.setActivity("Cubing At Home 2.1",{type: "COMPETING"})
//                     }
//                 }
//             })
//             previousRounds = rounds;
//         })
// }

// module.exports = addRoundListener;