const {ipcMain} = require('electron');
const menubar = require('menubar');
const path = require('path');
const url = require('url');

// Development only
// require('electron-reload')(__dirname, {
//     electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
// });

// Menubar
const mb = menubar({
    height: 300, resizable: false,
    alwaysOnTop: true
});

mb.on('hide', () => {
    mb.window.webContents.send('window:hide');
});

// IPC Main
ipcMain.on('window:close', () => {
    mb.app.quit();
});