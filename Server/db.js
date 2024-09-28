const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.log("Error Occurred - " + err.message);
    } else {
        console.log("SQLite connected!");
    }
});


/*db.close((err) => {
    if (err) {
        console.error('Error occurred while closing the database:', err.message);
    } else {
        console.log('Database connection closed.');
    }
});*/

module.exports = db;