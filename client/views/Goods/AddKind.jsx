import React from 'react'
import injecySheet from 'react-jss'
import {Helmet} from "react-helmet"
import {Button, Form, Icon, Input, message, Select} from "antd"
import axios from "axios";
import {inject, observer} from "mobx-react"


const { Option } = Select


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


class AddKind extends React.Component{
  constructor() {
    super()
    this.state = {
      kindInfo: {},
      typeInfo: [],
      modifyStatus: false
    }
  }

  async componentDidMount() {
    await this.props.goodState.fetchGoodTypes()
  }


  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>添加种类</title>
        </Helmet>
        <div  className={classes.wrapper}>
          <Form>
            <div className={classes.formItem}>
              <Select placeholder="请选择货物类型" onChange={(type)=>{
                this.setState((pre)=>{
                  return {
                    kindInfo: Object.assign({},pre.kindInfo,{type})
                  }
                })
                }}>
                {
                  this.props.goodState.goodTypes ? this.props.goodState.goodTypes.map(type=>{
                    return <Option key={type.key} value={type.key}>{type.typeName}</Option>
                  }) : null
                }
              </Select>
            </div>
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
                placeholder="请输入种类代号" />
            </div>
            <div className={classes.formItem}>
              <Input
                value={this.state.kindInfo.nickname}
                onChange={(e)=>{
                  let nickname = e.target.value
                  this.setState((pre)=>{
                    return {
                      kindInfo: Object.assign({},pre.kindInfo,{nickname})
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

                        await axios.post(`${process.env.API_BASE}/api/goods/kind/add`,{
                          type: this.state.kindInfo.type,
                          name: this.state.kindInfo.name,
                          nickname: this.state.kindInfo.nickname
                        })

                        message.success('类型添加成功')
                        this.setState({
                          modifyStatus: false
                        })

                        this.props.history.push("/goodkinds")
                      }}>添加</Button>
            </div>
          </Form>
        </div>
      </React.Fragment>


    )
  }
}



export default injecySheet(styles)(AddKind)
