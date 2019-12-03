import React from 'react'
import { getDefaultPage, DEFAUT_PAGE_VALUE_SCALE, DEFAUT_PAGE_VALUE_CHECKUP, DEFAUT_PAGE_VALUE_SETTINGS } from 'src/storage/setting'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
    this.redirect()
  }

  redirect = async () => {
    const page = await getDefaultPage();

    let redirect = '/settings'
    if (page) switch (page.value) {
      case DEFAUT_PAGE_VALUE_SCALE:
        redirect = '/weighted'
        break;
      case DEFAUT_PAGE_VALUE_CHECKUP:
        redirect = '/checkup'
        break;
    }
    this.props.history.push(redirect)
  }
  render() {
    return null
  }
} 
