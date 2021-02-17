//why am i doing this
const pool = require("../../connect");

async function burger() {
    try {
        const client = await pool.connect();
        const getBurger = await client.query(`SELECT date FROM burger;`)
        if (getBurger.rows.length===0 || parseInt(getBurger.rows[0].date)<new Date().getTime()) {
            await client.query(`UPDATE burger SET date='${new Date().getTime()+(1000*60*60*12)}'`)
            return "set";
        } else {
            console.log(getBurger.rows[0].date);
            return getBurger.rows[0].date;
        }
    } catch(err) {
        console.error(err);
        return err;
    }

}

module.exports = burger;