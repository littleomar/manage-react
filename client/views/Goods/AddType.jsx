import React from 'react'
import injecySheet from 'react-jss'
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




class AddType extends React.Component{
  constructor() {
    super()
    this.state = {
      typeInfo: {},
      modifyStatus: false
    }
  }
  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>添加类型</title>
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
                prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入类型名称" />
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
                prefix={<Icon type="dollar" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入类型价格" />
            </div>
            <div className={classes.formItem}>
              <Button type="primary" block disabled={this.state.modifyStatus}
                      onClick={async ()=>{


                        this.setState({
                          modifyStatus: true
                        })

                        await axios.post(`${process.env.API_BASE}/api/goods/addType`,{
                          typeName: this.state.typeInfo.typeName,
                          price: this.state.typeInfo.price
                        })

                        message.success('类型添加成功')
                        this.setState({
                          modifyStatus: false
                        })

                        this.props.history.push("/goodtypes")
                      }}>添加</Button>
            </div>
          </Form>
        </div>
      </React.Fragment>


    )
  }
}



export default injecySheet(styles)(AddType)
