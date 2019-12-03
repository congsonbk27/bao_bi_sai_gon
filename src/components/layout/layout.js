import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import logo from './logo.png';
import customerLogo from './customerLogo.jpg';
import './layout.less'

export default class AppLayout extends React.Component {
    constructor(props) {
      super(props)
    }
  
    render() {
      const main_nav_selected_id = this.props.page ? `${this.props.page.main_nav_id}` : '1'
      let slide_selected_id = this.props.page ? `${this.props.page.slide_id}` : '1'
      return (
        <Layout id="layout-main" >
          <Header className="header" >
            <img src={customerLogo} className="logo"/>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[main_nav_selected_id]}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item 
                key="1"
                onClick={() => {
                  this.props.history.push('weighted')
                }}
              >
                  Cân
              </Menu.Item>
              <Menu.Item 
                key="2"
                onClick={() => {
                  this.props.history.push('checkup')
                }}
              >
                Kiểm kê
              </Menu.Item>
            </Menu>
          </Header>
          <Content style={{ padding: '0 0px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; CÔNG TY CỔ PHẦN BAO BÌ SÀI GÒN (SAPACO)
              </Breadcrumb.Item>
            </Breadcrumb>
            <Layout style={{ padding: '10px 0', background: '#fff', height: '95%' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[slide_selected_id]}
                  style={{ height: '100%' }}
                >
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      this.props.history.push('weighted')
                    }}
                  >
                    <Icon type="appstore" /> Cân sản phẩm
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    onClick={() => {
                      this.props.history.push('checkup')
                    }}
                  >
                    <Icon type="check-square" /> Kiểm kê
                  </Menu.Item>
                    
                  <Menu.Item
                    key="3"
                    onClick={() => {
                      this.props.history.push('statsCheckup')
                    }}
                  >
                    <Icon type="export" /> Lịch sử kiểm kê 
                    </Menu.Item>
                    <Menu.Item
                      key="4"
                      onClick={() => {
                        this.props.history.push('statsWeighted')
                      }}
                    >
                      <Icon type="import" /> Lịch sử cân
                    </Menu.Item>
                    
                    <Menu.Item
                      key="5"
                    onClick={() => {
                      this.props.history.push('settings')
                    }}
                    >
                    <Icon type="setting" /> Cài đặt
                    </Menu.Item>
                  
                  <Menu.Item
                    onClick={() => {
                      this.props.history.push('about')
                    }}
                    key="6"
                  >
                      <Icon type="info-circle" /> Giới thiệu phần mềm
                  </Menu.Item>
                </Menu>
              </Sider>
              <Content style={{ padding: '0 24px', height: '100%' }}>
                {this.props.children}
              </Content>
            </Layout>
          </Content>
          <Footer style={{ textAlign: 'center', height: '20px' }}>
            Cân điện tử ©2019 Phát triển bởi
            <img src={logo} style={{ height: '20px', width: '20px', marginLeft: '5px', marginRight: '5px' }} />
            ngoisaonho.net
          </Footer>
      </Layout>
      )
    }
  }
