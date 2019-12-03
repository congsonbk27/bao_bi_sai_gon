//**
/* scale reader services by brian 31 august 2019
/* how to use:
/* - import it
/* - register a listerner
*/
const { remote } = require('electron')

import moment from 'moment'
import shortid from 'shortid'
import { createScaleInput } from '../storage/scaleInput'
import { getPort } from 'src/storage/setting'
import logger from '../utils/logger'

shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@#')
const BrowserWindow = remote.BrowserWindow

const MINIMUM_PRODUCT_WEIGHT_DIFF = 0.1 // unit: kg. Minumum weight to distinguish two object
const ANCHOR = new moment('09-09-2019')

const barcodeTemplate = (text, weight, paddedTime) => {
  const image_path = `file:///${$api.app.getAppPath() + `/${paddedTime}-barcode.png`}`

  const time = moment().format('HH:mm DD/MM/YYYY')
  return 'data:text/html;charset=UTF-8,' + encodeURIComponent(
    `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page {
            /* prevents electron's additional margins around sheet-content (the first printedPage of: the html already sized 8.5x22) */
            margin-top: 0cm;
            margin-left: 0cm;
            margin-right: 0cm;
            /* prevents electron from printing a blank page between each sheet (the first and second printedPages of the tall html) */
            margin-bottom: 0cm;
          }
          *{
            padding: 0;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div style="
          display: flex;
          flex-direction: row;
          margin-top: 0.2cm;
          margin-left: 0.2cm;
        ">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 40mm;
            width: 45mm;
            padding: 3mm;
            text-align: center;
          ">
            <div style="border: 1px solid black">
              <p style="">CTCP Bao Bì Sài Gòn </p>
              <img style="object-fit: cover" src="${image_path}" />
              <p style="">${text}</p>
              <p style="font-size: 40px; font-weight: bold">${weight}kg</p>
              <p style="">Ngày giờ: ${time}</p>
            </div>
          </div>

          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 40mm;
            width: 45mm;
            padding: 3mm;
            margin-left: -0.1cm;
            text-align: center;
          ">
            <div style="border: 1px solid black">
              <p style="">CTCP Bao Bì Sài Gòn </p>
              <img style="object-fit: cover" src="${image_path}" />
              <p style="">${text}</p>
              <p style="font-size: 40px; font-weight: bold">${weight}kg</p>
              <p style="">Ngày giờ: ${time}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
}

class ScaleReader {
  lastReaded = 0
  quantityOfCurrentPrintItem = 0
  callbacks = []
  serialPort = null

  constructor(serialPort) {
    this.serialPort = serialPort
    this.setUp()
  }

  setUp = async () => {
    const that = this
    const reader = function (d) {
      const data = d.toString();
      const number = parseFloat(data, 10)
      logger('RECEIVED FROM SCALE' + data + " CONVERTED VALUE:" + number);
      // if not a number, also ignore
      if (isNaN(number)) {
        logger('NOT A NUMBER');
        return
      }
      // no need to check because now we are using 
      // if (that.isObjectChanged(number)) { 
      // there is a new object is put to the scale
      const current_time = moment();
      const time = Math.abs(current_time.diff(ANCHOR, 'second'))
      const time_scale = current_time.format('HH:mm:ss --- DD/MM/YYYY');
      const weight = number;
      const theid =`${$api.pad(time, 10)}${$api.pad(weight, 5)}`;
      
      const newObject = {
        weight: number,
        time: time,
        id: shortid.generate(),
        time_scale: time_scale,
        theID: theid
      }
      that.saveToDb(newObject);
      that.lastReaded = number
    }

    const COM = await getPort()
    // console.log(`[ScaleReader] COM port ${COM.value} `)
    const port = new this.serialPort(COM.value, {
      baudRate: 9600
    }, function (err) {
      if (err) {
        return console.log('Error: ', err.message)
      }
      port.on('data', _.throttle(reader, 100))
    })
    // this is for simulating
    // reader('305.4')
  }

  saveToDb = async (newestObject) => {
    try {
      const data = await createScaleInput(newestObject)
      this.printBarcode(newestObject)
      for (let i = 0; i < this.callbacks.length; i++) {
        const callback = this.callbacks[i];
        callback(data)
      }
    } catch (error) {
      console.log('error adding new record', error)
    }
  }

  isObjectChanged = (currentNumber) => {
    if (currentNumber < 0.01) return false
    return Math.abs(currentNumber - this.lastReaded) > MINIMUM_PRODUCT_WEIGHT_DIFF
  }

  registerListener = (callback) => {
    this.callbacks.push(callback)
  }

  printLoop = (win) => {
    win.webContents.print({
      silent: true
    }, (error, data) => {
      console.log('PRINT SUCCESS FULLY')
      win.close()
    })
    logger('SENT TO PRINTER ALREADY');
  }

  printBarcode = async (object) => {
    try {
      await $api.createBarcodeImage({
        id: object.time,
        weight: object.weight
      });
      logger('CREATED BARCODE IMAGE');
      let win = new BrowserWindow({
        show: false, webPreferences: { webSecurity: false }
      })
      const paddedTime = $api.pad(object.time, 10)
      const paddedWeight = $api.pad(`${object.weight}`, 5)
      win.loadURL(barcodeTemplate(`${paddedTime}${paddedWeight}`, object.weight, paddedTime))
      win.webContents.on('did-finish-load', () => {
        this.quantityOfCurrentPrintItem = 0
        this.printLoop(win)
      })
    } catch (error) {
      console.log('printBarcode', error)
    }
  }
}

const singleton = new ScaleReader(serialport)
export default singleton
