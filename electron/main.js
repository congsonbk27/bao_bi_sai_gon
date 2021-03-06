
const { app, BrowserWindow } = require('electron')
const { creatTray } = require('./tray')
const { createWindow } = require('./window')
const { NODE_ENV } = process.env

app.commandLine.appendSwitch ("disable-http-cache");

// app.disableHardwareAcceleration()

global.$api = require('./api')
global.$service= require('./service')


if (NODE_ENV === 'development') {
  // react-developer-tools
  require('electron-debug')({ showDevTools: true })
  app.on('ready', () => {
    let installExtension = require('electron-devtools-installer')
    installExtension.default(installExtension.REACT_DEVELOPER_TOOLS).then(() => {
    }).catch(err => {
      console.log('Unable to install `react-developer-tools`: \n', err)
    })
  })
}

app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
  // window.openDevTools()
});

app.on('ready', () => {
  tray = creatTray()
  createWindow('home')  
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  if (process.platform === 'win32') {
    tray.destroy()
  }
})


