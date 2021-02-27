const cahDB = require("../connect").cahDB;
require("dotenv").config();

//Should change this to automate doc chosen
async function addRoundListener(client) {
    const CHANNEL_ID = process.env.NODE_ENV === "production" ? "691137105656807544" : "703359739584577579";
    const CHANNEL = client.channels.cache.get(CHANNEL_ID);

    const initialData = await cahDB.collection("competitions").doc("cah2.1").get();
    let previousRounds = initialData.data().rounds;
    console.log(previousRounds)

    cahDB.collection("competitions").doc("cah2.1")
        .onSnapshot(doc => {
            let rounds = doc.data().rounds;
            rounds.forEach((round, index) => {
                if (previousRounds[index].isOpen !== round.isOpen) {
                    round.isOpen ? console.log(round.id + " is open!"): console.log(round.id + " is not open!")
                    if (round.isOpen) {
                        client.user.setActivity(`${round.id.replace("-r1"," round 1").replace("-r2", " round 2")}`,{type:"COMPETING"})
                        CHANNEL.send(`@everyone, **${round.id.replace("-r1"," round 1").replace("-r2", " round 2")}** is happening now! Compete now: https://www.cubingathome.com/cah2.1/compete`)
                    } else {
                        client.user.setActivity("Cubing At Home 2.1",{type: "COMPETING"})
                    }
                }
            })
            previousRounds = rounds;
        })
}

module.exports = addRoundListener;