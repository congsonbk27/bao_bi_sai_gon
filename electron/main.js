
const { app, BrowserWindow } = require('electron')
const { creatTray } = require('./tray')
const { createWindow } = require('./window')
const fs = require('fs')
const bwipjs = require('bwip-js');
const { NODE_ENV } = process.env

console.log('bwipjs', bwipjs)

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


var file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(
  `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <div id="view">ngoisaonho.net</div>
        <img src="file:///${app.getAppPath() + '/barcode.png'}" />
      </body>
    </html>`
);

app.on('ready', () => {
  tray = creatTray()
  createWindow('home')

  // bwipjs.toBuffer({
  //   bcid: 'code128',       // Barcode type
  //   text: '84389544779',    // Text to encode
  //   scale: 3,               // 3x scaling factor
  //   height: 10,              // Bar height, in millimeters
  //   includetext: true,            // Show human-readable text
  //   textxalign: 'center',        // Always good to set this
  // }, function (err, png) {
  //   if (err) {
  //     throw err
  //     // Decide how to handle the error
  //     // `err` may be a string or Error object
  //   } else {
  //     // `png` is a Buffer
  //     // png.length           : PNG file length
  //     // png.readUInt32BE(16) : PNG image width
  //     // png.readUInt32BE(20) : PNG image height
  //     fs.writeFile('barcode.png', png, (error) => {
  //       if (error) throw error
  //       console.log('Write barcode.png successfully.')
  //     })
  //   }
  // });

  // let win = new BrowserWindow({
  //   width: 800, height: 600, resizable: false, webPreferences: {
  //     webSecurity: false
  //   }})
  // // win.loadURL('https://stackoverflow.com/questions/41130993/electron-not-allowed-to-load-local-resource')
  // // win.loadURL('file://' + __dirname + '/package.json')
  // win.loadURL(file)
  // win.webContents.on('did-finish-load', () => {
  //   win.webContents.printToPDF({ marginsType: 2, pageSize: "A4", landscape: false }, (error, data) => {
  //     if (error) throw error 
  //     fs.writeFile('output.pdf', data, (error) => {

  //       //getTitle of Window
  //       console.log(win.webContents.getTitle())
  //       //Silent Print 

  //       if (error) throw error
  //       console.log('Write PDF successfully.')

  //       // setTimeout(() => {
  //       //   win.close()
  //       // }, 1000);
  //     })
  //   })
  // })
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


