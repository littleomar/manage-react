import React from 'react'
import {Helmet} from "react-helmet"
import injectSheet from 'react-jss'
import {Button, message, Popconfirm, Table, Form, DatePicker} from "antd"
import {inject, observer} from "mobx-react"
import axios from 'axios'

const { Column, ColumnGroup} = Table



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
    sellState: stores.sellState
  }
}) @observer

class QuerySell extends React.Component{

  constructor() {
    super()

    this.tableChange = this.tableChange.bind(this)


    this.state = {

    }
  }

  async componentDidMount() {
    await this.props.sellState.fetchSellList()
    await this.props.sellState.fetchTotalCount()
  }


  async tableChange(info) {
    await this.props.sellState.changePage(info.current)
    await this.props.sellState.fetchSellList(info.current)
    this.setState(pre=>{
      return {
        sellList: this.props.sellState.getSellList
      }
    })
  }

  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>查询出售</title>
        </Helmet>
        <div className={classes.container}>
          <div className={classes.filter}>
            <Form layout="inline">
              <Form.Item>
                <DatePicker
                  placeholder="请选择筛选日期"
                  onChange={async (date,dateString)=>{
                    await this.props.sellState.changePage(1)
                    await this.props.sellState.setFilter({date: dateString})
                    await this.props.sellState.fetchSellList()
                    await this.props.sellState.fetchTotalCount()
                  }}
                />
              </Form.Item>
            </Form>
          </div>
          <Table dataSource={this.props.sellState.getSellList}
                 className={classes.table}
                 bordered={true}
            pagination={{total: this.props.sellState.totalCount.count,current:this.props.sellState.currentPage}}
                 onChange={this.tableChange}
                 loading={this.props.sellState.syncing}
          >
            <Column
              title="姓名"
              width="8%"
              align="center"
              dataIndex="username"
              key="username"
            />
            <Column
              title="出货日期"
              width="12%"
              align="center"
              dataIndex="date"
              key="sellDate"
            />
            <ColumnGroup title="货物信息">
              <Column
                align="center"
                title="货物名称"
                width="12%"
                dataIndex="goodArr"
                key="fullname"
                render={(goods)=>{
                  return goods.map((good,index)=>{
                    return <p key={index}>{good.fullname || '-----'}</p>
                  })
                }}
              />
              <Column
                title="货物日期"
                align="center"
                width="11%"
                dataIndex="goodArr"
                key="goodDate"
                render={(goods)=>{
                  return goods.map((good,index)=>{
                    return <p key={index}>{good.goodTime || '-----'}</p>
                  })
                }}
              />
              <Column
                title="张"
                align="center"
                dataIndex="goodArr"
                width="8%"
                key="count"
                render={(goods)=>{
                  return goods.map((good,index)=>{
                    return <p key={index}>{good.count || '---'}</p>
                  })
                }}
              />
              <Column
                title="米"
                align="center"
                width="10%"
                dataIndex="goodArr"
                key="meter"
                render={(goods)=>{
                  return goods.map((good,index)=>{
                    return <p key={index}>{good.meter || '----'}</p>
                  })
                }}
              />
              <Column
                title="单价"
                align="center"
                width="6%"
                dataIndex="goodArr"
                key="price"
                render={(goods)=>{
                  return goods.map((good,index)=>{
                    return <p key={index}>{good.price || '----'}</p>
                  })
                }}
              />
              <Column
                title="总计"
                align="center"
                dataIndex="totalPrice"
                width="8%"
                key="totalPrice"
              />
              <Column
                title="备注信息"
                align="center"
                dataIndex="goodArr"
                key="comments"
                render={(goods)=>{
                  return goods.map((good,index)=>{
                    return <p key={index}>{good.comments}</p>
                  })
                }}
              />
            </ColumnGroup>
            <Column
              title="备注信息"
              width="12%"
              dataIndex="comments"
              key="allcomments"
            />
            <Column
              title="操作"
              width="5%"
              key="action"
              render={(sell)=>{
                return (
                  <Popconfirm
                    title="您确定要删除该信息吗？"
                    onConfirm={async ()=>{
                      await axios.delete(`${process.env.API_BASE}/api/goods/sell/delete?id=${sell.id}`)
                      await this.props.sellState.fetchSellList()
                      await this.props.sellState.fetchTotalCount()
                      message.success("删除信息成功")
                    }}
                    onCancel={()=>{
                      message.info("您已取消删除")
                    }}
                    okText="删除"
                    placement="topRight"
                    cancelText="取消"
                  >
                    <Button shape="circle" type="danger" icon="delete" />
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

export default injectSheet(styles)(QuerySell)
