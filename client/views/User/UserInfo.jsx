import React from 'react'
import {Helmet} from "react-helmet"
import { Input, Icon, Form, Button, message } from 'antd'
import {inject, observer} from "mobx-react";
import injectSheet from 'react-jss'
import axios from 'axios'

const styles = {
  wrapper: {
    margin: 20,
    width: 300,
    padding: 20
  },
  formItem: {
    marginBottom: 10
  }
}

@inject((stores) => {
  return {
    userState: stores.userState
  }
}) @observer
class UserInfo extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      userInfo: {},
      tempArr: ['','','','',''],
      userId: '',
      modifyStatus: false
    }
  }

  async componentDidMount() {
    await this.setState({
      userId: this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf("/")+1)
    })
    await this.props.userState.fetchUserInfo(this.state.userId)
    this.setState({
      userInfo: Object.assign({},this.props.userState.userInfoObj)
    })
  }


  render() {
    const { userState, classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>{
            userState.userInfo.username ? `${userState.userInfo.username} 的个人信息`: ""
          }</title>
        </Helmet>
        <div  className={classes.wrapper}>
          <Form>
            <div className={classes.formItem}>
              <Input
                value={this.state.userInfo.username}
                onChange={(e)=>{
                  let username = e.target.value
                  this.setState((pre)=>{
                    return {
                      userInfo: Object.assign({},pre.userInfo,{username})
                    }
                  })
                }}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名" />
            </div>


            <div className={classes.formItem}>
              <Input
                value={this.state.userInfo.region}
                onChange={(e)=>{
                  let region = e.target.value
                  this.setState((pre)=>{
                    return {
                      userInfo: Object.assign({},pre.userInfo,{region})
                    }
                  })
                }}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入用户所在地" />
            </div>


            {
              this.state.userInfo.telephone ? this.state.tempArr.map((value,i)=>{
                return <div className={classes.formItem} key={i}>
                  <Input
                    onChange={(e)=>{
                      let telephone = this.state.userInfo.telephone
                      telephone[i] = e.target.value
                      this.setState((pre)=>Object.assign(pre.userInfo,{telephone}))
                    }}
                    value={this.state.userInfo.telephone ? this.state.userInfo.telephone[i] : ''}
                    prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="电话" />
                </div>
              }): null
            }
            <div className={classes.formItem}>
              <Button type="primary" block disabled={this.state.modifyStatus}
                      onClick={async ()=>{
                        this.setState({
                          modifyStatus: true
                        })
                        await axios.post(`${process.env.API_BASE}/api/customer/modify`,{
                          id:this.state.userId,
                          username: this.state.userInfo.username,
                          region: this.state.userInfo.region,
                          telephone: this.state.userInfo.telephone.filter((tel)=>tel)
                        })
                        message.success('信息修改成功')
                        this.setState({
                          modifyStatus: false
                        })
                      }}>修改</Button>
            </div>
          </Form>
        </div>
      </React.Fragment>
    )
  }

}

export default injectSheet(styles)(UserInfo)
