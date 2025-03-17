
require('dotenv').config();
const sql = require('mssql');

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: process.env.NODE_ENV !== 'production'
    }
};

async function connectToDatabase() {
    try {
        const pool = await sql.connect(sqlConfig);
        return pool;
    } catch (err) {
        console.error('Database connection error:', err);
        throw err;
    }
}


module.exports = { sqlConfig, connectToDatabase };