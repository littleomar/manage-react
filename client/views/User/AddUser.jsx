import React from 'react'
import injectSheet from 'react-jss'
import {Helmet} from "react-helmet"
import {Button, Form, Icon, Input, message} from "antd"
import axios from "axios";

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




class AddUser extends React.Component{

  constructor() {
    super()
    this.state = {
      userInfo: {
        telephone: ['','','','','']
      },
      submitStatus: false
    }
  }



  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>添加用户</title>
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
                placeholder="请输入用户名" />
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
              this.state.userInfo.telephone.map((value,i)=>{
                return <div className={classes.formItem} key={i}>
                  <Input
                    onChange={(e)=>{
                      let telephone = this.state.userInfo.telephone
                      telephone[i] = e.target.value
                      this.setState((pre)=>Object.assign(pre.userInfo,{telephone}))
                    }}
                    value={this.state.userInfo.telephone[i]}
                    prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请输入电话号码" />
                </div>
              })
            }
            <div className={classes.formItem}>
              <Button type="primary" block disabled={this.state.submitStatus}
                      onClick={async ()=>{
                        this.setState({
                          submitStatus: true
                        })

                        await axios.post(`${process.env.API_BASE}/api/customer/addUser`,{
                          username: this.state.userInfo.username,
                          region: this.state.userInfo.region,
                          telephone: this.state.userInfo.telephone.filter((tel)=>tel)
                        })
                        message.success('信息添加成功')
                        this.setState({
                          submitStatus: false,
                          userInfo: {
                            telephone: ['','','','','']
                          }
                        })
                      }}>添加客户</Button>
            </div>
          </Form>
        </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(AddUser)
