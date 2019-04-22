import React from 'react'
import injectSheet from 'react-jss'
import { Input, Button, message } from "antd"
import { withRouter } from "react-router-dom";
import axios from 'axios'
import {Helmet} from "react-helmet"
import {inject, observer} from "mobx-react"
const bgImage = require('./login_bg.jpg')

const styles  = {
  body: {
    width: "100%",
    height: "100%",
    background: `url(${bgImage}) no-repeat`,
    backgroundSize: "cover",
  },
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255,255,255,.2)",
    paddingTop: "1px"
  },
  login: {
    width: "350px",
    backgroundColor: "rgba(169, 215, 222, 0.5)",
    margin: "200px auto",
    borderRadius: "10px",
    padding: 25,
  },
  title: {
    margin: '10px 0'
  },
  inputWrapper: {
    margin: "0 auto",
    width: 300,
    textAlign: "center"
  },
  button: {
    marginTop: 10
  }
}

@inject((stores) => {
  return {
    appState: stores.appState
  }
}) @observer

class Login extends React.Component{
  constructor() {
    super()
    this.handleLogin = this.handleLogin.bind(this)
    this.bindPassword = this.bindPassword.bind(this)
  }
  state = {
    password: ''
  }
  async handleLogin() {
    const userRes = await axios.post(`${process.env.API_BASE}/api/login`,{
      accessToken: this.state.password
    })

    if (userRes.status === 200) {
      if (userRes.data.code === 1) {
        message.error("密码错误，请您重新输入")
      } else {
        message.success("登录成功")
        this.props.history.replace("/")
      }
    } else {
      message.error("服务器错误请您稍后重试")
    }

  }
  bindPassword(e) {
    this.setState({
      password: e.target.value
    })
  }
  render() {
    const classes = this.props.classes
    return (
      <React.Fragment>
        <Helmet>
          <title>登录</title>
        </Helmet>
        <div className={classes.body}>
          <div className={classes.container}>
            <div className={classes.login}>
              <p className={classes.title}>请输入秘钥：</p>
              <div className={classes.inputWrapper}>
                <Input placeholder="请输入秘钥" value={this.state.password} type="password" onPressEnter={this.handleLogin} onChange={this.bindPassword} />
                <Button type="primary" className={classes.button} htmlType="button" onClick={this.handleLogin}>登录</Button>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(injectSheet(styles)(Login))
