import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

export default class AppLayout extends React.Component {
    constructor(props) {
      super(props)
    }
  
    render() {

      const main_nav_selected_id = this.props.page ? `${this.props.page.main_nav_id}` : '1'
      const slide_selected_id = this.props.page ? `${this.props.page.slide_id}` : '1'
      return (
        <Layout id="layout-main">
          <Header className="header">
            <div className="logo" />
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={[main_nav_selected_id]}
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item 
                key="1"
                onClick={() => {
                  this.props.history.push('/')
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
              <Breadcrumb.Item>Công ty TNHH NGÔI SAO NHỎ</Breadcrumb.Item>
            </Breadcrumb>
            <Layout style={{ padding: '10px 0', background: '#fff', height: '95%' }}>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[slide_selected_id]}
                // defaultOpenKeys={['sub1']}
                  style={{ height: '100%' }}
                >
                  
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      this.props.history.push('/')
                    }}
                  >
                    <Icon type="appstore" /> Cân sản phảm
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    onClick={() => {
                      this.props.history.push('checkup')
                    }}
                  >
                    <Icon type="check-square" /> Kiểm kê
                  </Menu.Item>
                  
                  <SubMenu
                    key="sub2"
                    title={
                      <span>
                        <Icon type="laptop" />
                        Ban quản trị
                      </span>
                    }
                  >
                    <Menu.Item key="5">Báo cáo cân</Menu.Item>
                    <Menu.Item key="6">Báo cáo kiểm kê</Menu.Item>
                    <Menu.Item key="7">Đổi mật khẩu quản trị</Menu.Item>
                  </SubMenu>
                  <Menu.Item
                    onClick={() => {
                      $api.createWindow('about')
                    }}
                    key="8"
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
          <Footer style={{ textAlign: 'center', height: '20px' }}>Cân điện tử ©2019 Phát triển bởi ngoisaonho.net</Footer>
      </Layout>
      )
    }

  }
