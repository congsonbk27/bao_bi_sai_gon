const { app } = require('electron')
const { createWindow, getWindowUrl } = require('../window')
const bwipjs = require('bwip-js');
const fs = require('fs')

function pad(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  s = s.replace('.','')
  return s;
}

const createBarcodeImage = ({ id, weight }) => new Promise((resolve, reject) => {
  weight = pad(`${weight.toFixed(3)}`, 7)

  bwipjs.toBuffer({
    bcid: 'code128',       // Barcode type
    text: `${id}${weight}`,    // Text to encode
    scale: 3,               // 3x scaling factor
    height: 10,              // Bar height, in millimeters
    includetext: true,            // Show human-readable text
    textxalign: 'center',        // Always good to set this
  }, function (err, png) {
    if (err) {
      reject(err)
    } else {
      // `png` is a Buffer
      fs.writeFile('barcode.png', png, (error) => {
        if (error) reject(error)
        console.log('[createBarcodeImage] Write barcode.png successfully.')
        resolve('Write barcode.png successfully.')
      })
    }
  });
})

const $api = {
  app,
  createWindow,
  getWindowUrl,
  createBarcodeImage,
}

module.exports = $api
