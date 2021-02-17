const pool = require("../../connect");

async function suggest(userId, suggestion) {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM suggestions WHERE id='${userId}'`);
        if (result.rows.filter(r=>r.progress=="new").length>=5) {
            client.release()
            return "many";
        } else {
            const blacklist = await client.query(`SELECT * FROM blacklist WHERE id='${userId}'`);
            if (blacklist.rowCount>0) {
                return "banned";
            }
            const newSuggestionResult = await client.query(`INSERT INTO suggestions values ('${userId}', '${suggestion}', 'new')`);
            client.release()
            return "passed";
        }
    } catch(err) {
        client.release()
        console.error(err);
        return err;
    }
}

async function getSuggestions(userId) {
    //suggestion.progress can be "new", "denied", "in progress", "considering", "completed"
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM suggestions WHERE id='${userId}'`);
        return result.rows;
    } catch(err) {
        //client.release()
        console.error(err);
        return err;
    }
}
module.exports = {
    suggest: suggest,
    getSuggestions: getSuggestions
};