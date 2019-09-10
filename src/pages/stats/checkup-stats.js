import React from 'react'
import { Button } from 'antd'
import Layout from 'src/components/layout/layout'
import page from 'src/constants/page.const'

export default class CheckupStats extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
  }

  render() {
    const { params: { config }, history } = this.props
    return (
      <Layout history={history} page={page.stat_checkup}>
        THỐNG KÊ XUẤT
      </Layout>
    )
  }

} // class Page end
