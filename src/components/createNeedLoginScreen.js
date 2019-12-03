import React from "react";
import md5 from "md5";
import Layout from 'src/components/layout/layout'
import { Input, Card, Button, Icon } from 'antd'
import { getPassword } from 'src/storage/setting'
import notify from '../utils/notify_message'

export default function createNeedLoginScreen(Component) {
  class NeedLoginScreen extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        logged: false,
        password: ''
      }
    }

    listener = null

    componentDidMount() {
      this.registerKeyboardListener()
    }

    componentWillUnmount() {
      document.removeEventListener('keypress', this.onKeydown);
    }

    registerKeyboardListener = () => {
      document.addEventListener('keypress', this.onKeydown);
    }

    onKeydown = (event) => {
      if (event.key === 'Enter') {
        this.login()
      }
    }

    login = async () => {
      const currentPassword = await getPassword()
      if (md5(this.state.password) === currentPassword.value) {
        this.setState({
          logged: true
        })
      } else notify.openNotification("Mật khẩu chưa đúng.")
    }

    render() {
      const { logged } = this.state
      if (!logged) {
        return (
          <Layout history={this.props.history} page={{}}>
            <div className="setting">
              <h3>Đăng nhập</h3>
              <hr />
              <br />
              <h4>Hãy nhập mật khẩu quản trị</h4>
              <Card className="settingCard">
                <Input.Password
                  value={this.state.password}
                  onChange={(event) => {
                    this.setState({
                      password: event.target.value
                    })
                  }}
                  visibilityToggle
                  allowClear
                  placeholder="mật khẩu quản trị..."
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                <br />
                <br />
                <div className="input">
                  <span></span>
                  <Button onClick={this.login} className="loginButton"><Icon type=" user" />Đăng nhập</Button>
                </div>

              </Card>
            </div>
          </Layout>
        )
      }
      return <Component {...this.props} />
    }
  }

  return NeedLoginScreen
}
