 

const { BrowserWindow, ipcMain } =  require('electron');
const sqlite3 = require('sqlite3').verbose();


 
const conn = new sqlite3.Database('database.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Conexión exitosa a la base de datos SQLite');
});

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }

    });

ipcMain.on('search-google', async (event, query) => {
    const open = await import('open');
    open.default(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
});


 
    win.loadFile('src/index.html');


 
    ipcMain.on('close-window', () => {
        win.close();

 
        conn.close((err) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log('Conexión cerrada');
            }
        });
    });

    
}




async function insertNote(title,content) {
    return new Promise((resolve, reject) => {
        const emptyContent = {
            blocks: [] // Bloques de contenido vacíos
        };
        conn.run('INSERT INTO notas (titulo, descripcion) VALUES (?, ?)', [title, content], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
                console.log('Nota creada correctamente');
            }
        });
    });
}


async function searchNotesByID(id) {
    return new Promise((resolve, reject) => {
        conn.get('SELECT * FROM notas WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function updateNoteContent(id, content) {
    return new Promise((resolve, reject) => {
        conn.run('UPDATE notas SET descripcion = ? WHERE id = ?', [content, id], function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ message: 'Contenido de la nota actualizado correctamente.' });
            }
        });
    });
}


async function searchNotes() {
    return new Promise((resolve, reject) => {
        conn.all('SELECT * FROM notas', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

searchNotes()
    .then(notas => {
        console.log(notas);
    })
    .catch(error => {
        console.error(error);
    });



    
module.exports = {
    searchNotes,
    insertNote,
    searchNotesByID,
    updateNoteContent,
    createWindow
};