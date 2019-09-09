import React from 'react'
import { shell } from 'electron'

export default class About extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log($api)
  }

  render() {
    return (
      <div className="flex column center" style={{ height: '100%' }}>
        <img src={require('../../../assets/app-icon/app-icon@256.png')} width="88" />
        <h2 style={{ marginTop: 8 }}>{$api.app.getName()}</h2>
        <p className="fs-12" style={{ margin: 4 }}>Phiên bản {$api.app.getVersion()}</p>
        <p className="fs-12 text-gray">Copyright © {new Date().getFullYear()} <a href="javascript:;" onClick={() => {
          shell.openExternal('https://ngoisaonho.net')
        }}>Ngoisaonho.</a> Bảo lưu mọi quyền</p>
      </div>
    )
  }

} // class About end