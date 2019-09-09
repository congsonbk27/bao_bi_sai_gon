//**
 /* scale reader services by brian 31 august 2019
 /* how to use:
 /* - import it
 /* - register a listerner
 */
const { remote } = require('electron')

import moment from 'moment'
import fs from 'fs'
import shortid from 'shortid'
import { createScaleInput } from '../storage/scaleInput'

const BrowserWindow = remote.BrowserWindow

const MINIMUM_PRODUCT_WEIGHT_DIFF = 0.1 // unit: kg. Minumum weight to distinguish two object
const ANCHOR = new moment('01-01-2000')

const barcodeTemplate = 'data:text/html;charset=UTF-8,' + encodeURIComponent(
  `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <img style="height: 80px; width: 170px; object-fit: contain; margin-top: 0px; margin-left: 0px; margin-top: 0px; " src="file:///${$api.app.getAppPath() + '/barcode.png'}" />
      </body>
    </html>`
);

class ScaleReader {
  lastReaded = 0
  callbacks = []

  constructor(serialPort) {
    const that = this
    const reader = function (data) {
      data = data.toString();
      // sometime data is not containing the decimal somehow, so we need to add the decimal
      if (data.indexOf('?') !== -1 
      // || data.indexOf(' ') !== -1
      ) {
        return
      }
      if (data.indexOf('.') === -1) data = `.${data}`
      const number = parseFloat(data, 10)
      // if not a number, also ignore
      if (isNaN(number)) return
      
      if (that.isObjectChanged(number)) {
        // there is a new object is put to the scale
        const time = Math.abs(moment().diff(ANCHOR, 'second'))
        console.log(`[ScaleReader] New object detected with weight ${number} at `, time)
        // console.log(`[ScaleReader] New object detected with weight ${number} at `, time, '. Original ', data)
        const newObject = { weight: number, time, id: shortid.generate() }
        that.saveToDb(newObject)
      }
      that.lastReaded = number
    }

    // const port = new serialPort('/dev/tty.usbserial-14520', {
    const port = new serialPort('COM4', {
      baudRate: 9600
    }, function (err) {
      if (err) {
        return console.log('Error: ', err.message)
      }
      port.on('data', _.throttle(reader, 3000))
    })
  }

  saveToDb = async (newestObject) => {
    try {
      const data = await createScaleInput(newestObject)
      this.printBarcode(newestObject)
      for (let i = 0; i < this.callbacks.length; i++) {
        const callback = this.callbacks[i];
        callback({
          ...newestObject,
          time: data.createdAt
        })
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

  printBarcode = async (object) => {
    try {
      await $api.createBarcodeImage({
        id: object.id,
        weight: object.weight
      });
      let win = new BrowserWindow({
        show: false, webPreferences: { webSecurity: false }
      })
      win.loadURL(barcodeTemplate)
      win.webContents.on('did-finish-load', () => {
        // win.webContents.printToPDF({ marginsType: 2, pageSize: 'A5', landscape: false, silent: true }, (error, data) => {
        // win.webContents.printToPDF({ marginsType: 2, pageSize: {width: '50px', height: '20px' }, landscape: false, silent: true }, (error, data) => {
        win.webContents.print({ marginsType: 2, pageSize: "A5", landscape: false, silent: true }, (error, data) => {
          if (error) console.log(error)
          // this is for output pdf only
          // fs.writeFile(`output.pdf`, data, (error) => {
          //   if (error) console.log(error)
          //   console.log('Write PDF successfully.')
          // })
        })

        setTimeout(() => {
          win.close()
        }, 1000)
      })

    } catch (error) {
      console.log('printBarcode', error)
    }
  }
}

const singleton = new ScaleReader(serialport)
export default singleton
