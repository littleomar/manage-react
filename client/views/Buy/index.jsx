import React from 'react'
import {Helmet} from 'react-helmet'
import {inject, observer} from "mobx-react"
import {Button, DatePicker, Icon, Input, message, Select, Form} from "antd"
import injectSheet from 'react-jss'
import moment from "moment"
import axios from "axios"


const { TextArea } = Input
const { Option } = Select

const styles = {
  container: {
    margin: 20
  },
  title: {
    fontSize: 18,
    margin: "10px 0"
  },
  submit: {
    textAlign: "center",
    margin: 20
  }
}




@inject((stores) => {
  return {
    userState: stores.userState,
    goodState: stores.goodState
  }
}) @observer
class Buy extends React.Component{


  constructor() {
    super()


    this.goodTypeSelected = this.goodTypeSelected.bind(this)

    this.state= {
      date: '',
      goodList: [],
      typeList: [],
      comments: '',
      submitStatus: false

    }
  }

  async componentDidMount() {

    await this.props.goodState.fetchGoodTypes()
    this.setState({
      typeList: this.props.goodState.goodTypes
    })

    await this.setState({
      date: moment().format("YYYY-MM-DD")
    })
  }

  async goodTypeSelected(index, goodIndex) {
    await this.props.goodState.fetchGoodKinds(this.state.typeList[index].key)
    this.setState((pre)=>{
      pre.goodList[goodIndex].kindList = this.props.goodState.kindList
      pre.goodList[goodIndex].price = this.state.typeList[index].price
      return {
        goodList: pre.goodList
      }
    })

    this.setState((pre)=>{
      let { price, totalMeter, count } = pre.goodList[goodIndex]
      price = price ? price : 0
      totalMeter = totalMeter ? totalMeter : 0
      count = count ? count : 0
      pre.goodList[goodIndex].total = Math.ceil((totalMeter/2.4+count)*price)
      return {
        goodList: pre.goodList
      }
    })
  }


  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <Helmet>
          <title>入库</title>
        </Helmet>
        <div className={classes.container}>
          <div>
            <p className={classes.title}>货物入库日期：</p>
            <DatePicker
              defaultValue={moment()}
              onChange={(date,dateString) => {
                this.setState({
                  date: dateString
                })
              }} />
          </div>
          <div>
            <p className={classes.title}>货物信息：</p>
            {
              this.state.goodList.map((good,goodIndex)=>{
                return (
                  <Form layout="inline" key={good.key}>
                    <Form.Item>
                      <Select
                        placeholder="货物类型"
                        style={{ width: 120 }}
                        onChange={(index)=>{
                          this.goodTypeSelected(index,goodIndex)
                        }}>
                        {
                          this.state.typeList.map((type,index)=>{
                            return <Option value={index} key={type.key}>{type.typeName}</Option>
                          })
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Select
                        placeholder="货物种类"
                        style={{ width: 180 }}
                        onChange={(name)=>{
                          this.setState(pre=>{
                            pre.goodList[goodIndex].name = name
                            return {
                              goodList: pre.goodList
                            }
                          })
                        }}>
                        {
                          this.state.goodList[goodIndex].kindList ? this.state.goodList[goodIndex].kindList.map((kind,index)=>{
                            return <Option value={kind.key} key={kind.key}>{kind.fullName}</Option>
                          }) : null
                        }
                      </Select>
                    </Form.Item>
                    <Form.Item>
                      <Input
                        value={this.state.goodList[goodIndex].count}
                        style={{width: 90}}
                        onChange={async (e)=>{
                          let count = parseFloat(0+e.target.value)
                          await this.setState((pre)=>{
                            pre.goodList[goodIndex].count = parseFloat(count)
                            return {
                              goodList: pre.goodList
                            }
                          })
                        }}
                        addonAfter={<span>张</span>}
                        placeholder="张" />
                    </Form.Item>
                    <Form.Item>
                      <DatePicker
                        placeholder="请选择货物日期"
                        onChange={async (date, dateString)=>{
                          this.setState(pre=>{
                            pre.goodList[goodIndex].goodTime = dateString
                            return {
                              goodList: pre.goodList
                            }
                          })
                        }}
                      />
                    </Form.Item>
                    <Form.Item>
                    <TextArea
                      placeholder="请填写备注信息"
                      onChange={(e)=>{
                        const comments =  e.target.value
                        this.setState(pre=>{
                          pre.goodList[goodIndex].comments =comments
                          return {
                            goodList: pre.goodList
                          }
                        })
                      }}
                      value={this.state.goodList[goodIndex].comments}
                      autosize={{ minRows: 1, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="danger"
                        shape="circle"
                        icon="delete"
                        onClick={()=>{
                          this.setState(pre=>{
                            pre.goodList.splice(goodIndex,1)
                            return {
                              goodList: pre.goodList
                            }
                          })
                        }}
                      />
                    </Form.Item>
                  </Form>
                )
              })
            }
          </div>
          <div >
            <Button
            type="primary"
            shape="circle"
            icon="plus"
            size="large"
            onClick={async ()=>{
              let tempArr = this.state.goodList
              tempArr.push({
                key: Math.random()
              })
              await this.setState({
                goodList: tempArr
              })
            }} />
          </div>
          <div className={classes.submit}>
            <Form layout="inline">
              <Form.Item>
                <Button
                  type="primary"
                  disabled={this.state.submitStatus}
                  onClick={async ()=>{
                    if (!this.state.date) {
                      message.error("请填写入库时间")
                      return false
                    }

                    const tempGoodList = this.state.goodList.filter((good,index)=>{
                      if(!good.name) {
                        message.error(`第${index+1}种货物缺少货物种类`)
                      }
                      return good.name
                    })

                    if (tempGoodList.length !== this.state.goodList.length) {
                      message.error(`提交失败，请完善货物信息`)
                      return false
                    }
                    this.setState({
                      submitStatus: true
                    })

                    const data = {
                      date: this.state.date,
                      goods: this.state.goodList
                    }

                    let saveRes = await axios.post(`${process.env.API_BASE}/api/goods/buy/add`,data)

                    if (saveRes.status === 200) {
                      message.success("数据存储成功")
                      this.setState({
                        date: moment().format("YYYY-MM-DD"),
                        goodList: []
                      })
                    } else {
                      message.error("服务器错误，请您稍后再试")
                    }

                    this.setState({
                      submitStatus: true
                    })



                  }}
                >提交</Button>
              </Form.Item>

              <Form.Item>
                <Button
                  type="danger"
                  onClick={async ()=>{
                    await this.setState({
                      goodList: [],
                      date: moment().format("YYY-MM-DD")
                    })
                    message.success("表单重置成功")
                  }}
                >重置</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default injectSheet(styles)(Buy)
