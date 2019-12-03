import React from 'react'
import md5 from 'md5'
import { Button, Select, Card, Icon, Input, Tooltip, notification } from 'antd'
import { getPort, setPort, getPassword, setPassword, DEFAUT_PAGE_VALUE_SCALE, DEFAUT_PAGE_VALUE_CHECKUP, setDefaultPage, getDefaultPage } from 'src/storage/setting'
import Layout from '../../components/layout/layout'
import page from '../../constants/page.const'

import notify from '../../utils/notify_message'

const { Option } = Select;


export default class Page extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)

    this.state = {
      ports: [],
      port: '',
      defaultPage: ''
    }

    this.getInformation()
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.onKeydown);
  }

  registerKeyboardListener = () => {
    document.addEventListener('keypress', this.onKeydown);
  }

  onKeydown = (event) => {
    if (event.key === 'Enter') {
      this.savePassword(); 
    }
  }

  getInformation = async () => {
    const port = await getPort()
    const defaultPage = await getDefaultPage()
    console.log({ defaultPage });
    serialport.list((err, ports) => {
      console.log('getInformation com ports', ports);
      this.setState({
        ports,
        port: port ? port.value : '',
        defaultPage: defaultPage ? defaultPage.value : ''
      })
    })

  }

  chooseCOMport = (value) => {
    this.setState({ port: value })
  }

  chooseDefaultHomePage = (value) => {
    this.setState({ defaultPage: value })
  }

  saveCOMport = async () => {
    if (!this.state.port) {
      notify.openNotification('Vui lòng chọn cổng trước khi bấm lưu')
      return
    }
    try {
      await setPort(this.state.port)
      notify.openNotification('Cài đặt cổng máy in thành công')
    } catch (error) {
      notify.openNotification('Cài đặt cổng máy in thất bại' + error.message)
    }
  }

  saveHomePage = async () => {
    if (!this.state.defaultPage) {
      notify.openNotification("Hãy chọn trang chủ mặc định trước khi bấm lưu")
      return
    }
    try {
      await setDefaultPage(this.state.defaultPage)
      notify.openNotification("Thay trang chủ mặc định thành công")
    } catch (error) {
      notify.openNotification("Thay trang chủ mặc định thất bại")
    }
  }

  savePassword = async () => {
    if (!this.state.oldPassword || this.state.oldPassword.length < 6) {
      notify.openNotification("Mật khẩu cũ không đúng")
      return
    }
    const { value: password } = await getPassword()
    if (password !== md5(this.state.oldPassword)) {
      notify.openNotification("Mật khẩu cũ không đúng")
      return
    }
    if (!this.state.password || this.state.password.length < 6) {
      notify.openNotification('Mật khẩu phải dài từ 6 ký tự trở lên')
      return
    }
    if (!this.state.rePassword || this.state.rePassword !== this.state.password) {
      notify.openNotification('Vui lòng nhập lại mật khẩu mới! 2 mật khẩu không khớp!')
      return
    }
    if (!this.state.port) {
      notify.openNotification('Vui lòng chọn cổng trước khi bấm lưu')
      return
    }
    try {
      await setPassword(this.state.password)
      notify.openNotification('Đổi mật khẩu thành công')
    } catch (error) {
      notify.openNotification('Đổi mật khẩu thất bại' + error.message)
    }
  }

  onOldPasswordChange = (event) => {
    this.setState({
      oldPassword: event.target.value
    })
  }

  onPasswordChange = (event) => {
    this.setState({
      password: event.target.value
    })
  }

  onRePasswordChange = (event) => {
    this.setState({
      rePassword: event.target.value
    })
  }

  render() {
    const { params: { config }, history } = this.props
    return (
      <Layout history={history} page={page.settings}>
        <div className="setting">
          <h3>Cài đặt</h3>
          <hr />
          <br />
          <br />
          <h4>Chọn cân</h4>
          <Card className="settingCard">
            <div className="input">
              <label>Cổng: &nbsp; &nbsp;</label>
              <Select value={this.state.port} className="chooseComSelectbox" placeholder="Bấm để chọn cân" onChange={this.chooseCOMport}>
                {
                  this.state.ports.map((port, index) => {
                    return <Option key={index} value={port.comName}>{port.comName}</Option>
                  })
                }
              </Select>
            </div>

            <div className="input">
              <span></span>
              <Button onClick={this.saveCOMport} className="saveButton"><Icon type="save" /> Lưu cổng</Button>
            </div>
          </Card>
          <br />
          <br />
          <h4>Trang chủ:</h4>
          <Card className="settingCard">
            <div className="input">
              <label>Trang chủ khi khởi chạy phần mềm: &nbsp; &nbsp;</label>
              <Select value={this.state.defaultPage} className="chooseComSelectbox" placeholder="Bấm để chọn trang chủ mặc định khi mở phần mềm" onChange={this.chooseDefaultHomePage}>
                {
                  [DEFAUT_PAGE_VALUE_CHECKUP, DEFAUT_PAGE_VALUE_SCALE].map((page, index) => {
                    return <Option key={index} value={page}>{page}</Option>
                  })
                }
              </Select>
            </div>

            <div className="input">
              <span></span>
              <Button onClick={this.saveHomePage} className="saveButton"><Icon type="save" /> Lưu trang chủ</Button>
            </div>
          </Card>
          <br />
          <br />
          <h4>Đổi mật khẩu quản trị</h4>
          <Card className="settingCard">
            <Input.Password
              value={this.state.oldPassword}
              onChange={this.onOldPasswordChange}
              visibilityToggle
              allowClear
              placeholder="Mật khẩu hiện tại"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
            <br />
            <br />
            <Input.Password
              value={this.state.password}
              onChange={this.onPasswordChange}
              visibilityToggle
              allowClear
              placeholder="Mật khẩu mới"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
            <br />
            <br />
            <Input.Password
              value={this.state.rePassword}
              onChange={this.onRePasswordChange}
              placeholder="Nhập lại mật khẩu"
              visibilityToggle
              allowClear
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            />
            <div className="input">
              <span></span>
              <Button onClick={this.savePassword} className="saveButton"><Icon type="save" /> Đổi mật khẩu</Button>
            </div>
          </Card>
        </div>
      </Layout>
    )
  }

} // class Page end
