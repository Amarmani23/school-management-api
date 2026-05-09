const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Database initialization
const initDatabase = async () => {
    try {
        // Test connection first
        const connection = await promisePool.getConnection();
        console.log('✅ Connected to Railway MySQL successfully!');
        
        // Create schools table if not exists
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS schools (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                address VARCHAR(500) NOT NULL,
                latitude DECIMAL(10, 8) NOT NULL,
                longitude DECIMAL(11, 8) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_coordinates (latitude, longitude)
            )
        `;
        
        await connection.query(createTableQuery);
        console.log('✅ Schools table ready');
        connection.release();
    } catch (error) {
        console.error('❌ Database initialization error:', error);
        throw error;
    }
};

module.exports = { promisePool, initDatabase };