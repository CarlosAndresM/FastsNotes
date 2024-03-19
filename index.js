const {
    app,
    BrowserWindow,
    globalShortcut,
    screen,
    ipcMain,
    shell
} = require('electron');
const {
    createWindow
} = require('./main'); // Suponiendo que tienes una función createWindow definida en main.js


 
const fs = require('fs');
const path = require('path');

app.allowRendererProcessReuse = true;

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});



app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Registrar el atajo de teclado global
let inputWindow = null;

app.on('ready', () => {
    globalShortcut.register('CommandOrControl+Alt+X', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        } else {
            BrowserWindow.getAllWindows()[0].focus(); // Enfoca la primera ventana abierta si hay más de una
        }
    });

    globalShortcut.register('CommandOrControl+Alt+D', () => {

        const mousePosition = screen.getCursorScreenPoint();

        // Calcula las coordenadas de la ventana de entrada en función de la posición del mouse
        const { x, y } = mousePosition;

        if (!inputWindow) {
            inputWindow = new BrowserWindow({
                width: 350,
                height: 300,
                x: x - 125, // La mitad del ancho de la ventana
                y: y - 50,  // La mitad de la altura de la ventana
                frame: false,
                backgroundColor: '#212121',
                resizable: false,
                webPreferences: {
                    nodeIntegration: true,
                    contextIsolation: false
                }
            });


            inputWindow.loadFile('./src/input.html');
            inputWindow.on('closed', () => {
                inputWindow = null;
            });
          
            globalShortcut.register('Escape', () => {
                if (inputWindow !== null) {
                    inputWindow.close();
                }
            });


            inputWindow.on('blur', () => {
                inputWindow.close();
            });
 

        } else {
            BrowserWindow.getAllWindows()[1].focus(); // Enfoca la segunda ventana abierta si hay más de una
        }
    });
});


        app.on('will-quit', () => {
            // Desregistrar todos los atajos de teclado globales antes de salir
            globalShortcut.unregisterAll();
        });





// Función para filtrar las aplicaciones del sistema
function filterApps(query) {
    const appsDirectory = '/usr/share/applications'; // Directorio donde se almacenan los accesos directos de las aplicaciones
    let apps = [];

    try {
        const files = fs.readdirSync(appsDirectory);
        files.forEach(file => {
            const filePath = path.join(appsDirectory, file);
            if (fs.statSync(filePath).isFile() && file.endsWith('.desktop')) {
                const content = fs.readFileSync(filePath, 'utf-8');
                const lines = content.split('\n');
                for (const line of lines) {
                    if (line.startsWith('Name=')) {
                        const appName = line.substring(5);
                        if (appName.toLowerCase().includes(query)) {
                            apps.push(appName);
                        }
                        break;
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al leer el directorio de aplicaciones:', error);
    }

    return apps;
}

// Maneja el evento de filtrado de aplicaciones
ipcMain.on('filter-apps', (event, query) => {
    const filteredApps = filterApps(query.toLowerCase());
    event.reply('update-app-list', filteredApps);
});

 