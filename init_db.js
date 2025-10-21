const mysql = require('mysql2');
const fs = require('fs');

// MySQL connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'sharayu'
};

// Create connection without specifying database
const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('❌ MySQL Connection Failed:', err);
        return;
    }
    console.log('✅ Connected to MySQL');

    // Read the SQL file
    const sql = fs.readFileSync('fitpro.sql', 'utf8');

    // Split the SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    // Execute each statement
    statements.forEach((statement, index) => {
        connection.query(statement, (err, results) => {
            if (err) {
                console.error(`❌ Error executing statement ${index + 1}:`, err);
            } else {
                console.log(`✅ Statement ${index + 1} executed successfully`);
            }
        });
    });

    // Close the connection after a delay
    setTimeout(() => {
        connection.end();
        console.log('Database initialization complete');
    }, 2000);
});
