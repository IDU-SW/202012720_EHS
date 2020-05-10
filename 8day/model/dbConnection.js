const mysql = require('mysql2');


// DB Connection
const dbConfig = {
    host: 'localhost',
    user: 'hak',
    password: 'cometrue',
    port: 3306,
    database: 'foods',
    multipleStatements: true,
 };

// Connection Pool module export
const pool = mysql.createPool(dbConfig).promise();
module.exports = pool;