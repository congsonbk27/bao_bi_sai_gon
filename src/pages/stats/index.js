import React from 'react'

import { Router, AsyncImport } from 'src/components'

export const checkupStats = {
  path: '/statsCheckup',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/statsCheckup/',
      params: { config: 'statsCheckup' },
      component: AsyncImport(() => import('./checkup-stats')),
    }
  ]} />,
  params: { from: 'statsCheckup' },
}


export const weighedStats = {
  path: '/statsWeighted',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/statsWeighted/',
      params: { config: 'statsWeighted' },
      component: AsyncImport(() => import('./weighted-stats')),
    }
  ]} />,
  params: { from: 'statsWeighted' },
}
