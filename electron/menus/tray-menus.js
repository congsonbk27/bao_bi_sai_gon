const { createWindow } = require('../window')

const trayMenus = [
  { label: 'Cân', click: () => createWindow('home') },
  { label: 'Về chúng tôi', click: () => createWindow('about') },
  { label: 'Thoát', role: 'quit' }
]

module.exports = trayMenus
