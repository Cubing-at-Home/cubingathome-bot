const pool = require("../connect");

async function guild() {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM testing');
        
        const results = { 'results': (result) ? result.rows : null};
        
        console.log(results);
        client.release()
    } catch(err) {
        console.error(err);
    }
}

module.exports = guild;