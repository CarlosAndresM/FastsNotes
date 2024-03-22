const sqlite3 = require('sqlite3').verbose();

// Create a new database connection
const conn = new sqlite3.Database('database.db');

// Execute the SQL statement to create the table
conn.run('CREATE TABLE IF NOT EXISTS notas (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, descripcion TEXT)', (error) => {
    if (error) {
        console.log(error.message);
    } else {
        console.log('Tabla notas creada');
    }
});

// Close the database connection after executing the statement
conn.close();
