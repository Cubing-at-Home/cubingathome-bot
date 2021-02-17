const { Pool } = require("pg");

//if not production parses env automatically to connect to local pg
const pool = process.env.NODE_ENV === "production" 
    ? 
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }) 
    :
    new Pool();
module.exports = pool;