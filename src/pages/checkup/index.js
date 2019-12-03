import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/checkup',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/checkup/',
      params: { config: 'home' },
      component: AsyncImport(() => import('./checkup')),
    }
  ]} />,
  params: { from: 'checkup' },
}