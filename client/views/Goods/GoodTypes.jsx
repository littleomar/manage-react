import React from 'react'
import {Helmet} from "react-helmet"
import injectSheet from 'react-jss'
import {inject, observer} from "mobx-react"
import {Button, Divider, Input, message, Popconfirm, Table} from "antd"
import {Link} from "react-router-dom"


const { Column } = Table

const styles = {
  table: {
    margin: 20
  },
  noticeName: {
    fontSize: "20px",
    color: "#ff8b26",
    fontWeight: "700",
    fontStyle: "italic"
  },
  wrapper: {
    display: "flex",
    justifyContent: "space-between"
  }
}

@inject((stores) => {
  return {
    goodState: stores.goodState
  }
}) @observer

class GoodTypes extends React.Component{

  constructor() {
    super()
    this.state = {
      goodTypeList: []
    }
  }


  async componentDidMount() {
    await this.props.goodState.fetchGoodTypes()
    this.setState({
      goodTypeList: this.props.goodState.goodTypes
    })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>货物类型</title>
        </Helmet>
        <Table
          // dataSource={this.state.goodTypeList.length ? this.state.goodTypeList : []}
          dataSource={this.state.goodTypeList}
          className={classes.table}
          bordered={true}
          pagination={false}
          loading={this.props.goodState.syncing}
        >
          <Column
            title="类型"
            dataIndex="typeName"
            key="typeName"
            width="40%"
          />
          <Column
            title="价格"
            dataIndex="price"
            key="price"
            width="40%"
          />
          <Column
            align="center"
            title={
              <div className={classes.wrapper}>
                <div>操作</div>
                <div><Button type="primary"><Link to="/goodtypes/add">添加类型</Link></Button></div>
              </div>
            }
            key="action"
            width="20%"
            render={(text, type) => (
              <span>
                <Link to={`/goodtypes/${type.key}`}>修改</Link>
                <Divider type="vertical" />
                <Popconfirm
                  title={<div>您确定要删除 <span className={classes.noticeName}>{type.typeName}</span> 吗？</div>}
                  onConfirm={async ()=>{
                    await this.props.goodState.deleteType(type.key)
                    this.setState({
                      goodTypeList: this.props.goodState.goodTypes
                    })
                    message.success("删除成功")
                  }}
                  onCancel={()=>{
                    message.warn("取消删除")
                  }}
                  okText="确认"
                  cancelText="取消">
                  <a href="#">删除</a>
                </Popconfirm>
              </span>
            )}
          />
        </Table>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(GoodTypes)
