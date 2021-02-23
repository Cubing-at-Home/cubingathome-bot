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
                        client.user.setActivity(`${round.id}`,{type:"COMPETING"})
                    } else {
                        client.user.setActivity("'The Speed Cubers' on Netflix",{type: "WATCHING"})
                    }
                    round.isOpen ? CHANNEL.send(`**${round.id}** is now open for competitors!`) : CHANNEL.send(`**${round.id}** is now closed!`);
                }
            })
            previousRounds = rounds;
        })
}

module.exports = addRoundListener;