const { ipcRenderer, remote } = require('electron');


const closeBtn = document.getElementById('close-btn');
const titleBar = document.getElementById('title-bar'); 

closeBtn.addEventListener('click', () => { 
    ipcRenderer.send('close-window');
});


let isDragging = false;
let offset = { x: 0, y: 0 };

titleBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    const window = remote.getCurrentWindow();
    const bounds = window.getBounds();
    offset.x = bounds.x - e.screenX;
    offset.y = bounds.y - e.screenY;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const window = remote.getCurrentWindow();
        window.setPosition(e.screenX + offset.x, e.screenY + offset.y);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});
