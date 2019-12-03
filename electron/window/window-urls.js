const fixedConfig = { resizable: false, maximizable: false, minimizable: false }

const urls = {
  home: { url: '/', config: { title: 'home' } },
  about: {
    url: '/about',
    config: {
      title: 'Về chúng tôi',
      width: 300, height: 240,
      ...fixedConfig,
    }
  },

}

module.exports = urls
