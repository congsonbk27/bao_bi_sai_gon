
import React from 'react'
import { AsyncImport } from '../components'

import checkup from './checkup'
import about from './about'

const routes = [
  { path: '/', exact: true, component: AsyncImport(() => import('./home')), params: { test: 'ok' } },
  checkup,
  about,
]


module.exports = routes
