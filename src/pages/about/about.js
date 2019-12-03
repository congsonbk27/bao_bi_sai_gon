import React from 'react'
import Layout from '../../components/layout/layout'
import page from '../../constants/page.const'
import './about.less'

export default class About extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log($api)
  }

  render() {
    const { params: { config }, history } = this.props
    return (
      <Layout history={history} page={page.about}>
        <div style = {{height: '100%'}}>
        <iframe style = {{border: 'none'}}  src="https://ngoisaonho.net/nsn-autoscale" height="100%" width="100%"></iframe>

        </div>

      </Layout>
    )
  }
} // class About end
