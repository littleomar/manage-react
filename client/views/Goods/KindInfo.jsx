import React from 'react'
import {Helmet} from "react-helmet"
import injectSheet from 'react-jss'
import {Button, Form, Icon, Input, message} from "antd";
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

class KindInfo extends React.Component{

  constructor() {
    super()
    this.state = {
      kindInfo: {},
      kindId: ''
    }
  }

  async componentDidMount() {
    await this.setState({
      kindId: this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf("/")+1)
    })


  }


  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>种类信息</title>
        </Helmet>
        <div className={classes.wrapper}>
          <Form>
            <div className={classes.formItem}>
              <Input
                value={this.state.kindInfo.name}
                onChange={(e)=>{
                  let name = e.target.value
                  this.setState((pre)=>{
                    return {
                      kindInfo: Object.assign({},pre.kindInfo,{name})
                    }
                  })
                }}
                prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入种类编号" />
            </div>
            <div className={classes.formItem}>
              <Input
                value={this.state.kindInfo.nickName}
                onChange={(e)=>{
                  let nickName = e.target.value
                  this.setState((pre)=>{
                    return {
                      kindInfo: Object.assign({},pre.kindInfo,{nickName})
                    }
                  })
                }}
                prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入种类名称" />
            </div>
            <div className={classes.formItem}>
              <Button type="primary" block disabled={this.state.modifyStatus}
                      onClick={async ()=>{

                        this.setState({
                          modifyStatus: true
                        })


                        this.setState({
                          modifyStatus: false
                        })
                      }}>添加</Button>
            </div>
          </Form>
        </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(KindInfo)
