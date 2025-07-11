const { app, BrowserWindow, screen } = require('electron');
const url = require('url');
const path = require('path');

let mainWindow;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '/dist/sellup/browser/index.html'),
      protocol: 'file:',
      slashes: true,
    })
  );

  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Adiciona o nome do aplicativo
app.setName('Sellup');

app.on('ready', () => {
  createWindow();

  const { globalShortcut } = require('electron');

  globalShortcut.register('Ctrl+I', () => {
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (mainWindow === null) createWindow();
});