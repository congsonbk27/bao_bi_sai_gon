const { app } = require('electron')
const { createWindow, getWindowUrl } = require('../window')
const bwipjs = require('bwip-js');
const fs = require('fs')
const ioHook = require('iohook');

function pad(num, size) {
  let s = num + "";
  while (s.length < size) s = "0" + s;
  s = s.replace('.','')
  if (s.length > 9) s = s.slice(s.length-9, s.length)
  return s;
}

const createBarcodeImage = ({ id, weight }) => new Promise((resolve, reject) => {
  const paddedWeight = pad(`${weight.toFixed(1)}`, 5)
  const paddedTime = pad(`${id}`,10)
  console.log('TAO HINH', `999${paddedTime}${paddedWeight}`)
  bwipjs.toBuffer({
    bcid: 'code128',       // Barcode type
    text: `999${paddedTime}${paddedWeight}`,    // Text to encode, 999
    scale: 1,               // 3x scaling factor
    height: 10,              // Bar height, in millimeters
    includetext: false,            // Show human-readable text
    textxalign: 'center',        // Always good to set this
  }, function (err, png) {
    if (err) {
      reject(err)
    } else {
      // `png` is a Buffer
        fs.writeFile(`${app.getAppPath()}/${paddedTime}-barcode.png`, png, (error) => {
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
  pad,
  ioHook
}

module.exports = $api
