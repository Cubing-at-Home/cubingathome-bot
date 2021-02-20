const db = require("./connect");

async function getSupporters() {
    let supportArr = [];
    const querySnapshot = await db.collection("Supporters").get();
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        supportArr.push({id: doc.id, date: doc.data().start.toDate()});
    });
    return supportArr;
}

module.exports = {
    getSupporters: getSupporters
}