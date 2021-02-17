const pool = require("../../connect");

const DEFAULT_PREFIX = process.env.NODE_ENV === "production" ? "s!" : "d!";
async function guildConnect(guildId) {
    try {
        const client = await pool.connect();
        const result = await client.query(`SELECT * FROM guilds WHERE id='${guildId}'`);
        //new server
        if (result.rowCount === 0) {
            //insert new Guild with defaults
            const insertResult = await client.query(`INSERT INTO guilds values ('${guildId}', '${DEFAULT_PREFIX}')`);
            console.log(insertResult.rows);
        } else {
            console.log(result.rows);
        }
        client.release()
    } catch(err) {
        return err;
        console.error(err);
    }
}

async function getPrefix(guildId) {
    try {
        const client = await pool.connect();
        const prefix = await client.query(`SELECT prefix FROM guilds WHERE id='${guildId}'`);
        if (prefix.rowCount==0) {
            await guildConnect(guildId);
            client.release();
            return DEFAULT_PREFIX;
        } else {
            console.log("Server found, prefix set to: "+prefix.rows[0].prefix)
            client.release();
            return prefix.rows[0].prefix;
        }
    } catch(err) {
        console.error(err);
        return DEFAULT_PREFIX;
    }
}

async function setPrefix(guildId, prefix) {
    try {
        const client = await pool.connect();
        const setPrefixResult = await client.query(`UPDATE guilds SET prefix='${prefix}' WHERE id='${guildId}'`);
        //console.log(setPrefixResult);
        client.release();
        return setPrefixResult;
    } catch(err) {
        console.error(err);
        return err;
    }
}
module.exports = {
    guildConnect: guildConnect,
    getPrefix: getPrefix,
    setPrefix: setPrefix
};