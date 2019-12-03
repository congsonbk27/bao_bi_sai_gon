import React from 'react'

import { Router, AsyncImport } from 'src/components'
import createNeedLoginScreen from 'src/components/createNeedLoginScreen'

export const checkupStats = {
  path: '/statsCheckup',
  component: () => <Router routes={[
    {
      exact: true,
      path: '/statsCheckup/',
      params: { config: 'statsCheckup' },
      component: createNeedLoginScreen(AsyncImport(
        () => import('./checkup-stats'))
      ),
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
      component: createNeedLoginScreen(
        AsyncImport(() => import('./weighted-stats'))
        ),
    }
  ]} />,
  params: { from: 'statsWeighted' },
}
