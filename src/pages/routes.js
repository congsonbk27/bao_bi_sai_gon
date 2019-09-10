
import React from 'react'
import { AsyncImport } from '../components'

import checkup from './checkup'
import about from './about'
import settings from './settings'
import { checkupStats, weighedStats } from './stats'
import weighted from './weighted'

const routes = [
  { 
    path: '/',
    exact: true,
    component: AsyncImport(() => import('./home')),
    params: { test: 'ok' }
  },
  checkup,
  about,
  checkupStats,
  weighedStats,
  settings,
  weighted
]


module.exports = routes
