require('dotenv').config();
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar:true,
    icon: path.join(__dirname,'./src/assets/Dhandho.ico')
  });

  // Check if the app is running in development mode
  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:9000' // Webpack Dev Server URL
    : `file://${path.join(__dirname, 'dist', 'index.html')}`; // File path in production mode

  win.loadURL(startUrl);

  // Catch all routes and serve index.html
  win.webContents.on('did-fail-load', () => {
    win.loadURL(startUrl);  // Re-load index.html on any route failure
  });
}

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
