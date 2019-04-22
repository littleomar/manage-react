import React from 'react'
import {Helmet} from "react-helmet"
import {Button, DatePicker, message, Popconfirm, Table, Form} from "antd"
import axios from "axios";
import injectSheet from 'react-jss'
import {inject, observer} from "mobx-react"


const { Column } = Table



const styles = {
  container: {
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
  },
  filter: {
    margin: "20px 0"
  }
}

@inject((stores) => {
  return {
    buyState: stores.buyState
  }
}) @observer

class QueryBuy extends React.Component{
  
  constructor() {
    super()
    
    this.tableChange = this.tableChange.bind(this)

  }
  
  async componentDidMount() {
    await this.props.buyState.fetchTotalCount()
    await this.props.buyState.fetchBuyList()
  }
  
  async tableChange(pagination) {
    await this.props.buyState.changePage(pagination.current)
    await this.props.buyState.fetchBuyList()
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>查询入库</title>
        </Helmet>
        <div className={classes.container}>
          <div className={classes.filter}>
            <Form layout="inline">
              <Form.Item>
                <DatePicker
                  placeholder="请选择筛选日期"
                  onChange={async (date,dateString)=>{
                    await this.props.buyState.changePage(1)
                    await this.props.buyState.setFilter({buyTime: dateString})
                    await this.props.buyState.fetchBuyList()
                    await this.props.buyState.fetchTotalCount()
                  }}
                />
              </Form.Item>
            </Form>
          </div>
          <Table dataSource={this.props.buyState.getBuyList}
                 className={classes.table}
                 bordered={true}
                 pagination={{total: this.props.buyState.totalCount,current:this.props.buyState.currentPage}}
                 onChange={this.tableChange}
                 loading={this.props.buyState.syncing}
          >
            <Column
              title="货物名称"
              width="20%"
              align="center"
              dataIndex="fullname"
              key="fullname"
            />
            <Column
              title="入库日期"
              width="20%"
              align="center"
              dataIndex="buyTime"
              key="buytime"
            />
            <Column
              title="出厂日期"
              width="20%"
              align="center"
              dataIndex="goodTime"
              key="goodtime"
            />
            <Column
              title="备注信息"
              width="20%"
              dataIndex="comments"
              key="comments"
            />
            <Column
              align="center"
              title="操作"
              width="20%"
              key="action"
              render={(buy)=>{
                return (
                  <Popconfirm
                    title="您确定要删除该信息吗？"
                    onConfirm={async ()=>{
                      let deleteRes = await axios.delete(`${process.env.API_BASE}/api/goods/buy/delete?id=${buy.id}`)
                      if (deleteRes.status === 200 ) {
                        message.success("删除信息成功")
                        await this.props.buyState.fetchBuyList()
                        await this.props.buyState.fetchTotalCount()
                      } else {
                        message.error("服务器错误，请稍后再试！")
                      }
                    }}
                    onCancel={()=>{
                      message.info("您已取消删除")
                    }}
                    okText="删除"
                    placement="top"
                    cancelText="取消"
                  >
                    <Button
                      shape="circle"
                      type="danger"
                      icon="delete" />
                  </Popconfirm>
                )
              }}
            />
          </Table>
        </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(QueryBuy)
