const db = require("./connect").defaultDB;
const admin = require("firebase-admin")

async function isBannedFromSuggesting(user) {
    const suggestions = await db.collection("Suggestions").doc(user.id).get();
    return suggestions.data().banned
}

async function addSuggester(user, firstSuggestion) {
    await db.collection("Suggestions").doc(user.id).set({
        name: user.username,
        id: user.id,
        banned: false,
        suggestions: [firstSuggestion]
    })
}

async function addSuggestion(user, suggestion) {
    const userId = user.id;
    const ref = await db.collection("Suggestions").doc(userId).get();
    if (!ref.exists ) {
        await addSuggester(user, suggestion);
        return true;
    } else {
        const isBanned = await isBannedFromSuggesting(user);
        if (isBanned) {
            return false;
        }
        await db.collection("Suggestions").doc(userId)
        .update({
            suggestions: admin.firestore.FieldValue.arrayUnion(suggestion)
            })
        return true;
    }
}

async function getSuggestions(user) {
    const userId = user.id;
    const isBanned = await isBannedFromSuggesting(user);
    if (isBanned) {
        return false;
    }
    //account for banned
    const ref = await db.collection("Suggestions").doc(userId).get();
    const suggestions = ref.data().suggestions;
    return suggestions;
}

module.exports = {
    addSuggestion: addSuggestion,
    getSuggestions: getSuggestions
}