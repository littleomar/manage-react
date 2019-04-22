import React from 'react'
import injectSheet from 'react-jss'
import {Helmet} from "react-helmet"
import {inject, observer} from "mobx-react"
import { withRouter } from "react-router-dom"
import {Button, Form, Icon, Input, message} from "antd"
import axios from "axios"


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
    goodState: stores.goodState
  }
}) @observer

class TypeInfo extends React.Component{
  constructor() {
    super()
    this.state = {
      typeId: '',
      typeInfo: {
        typeName: "",
        price: 0
      },
      modifyStatus: false
    }
  }

  async componentDidMount() {
    await this.setState({
      typeId: this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf("/")+1)
    })

    await this.props.goodState.fetchGoodTypes(this.state.typeId)

    this.setState({
      typeInfo: this.props.goodState.goodTypes[0]
    })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>修改类型</title>
        </Helmet>
        <div  className={classes.wrapper}>
          <Form>
            <div className={classes.formItem}>
              <Input
                value={this.state.typeInfo.typeName}
                onChange={(e)=>{
                  let typeName = e.target.value
                  this.setState((pre)=>{
                    return {
                      typeInfo: Object.assign({},pre.typeInfo,{typeName})
                    }
                  })
                }}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="类型名称" />
            </div>
            <div className={classes.formItem}>
              <Input
                value={this.state.typeInfo.price}
                onChange={(e)=>{
                  let price = e.target.value
                  this.setState((pre)=>{
                    return {
                      typeInfo: Object.assign({},pre.typeInfo,{price})
                    }
                  })
                }}
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="类型价格" />
            </div>
            <div className={classes.formItem}>
              <Button type="primary" block disabled={this.state.modifyStatus}
                      onClick={async ()=>{
                        this.setState({
                          modifyStatus: true
                        })

                        await axios.post(`${process.env.API_BASE}/api/goods/modifyType`,{
                          id: this.state.typeId,
                          typeName: this.state.typeInfo.typeName,
                          price: this.state.typeInfo.price
                        })

                        message.success('信息修改成功')
                        this.setState({
                          modifyStatus: false
                        })

                        this.props.history.push("/goodtypes")
                      }}>修改</Button>
            </div>
          </Form>
        </div>
      </React.Fragment>
    )
  }
}

export default withRouter(injectSheet(styles)(TypeInfo))
