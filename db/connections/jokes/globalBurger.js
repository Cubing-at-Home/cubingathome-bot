//why am i doing this
const pool = require("../../connect");

async function burger() {
    try {
        const client = await pool.connect();
        const getBurger = await client.query(`SELECT date FROM burger;`)
        console.log(getBurger.rows);
        if (!getBurger.rows[0] || parseInt(getBurger.rows[0].date)<new Date().getMilliseconds()) {
            await client.query(`UPDATE burger SET date='${new Date().getMilliseconds()+(1000*60*60*24)}'`)
            return "set";
        } else {
            return getBurger.rows[0].date;
        }
    } catch(err) {
        console.error(err);
        return err;
    }

}

module.exports = burger;