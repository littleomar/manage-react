import React from 'react'
import {Helmet} from "react-helmet"
import injectSheet from 'react-jss'
import {inject, observer} from "mobx-react"
import {Button, Divider, message, Popconfirm, Select, Table} from "antd"
import {Link} from "react-router-dom"
import axios from 'axios'

const { Option } = Select
const { Column } = Table


const styles = {
  container: {
    margin: 20
  },
  top: {
    width: 500
  },
  table: {
    marginTop: 20
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
class GoodKinds extends React.Component{
  constructor() {
    super()
    this.typeSelected = this.typeSelected.bind(this)

    this.state = {
      typeList: [],
      kindList: [],
      kindId: ''
    }
  }

  async componentDidMount() {
    await this.props.goodState.fetchGoodTypes()
    this.setState({
      typeList: this.props.goodState.goodTypes
    })


  }

  async typeSelected(value) {
    this.setState({
      kindId: value
    })
    await this.props.goodState.fetchGoodKinds(value)
    this.setState({
      kindList: this.props.goodState.kindList
    })
  }



  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>货物种类</title>
        </Helmet>
        <div className={classes.container}>
          <div>
            <span>请选择货物类型：</span>
            <Select style={{ width: 180 }} onChange={this.typeSelected} defaultValue={this.selectedType}>
              {
                this.state.typeList ? this.state.typeList.map(type=>{
                  return <Option value={type.key} key={type.key}>{type.typeName}</Option>
                }): null
              }
            </Select>
          </div>
          <Table
            className={classes.table}
            dataSource={this.state.kindList}
            bordered={true}
            pagination={false}
            loading={this.props.goodState.syncing}
          >
            <Column
              title="种类"
              dataIndex="fullName"
              key="fullName"
              width="70%"
            />
            <Column
              align="center"
              title={
                <div className={classes.wrapper}>
                  <div>操作</div>
                  <div><Button type="primary"><Link to="/goodkinds/add">添加种类</Link></Button></div>
                </div>
              }
              key="action"
              width="30%"
              render={(text, kind) => (
                <span>
                  <Popconfirm
                    title={<div>您确定要删除 <span className={classes.noticeName}>{kind.fullName}</span> 吗？</div>}
                    onConfirm={async ()=>{
                      await axios.delete(`${process.env.API_BASE}/api/goods/kind/delete?id=${kind.key}`)
                      await this.props.goodState.fetchGoodKinds(this.state.kindId)
                      this.setState({
                        kindList: this.props.goodState.kindList
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
        </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(GoodKinds)
