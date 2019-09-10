import React from 'react'
import { Router } from './components'
import routes from './pages/routes'
import _ from 'lodash'
import md5 from 'md5'
// register db
import './storage/db'
import { createSetting, PORT_SETTING_ID, PASSWORD_SETTING_ID, DEFAUT_PAGE_SETTING_ID, DEFAUT_PAGE_VALUE_SETTINGS } from './storage/setting'
// register scale reader sevice
import './utils/scaleReader'
import './styles/index.less'

createSetting({ setting_id: PORT_SETTING_ID, value: '' })
createSetting({ setting_id: PASSWORD_SETTING_ID, value: md5('baobisaigon@2019') })
createSetting({ setting_id: DEFAUT_PAGE_SETTING_ID, value: DEFAUT_PAGE_VALUE_SETTINGS })

export default class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    
    return (
      <div id="app">
        <Router routes={routes} />
      </div>
    )
  }

} // class App end
