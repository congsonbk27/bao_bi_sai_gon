import React from 'react'
import { Router } from './components'
import routes from './pages/routes'
import _ from 'lodash'
import md5 from 'md5'
import { shell, clipboard } from 'electron'
// register db
import './storage/db'
import { createSetting, getAnswerCode, setAnswerCode, PORT_SETTING_ID, PASSWORD_SETTING_ID, DEFAUT_PAGE_SETTING_ID, DEFAUT_PAGE_VALUE_SETTINGS, LICENSE_ANSWER_CODE } from './storage/setting'
// license
import * as licenseUtil from './utils/license'
// register scale reader sevice
import './utils/scaleReader'
import './styles/index.less'

import { Icon, Button, Input } from 'antd';

import notify from './utils/notify_message'

createSetting({ setting_id: PORT_SETTING_ID, value: '' })
createSetting({ setting_id: PASSWORD_SETTING_ID, value: md5('baobisaigon@2019') })
createSetting({ setting_id: DEFAUT_PAGE_SETTING_ID, value: DEFAUT_PAGE_VALUE_SETTINGS })
createSetting({ setting_id: LICENSE_ANSWER_CODE, value: '' })

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ready: false,
      licensed: false
    }
   
  }

  componentDidMount() {
    this.checkAnswerCode()
  }

  checkAnswerCode = async (justEnteredAnswerCode) => {
    const savedAnswerCode = await getAnswerCode()
    const answerCode = justEnteredAnswerCode ? justEnteredAnswerCode : savedAnswerCode ? savedAnswerCode.value : ''
    const licensed = await licenseUtil.checkLicense(answerCode)
    if (licensed) { await setAnswerCode(answerCode) }
    const requestActivationCode = await licenseUtil.getRequestActivationCode()
    console.log('licensed', { licensed, justEnteredAnswerCode, answerCode })
    this.setState({
      licensed: true,
      ready: true,
      requestActivationCode
    })
  }
  checkAnswerCodeAfterInCode = async (justEnteredAnswerCode) => {
    const savedAnswerCode = await getAnswerCode()
    const answerCode = justEnteredAnswerCode ? justEnteredAnswerCode : savedAnswerCode ? savedAnswerCode.value : ''
    const licensed = await licenseUtil.checkLicense(answerCode)
    if (licensed) { 
      await setAnswerCode(answerCode);
      notify.openNotification('Mã kích hoạt bản quyền thành công!');
     }
    else {
      notify.openNotification('Mã kích hoạt chưa đúng! Hãy nhập lại mã kích hoạt');
    }
    const requestActivationCode = await licenseUtil.getRequestActivationCode()
    console.log('licensed', { licensed, justEnteredAnswerCode, answerCode })
    this.setState({
      licensed,
      ready: true,
      requestActivationCode
    })
  }

  openEmail = () => {
    shell.openExternal(`mailto:sale@ngoisaonho.net?subject=ActiveNTTAutoScaleRequest&body=Mã yêu cầu của tôi là: ${this.state.requestActivationCode}`);
  }

  copyToClipboard = () => {
    clipboard.writeText(this.state.requestActivationCode)
    notify.openNotification('Đã copy mã yêu cầu vào clipboard! Bạn có thể paste bằng Ctrl + V!')
  }

  render() {
    const { licensed, ready, requestActivationCode } = this.state

    if (!ready) {
      return (
        <div class="nonLisenseApp">
          <Icon type="loading" style={{ fontSize: 24 }} spin />
        </div>
      )
    }

    if (!licensed) {
      return (
        <div class="nonLisenseApp">
          <div class="nonLisenseAppContainer">
            <h3>Kích hoạt bản quyền</h3>
            <br />
            <br />
            <br />
            <label>Mã yêu cầu: <b>{requestActivationCode}</b></label>
            <p>Vui lòng gửi mã yêu cầu về email: sale@ngoisaonho.net, chúng tôi sẽ gửi mã kích hoạt cho bạn</p>

            <br />
            <div>
              <Button onClick={this.copyToClipboard}>Copy mã yêu cầu</Button>
              &nbsp;
            <Button onClick={this.openEmail}>Mở email</Button>
            </div>

            <br />
            <br />
            <br />
            <p>Sau khi nhận được mã kích hoạt từ Ngôi Sao Nhỏ, hãy nhập vào đây</p>
            <Input
              style={{ width: '400px' }}
              value={this.state.inputAnswerCode}
              onChange={(event) => this.setState({ inputAnswerCode: event.target.value })}
              placeholder="Nhập mã kích hoạt"
              visibilityToggle
              allowClear
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
            <br />
            <Button onClick={() => this.checkAnswerCodeAfterInCode(this.state.inputAnswerCode)} className="saveButton"><Icon type="unlock" />Kích hoạt bản quyền</Button>
          </div>
        </div>
      )
    }

    return (
      <div id="app">
        <Router routes={routes} />
      </div>
    )
  }

} // class App end
