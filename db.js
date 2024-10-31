const { Pool } = require('pg');
require('dotenv').config({ path: 'temporal.env' });

class db {

    constructor() {
            this.pool = new Pool({
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            host: process.env.DB_HOST
        });
    }
    async query(sql, params) {
        try {
            const result = await  this.pool.query(sql, params);
            // console.log("result",result);
            
            return result; 
        } catch (err) {
            console.error("Database query error:", err);

            throw err;
        }
    }
}

module.exports = db;
