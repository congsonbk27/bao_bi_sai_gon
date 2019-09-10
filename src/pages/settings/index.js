import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/settings',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/settings/',
      params: { config: 'settings' },
      component: AsyncImport(() => import('./settings')),
    }
  ]} />,
  params: { from: 'settings' },
}
