const cahDB = require("../connect").cahDB;
require("dotenv").config();

const activityKey = {
	'222': '2x2x2',
	'333': '3x3x3',
	'444': '4x4x4',
	'555': '5x5x5',
	'666': '6x6x6',
	'777': '7x7x7',
	pyram: 'Pyraminx',
	'333oh': '3x3x3 One-Handed',
	'333bf': '3x3x3 Blindfolded',
	'444bf': '4x4x4 Blindfolded',
	'555bf': '5x5x5 Blindfolded',
	skewb: 'Skewb',
	clock: 'Clock',
	'333ft': '3x3x3 with Feet',
	'333mbf': '3x3x3 Multiple Blindfolded',
	'333fm': 'Fewest Moves',
	sq1: 'Square 1',
	minx: 'Megaminx',
	'234567relay': '2x2-7x7 Relay',
	'2345relay': '2x2-5x5 Relay',
	kilominx: 'Kilominx',
	mpyram: 'Master Pyraminx',
	redi: 'Redi Cube',
	'666bf': '6x6x6 Blindfolded',
	'777bf': '7x7x7 Blindfolded',
	miniguild: 'Mini Guildford Challenge',
	mirror: 'Mirror Blocks',
	fto: 'Face Turning Octahedron'
}
//Should change this to automate doc chosen
async function addRoundListener(client) {
    const CHANNEL_ID = process.env.NODE_ENV === "production" ? "691137105656807544" : "810760277850980365";
    const CHANNEL = client.channels.cache.get(CHANNEL_ID);
    const COMP_ID = "cah2.5";
    const initialData = await cahDB.collection("competitions").doc(COMP_ID).get();
    let previousRounds = initialData.data().rounds;
    //console.log(previousRounds)

    cahDB.collection("competitions").doc(COMP_ID)
        .onSnapshot(doc => {
            let rounds = doc.data().rounds;
            rounds.forEach((round, index) => {
                if (previousRounds[index].isOpen !== round.isOpen) {
                    if (round.isOpen) {
                        const eventId = round.id.split("-")[0];
                        const roundId = round.id.split("-")[1].replace("r","");

                        const roundFormatted = `${activityKey[eventId]} round ${roundId}`
                        console.log(roundFormatted)
                        client.user.setActivity(roundFormatted,{type:"COMPETING"})
                        CHANNEL.send(`@everyone, **${roundFormatted}** just opened!`)
                            .then(CHANNEL.send(`**Compete:** https://www.cubingathome.com/${COMP_ID}/compete`))
                    } else {
                        client.user.setActivity(`Cubing At Home ${COMP_ID}` ,{type: "COMPETING"})
                    }
                }
            })
            previousRounds = rounds;
        })
}

module.exports = addRoundListener;