import React from 'react'

import { Router, AsyncImport } from 'src/components'

export default {
  path: '/about',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/about/',
      params: { key: 'about' },
      component: AsyncImport(() => import('src/pages/about/about')),
    },
  ]} />,
}
