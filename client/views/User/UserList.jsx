import React from 'react'
import {Helmet} from "react-helmet"
import {Table, Divider, Popconfirm, message, Input, Button } from "antd"
import { Link, withRouter } from 'react-router-dom'
import injectSheet from 'react-jss'
import {inject, observer} from "mobx-react"


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
    userState: stores.userState
  }
}) @observer
class UserList extends React.Component{

  constructor() {
    super()
    this.tableChange = this.tableChange.bind(this)

  }

  state = {
    dataSource: [],
    skip: 1,
    modalVisible: false,
    timer: null
  }

  async componentDidMount() {
    await this.props.userState.fetchUserList()
  }

  async tableChange(pagination) {
    await this.props.userState.changeCurrentPage(pagination.current)
    await this.props.userState.fetchUserList(this.state.filter)
  }


  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>用户列表</title>
        </Helmet>
        <Table dataSource={this.props.userState.userList.length ? this.props.userState.userList : []}
               className={classes.table}
               bordered={true}
               pagination={{total: this.props.userState.userInfoCount,current: this.props.userState.currentPage}}
               onChange={this.tableChange}
               loading={this.props.userState.syncing}
        >
          <Column
            title="姓名"
            dataIndex="username"
            key="username"
            width="12%"
          />
          <Column
            title="地址"
            dataIndex="region"
            key="region"
            width="30%"
          />
          <Column
            title={
              <div className={classes.wrapper}>
                <div>电话</div>
                <div><Input
                  value={this.state.filter}
                  onChange={(e)=>{
                    this.props.userState.changeSyncing(true)
                    this.setState({
                      filter: e.target.value
                    })
                    clearTimeout(this.state.timer)

                    let timer = setTimeout( async ()=>{
                      await this.props.userState.changeCurrentPage(1)
                      await this.props.userState.fetchUserList(this.state.filter)

                      this.props.userState.changeSyncing(false)
                    },1000)

                    this.setState({
                      timer: timer
                    })
                  }
                  }
                /></div>
              </div>
            }
            dataIndex="telephone"
            key="telephone"
            width="43%"
          />
          <Column
            title={
              <div className={classes.wrapper}>
                <div>操作</div>
                <div><Button type="primary"><Link to="/user/add">添加用户</Link></Button></div>
              </div>
            }
            key="action"
            width="15%"
            render={(text, user) => (
              <span>
                <Link to={`/user/${user.key}`}>查看</Link>
                <Divider type="vertical" />
                <Popconfirm
                  title={<div>您确定要删除 <span className={classes.noticeName}>{user.username}</span> 吗？</div>}
                  onConfirm={()=>{
                    this.props.userState.deleteUser(user.key)
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

export default withRouter(injectSheet(styles)(UserList))
