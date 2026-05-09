require('dotenv').config();
const mysql = require('mysql2');

console.log('Testing Railway MySQL Connection...');
console.log('================================');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection Failed!');
        console.error('Error:', err.message);
        console.log('\n💡 Troubleshooting tips:');
        console.log('1. Check if password is correct in .env file');
        console.log('2. Verify host/port are correct');
        console.log('3. Make sure MySQL service is running on Railway');
        process.exit(1);
    }
    
    console.log('✅ Connected to Railway MySQL!');
    console.log('📊 Database:', process.env.DB_NAME);
    console.log('🌐 Host:', process.env.DB_HOST);
    console.log('🔌 Port:', process.env.DB_PORT);
    
    // Create test table
    connection.query(`
        CREATE TABLE IF NOT EXISTS schools (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL,
            address VARCHAR(500) NOT NULL,
            latitude DECIMAL(10, 8) NOT NULL,
            longitude DECIMAL(11, 8) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('❌ Failed to create table:', err.message);
        } else {
            console.log('✅ Schools table ready');
            
            // Insert a test school
            connection.query(`
                INSERT INTO schools (name, address, latitude, longitude) 
                VALUES (?, ?, ?, ?)
            `, ['Test School', '123 Test Street', 40.7128, -74.0060], (err, result) => {
                if (err) {
                    console.log('⚠️  Test school already exists or insert failed');
                } else {
                    console.log('✅ Test school added with ID:', result.insertId);
                }
                
                // Show all schools
                connection.query('SELECT * FROM schools', (err, rows) => {
                    if (err) {
                        console.error('Failed to fetch:', err);
                    } else {
                        console.log('\n📚 Schools in database:');
                        console.table(rows);
                    }
                    connection.end();
                    console.log('\n✅ Database test complete!');
                });
            });
        }
    });
});