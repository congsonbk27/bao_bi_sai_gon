import React from 'react'

import { Router, AsyncImport } from '../../components'

export default {
  path: '/weighted',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/weighted/',
      params: { config: 'weighted' },
      component: AsyncImport(() => import('./weighted')),
    }
  ]} />,
  params: { from: 'weighted' },
}
