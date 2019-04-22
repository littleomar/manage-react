import React from 'react'
import injectSheet from 'react-jss'
import  { Link } from 'react-router-dom'
import { withRouter } from "react-router-dom"
import { withCookies } from "react-cookie";


import Routes from '../config/indexRouter'

import { Layout, Menu, Row, Col, Button, Popconfirm, message } from 'antd'
import {inject, observer} from "mobx-react"
const { Content, Header, Sider, Footer } = Layout
const { SubMenu } = Menu

const styles = {
  content: {
    backgroundColor: "#fff"
  },
  title: {
    textAlign: "center",
    fontSize: 24

  }
}



@inject((stores) => {
  return {
    appState: stores.appState
  }
}) @observer

class Main extends React.Component {

  constructor() {
    super()
    this.changeIndex = this.changeIndex.bind(this)
  }

  state = {
    collapsed: false,
    defaultIndex: 1,
    defaultOpenKey: '',
    keyIndex: [
      "sell",
      "buy",
      "user",
      "querysell",
      "querybuy",
      "goodtypes",
      "goodkinds",
      "statistics"
    ]
  }

  componentWillMount() {
    const key = this.props.location.pathname.split("/")[1]
    const index = this.state.keyIndex.indexOf(key)+1
    if (index === 4 || index === 5 ) {
      this.setState({
        defaultOpenKey: "sub1"
      })
    } else if (index === 6 || index === 7) {
      this.setState({
        defaultOpenKey: "sub2"
      })
    }
    this.setState({
      defaultIndex: index
    })
  }


  changeIndex({key}) {
    this.props.appState.changeIndex(key)
  }
  render() {
    const {classes} = this.props
    return (

      <Layout>
        <Sider style={{
          overflow: 'auto', height: '100vh', position: 'fixed', left: 0,
        }}
        >
          <div className="logo" />
          <Menu
            defaultSelectedKeys={[`${this.state.defaultIndex}`]}
            mode="inline"
            theme="dark"
            defaultOpenKeys={[`${this.state.defaultOpenKey}`]}
            inlineCollapsed={this.state.collapsed}
            onClick={this.changeIndex}
          >
            <Menu.Item key="1">
              <Link to="/sell">开票</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/buy">入库</Link>
            </Menu.Item>
            <SubMenu key="sub1" title={<span><span>查询</span></span>}>
              <Menu.Item key="4"><Link to="/querysell">查询开票</Link></Menu.Item>
              <Menu.Item key="5"><Link to="/querybuy">查询入库</Link></Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" title={<span><span>货物</span></span>}>
              <Menu.Item key="6"><Link to="/goodtypes">货物类型</Link></Menu.Item>
              <Menu.Item key="7"><Link to="/goodkinds">货物种类</Link></Menu.Item>
            </SubMenu>
            <Menu.Item key="3">
              <Link to="/user">用户</Link>
            </Menu.Item>
            <Menu.Item key="8">
              <Link to="/statistics">数据统计</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: 200 }}>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Row>
              <Col span={22}><h1 className={classes.title}>西安石材总经销处货物管理中心</h1></Col>
              <Col span={2}>
                <Popconfirm
                  placement="bottomLeft"
                  title="您确定要退出登录本账户吗?"
                  onConfirm={()=>{
                    this.props.cookies.remove("koa:sess")
                    this.props.cookies.remove("koa:sess.sig")
                    message.success("注销成功")
                  }}
                  onCancel={()=>{
                    message.info("您已取消注销")
                  }}
                  okText="注销"
                  cancelText="取消">
                  <Button type="danger">注销</Button>
                </Popconfirm>

              </Col>
            </Row>
          </Header>
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
              <Routes />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Xi'an Stone General Distribution Office ©2018 Created by Omar
          </Footer>
        </Layout>
      </Layout>
    )
  }
}


export default withRouter(withCookies(injectSheet(styles)(Main)))
